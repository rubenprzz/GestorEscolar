namespace WebApplication1.viewModels;

public class AlumnoViewModelSinCamposNoNecesarios
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellidos { get; set; }
    public string Dni { get; set; }
    public DateOnly FechaNacimiento { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public List<string> Padres { get; set; } = new List<string>();  
}