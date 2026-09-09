import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = "Search...",
  suggestions = [],
  onSuggestionClick,
  className = "",
  debounceMs = 250,
}) {
  const [internal, setInternal] = useState(controlledValue ?? "");
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const value = controlledValue ?? internal;

  useEffect(() => {
    if (controlledValue !== undefined) setInternal(controlledValue);
  }, [controlledValue]);

  const debouncedChange = useCallback(
    (val) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange?.(val), debounceMs);
    },
    [onChange, debounceMs]
  );

  function handleChange(e) {
    const v = e.target.value;
    setInternal(v);
    setActiveIdx(-1);
    debouncedChange(v);
  }

  function handleClear() {
    setInternal("");
    setActiveIdx(-1);
    onChange?.("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      handleClear();
    } else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        onSuggestionClick?.(suggestions[activeIdx]);
        setFocused(false);
      } else {
        onSubmit?.(value);
      }
    }
  }

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const showDropdown = focused && suggestions.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-lg border border-panel-line bg-panel/60 px-3 py-2 transition-colors focus-within:border-neon-cyan/60">
        <Search className="h-4 w-4 shrink-0 text-ink-faint" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent font-body text-sm text-ink-primary placeholder-ink-faint focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded p-0.5 text-ink-faint hover:text-ink-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-panel-line bg-panel shadow-lg">
          {suggestions.map((s, i) => (
            <button
              key={typeof s === "string" ? s : s.id ?? i}
              type="button"
              onMouseDown={() => {
                onSuggestionClick?.(s);
                setInternal(typeof s === "string" ? s : s.label ?? "");
                setFocused(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left font-body text-sm transition-colors ${
                i === activeIdx
                  ? "bg-arcane-purple/15 text-neon-cyan"
                  : "text-ink-primary hover:bg-panel-line/30"
              }`}
            >
              {typeof s === "string" ? s : s.label ?? s.name ?? ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
