using Dapper;
using InterRapidisimo_api.Context.ContextInterRapidisimo;
using InterRapidisimo_api.Interface;
using InterRapidisimo_api.Models.DTOs;
using InterRapidisimo_api.Models.DTOs.Store_Procedures;
using InterRapidisimo_api.Models.InterRapidisimo;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace InterRapidisimo_api.Methods
{
    public class StudentRepository : IStudentRepository
    {
        private readonly string _connectionStringInter;

        public StudentRepository(IConfiguration configuration)
        {
            _connectionStringInter = configuration.GetConnectionString("ConnectionLocal");
        }

        public async Task<bool> SetAsignarMaterias(AssignSubjectsDTO asignarDTO)
        {
            using var connection = new SqlConnection(_connectionStringInter);
            var parameters = new DynamicParameters();
            parameters.Add("EstudianteId", asignarDTO.EstudianteId);
            parameters.Add("Materia1", asignarDTO.Materia1);
            parameters.Add("Materia2", asignarDTO.Materia2);
            parameters.Add("Materia3", asignarDTO.Materia3);

            await connection.ExecuteAsync("sp_AsignarMaterias", parameters, commandType: CommandType.StoredProcedure);
            return true;
        }

        public async Task<List<sp_ObtenerMateriasConProfesoresDTO>> GetMateriasDisponiblesAsync()
        {
            using var connection = new SqlConnection(_connectionStringInter);
            var result = await connection.QueryAsync<sp_ObtenerMateriasConProfesoresDTO>(
                "[dbo].[sp_ObtenerMateriasConProfesores]",
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }

        public async Task<List<sp_ObtenerCompanerosDTO>> GetCompanerosPorMateria(EstudianteDTO idDTO)
        {
            using var connection = new SqlConnection(_connectionStringInter);
            var result = await connection.QueryAsync<sp_ObtenerCompanerosDTO>(
                "[dbo].[sp_ObtenerCompaneros]",
                new { EstudianteId = idDTO.EstudianteId },
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }

        public async Task<bool> DeleteMateriaEstudiante(DeleteEstudianteMateriaDTO deleteDTO)
        {
            using var connection = new SqlConnection(_connectionStringInter);
            await connection.OpenAsync();
            var parameters = new DynamicParameters();
            parameters.Add("EstudianteId", deleteDTO.EstudianteId);
            parameters.Add("MateriaId", deleteDTO.MateriaId);

            await connection.ExecuteAsync(
                "[dbo].[sp_EliminarMateriaEstudiante]",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return true;
        }

        public async Task<List<sp_ObtenerMateriasAsignadasDTO>> GetMateriasAsignadas(int IdStudent)
        {
            using var connection = new SqlConnection(_connectionStringInter);
            var result = await connection.QueryAsync<sp_ObtenerMateriasAsignadasDTO>(
                "[dbo].[sp_ObtenerMateriasAsignadas]",
                new { EstudianteId = IdStudent },
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }

        public async Task<List<sp_HistorialEstudianteDTO>> GetHistorialEstudiante(int IdStudent)
        {
            using var connection = new SqlConnection(_connectionStringInter);
            var result = await connection.QueryAsync<sp_HistorialEstudianteDTO>(
                "[dbo].[sp_ObtenerHistorialEstudiante]",
                new { EstudianteId = IdStudent },
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }
    }
}
