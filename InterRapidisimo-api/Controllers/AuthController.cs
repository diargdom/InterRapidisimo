using InterRapidisimo_api.Class;
using InterRapidisimo_api.Context;
using InterRapidisimo_api.Models.DTOs;
using InterRapidisimo_api.Models.InterRapidisimo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InterRapidisimo_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly InterRapidisimoDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(InterRapidisimoDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDTO request)
        {
            var existe = await _context.Estudiantes.AnyAsync(e => e.Email == request.Email);
            if (existe)
                return BadRequest("Ya existe un estudiante con este correo electrónico.");

            var estudiante = new Estudiante
            {
                Nombre = request.Nombre,
                Email = request.Email,
                Contrasena = request.Contrasena
            };

            _context.Estudiantes.Add(estudiante);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(estudiante);
            return Ok(new { Token = token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDTO request)
        {
            var estudiante = await _context.Estudiantes.FirstOrDefaultAsync(e => e.Email == request.Email);

            if (estudiante == null || estudiante.Contrasena != request.Contrasena)
                return Unauthorized("Credenciales incorrectas.");

            var token = _jwtService.GenerateToken(estudiante);
            return Ok(new { Token = token });
        }
    }
}
