import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";

function CreditSummary() {
  const { estudianteId } = useSelector((state) => state.authState);
  const [creditos, setCreditos] = useState(0);

  useEffect(() => {
    fetch(`${urlApi}/student/${estudianteId}/creditos`)
      .then((res) => res.json())
      .then((data) => setCreditos(data.total));
  }, [estudianteId]);

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-bold">Créditos Totales</h3>
      <p>{creditos}/9 créditos</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${(creditos / 9) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default CreditSummary;
