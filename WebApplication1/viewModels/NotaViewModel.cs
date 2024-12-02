namespace WebApplication1.ViewModels;

public class NotaViewModel
{
    public int Id { get; set; }
    public DateOnly Fecha { get; set; }
    public decimal NotaValue { get; set; }
    public string AlumnoDni { get; set; }
    public string Motivo { get; set; }
    public string AlumnoNombre { get; set; }
    public int AsignaturaId { get; set; }
    public string AsignaturaNombre { get; set; }
    
}