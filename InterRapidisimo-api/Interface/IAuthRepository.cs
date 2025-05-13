using InterRapidisimo_api.Models.DTOs;
using InterRapidisimo_api.Models.DTOs.Store_Procedures;

namespace InterRapidisimo_api.Interface
{
    public interface IAuthRepository
    {
        string GenerateJwtToken(LoginRequestDTO LoginDTO);
        Task<sp_RegistrarEstudianteDTO> SetRegisterStudent(RegisterStudentDTO registerStudentDTO);
    }
}
