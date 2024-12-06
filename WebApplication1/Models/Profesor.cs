using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class Profesor
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellidos { get; set; }
    public string Dni { get; set; }
    public string Email { get; set; }
    public bool isDeleted { get; set; }

    public string Telefono { get; set; }
    [JsonIgnore]
    public ICollection<Asignatura> Asignaturas { get; set; }
}