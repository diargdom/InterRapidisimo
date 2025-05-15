import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, Book, FileText, Clock } from "lucide-react";

function StudentHistory() {
  const navigate = useNavigate();
  const { EstudianteId } = useParams();
  const id = parseInt(EstudianteId, 10);
  const { token } = useSelector((state) => state.authState);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch(`${urlApi}/student/${id}/historial`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener historial");

        const data = await response.json();
        setHistorial(data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EstudianteId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft size={20} />
            Volver atrás
          </button>
        </div>

        <h1 className="text-2xl font-bold text-white mb-6">
          Historial de Actividades
        </h1>

        {historial.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No hay registros de actividad
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {historial.map((registro, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-lg ${
                  registro.tipoRegistro === "MATERIA"
                    ? "bg-gray-700"
                    : "bg-gray-700 border-l-4 border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {registro.tipoRegistro === "MATERIA" ? (
                      <Book className="text-blue-400" size={18} />
                    ) : (
                      <FileText className="text-green-400" size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-white">
                        {registro.tipoRegistro === "MATERIA"
                          ? `Materia: ${registro.materia}`
                          : "Cambio de datos"}
                      </h3>
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock size={14} />
                        {registro.fecha} {registro.hora}
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mt-1">
                      {registro.tipoRegistro === "DATOS"
                        ? `Detalle: ${registro.materia}`
                        : registro.accion}
                    </p>

                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-xs text-gray-400">
                        Acción: {registro.accion}
                      </p>
                      <p className="text-xs text-gray-400">
                        Usuario: {registro.usuario}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default StudentHistory;
