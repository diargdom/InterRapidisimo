namespace InterRapidisimo_api.Models.InterRapidisimo
{
    public class EstudianteMateria
    {
        public int Id { get; set; }
        public int EstudianteId { get; set; }
        public Estudiante? Estudiante { get; set; }

        public int MateriaId { get; set; }
        public Materia? Materia { get; set; }
    }
}
