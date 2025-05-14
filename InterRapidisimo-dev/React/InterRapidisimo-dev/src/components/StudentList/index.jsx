import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";

function StudentList() {
  const { token } = useSelector((state) => state.authState);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${urlApi}/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener estudiantes");

      const data = await response.json();
      setStudents(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-8 text-gray-600">Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto p-2 sm:p-6 bg-gray-50 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Listado de Estudiantes
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition text-sm"
          >
            <ArrowLeft size={18} />
            Regresar
          </Link>

          <Link
            to="/estudiantes/registrar"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition text-sm"
          >
            <Plus size={18} />
            Nuevo Estudiante
          </Link>
        </div>
      </div>

      {/* Vista en tabla (solo en pantallas medianas o más grandes) */}
      <div className="hidden md:block max-h-[500px] rounded-lg border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <motion.tr
                key={student.estudianteId}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(243, 244, 246, 0.6)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="transition-all"
              >
                <td className="px-6 py-4 text-sm text-gray-800 break-words">
                  {student.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 break-words">
                  {student.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 capitalize break-words">
                  {student.documentoIdentidad}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    to={`/estudiantes/${student.estudianteId}/materias`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    Ver Materias
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista mobile (cards) */}
      <div className="md:hidden space-y-4">
        {students.map((student) => (
          <motion.div
            key={student.estudianteId}
            whileHover={{ scale: 1.01 }}
            className="bg-white p-4 rounded-md shadow border border-gray-200"
          >
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Nombre: </span>
              {student.nombre}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Email: </span>
              {student.email}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Documento: </span>
              {student.documentoIdentidad}
            </p>
            <div className="mt-3">
              <Link
                to={`/estudiantes/${student.estudianteId}/materias`}
                className="text-sm text-blue-600 hover:text-blue-800 transition"
              >
                Ver Materias
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default StudentList;
