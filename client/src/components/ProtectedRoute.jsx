import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import RouteLoader from "./RouteLoader.jsx";

// Wrap any route tree that should be restricted by sign-in and/or role:
//
//   <Route path="/admin/*" element={
//     <ProtectedRoute allow={["ADMIN"]}><AdminApp /></ProtectedRoute>
//   } />
//
// This is a UX guard, not a security boundary - it stops a STUDENT or
// TEACHER from ever seeing the Admin UI render, but the data those pages
// fetch is only actually safe because the backend routes they call
// (server/src/routes/admin.js, teacher.js) enforce the same rule again
// with requireRole(). Never remove the backend check because this exists.
export default function ProtectedRoute({ allow, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
