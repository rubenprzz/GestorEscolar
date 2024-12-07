using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AsistenciaController : ControllerBase
{
    private readonly AsistenciaService _asistenciaService;
    
    public AsistenciaController(AsistenciaService asistenciaService)
    {
        _asistenciaService = asistenciaService;
    }
    [HttpGet]
    public async Task<ActionResult<List<Asistencia>>> GetAsistencias()
    {
        var asistencias = await _asistenciaService.ObtenerTodasLasAsistencias();
        return Ok(asistencias);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Asistencia>> GetAsistencia(int id)
    {
        var asistencia = await _asistenciaService.ObtenerAsistenciaPorId(id);
        if (asistencia == null)
        {
            return NotFound();
        }
        return Ok(asistencia);
    }
    [HttpGet("alumno/{id}")]
    public async Task<ActionResult<Asistencia>> GetAsistenciaPorAlumnoId(int id)
    {
        var asistencia = await _asistenciaService.ObtenerAsistenciaPorAlumnoId(id);
        if (asistencia == null)
        {
            return NotFound();
        }
        return Ok(asistencia);
    }
    
    [HttpGet("identificador/{identificador}")]
    
    public async Task<ActionResult<Asistencia>> GetAsistenciaPorIdentificador(string identificador)
    {
        var asistencia = await _asistenciaService.ObtenerAsistenciaPorIdentificador(identificador);
        if (asistencia == null)
        {
            return NotFound();
        }
        return Ok(asistencia);
    }
    
    [HttpPost]
    public async Task<ActionResult<Asistencia>> CreateAsistencia([FromBody] createAsistenciaDto asistencia)
    {
        if (asistencia == null)
        {
            return BadRequest("La asistencia no puede ser nula.");
        }
        var nuevaAsistencia = await _asistenciaService.CreateAsistencia(asistencia);
        return CreatedAtAction(nameof(GetAsistencia), new { id = nuevaAsistencia.Id }, nuevaAsistencia);
    }
    [HttpPut("{id}")]
    public async Task<ActionResult<Asistencia>> UpdateAsistencia(int id, [FromBody] createAsistenciaDto asistencia)
    {
        if (asistencia == null || id != asistencia.Id)
        {
            return BadRequest("Los datos de la asistencia son incorrectos.");
        }
        var asistenciaActualizada = await _asistenciaService.ActualizarAsistencia(id, asistencia);
        if (asistenciaActualizada == null)
        {
            return NotFound();
        }
        return Ok(asistenciaActualizada);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsistencia(int id)
    {
        var asistencia = await _asistenciaService.ObtenerAsistenciaPorId(id);
        if (asistencia == null)
        {
            return NotFound();
        }
        await _asistenciaService.EliminarAsistencia(asistencia.Id);
        return NoContent();
    }
}