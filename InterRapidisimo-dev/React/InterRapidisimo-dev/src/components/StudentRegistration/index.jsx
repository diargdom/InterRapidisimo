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
      console.log("🚀 ~ onSubmit ~ result:", result);
      toast.success("Estudiante registrado exitosamente");
      navigate("/estudiantes");
    } catch (error) {
      toast.error(error.message || "Error al registrar estudiante");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Estudiante</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Nombre Completo</label>
          <input
            {...register("Nombre", { required: "Nombre es requerido" })}
            type="text"
            className="w-full p-2 border rounded"
          />
          {errors.Nombre && (
            <span className="text-red-500 text-sm">
              {errors.Nombre.message}
            </span>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            {...register("Email", {
              required: "Email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            type="email"
            className="w-full p-2 border rounded"
          />
          {errors.Email && (
            <span className="text-red-500 text-sm">{errors.Email.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Contraseña</label>
          <input
            {...register("Contrasena", {
              required: "Contraseña es requerida",
              minLength: {
                value: 8,
                message: "Mínimo 8 caracteres",
              },
            })}
            type="password"
            className="w-full p-2 border rounded"
          />
          {errors.Contrasena && (
            <span className="text-red-500 text-sm">
              {errors.Contrasena.message}
            </span>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Documento de Identidad
          </label>
          <input
            {...register("DocumentoIdentidad", {
              required: "Documento es requerido",
            })}
            type="text"
            className="w-full p-2 border rounded"
          />
          {errors.DocumentoIdentidad && (
            <span className="text-red-500 text-sm">
              {errors.DocumentoIdentidad.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? "Registrando..." : "Registrar Estudiante"}
        </button>
      </form>
    </motion.div>
  );
}

export default StudentRegistration;
