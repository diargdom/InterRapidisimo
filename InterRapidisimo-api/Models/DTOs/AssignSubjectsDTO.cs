using System.ComponentModel.DataAnnotations;

namespace InterRapidisimo_api.Models.DTOs
{
    public class AssignSubjectsDTO
    {
        [Range(1, int.MaxValue, ErrorMessage = "ID de estudiante inválido")]
        public int EstudianteId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "Materia 1 inválida")]
        public int Materia1 { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "Materia 2 inválida")]
        public int Materia2 { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Materia 3 inválida")] 
        public int Materia3 { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Materia1 == Materia2 || Materia1 == Materia3 || Materia2 == Materia3)
            {
                yield return new ValidationResult("No puede seleccionar la misma materia más de una vez",
                    new[] { nameof(Materia1), nameof(Materia2), nameof(Materia3) });
            }
        }
    }
}
