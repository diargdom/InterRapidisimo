import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function ClassmatesList() {
  const { token, estudianteId } = useSelector((state) => state.authState);
  const [compañeros, setCompañeros] = useState([]);

  useEffect(() => {
    const fetchCompañeros = async () => {
      try {
        const response = await fetch(`${urlApi}/student/companeros`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ EstudianteId: estudianteId }),
        });
        const data = await response.json();
        setCompañeros(data.data);
      } catch (error) {
        console.error("🚀 ~ constfetchCompañeros= ~ error:", error);
        toast.error("Error al cargar compañeros");
      }
    };

    fetchCompañeros();
  }, [token, estudianteId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Link
        to="/dashboard"
        className="fixed top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
      >
        <ArrowLeft size={18} />
      </Link>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-6 pt-16"
      >
        <h1 className="text-3xl font-bold mb-6">Compañeros de Clase</h1>

        <div className="space-y-6">
          {compañeros.length > 0 ? (
            compañeros.map((comp) => (
              <motion.div
                key={`${comp.materia}-${comp.compañero}`}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold text-indigo-400">
                  {comp.materia}
                </h3>
                <p className="text-gray-300">{comp.compañero}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">
              No tienes compañeros registrados en tus materias
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ClassmatesList;
