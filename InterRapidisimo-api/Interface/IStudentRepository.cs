using InterRapidisimo_api.Models.DTOs;
using InterRapidisimo_api.Models.DTOs.Store_Procedures;
using InterRapidisimo_api.Models.InterRapidisimo;

namespace InterRapidisimo_api.Interface
{
    public interface IStudentRepository
    {
        Task<bool> SetAsignarMaterias(AssignSubjectsDTO asignarDTO);
        Task<List<sp_ObtenerMateriasConProfesoresDTO>> GetMateriasDisponiblesAsync();
        Task<List<sp_ObtenerCompanerosDTO>> GetCompanerosPorMateria(EstudianteDTO idDTO);
        Task<bool> DeleteMateriaEstudiante(DeleteEstudianteMateriaDTO deleteDTO);
    }
}
