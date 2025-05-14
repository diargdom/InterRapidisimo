import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";

export const routes = [
  { path: "/", element: <LoginPage /> },
  //     {
  //     element: <ProtectedRoute />,
  //     children: [
  //       {
  //         path: "/dashboard",
  //         element: <DashboardPage />,
  //       },
  //       {
  //         path: "/clientes/registrar",
  //         element: <ClientRegistration />,
  //       },
  //       {
  //         path: "/usuarios/registrar",
  //         element: <UserRegistration />,
  //       },
  //       {
  //         path: "/clientes/actualizar/:id",
  //         element: <ClientUpdate />,
  //       },
  //     ],
  //   },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];
