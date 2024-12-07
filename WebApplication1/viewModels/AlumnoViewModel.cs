using WebApplication1.Models;

namespace WebApplication1.ViewModels
{
    public class AlumnoViewModel
    {
        public int? Id { get; set; }
        public string? Nombre { get; set; }
        public string? Apellidos { get; set; }
        public string? Dni { get; set; }
        public DateOnly? FechaNacimiento { get; set; }
        public string? Email { get; set; }
        public string? Telefono { get; set; }
        public List<string>? Padres { get; set; } = new List<string>();  
        public string? Curso { get; set; }  
        public List<string>? Justificantes { get; set; }
        public List<int>? Notas { get; set; }    // Notas del alumno
        public int? CantidadRetrasos { get; set; } // Número de retrasos
        private string? _urlFotoL; // Campo privado para almacenar la URL relativa

        public string? UrlFotoL
        {
            get => _urlFotoL;
            set => _urlFotoL = value;
        }

        public string? urlFoto
        {
            get => $"http://localhost:5202{_urlFotoL}";
            set
            {
                // Solo actualiza _urlFotoL con la parte relativa
                _urlFotoL = value.Replace("http://localhost:5202/", string.Empty);
            }
        }
        public int CantidadAsistenciasFaltadas { get; set; } // Número de faltas en asistencias

    }
}