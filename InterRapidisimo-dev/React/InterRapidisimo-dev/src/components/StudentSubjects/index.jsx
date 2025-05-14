import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function StudentSubjects() {
  const { EstudianteId } = useParams();
  const id = parseInt(EstudianteId, 10);
  const { token } = useSelector((state) => state.authState);
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
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Mis Materias Asignadas</h1>

      {materias.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tienes materias asignadas
        </div>
      ) : (
        <div className="space-y-4">
          {materias.map((materia) => (
            <motion.div
              key={materia.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{materia.materia}</h3>
                <p className="text-gray-600">Profesor: {materia.profesor}</p>
                <p className="text-gray-600">Créditos: {materia.creditos}</p>
              </div>
              <button
                onClick={() => handleDelete(materia.id)}
                className="text-red-500 hover:text-red-700"
              >
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
