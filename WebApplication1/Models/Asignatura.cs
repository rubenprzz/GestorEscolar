using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class Asignatura
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    
    public int ProfesorId { get; set; }
    public Profesor Profesor { get; set; }

    public ICollection<Curso> Cursos { get; set; }
    [JsonIgnore]
    public ICollection<Asistencia> Asistencias { get; set; }

    public ICollection<Retraso> Retrasos { get; set; }
    public ICollection<Nota> Notas { get; set; }
    [JsonIgnore]
    public ICollection<Hora> HorasDeClase { get; set; } 

}