namespace InterRapidisimo_api.Models.DTOs.Store_Procedures
{
    public class sp_HistorialEstudianteDTO
    {
        public string TipoRegistro { get; set; } 
        public string Fecha { get; set; }
        public string Hora { get; set; }
        public string Accion { get; set; } // 'INSERT', 'DELETE', 'UPDATE'
        public string Materia { get; set; }
        public string Profesor { get; set; }
        public string Usuario { get; set; }
        public string IpAddress { get; set; }
    }
}
