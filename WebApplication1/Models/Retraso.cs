namespace WebApplication1.Models;

public class Retraso
{
    
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public int MinutosRetraso { get; set; }
    public int AlumnoId { get; set; }
    public Alumno Alumno { get; set; }
    public Boolean Justificado { get; set; }
    public string Motivo { get; set; }

    public int AsignaturaId { get; set; }
    public Asignatura Asignatura { get; set; }
}