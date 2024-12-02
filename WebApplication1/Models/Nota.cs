namespace WebApplication1.Models
{
    public class Nota
    {
        public int Id { get; set; }
        public decimal NotaValue { get; set; }
        public DateOnly Fecha { get; set; }
        public string Motivo { get; set; }

        public int AlumnoId { get; set; }
        public Alumno Alumno { get; set; }

        public int AsignaturaId { get; set; }
        public Asignatura Asignatura { get; set; }
    }
}