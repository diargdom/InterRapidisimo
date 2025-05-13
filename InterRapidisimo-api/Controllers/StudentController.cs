//using InterRapidisimo_api.Context;
//using InterRapidisimo_api.Models.DTOs;
//using InterRapidisimo_api.Models.InterRapidisimo;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Claims;

//namespace InterRapidisimo_api.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    [Authorize]
//    public class StudentController : ControllerBase
//    {
//        private readonly InterRapidisimoDbContext _context;
//        public StudentController(InterRapidisimoDbContext context)
//        {
//            _context = context;
//        }

//        private int ObtenerEstudianteIdDesdeToken()
//        {
//            var identity = HttpContext.User.Identity as ClaimsIdentity;
//            var estudianteId = identity?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//            return int.Parse(estudianteId ?? "0");
//        }

//        [HttpPost("asignar-materias")]
//        public async Task<IActionResult> AsignarMaterias([FromBody] MateriaAsignacionRequestDTO request)
//        {
//            var estudianteId = ObtenerEstudianteIdDesdeToken();

//            if (request.MateriaIds.Count != 3)
//                return BadRequest("Debes seleccionar exactamente 3 materias.");

//            var materias = await _context.Materias
//                .Include(m => m.Profesor)
//                .Where(m => request.MateriaIds.Contains(m.MateriaId))
//                .ToListAsync();

//            if (materias.Count != 3)
//                return BadRequest("Algunas materias seleccionadas no existen.");

//            var profesores = materias.Select(m => m.ProfesorId).Distinct();
//            if (profesores.Count() < 3)
//                return BadRequest("No puedes elegir más de una materia con el mismo profesor.");

//            var asignacionesPrevias = await _context.EstudianteMaterias
//                .Where(em => em.EstudianteId == estudianteId)
//                .ToListAsync();

//            if (asignacionesPrevias.Any())
//                return BadRequest("Ya has asignado tus materias.");

//            foreach (var materiaId in request.MateriaIds)
//            {
//                _context.EstudianteMaterias.Add(new EstudianteMateria
//                {
//                    EstudianteId = estudianteId,
//                    MateriaId = materiaId
//                });
//            }

//            await _context.SaveChangesAsync();
//            return Ok("Materias asignadas correctamente.");
//        }

//        [HttpGet("clases-compartidas")]
//        public async Task<IActionResult> ObtenerClasesCompartidas()
//        {
//            var estudianteId = ObtenerEstudianteIdDesdeToken();

//            var materiasDelEstudiante = await _context.EstudianteMaterias
//                .Where(em => em.EstudianteId == estudianteId)
//                .Select(em => em.MateriaId)
//                .ToListAsync();

//            var estudiantesCompartidos = await _context.EstudianteMaterias
//                .Where(em => materiasDelEstudiante.Contains(em.MateriaId) && em.EstudianteId != estudianteId)
//                .Select(em => em.Estudiante.Nombre)
//                .Distinct()
//                .ToListAsync();

//            return Ok(estudiantesCompartidos);
//        }
//    }
//}
