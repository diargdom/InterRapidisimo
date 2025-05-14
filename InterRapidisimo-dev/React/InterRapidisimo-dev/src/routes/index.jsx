import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import StudentRegistration from "../components/StudentRegistration";
import StudentList from "../components/StudentList";
import StudentUpdate from "../components/StudentUpdate";
import StudentSubjects from "../components/StudentSubjects";
import AssignSubjects from "../components/AssignSubjects";
import ClassmatesList from "../components/ClassmatesList";

export const routes = [
  { path: "/", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      {
        path: "/estudiantes",
        element: (
          <ProtectedRoute adminOnly>
            <StudentList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/estudiantes/registrar",
        element: (
          <ProtectedRoute adminOnly>
            <StudentRegistration />
          </ProtectedRoute>
        ),
      },

      {
        path: "/estudiantes/actualizar/:EstudianteId",
        element: (
          <ProtectedRoute adminOnly>
            <StudentUpdate />
          </ProtectedRoute>
        ),
      },

      {
        path: "/estudiantes/:EstudianteId/materias",
        element: (
          <ProtectedRoute>
            <StudentSubjects />
          </ProtectedRoute>
        ),
      },
      {
        path: "/materias/asignar",
        element: (
          <ProtectedRoute>
            <AssignSubjects />
          </ProtectedRoute>
        ),
      },

      // Ruta común
      { path: "/compañeros", element: <ClassmatesList /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];
