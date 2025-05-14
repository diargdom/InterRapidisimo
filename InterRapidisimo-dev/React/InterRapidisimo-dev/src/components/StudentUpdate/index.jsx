import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function StudentUpdate() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.authState);
  const [student, setStudent] = useState({
    nombre: "",
    email: "",
    documentoIdentidad: "",
    rol: "estudiante",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${urlApi}/estudiantes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${urlApi}/estudiantes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) throw new Error("Error al actualizar estudiante");

      toast.success("Estudiante actualizado correctamente");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };
  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Actualizar Estudiante</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={student.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Documento</label>
          <input
            type="text"
            name="documentoIdentidad"
            value={student.documentoIdentidad}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Rol</label>
          <select
            name="rol"
            value={student.rol}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="estudiante">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
    </motion.div>
  );
}

export default StudentUpdate;
