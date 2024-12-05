
namespace WebApplication1.dtos.create
{
    public class createPadreDto
    {
        public int id { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Dni { get; set; }
        public string Telefono { get; set; }
        public List<string> Alumnos { get; set; } // IDs de los alumnos que serán asociados a este padre
    }
}

