namespace WebApplication1.DTOs
{
    public class createAsignaturaDto
    {
        public string? nombre { get; set; }
        public string? profesorDni { get; set; }
        public string[] cursoNombres { get; set; }
        public List<string> horasInicio { get; set; }
        public List<string> horasFin { get; set; }
        public List<string> dias { get; set; }  // Usamos el enum DiaSemana
    }
}