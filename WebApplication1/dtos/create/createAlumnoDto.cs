using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace WebApplication1.DTOs;

public class CrearAlumnoDto
{
    public int id { get; set; }
    public string nombre { get; set; }
    
    public string apellidos { get; set; }
    
    public string dni { get; set; }
    public IFormFile? urlFoto { get; set; }
    
    public DateTime FechaNacimiento { get; set; }
    
    public string email { get; set; }
    
    public string? telefono { get; set; }
    
    public string cursoNombre { get; set; } // Nombre del curso obligatorio
    
    public List<string>? padresDnis { get; set; }
}
