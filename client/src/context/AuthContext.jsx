import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.js";

// Frontend half of role-based access control. This does NOT enforce
// anything by itself - ProtectedRoute.jsx reads `role` from here to decide
// what to render, but the real enforcement is server-side (see
// server/src/middleware/auth.js requireRole, applied to every route in
// server/src/routes/admin.js and teacher.js). Treat everything here as
// "what should we show this person", never as "is this person allowed to
// do this" - that question always has to be answered by the API.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role } | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authApi
      .getMe()
      .then((res) => {
        if (!cancelled) setUser(res?.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    return res.user;
  }, []);

  const signup = useCallback(async (name, email, password, fields) => {
    const res = await authApi.signup(name, email, password, fields);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, role: user?.role ?? null, isAuthenticated: !!user, loading, login, signup, logout }),
    [user, loading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
