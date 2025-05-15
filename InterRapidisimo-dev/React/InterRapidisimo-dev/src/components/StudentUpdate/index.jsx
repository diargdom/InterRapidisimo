import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function StudentUpdate() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.authState);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state?.studentData) {
      setValue("NuevoNombre", state.studentData.nombre);
      setValue("NuevoEmail", state.studentData.email);
    }
  }, [state, setValue]);

  const onSubmit = async (data) => {
    if (!data.NuevoNombre && !data.NuevoEmail) {
      toast.error("Debe proporcionar al menos un campo para actualizar");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        EstudianteId: parseInt(id),
        ...(data.NuevoNombre && { NuevoNombre: data.NuevoNombre }),
        ...(data.NuevoEmail && { NuevoEmail: data.NuevoEmail }),
      };
      console.log("🚀 ~ onSubmit ~ updateData:", updateData);

      const response = await fetch(`${urlApi}/auth/updateStudent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar estudiante");
      }

      toast.success("Estudiante actualizado correctamente");
      navigate("/estudiantes", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold text-white mb-6 text-center">
          Actualizar Estudiante
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("NuevoNombre")}
            type="text"
            placeholder="Nuevo Nombre (opcional)"
            className="p-2 border rounded bg-gray-700 text-white"
          />

          <input
            {...register("NuevoEmail", {
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Email inválido",
              },
            })}
            type="email"
            placeholder="Nuevo Correo Electrónico (opcional)"
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.NuevoEmail && (
            <span className="text-red-500 text-sm">
              {errors.NuevoEmail.message}
            </span>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? "Actualizando..." : "Actualizar"}
          </motion.button>
        </form>

        <motion.button
          onClick={() => navigate("/estudiantes")}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Volver
        </motion.button>
      </motion.div>
    </div>
  );
}

export default StudentUpdate;
