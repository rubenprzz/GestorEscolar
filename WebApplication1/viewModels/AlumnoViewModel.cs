using WebApplication1.Models;

namespace WebApplication1.ViewModels
{
    public class AlumnoViewModel
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Dni { get; set; }
        public DateOnly FechaNacimiento { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public List<string> Padres { get; set; } = new List<string>();  
        public string Curso { get; set; }  
        public List<string> Justificantes { get; set; }
        public List<int> Notas { get; set; }    // Notas del alumno
        public int CantidadRetrasos { get; set; } // Número de retrasos
        public string urlFoto { get; set; }

        public int CantidadAsistenciasFaltadas { get; set; } // Número de faltas en asistencias

    }
}