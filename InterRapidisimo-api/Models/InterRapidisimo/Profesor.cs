namespace InterRapidisimo_api.Models.InterRapidisimo
{
    public class Profesor
    {
        public int ProfesorId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public ICollection<Materia> Materias { get; set; } = new List<Materia>();
    }
}
