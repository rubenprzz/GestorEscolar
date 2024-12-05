namespace WebApplication1.dtos.create;

public class createRetrasoDto
{
    public int Id { get; set; }
    public string? Fecha { get; set; }
    public string? AlumnoDni { get; set; }
    public TimeSpan HoraLlegada { get; set; }
    public int MinutosRetraso { get; set; }
    public string? Motivo { get; set; }
    public bool Justificado { get; set; }
    public string? AsignaturaNombre { get; set; }
}
