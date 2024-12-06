using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    public class Curso
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public DateOnly FechaInicio { get; set; }
        public DateOnly FechaFin { get; set; }
        [JsonIgnore]
        public ICollection<Alumno> Alumnos { get; set; }
        [JsonIgnore]
        public ICollection<Asignatura> Asignaturas { get; set; }
        public bool isDeleted { get; set; }

    }
}