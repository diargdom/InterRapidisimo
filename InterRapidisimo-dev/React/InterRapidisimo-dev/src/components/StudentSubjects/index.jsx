import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Trash, X } from "lucide-react";

function StudentSubjects() {
  const { EstudianteId } = useParams();
  const id = parseInt(EstudianteId, 10);
  const { token } = useSelector((state) => state.authState);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMateriaId, setSelectedMateriaId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    if (!window.confirm("¿Estás seguro de eliminar esta materia?")) return;

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

      if (!response.ok) throw new Error("Error al eliminar materia");

      toast.success("Materia eliminada correctamente");
      fetchMaterias(); // Refrescar la lista
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-xl"
    >
      {/* Botón de volver */}
      <div className="mb-6">
        <a
          href="/estudiantes"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          ← Volver al listado
        </a>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Materias Asignadas
      </h1>

      {materias.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tienes materias asignadas
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {materias.map((materia) => (
            <motion.div
              key={materia.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {materia.materia}
                </h3>
                <p className="text-sm text-gray-600">
                  Profesor:{" "}
                  <span className="font-medium">{materia.profesor}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Créditos: {materia.creditos}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedMateriaId(materia.id);
                  setShowModal(true);
                }}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm cursor-pointer"
              >
                <Trash size={16} />
                Eliminar
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default StudentSubjects;
