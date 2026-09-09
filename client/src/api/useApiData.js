import { useCallback, useEffect, useRef, useState } from "react";

// Small shared fetch hook (Section 43: loading states, error handling).
// `fetcher` is an async function (typically one of src/api/endpoints.js's
// exports) and `deps` re-runs it the same way useEffect deps would. Returns
// { data, loading, error, retry } — pages render a skeleton while loading,
// an error card with `retry` on failure, and the real content once `data`
// resolves. `active` lets a caller skip fetching until its inputs are
// ready (e.g. class/board not chosen yet).
export function useApiData(fetcher, deps = [], { active = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(active);
  const [error, setError] = useState(null);
  const attemptRef = useRef(0);

  const run = useCallback(() => {
    if (!active) {
      setLoading(false);
      return;
    }
    const attempt = ++attemptRef.current;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (attemptRef.current !== attempt) return; // a newer call/retry won
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (attemptRef.current !== attempt) return;
        setError(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, retry: run };
}
