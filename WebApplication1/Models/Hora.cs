using WebApplication1.Models;

public class Hora
{
    public int Id { get; set; }
    public DiaSemana Dia { get; set; } 
    public TimeSpan HoraInicio { get; set; }
    public TimeSpan HoraFin { get; set; }
    public int AsignaturaId { get; set; }
    public Asignatura Asignatura { get; set; }
    public bool isDeleted { get; set; }

   
}
public enum DiaSemana
{
    Lunes = 0,
    Martes = 1,
    Miércoles = 2,
    Jueves = 3,
    Viernes = 4,
    Sábado = 5,
    Domingo = 6
}

