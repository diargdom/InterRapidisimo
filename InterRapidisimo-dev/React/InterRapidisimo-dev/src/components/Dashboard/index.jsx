import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Dashboard() {
  const { nombre, role, estudianteId } = useSelector(
    (state) => state.authState
  );
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-black">
      <motion.div
        className="p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
            Bienvenido, {nombre}
          </h1>
          <motion.button
            onClick={() => dispatch(logout())}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cerrar sesión
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {role === "admin" && (
            <>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Gestión de Estudiantes
                </h2>
                <Link
                  to="/estudiantes/registrar"
                  className="block bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 mb-2"
                >
                  Registrar Nuevo Estudiante
                </Link>
                <Link
                  to="/estudiantes"
                  className="block bg-green-500 text-white text-center py-2 rounded hover:bg-green-600"
                >
                  Listar Todos los Estudiantes
                </Link>
              </motion.div>
            </>
          )}
          {role === "estudiante" && (
            <>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4">Mis Materias</h2>
                <Link
                  to={`/estudiantes/${estudianteId}/materias`}
                  className="block bg-purple-500 text-white text-center py-2 rounded hover:bg-purple-600"
                >
                  Ver Mis Materias Asignadas
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4">Asignar Materias</h2>
                <Link
                  to="/materias/asignar"
                  className="block bg-indigo-500 text-white text-center py-2 rounded hover:bg-indigo-600"
                >
                  Seleccionar Nuevas Materias
                </Link>
              </motion.div>
            </>
          )}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Compañeros de Clase</h2>
            <Link
              to="/compañeros"
              className="block bg-teal-500 text-white text-center py-2 rounded hover:bg-teal-600"
            >
              Ver Compañeros
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
