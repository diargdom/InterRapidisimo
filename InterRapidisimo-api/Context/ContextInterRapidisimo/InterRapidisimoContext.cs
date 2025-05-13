using InterRapidisimo_api.Models.InterRapidisimo;
using Microsoft.EntityFrameworkCore;

namespace InterRapidisimo_api.Context.ContextInterRapidisimo
{
    public class InterRapidisimoContext : DbContext
    {
        public InterRapidisimoContext(DbContextOptions<InterRapidisimoContext> options) : base(options) { }
        public DbSet<Estudiante> Estudiantes { get; set; }
        public DbSet<Materia> Materias { get; set; }
        public DbSet<Profesor> Profesores { get; set; }
        public DbSet<EstudianteMateria> EstudianteMaterias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EstudianteMateria>()
                .HasOne(em => em.Estudiante)
                .WithMany(e => e.Materias)
                .HasForeignKey(em => em.EstudianteId);

            modelBuilder.Entity<EstudianteMateria>()
                .HasOne(em => em.Materia)
                .WithMany(m => m.Estudiantes)
                .HasForeignKey(em => em.MateriaId);
        }
    }
}
