namespace WebApplication1.DTOs
{
    public class createAsignaturaDto
    {
        public int id { get; set; }
        public string Nombre { get; set; }
        public string ProfesorDni { get; set; }
        public List<string> CursoNombres { get; set; }
        public List<string> Dias { get; set; }      // Lista de días
        public List<string> HorasInicio { get; set; } // Lista de horas de inicio (en formato HH:mm)
        public List<string> HorasFin { get; set; }    // Lista de horas de fin (en formato HH:mm)
    }

}