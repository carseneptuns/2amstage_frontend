import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * Guards a route to a specific set of roles.
 * Unauthenticated -> /login. Authenticated but wrong role -> /.
 */
export default function RoleRoute({ roles = [], children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
