namespace InterRapidisimo_api.Models.DTOs.Store_Procedures
{
    public class sp_ObtenerMateriasAsignadasDTO
    {
        public int Id { get; set; }
        public string Materia { get; set; }
        public string Profesor { get; set; }
        public int Creditos { get; set; }
    }
}
