import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute({ adminOnly, studentOnly, children }) {
  const { token, role } = useSelector((state) => state.authState);
  const location = useLocation();

  if (!token) return <Navigate to="/" state={{ from: location }} replace />;
  if (adminOnly && role !== "admin")
    return <Navigate to="/dashboard" replace />;
  if (studentOnly && role !== "student")
    return <Navigate to="/dashboard" replace />;
  return children ? children : <Outlet />;
}
