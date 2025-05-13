namespace InterRapidisimo_api.Models.InterRapidisimo
{
    public class Estudiante
    {
        public int EstudianteId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public string DocumentoIdentidad { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; }
        public ICollection<EstudianteMateria> Materias { get; set; } = new List<EstudianteMateria>();
    }
}
