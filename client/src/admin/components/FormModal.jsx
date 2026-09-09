import { useEffect, useState, useMemo } from "react";
import { X, Upload, AlertTriangle, ChevronDown } from "lucide-react";

/**
 * Enhanced form modal — slides up from bottom on mobile (bottom-sheet),
 * centered card on desktop. Same API as before.
 */
export default function FormModal({ open, title, fields: allFields, initial, onSave, onClose, preview = false }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const fields = useMemo(
    () => allFields.filter((f) => !f.addOnly || !initial).filter((f) => !f.visible || f.visible(values)),
    [allFields, initial, values]
  );

  useEffect(() => {
    if (!open) return;
    const base = {};
    const errs = {};
    fields.forEach((f) => {
      const empty = f.type === "checkbox" ? false : f.type === "multiselect" ? [] : "";
      base[f.key] = initial?.[f.key] ?? empty;
      errs[f.key] = null;
    });
    if (initial?.id) base.id = initial.id;
    setValues(base);
    setErrors(errs);
  }, [open, initial]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!open) return null;

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function validate() {
    const errs = {};
    let valid = true;
    fields.forEach((f) => {
      if (f.required) {
        const val = values[f.key];
        if (val === "" || val === null || val === undefined || (Array.isArray(val) && val.length === 0)) {
          errs[f.key] = `${f.label} is required`;
          valid = false;
        }
      }
      if (f.validate && !errs[f.key]) {
        const msg = f.validate(values[f.key]);
        if (msg) { errs[f.key] = msg; valid = false; }
      }
    });
    setErrors(errs);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave(values);
  }

  return (
    <>
      {/* Overlay */}
      <div className="bottom-sheet-overlay" onClick={onClose} />

      {/* Sheet */}
      <div className="bottom-sheet-container" role="dialog" aria-modal="true" aria-label={title}>
        {/* Mobile drag handle */}
        <div className="bottom-sheet-handle" />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-panel-line bg-panel px-5 py-4">
          <h3 className="font-display text-lg font-bold text-ink-primary">
            {preview ? `Preview: ${title}` : title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-panel-alt text-ink-faint transition-colors hover:bg-panel-line hover:text-ink-primary active:scale-95"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-2 block font-display text-xs font-semibold uppercase tracking-wider text-ink-faint">
                {f.label}
                {f.required && <span className="ml-0.5 text-red-400">*</span>}
              </span>

              {f.type === "multiselect" ? (
                <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-xl border border-panel-line bg-void p-3">
                  {(f.options ?? []).length === 0 && (
                    <p className="px-1 py-1 text-xs text-ink-faint">No options available yet.</p>
                  )}
                  {(f.options ?? []).map((opt) => {
                    const optValue = opt.value ?? opt;
                    const optLabel = opt.label ?? opt;
                    const selected = Array.isArray(values[f.key]) && values[f.key].includes(optValue);
                    return (
                      <label key={optValue} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors tap-highlight">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const current = Array.isArray(values[f.key]) ? values[f.key] : [];
                            const next = e.target.checked
                              ? [...current, optValue]
                              : current.filter((v) => v !== optValue);
                            setField(f.key, next);
                          }}
                          disabled={preview}
                          className="h-5 w-5 rounded border-panel-line accent-arcane-purple"
                        />
                        <span className="text-sm text-ink-primary">{optLabel}</span>
                      </label>
                    );
                  })}
                </div>
              ) : f.type === "select" ? (
                <div className="relative">
                  <select
                    required={f.required}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    disabled={preview}
                    className="w-full appearance-none rounded-xl border border-panel-line bg-void px-4 py-3 text-sm text-ink-primary outline-none transition-colors focus:border-neon-cyan disabled:opacity-60"
                  >
                    <option value="" disabled>Select {f.label.toLowerCase()}</option>
                    {(f.options ?? []).map((opt) => (
                      <option key={opt.value ?? opt} value={opt.value ?? opt}>
                        {opt.label ?? opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                </div>
              ) : f.type === "textarea" || f.type === "richtext" ? (
                <div>
                  <textarea
                    required={f.required}
                    rows={f.rows ?? 3}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    disabled={preview}
                    className="w-full resize-none rounded-xl border border-panel-line bg-void px-4 py-3 text-sm text-ink-primary outline-none transition-colors focus:border-neon-cyan disabled:opacity-60"
                  />
                  {f.type === "richtext" && (
                    <p className="mt-1 text-[10px] text-ink-faint">Supports basic formatting.</p>
                  )}
                </div>
              ) : f.type === "checkbox" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!values[f.key]}
                    onChange={(e) => setField(f.key, e.target.checked)}
                    disabled={preview}
                    className="h-5 w-5 rounded border-panel-line accent-arcane-purple"
                  />
                  <span className="text-sm text-ink-primary">{values[f.key] ? "Yes" : "No"}</span>
                </div>
              ) : f.type === "file" ? (
                <div>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-panel-line bg-void/40 p-4 transition-colors focus-within:border-neon-cyan">
                    <Upload className="h-5 w-5 text-ink-faint" />
                    <div className="flex-1">
                      <input
                        type="file"
                        accept={f.accept}
                        onChange={(e) => setField(f.key, e.target.files?.[0] ?? null)}
                        disabled={preview}
                        className="w-full text-sm text-ink-primary file:mr-3 file:rounded-lg file:border-0 file:bg-arcane-purple file:px-4 file:py-1.5 file:font-display file:text-xs file:font-semibold file:text-white file:transition-transform file:active:scale-95"
                      />
                    </div>
                  </div>
                  {values[f.key] && typeof values[f.key] === "object" && (
                    <p className="mt-1 text-xs text-ink-muted">Selected: {values[f.key].name}</p>
                  )}
                </div>
              ) : f.type === "datetime-local" ? (
                <input
                  type="datetime-local"
                  required={f.required}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  disabled={preview}
                  className="w-full rounded-xl border border-panel-line bg-void px-4 py-3 text-sm text-ink-primary outline-none transition-colors focus:border-neon-cyan disabled:opacity-60"
                />
              ) : (
                <input
                  type={f.type ?? "text"}
                  required={f.required}
                  value={values[f.key] ?? ""}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setField(f.key, f.type === "number" ? e.target.valueAsNumber || "" : e.target.value)
                  }
                  disabled={preview}
                  className="w-full rounded-xl border border-panel-line bg-void px-4 py-3 text-sm text-ink-primary placeholder:text-ink-faint outline-none transition-colors focus:border-neon-cyan disabled:opacity-60"
                />
              )}

              {f.helpText && <p className="mt-1.5 text-[10px] text-ink-faint">{f.helpText}</p>}
              {errors[f.key] && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  {errors[f.key]}
                </p>
              )}
            </label>
          ))}

          {/* Action bar — sticky at bottom on mobile */}
          <div className="sticky bottom-0 -mx-5 border-t border-panel-line bg-panel px-5 pt-4 pb-1">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="tap-feedback rounded-xl border border-panel-line bg-panel-alt px-5 py-3 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink-primary"
              >
                {preview ? "Close" : "Cancel"}
              </button>
              {!preview && (
                <button
                  type="submit"
                  className="tap-bounce rounded-xl bg-gradient-to-r from-arcane-purple to-arcane-violet px-6 py-3 font-display text-sm font-bold text-white shadow-glow-purple transition-all hover:brightness-110"
                >
                  {initial ? "Save Changes" : "Create"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
