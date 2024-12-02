namespace WebApplication1.DTOs;

public class createCursoDto
{
    public string? Nombre { get; set; }
    public DateOnly? FechaInicio { get; set; }
    public DateOnly? FechaFin { get; set; }
    public List<string> AlumnosSeleccionados { get; set; } = new List<string>();
}