import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Trash, X, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

function StudentSubjects() {
  const navigate = useNavigate();
  const { EstudianteId } = useParams();
  const id = parseInt(EstudianteId, 10);
  const { token, role } = useSelector((state) => state.authState);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const fetchMaterias = async () => {
    try {
      const response = await fetch(
        `${urlApi}/student/${id}/materias-asignadas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Error al obtener materias");

      const data = await response.json();
      setMaterias(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materiaId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la materia asignada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1f2937",
      color: "#fff",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${urlApi}/student/delete-materia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          EstudianteId: id,
          MateriaId: materiaId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar materia");
      }

      await Swal.fire({
        title: "¡Eliminado!",
        text: "La materia ha sido eliminada.",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
      });
      fetchMaterias();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando materias...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() =>
              navigate(role === "admin" ? "/estudiantes" : "/dashboard")
            }
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft size={20} />
            {role === "admin" ? "Volver al listado" : "Volver al dashboard"}
          </button>
        </div>

        <h1 className="text-2xl font-bold text-white mb-6">
          Materias Asignadas
        </h1>

        {materias.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tienes materias asignadas
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {materias.map((materia) => (
              <motion.div
                key={materia.id}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {materia.materia}
                  </h3>
                  <p className="text-sm text-gray-300">
                    Profesor:{" "}
                    <span className="font-medium">{materia.profesor}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    Créditos: {materia.creditos}
                  </p>
                </div>
                <motion.button
                  onClick={() => handleDelete(materia.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm"
                >
                  <Trash size={16} />
                  Eliminar
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default StudentSubjects;
