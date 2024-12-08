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
public class PadreController: ControllerBase
{
    private readonly PadreService _padreService;
    
    public PadreController(PadreService padreService)
    {
        _padreService = padreService;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<Padre>>> GetPadres()
    {
        var padres = await _padreService.ObtenerTodosLosPadres();
        return Ok(padres);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Padre>> GetPadre(int id)
    {
        var padre = await _padreService.ObtenerPadrePorId(id);
        if (padre == null)
        {
            return NotFound();
        }
        return Ok(padre);
    }
    //obtener por Dni
    
    [HttpGet("dni/{dni}")]
    public async Task<ActionResult<Padre>> GetPadrePorDni(string dni)
    {
        var padre = await _padreService.ObtenerPadrePorDni(dni);
        if (padre == null)
        {
            return NotFound();
        }
        return Ok(padre);
    }
    
    
    [HttpPost]
    public async Task<ActionResult<Padre>> CreatePadre([FromBody] createPadreDto padre)
    {
        if (padre == null)
        {
            return BadRequest("El padre no puede ser nulo.");
        }
        var nuevoPadre = await _padreService.AgregarPadre(padre);
        return CreatedAtAction(nameof(GetPadre), new { id = nuevoPadre.Id }, nuevoPadre);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Padre>> UpdatePadre(int id, [FromBody] createPadreDto padre)
    {
        if (padre == null || id != padre.id)
        {
            return BadRequest("Los datos del padre son incorrectos.");
        }
        var padreActualizado = await _padreService.ActualizarPadre(padre);
        if (padreActualizado == null)
        {
            return NotFound();
        }
        return Ok(padreActualizado);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePadre(int id)
    {
        var padre = await _padreService.ObtenerPadrePorId(id);
        if (padre == null)
        {
            return NotFound();
        }
        await _padreService.EliminarPadre(padre.Id);
        return NoContent();
    }
    
}