using InterRapidisimo_api.Class;
using InterRapidisimo_api.Context.ContextInterRapidisimo;
using InterRapidisimo_api.Interface;
using InterRapidisimo_api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InterRapidisimo_api.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this WebApplication app)
        {
            var auth = app.MapGroup("/auth");

            auth.MapPost("/register", async (RegisterStudentDTO registerStudentDTO, IAuthRepository authInterface) =>
            {
                return await MethodGeneric.HandleSPRequest(() => authInterface.SetRegisterStudent(registerStudentDTO));
            }).WithSummary("➡ Endpoint para registrar estudiantes").WithTags("Auth");

            auth.MapPatch("/updateStudent", async (UpdateStudentDTO updateDTO, IAuthRepository authInterface) =>
            {
                return await MethodGeneric.HandleSPRequest(() => authInterface.SetUpdateStudent(updateDTO));
            }).WithSummary("➡ Endpoint para actualizar estudiantes").WithTags("Auth");

            auth.MapPost("/login", async (HttpContext httpContext, [FromBody] LoginRequestDTO LoginDTO, IAuthRepository authInterface, InterRapidisimoContext context) =>
            {
                try
                {
                    var student = await context.Estudiantes.FirstOrDefaultAsync(e => e.Email == LoginDTO.Email);
                    if (student == null || !BCrypt.Net.BCrypt.Verify(LoginDTO.Password, student.Contrasena))
                    {
                        return Results.Unauthorized();
                    }                                     

                    var token = authInterface.GenerateJwtToken(LoginDTO);
                    return Results.Ok(new { Token = token, IdEst = student.EstudianteId, Nombre = student.Nombre, Rol = student.Rol });
                }
                catch (Exception ex)
                {

                    return Results.Unauthorized();
                }
            }).WithSummary("➡ Endpoint para loguin y generación de JWT").WithTags("Auth");
        }
    }
}
