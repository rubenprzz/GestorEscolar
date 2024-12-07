using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Context
{
    public class DatabaseContext : IdentityDbContext<IdentityUser>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        public DbSet<Padre> Padres { get; set; }
        public DbSet<Alumno> Alumnos { get; set; }
        public DbSet<Justificante> Justificantes { get; set; }
        public DbSet<Profesor> Profesores { get; set; }
        public DbSet<Asignatura> Asignaturas { get; set; }
        public DbSet<Curso> Cursos { get; set; }
        public DbSet<Asistencia> Asistencias { get; set; }
        public DbSet<Retraso> Retrasos { get; set; }
        public DbSet<Nota> Notas { get; set; }
        public DbSet<Hora> Horas { get; set; }
        

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Database=GestorAlumnosDb;Username=admin;Password=password;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            //que ignore los is deleted
            modelBuilder.Entity<Padre>().HasQueryFilter(p => !p.isDeleted);
            modelBuilder.Entity<Alumno>().HasQueryFilter(a => !a.isDeleted);
            modelBuilder.Entity<Profesor>().HasQueryFilter(p => !p.isDeleted);
            modelBuilder.Entity<Asignatura>().HasQueryFilter(a => !a.isDeleted);
            modelBuilder.Entity<Curso>().HasQueryFilter(c => !c.isDeleted);
            modelBuilder.Entity<Asistencia>().HasQueryFilter(a => !a.isDeleted);
            modelBuilder.Entity<Retraso>().HasQueryFilter(r => !r.isDeleted);
            modelBuilder.Entity<Nota>().HasQueryFilter(n => !n.isDeleted);
            modelBuilder.Entity<Hora>().HasQueryFilter(h => !h.isDeleted);
            modelBuilder.Entity<Justificante>().HasQueryFilter(j => !j.isDeleted);
            
            modelBuilder.Entity<IdentityUser>().ToTable("Users");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
            modelBuilder.Entity<Alumno>()
                .HasMany(a => a.Padres)
                .WithMany(p => p.Alumnos)
                .UsingEntity(j => j.ToTable("AlumnoPadres"));
    
            modelBuilder.Entity<Alumno>()
                .HasOne(a => a.Curso)
                .WithMany(c => c.Alumnos)
                .HasForeignKey(a => a.CursoId);

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Alumno)
                .WithMany(a => a.Asistencias)
                .HasForeignKey(a => a.AlumnoId);

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Asignatura)
                .WithMany(a => a.Asistencias)
                .HasForeignKey(a => a.AsignaturaId);

            modelBuilder.Entity<Justificante>()
                .HasOne(j => j.Asistencia)
                .WithMany()
                .HasForeignKey(j => j.AsistenciaId);

            modelBuilder.Entity<Justificante>()
                .HasOne(j => j.Alumno)
                .WithMany(a => a.Justificantes)
                .HasForeignKey(j => j.AlumnoId);

            modelBuilder.Entity<Retraso>()
                .HasOne(r => r.Alumno)
                .WithMany(a => a.Retrasos)
                .HasForeignKey(r => r.AlumnoId);

            modelBuilder.Entity<Retraso>()
                .HasOne(r => r.Asignatura)
                .WithMany(a => a.Retrasos)
                .HasForeignKey(r => r.AsignaturaId);

            modelBuilder.Entity<Asignatura>()
                .HasOne(a => a.Profesor)
                .WithMany(p => p.Asignaturas)
                .HasForeignKey(a => a.ProfesorId);

            modelBuilder.Entity<Curso>()
                .HasMany(c => c.Asignaturas)
                .WithMany(a => a.Cursos)
                .UsingEntity(j => j.ToTable("CursoAsignaturas"));

            modelBuilder.Entity<Nota>()
                .HasOne(n => n.Alumno)
                .WithMany(a => a.Notas)
                .HasForeignKey(n => n.AlumnoId);

            modelBuilder.Entity<Nota>()
                .HasOne(n => n.Asignatura)
                .WithMany(a => a.Notas)
                .HasForeignKey(n => n.AsignaturaId)
                ;

            modelBuilder.Entity<Asignatura>()
                .HasMany(a => a.HorasDeClase)
                .WithOne(h => h.Asignatura)
                .HasForeignKey(h => h.AsignaturaId)
                ;
        }
    }
}
