import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Dashboard() {
  const { nombre, role, estudianteId } = useSelector(
    (state) => state.authState
  );
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Sesión finalizada");
  };

  return (
    <div className="min-h-screen bg-black">
      <motion.div
        className="p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
            Bienvenido, {nombre}
          </h1>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {role === "admin" && (
              <>
                <Link to="/estudiantes/registrar">
                  <motion.button
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-green-400 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Registrar Estudiante
                  </motion.button>
                </Link>
                <Link to="/estudiantes">
                  <motion.button
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver Estudiantes
                  </motion.button>
                </Link>
              </>
            )}

            <motion.button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cerrar sesión
            </motion.button>
          </div>
        </div>

        {/* Contenido según rol */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Común a ambos roles */}
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
