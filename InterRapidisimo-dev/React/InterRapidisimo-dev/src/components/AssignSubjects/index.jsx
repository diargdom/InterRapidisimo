import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AssignSubjects() {
  const navigate = useNavigate();
  const { token, estudianteId } = useSelector((state) => state.authState);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState([]);
  const [selectedMaterias, setSelectedMaterias] = useState({
    materia1: null,
    materia2: null,
    materia3: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMateriasDisponibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMateriasDisponibles = async () => {
    try {
      const response = await fetch(`${urlApi}/student/materias`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener materias");

      const data = await response.json();
      setMateriasDisponibles(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (num, value) => {
    const materiaSeleccionada = materiasDisponibles.find(
      (m) => m.materiaId == value
    );
    if (!materiaSeleccionada) return;

    if (profesoresSeleccionados.includes(materiaSeleccionada.nombre_Profesor)) {
      toast.error("Ya tienes una materia con este profesor");
      return;
    }
    setSelectedMaterias({
      ...selectedMaterias,
      [`materia${num}`]: value === "" ? null : parseInt(value),
    });
    if (value !== "") {
      setProfesoresSeleccionados((prev) => [
        ...prev,
        materiaSeleccionada.nombre_Profesor,
      ]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const materias = Object.values(selectedMaterias);
    if (materias.some((m) => m === null)) {
      toast.error("Debes seleccionar 3 materias");
      return;
    }

    if (new Set(materias).size !== 3) {
      toast.error("Las materias deben ser diferentes");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${urlApi}/student/asignar-materias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          EstudianteId: estudianteId,
          Materia1: selectedMaterias.materia1,
          Materia2: selectedMaterias.materia2,
          Materia3: selectedMaterias.materia3,
        }),
      });

      if (!response.ok) throw new Error("Error al asignar materias");

      toast.success("Materias asignadas correctamente");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando materias disponibles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold text-white mb-6 text-center text-xl">
          Asignación de Materias
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          Selecciona 3 materias (deben tener profesores diferentes)
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col gap-2">
                <label className="text-gray-300">Materia {num}</label>
                <select
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  value={selectedMaterias[`materia${num}`] || ""}
                  onChange={(e) => handleSelectChange(num, e.target.value)}
                  required
                >
                  <option value="">Selecciona una materia</option>
                  {materiasDisponibles.map((materia) => (
                    <option
                      key={materia.materiaId}
                      value={materia.materiaId}
                      disabled={Object.values(selectedMaterias).includes(
                        materia.materiaId
                      )}
                      className="bg-gray-800"
                    >
                      {materia.nombre_Materia} - {materia.nombre_Profesor}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white px-4 py-2 rounded"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isSubmitting ? "Asignando..." : "Asignar Materias"}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Volver
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AssignSubjects;
