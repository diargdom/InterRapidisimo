import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ redirectPath = "/" }) => {
  const token = useSelector((state) => state.authState.token);
  return token ? <Outlet /> : <Navigate to={redirectPath} />;
};
