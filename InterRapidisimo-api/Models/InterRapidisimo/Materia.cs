namespace InterRapidisimo_api.Models.InterRapidisimo
{
    public class Materia
    {
        public int MateriaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int Creditos { get; set; }
        public int ProfesorId { get; set; }
        public Profesor? Profesor { get; set; }
        public ICollection<EstudianteMateria> Estudiantes { get; set; } = new List<EstudianteMateria>();
    }
}
