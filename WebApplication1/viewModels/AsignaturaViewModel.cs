using System.Text.Json.Serialization;

namespace WebApplication1.ViewModels
{
    public class AsignaturaViewModel
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public bool IsPresente { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]

        public string profesorDni { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<string> CursoNombres { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]

        public List<string> Dias { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        // Lista de días (como cadenas)
        public List<string> HorasInicio { get; set; }  // Lista de horas de inicio
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]

        public List<string> HorasFin { get; set; }  // Lista de horas de fin
    }
}