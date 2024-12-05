public class createProfesorDto
{
    public int id { get; set; }
    public string Nombre { get; set; }
    public string Apellidos { get; set; }
    public string Dni { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public List<int> asignaturasId { get; set; }
}