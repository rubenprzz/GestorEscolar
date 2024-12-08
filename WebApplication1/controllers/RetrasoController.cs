using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.dtos.create;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;
[Authorize(Roles = "Director,Profesor", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

[Route("api/[controller]")]
[ApiController]
public class RetrasoController: ControllerBase
{
    private readonly RetrasoService _retrasoService;
    
    public RetrasoController(RetrasoService retrasoService)
    {
        _retrasoService = retrasoService;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<Retraso>>> GetRetrasos()
    {
        var retrasos = await _retrasoService.ObtenerTodosLosRetrasos();
        return Ok(retrasos);
    }
    [HttpGet("alumno/{id}")]
    public async Task<ActionResult<Retraso>> GetRetrasosPorIdAlumno(int id)
    {
        var retrasos = await _retrasoService.ObtenerRetrasosPorIdAlumno(id);
        if (retrasos == null)
        {
            return NotFound();
        }
        return Ok(retrasos);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Retraso>> GetRetraso(int id)
    {
        var retraso = await _retrasoService.ObtenerRetrasoPorId(id);
        if (retraso == null)
        {
            return NotFound();
        }
        return Ok(retraso);
    }
    
    [HttpPost]
    public async Task<ActionResult<Retraso>> CreateRetraso([FromBody] createRetrasoDto retraso)
    {
        if (retraso == null)
        {
            return BadRequest("El retraso no puede ser nulo.");
        }
        var nuevoRetraso = await _retrasoService.AgregarRetraso(retraso);
        return CreatedAtAction(nameof(GetRetraso), new { id = nuevoRetraso.Id }, nuevoRetraso);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Retraso>> UpdateRetraso(int id, [FromBody] createRetrasoDto retraso)
    {
        if (retraso == null || id != retraso.Id)
        {
            return BadRequest("Los datos del retraso son incorrectos.");
        }
        var retrasoActualizado = await _retrasoService.ActualizarRetraso(id, retraso);
        if (retrasoActualizado == null)
        {
            return NotFound();
        }
        return Ok(retrasoActualizado);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRetraso(int id)
    {
        var retraso = await _retrasoService.ObtenerRetrasoPorId(id);
        if (retraso == null)
        {
            return NotFound();
        }
        await _retrasoService.EliminarRetraso(retraso.Id);
        return NoContent();
    }
    
    
}