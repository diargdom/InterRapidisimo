import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function AssignSubjects() {
  const { token, estudianteId } = useSelector((state) => state.authState);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState([]);
  const [selectedMaterias, setSelectedMaterias] = useState({
    materia1: null,
    materia2: null,
    materia3: null,
  });
  const [loading, setLoading] = useState(true);

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

    // Validar que se seleccionaron 3 materias distintas
    const materias = Object.values(selectedMaterias);
    if (materias.some((m) => m === null)) {
      toast.error("Debes seleccionar 3 materias");
      return;
    }

    if (new Set(materias).size !== 3) {
      toast.error("Las materias deben ser diferentes");
      return;
    }

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
      <h1 className="text-2xl font-bold mb-6">Asignación de Materias</h1>
      <p className="mb-6">
        Selecciona 3 materias (deben tener profesores diferentes)
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <label className="block mb-2 font-medium">Materia {num}</label>
              <select
                className="w-full p-2 border rounded"
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
                  >
                    {materia.nombre_Materia} - {materia.nombre_Profesor}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Asignar Materias
        </button>
      </form>
    </motion.div>
  );
}

export default AssignSubjects;
