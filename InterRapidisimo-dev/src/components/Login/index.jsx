import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LogoInterRapidisimoImage from "../../img/logoInterrapidisimo.png";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/slices/authSlice";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${urlApi}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) toast.error("Credenciales incorrectas");
      const result = await response.json();
      dispatch(
        setCredentials({
          token: result.token,
          nombre: result.nombre,
          role: result.rol,
          estudianteId: result.idEst,
        })
      );
      navigate("/dashboard");
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 bg-black flex justify-center items-center"
      >
        <div className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <img
              src={LogoInterRapidisimoImage}
              className="w-20 h-auto"
              alt="Logo"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Inter Rapidisimo
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                {...register("Email", { required: "Email es requerido" })}
                type="text"
                id="email"
                placeholder="Email"
                className={`w-full p-3 text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-shadow ${
                  errors.Email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Email && (
                <span className="text-red-500 text-sm">
                  {errors.Email.message}
                </span>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                {...register("Password", { required: "Password es requerido" })}
                type="password"
                id="password"
                placeholder="Contraseña"
                className={`w-full p-3 text-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-shadow ${
                  errors.Password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Password && (
                <span className="text-red-500 text-sm">
                  {errors.Password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </motion.div>
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${LogoInterRapidisimoImage})` }}
      ></div>
    </div>
  );
}

export default Login;
