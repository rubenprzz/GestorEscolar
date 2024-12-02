using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using WebApplication1.DTOs;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlumnoController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly AlumnoService _alumnoService;

        public AlumnoController(AlumnoService alumnoService, IWebHostEnvironment environment)
        {
            _alumnoService = alumnoService;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult<List<Alumno>>> GetAlumnos()
        {
            var alumnos = await _alumnoService.ObtenerTodosLosAlumnos();
            return Ok(alumnos);
        }
        

        [HttpGet("dni/{dni}")]
        public async Task<ActionResult<Alumno>> GetAlumnoPorDni(string dni)
        {
            var alumno = await _alumnoService.ObtenerAlumnoPorDni(dni);
            if (alumno == null)
            {
                return NotFound();
            }
            return Ok(alumno);
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Alumno>> GetAlumno(int id)
        {
            var alumno = await _alumnoService.ObtenerAlumnoPorId(id);
            if (alumno == null)
            {
                return NotFound();
            }
            return Ok(alumno);
        }
        [HttpPost("upload")]

        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Alumno))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No se ha proporcionado un archivo válido.");
            }

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            var imageUrl = $"/uploads/{fileName}";

            return Ok(new { ImageUrl = imageUrl });
        }

        /*[HttpPost]
        public async Task<ActionResult<Alumno>> CrearAlumno([FromBody] CrearAlumnoDto dto)
        {
            if (dto == null)
                return BadRequest("Los datos del alumno no son válidos.");

            var nuevoAlumno = await _alumnoService.CrearAlumno(dto);
            if (nuevoAlumno == null)
                return BadRequest("Error al crear el alumno.");

            return CreatedAtAction(nameof(GetAlumnoPorDni), new { dni = nuevoAlumno.Dni }, nuevoAlumno);
        }*/
        [HttpPost]
        public async Task<IActionResult> CrearAlumnoConImagen([FromForm] CrearAlumnoDto dto)
        {
            if (dto == null)
                return BadRequest("Los datos del alumno no son válidos.");

            // Manejar la imagen
            string imageUrl = null;
            if (dto.foto != null && dto.foto.Length > 0)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.foto.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.foto.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/{fileName}";
            }

            var nuevoAlumno = await _alumnoService.CrearAlumno(dto, imageUrl);
            if (nuevoAlumno == null)
                return BadRequest("Error al crear el alumno.");

            return CreatedAtAction(nameof(GetAlumnoPorDni), new { dni = nuevoAlumno.Dni }, nuevoAlumno);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Alumno>> UpdateAlumno(int id, [FromBody] Alumno alumno)
        {
            if (alumno == null || id != alumno.Id)
            {
                return BadRequest("Los datos del alumno son incorrectos.");
            }

            var alumnoActualizado = await _alumnoService.ActualizarAlumno(alumno);
            if (alumnoActualizado == null)
            {
                return NotFound();
            }

            return Ok(alumnoActualizado);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAlumno(int id)
        {
            var eliminado = await _alumnoService.EliminarAlumno(id);
            if (!eliminado)
            {
                return NotFound();
            }

            return NoContent(); // 204 No Content
        }
    }
}
