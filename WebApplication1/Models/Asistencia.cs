namespace WebApplication1.Models;

public class Asistencia
{
    public int Id { get; set; }
    public DiaSemana DiaSemana { get; set; }
    public TimeSpan HoraInicio { get; set; }
    public TimeSpan HoraFin { get; set; }
    public string Identificador { get; set; }
    public bool IsPresente { get; set; }

    public int AlumnoId { get; set; }
    public Alumno Alumno { get; set; }

    public int AsignaturaId { get; set; }
    public Asignatura Asignatura { get; set; }
}