namespace InterRapidisimo_api.Models.DTOs.Store_Procedures
{
    public class sp_ObtenerMateriasConProfesoresDTO
    {
        public int MateriaId { get; set; }
        public string Nombre_Materia { get; set; }
        public int Creditos { get; set; }
        public string Nombre_Profesor{ get; set; }
    }
}
