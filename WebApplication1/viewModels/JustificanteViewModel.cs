namespace WebApplication1.ViewModels
{
    public class JustificanteViewModel
    {
        public int Id { get; set; }
        public DateOnly FechaJustificacion { get; set; }
        public string Descripcion { get; set; }
        public string Alias { get; set; }
        public string Motivo { get; set; }

        public string AlumnoDni { get; set; } 

        public string AsistenciaIdentificador { get; set; }
        public bool AsistenciaIsPresente { get; set; }

        public string AsignaturaNombre { get; set; }
    }
}