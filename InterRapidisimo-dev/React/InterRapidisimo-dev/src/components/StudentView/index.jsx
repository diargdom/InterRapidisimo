import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urlApi } from "../../server";

function StudentView() {
  const { token } = useSelector((state) => state.authState);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`${urlApi}/student/estudiantes-view`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, [token]);

  return (
    <div>
      <h2>Listado de Estudiantes</h2>
      <ul>
        {students.map((s) => (
          <li key={s.estudianteId}>{s.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default StudentView;
