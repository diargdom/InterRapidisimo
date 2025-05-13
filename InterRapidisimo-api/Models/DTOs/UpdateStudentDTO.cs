namespace InterRapidisimo_api.Models.DTOs
{
    public class UpdateStudentDTO
    {
        public int EstudianteId { get; set; }
        public string? NuevoNombre { get; set; }
        public string? NuevoEmail { get; set; }
    }
}
