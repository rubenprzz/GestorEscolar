namespace WebApplication1.DTOs;

public class createCursoDto
{
    public string? Nombre { get; set; }
    public DateOnly? FechaInicio { get; set; }
    public DateOnly? FechaFin { get; set; }
    public List<string>? alumnos { get; set; } = new List<string>();
    public List<string>? asignaturas { get; set; } = new List<string>();
}