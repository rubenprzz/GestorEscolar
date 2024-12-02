namespace WebApplication1.ViewModels;

public class ProfesorViewModel
{
    public int Id { get; set; }
    public string Dni { get; set; }
    public string Nombre { get; set; }
    public string Apellidos { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public List<AsignaturaViewModel> Asignaturas { get; set; }
    
}