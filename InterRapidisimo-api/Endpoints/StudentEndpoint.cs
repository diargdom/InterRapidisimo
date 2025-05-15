using InterRapidisimo_api.Class;
using InterRapidisimo_api.Interface;
using InterRapidisimo_api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;

namespace InterRapidisimo_api.Endpoints
{
    public static class StudentEndpoint
    {
        public static void MapStudentEndpoints(this WebApplication app)
        {
            var student = app.MapGroup("/student").RequireAuthorization();

            student.MapPost("/asignar-materias", [Authorize] async([FromBody] AssignSubjectsDTO asignarDTO, IStudentRepository studentInterface) =>
            {
                return await MethodGeneric.HandleSPRequest(() => 
                studentInterface.SetAsignarMaterias(asignarDTO));
            }).WithSummary("➡ Endpoint para asignar materias").WithTags("Student");

            student.MapGet("/materias", [Authorize] async (IStudentRepository studentRepository) =>
            {
                return await MethodGeneric.HandleSPRequest(() =>
                    studentRepository.GetMateriasDisponiblesAsync());
            }).WithSummary("➡ Lista las materias disponibles").WithTags("Student");

            student.MapPost("/companeros", [Authorize] async (EstudianteDTO IdDTO,IStudentRepository studentRepository) =>
            {
                return await MethodGeneric.HandleSPRequest(() =>
                    studentRepository.GetCompanerosPorMateria(IdDTO));
            }).WithSummary("➡ Lista los compañeros del estudiante por materia").WithTags("Student");

            student.MapPost("/delete-materia", [Authorize] async (DeleteEstudianteMateriaDTO deleteDTO, IStudentRepository studentRepository) =>
            {
                return await MethodGeneric.HandleSPRequest(() => 
                studentRepository.DeleteMateriaEstudiante(deleteDTO));
            }).WithSummary("➡ Endpoint para eliminar una materia del estudiante").WithTags("Student");

            student.MapGet("/{id}/materias-asignadas", [Authorize] async (int id, IStudentRepository studentRepository) =>
            {
                return await MethodGeneric.HandleSPRequest(() =>
                    studentRepository.GetMateriasAsignadas(id));
            }).WithSummary("➡ Obtiene las materias asignadas a un estudiante").WithTags("Student");

            student.MapGet("/{id}/historial", [Authorize] async (int id, IStudentRepository studentRepository) =>
            {
                return await MethodGeneric.HandleSPRequest(() =>
                    studentRepository.GetHistorialEstudiante(id));
            }).WithSummary("➡ Obtiene el historial de acciones del estudiante").WithTags("Student");

            student.MapGet("/", [Authorize] async (IStudentRepository studentRepository) =>
            {
                return await MethodGeneric.HandleSPRequest(() =>
                    studentRepository.GetAllEstudiantes());
            }).WithSummary("➡ Lista todos los estudiantes").WithTags("Student");
        }
    }
}
