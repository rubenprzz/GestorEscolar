namespace WebApplication1.ViewModels
{
    public class AsistenciaViewModel
    {
        public int Id { get; set; }
        public DiaSemana Dia { get; set; } // Día de la clase
        public TimeSpan HoraInicio { get; set; } // Hora de inicio de la clase
        public TimeSpan HoraFin { get; set; } // Hora de fin de la clase
        public string Identificador { get; set; }
        public bool IsPresente { get; set; }

        public int AlumnoId { get; set; }
        public string AlumnoNombre { get; set; }
        public string AlumnoDni { get; set; }
        public int AsignaturaId { get; set; }
        public string AsignaturaNombre { get; set; }
    }
}