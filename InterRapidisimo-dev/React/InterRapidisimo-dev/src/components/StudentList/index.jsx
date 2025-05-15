import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  BookOpen,
  Edit,
  User,
  ClipboardList,
  History,
} from "lucide-react";

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <User className="text-blue-600" size={28} />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Gestión de Estudiantes
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition shadow-sm text-sm"
          >
            <ArrowLeft size={18} />
            Volver al Inicio
          </Link>

          <Link
            to="/estudiantes/registrar"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md text-sm"
          >
            <Plus size={18} />
            Nuevo Estudiante
          </Link>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Informacion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
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
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                className="transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        Documento: {student.documentoIdentidad}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    <Link
                      to={`/estudiantes/${student.estudianteId}/materias`}
                      className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
                    >
                      <BookOpen size={16} />
                      Materias
                    </Link>
                    <Link
                      to={`/estudiantes/actualizar/${student.estudianteId}`}
                      state={{
                        studentData: {
                          nombre: student.nombre,
                          email: student.email,
                        },
                      }}
                      className="flex items-center gap-1 text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                      <Edit size={16} />
                      Editar
                    </Link>
                    <Link
                      to={`/estudiantes/${student.estudianteId}/historial`}
                      className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
                    >
                      <History size={16} />
                      Historial
                    </Link>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {students.map((student) => (
          <motion.div
            key={student.estudianteId}
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-lg shadow border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{student.nombre}</h3>
                <p className="text-sm text-gray-500 mt-1">{student.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Documento: {student.documentoIdentidad}
                </p>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/estudiantes/${student.estudianteId}/materias`}
                    className="flex-1 flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition"
                  >
                    <BookOpen size={16} />
                    Materias
                  </Link>
                  <Link
                    to={`/estudiantes/actualizar/${student.estudianteId}`}
                    className="flex-1 flex items-center justify-center gap-1 text-sm bg-gray-50 text-gray-600 px-3 py-2 rounded hover:bg-gray-100 transition"
                  >
                    <Edit size={16} />
                    Editar
                  </Link>
                  <Link
                    to={`/estudiantes/${student.estudianteId}/historial`}
                    className="flex-1 flex items-center justify-center gap-1 text-sm bg-gray-50 text-gray-600 px-3 py-2 rounded hover:bg-gray-100 transition"
                  >
                    <History size={16} />
                    Historial
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay estudiantes registrados
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando un nuevo estudiante.
          </p>
          <div className="mt-6">
            <Link
              to="/estudiantes/registrar"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Nuevo Estudiante
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default StudentList;
