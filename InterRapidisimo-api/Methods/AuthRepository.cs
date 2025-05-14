using Dapper;
using InterRapidisimo_api.Configurations;
using InterRapidisimo_api.Context.ContextInterRapidisimo;
using InterRapidisimo_api.Interface;
using InterRapidisimo_api.Models.DTOs;
using InterRapidisimo_api.Models.DTOs.Store_Procedures;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InterRapidisimo_api.Methods
{
    public class AuthRepository : IAuthRepository
    {
        private readonly JwtSettings _jwtSettings;
        private readonly InterRapidisimoContext _interRapidisimoContext;
        private readonly string _connectionStringInterRapidisimo;

        public AuthRepository(JwtSettings jwtSettings, InterRapidisimoContext interRapidisimoContext, IConfiguration configuration)
        {
            _jwtSettings = jwtSettings;
            _interRapidisimoContext = interRapidisimoContext;
            _connectionStringInterRapidisimo = configuration.GetConnectionString("ConnectionLocal");
        }

        public async Task<sp_RegistrarEstudianteDTO> SetRegisterStudent(RegisterStudentDTO registerStudentDTO)
        {
            int? NuevoID = null;
            using var connection = new SqlConnection(_connectionStringInterRapidisimo);
            await connection.OpenAsync();
            using var transaction = await connection.BeginTransactionAsync();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerStudentDTO.Contrasena);

            var parameters = new DynamicParameters();
            parameters.Add("Nombre", registerStudentDTO.Nombre);
            parameters.Add("Email", registerStudentDTO.Email);
            parameters.Add("Contrasena", hashedPassword);
            parameters.Add("DocumentoIdentidad", registerStudentDTO.DocumentoIdentidad);
            parameters.Add("Rol", registerStudentDTO.Rol);
            parameters.Add("NuevoID", NuevoID, DbType.Int32, ParameterDirection.InputOutput);
            await connection.ExecuteAsync(
                    "[dbo].[sp_RegistrarEstudiante]",
                    parameters,
                    transaction,
                    commandType: CommandType.StoredProcedure
                );
            var idStudent = parameters.Get<int>("NuevoID");
            await transaction.CommitAsync();
            return new sp_RegistrarEstudianteDTO
            {
                NuevoID = idStudent
            };
        }

        public async Task<sp_ActualizarEstudianteDTO> SetUpdateStudent(UpdateStudentDTO updateStudentDTO)
        {
            int? IdTableStudent = null;
            using var connection = new SqlConnection(_connectionStringInterRapidisimo);
            var parameters = new DynamicParameters();
            parameters.Add("EstudianteId", updateStudentDTO.EstudianteId);
            parameters.Add("NuevoNombre", updateStudentDTO.NuevoNombre);
            parameters.Add("NuevoEmail", updateStudentDTO.NuevoEmail);
            parameters.Add("IdTableStudent", IdTableStudent);
            await connection.ExecuteAsync(
                "[dbo].[sp_ActualizarEstudiante]",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            
            return new sp_ActualizarEstudianteDTO
            {
                IdTableStudent = updateStudentDTO.EstudianteId
            };
        }


        public string GenerateJwtToken(LoginRequestDTO LoginDTO)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, LoginDTO.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpireMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
