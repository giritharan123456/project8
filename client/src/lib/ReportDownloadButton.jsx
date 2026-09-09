import { useState } from "react";
import { downloadReport } from "./reportGenerator.js";

export default function ReportDownloadButton({ path, disabled = false, className = "", children }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      await downloadReport(path);
    } catch (err) {
      setError(err?.message ?? "Download failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={handleClick}
        className={`${className} ${disabled || busy ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {children}
      </button>
      {busy && <span className="font-mono text-xs text-ink-muted">Generating\u2026</span>}
      {error && (
        <span role="alert" className="font-mono text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}