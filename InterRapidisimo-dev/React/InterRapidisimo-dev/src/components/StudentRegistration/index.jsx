import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function StudentRegistration() {
  const { token } = useSelector((state) => state.authState);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${urlApi}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, role: "estudiante" }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      toast.success("Estudiante registrado exitosamente");
      reset();
      navigate("/estudiantes");
    } catch (error) {
      toast.error(error.message || "Error al registrar estudiante");
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
          Registrar Estudiante
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("Nombre", { required: "Nombre es requerido" })}
            type="text"
            placeholder="Nombre Completo"
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.Nombre && (
            <span className="text-red-500 text-sm">
              {errors.Nombre.message}
            </span>
          )}

          <input
            {...register("Email", {
              required: "Email es requerido",
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Email inválido",
              },
            })}
            type="email"
            placeholder="Correo Electrónico"
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.Email && (
            <span className="text-red-500 text-sm">{errors.Email.message}</span>
          )}

          <input
            {...register("Contrasena", {
              required: "Contraseña es requerida",
              minLength: {
                value: 8,
                message: "Mínimo 8 caracteres",
              },
            })}
            type="password"
            placeholder="Contraseña"
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.Contrasena && (
            <span className="text-red-500 text-sm">
              {errors.Contrasena.message}
            </span>
          )}

          <input
            {...register("DocumentoIdentidad", {
              required: "Documento es requerido",
            })}
            type="text"
            placeholder="Documento de Identidad"
            className="p-2 border rounded bg-gray-700 text-white"
          />
          {errors.DocumentoIdentidad && (
            <span className="text-red-500 text-sm">
              {errors.DocumentoIdentidad.message}
            </span>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </motion.button>
        </form>

        <motion.button
          onClick={() => navigate("/dashboard")}
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

export default StudentRegistration;
