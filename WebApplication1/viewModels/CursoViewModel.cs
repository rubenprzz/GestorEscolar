using WebApplication1.viewModels;

namespace WebApplication1.ViewModels;

public class CursoViewModel
{
    public List<AsignaturaViewModel>  Asignaturas { get; set; }
    public List<AlumnoViewModelSinCamposNoNecesarios> Alumnos { get; set; }
    public int Id { get; set; }
    public string Nombre { get; set; }
    public DateOnly FechaInicio { get; set; }
    public DateOnly FechaFin { get; set; }
    
}