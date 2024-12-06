namespace WebApplication1.Models;

public class Justificante
{
    public int Id { get; set; }
    public DateOnly FechaJustificacion { get; set; }
    public string Descripcion { get; set; }
    public string Motivo { get; set; }

    public int AlumnoId { get; set; }
    public Alumno Alumno { get; set; }

    public int AsistenciaId { get; set; }
    public Asistencia Asistencia { get; set; }
    public bool isDeleted { get; set; }

    
    public string Alias { get; set; }
    


}