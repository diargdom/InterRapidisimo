import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function StudentList() {
  const { token } = useSelector((state) => state.authState);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
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

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listado de Estudiantes</h1>
        <Link
          to="/estudiantes/registrar"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Nuevo Estudiante
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <motion.tr
                key={student.estudianteId}
                whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {student.documentoIdentidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/estudiantes/${student.estudianteId}/materias`}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Ver Materias
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default StudentList;
