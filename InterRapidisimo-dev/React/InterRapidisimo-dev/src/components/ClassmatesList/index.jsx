import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Compañeros de Clase</h1>

      <div className="space-y-4">
        {compañeros.length > 0 ? (
          compañeros.map((comp) => (
            <motion.div
              key={`${comp.materia}-${comp.compañero}`}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h3 className="font-semibold">{comp.materia}</h3>
              <p>{comp.compañero}</p>
            </motion.div>
          ))
        ) : (
          <p>No tienes compañeros registrados en tus materias</p>
        )}
      </div>
    </motion.div>
  );
}

export default ClassmatesList;
