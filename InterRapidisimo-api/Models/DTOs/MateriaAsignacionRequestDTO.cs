namespace InterRapidisimo_api.Models.DTOs
{
    public class MateriaAsignacionRequestDTO
    {
        public int EstudianteId { get; set; }
        public List<int> MateriaIds { get; set; } = new();
    }
}
