using Microsoft.AspNetCore.Mvc;
using WebApplication1.dtos.create;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProfesorController : ControllerBase
{
    private readonly ProfesorService _profesorService;
    
    public ProfesorController(ProfesorService profesorService)
    {
        _profesorService = profesorService;
    }
    [HttpGet]
    public async Task<ActionResult<List<Profesor>>> GetProfesores()
    {
        var profesores = await _profesorService.ObtenerTodosLosProfesores();
        return Ok(profesores);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Profesor>> GetProfesor(int id)
    {
        var profesor = await _profesorService.ObtenerProfesorPorId(id);
        if (profesor == null)
        {
            return NotFound();
        }
        return Ok(profesor);
    }
    [HttpPost]
    public async Task<IActionResult> CrearProfesor([FromBody] createProfesorDto dto)
    {
        if (dto == null)
            return BadRequest("Los datos del profesor no son válidos.");

        var nuevoProfesor = await _profesorService.AgregarProfesor(dto);
        if (nuevoProfesor == null)
            return BadRequest("No se pudieron asociar todas las asignaturas proporcionadas.");

        return CreatedAtAction(nameof(GetProfesor), new { id = nuevoProfesor.Id }, nuevoProfesor);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Profesor>> UpdateProfesor(int id, [FromBody] createProfesorDto profesor)
    {
        if (profesor == null || id != profesor.id)
        {
            return BadRequest("Los datos del profesor son incorrectos.");
        }
        var profesorActualizado = await _profesorService.ActualizarProfesor(profesor);
        if (profesorActualizado == null)
        {
            return NotFound();
        }
        return Ok(profesorActualizado);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProfesor(int id)
    {
        var profesor = await _profesorService.ObtenerProfesorPorId(id);
        if (profesor == null)
        {
            return NotFound();
        }
        await _profesorService.EliminarProfesor(profesor.Id);
        return NoContent();
    }
}