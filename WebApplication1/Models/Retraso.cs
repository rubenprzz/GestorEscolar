namespace WebApplication1.Models
{
    public class Retraso
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public int MinutosRetraso { get; set; }
        public TimeSpan HoraLlegada { get; set; }
        public int AlumnoId { get; set; }
        public Alumno? Alumno { get; set; }
        public Boolean Justificado { get; set; }
        public string? Motivo { get; set; }
        public bool isDeleted { get; set; }

        public int AsignaturaId { get; set; }
        public Asignatura Asignatura { get; set; }

     
        public int CalcularMinutosDeRetraso(TimeSpan horaInicio)
        {
            if (HoraLlegada > horaInicio)
            {
                return (int)(HoraLlegada - horaInicio).TotalMinutes;
            }
            return 0; 
        }
    }

    }
