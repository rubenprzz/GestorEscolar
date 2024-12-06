using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class Alumno
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellidos { get; set; }
    public bool isPresente { get; set; }
    public string Dni { get; set; }
    public DateOnly FechaNacimiento { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public string urlFoto { get; set; }
    public int CursoId { get; set; }
    public Curso Curso { get; set; }
    public string? imagen { get; set; }
    public bool isDeleted { get; set; }

    public ICollection<Padre> Padres { get; set; }
    [JsonIgnore]
    public ICollection<Asistencia> Asistencias { get; set; }
    [JsonIgnore]
    public ICollection<Justificante> Justificantes { get; set; }
    [JsonIgnore]
    public ICollection<Retraso> Retrasos { get; set; }
    public ICollection<Nota> Notas { get; set; }

}