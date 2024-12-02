namespace WebApplication1.ViewModels;

public class RetrasoViewModel
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Motivo { get; set; }
    public bool Justificado { get; set; }
    public int MinutosRetraso { get; set; }
    public string alumnoDni { get; set; }
    public string alumnoNombre { get; set; }
    public string asignaturaNombre { get; set; }
    
}