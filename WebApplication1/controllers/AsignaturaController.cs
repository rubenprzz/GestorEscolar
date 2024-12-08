using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.Services;
using WebApplication1.ViewModels;

namespace WebApplication1.Controllers;
[Authorize(Roles = "Director,Profesor", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

[Route("api/[controller]")]
[ApiController]
public class AsignaturaController : ControllerBase
{
    private readonly AsignaturaService _asignaturaService;
    
    public AsignaturaController(AsignaturaService asignaturaService)
    {
        _asignaturaService = asignaturaService;
    }
    [HttpGet]
    public async Task<ActionResult<List<Asignatura>>> GetAsignaturas()
    {
        var asignaturas = await _asignaturaService.ObtenerTodasLasAsignaturas();
        return Ok(asignaturas);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Asignatura>> GetAsignatura(int id)
    {
        var asignatura = await _asignaturaService.ObtenerAsignaturaPorId(id);
        if (asignatura == null)
        {
            return NotFound();
        }
        return Ok(asignatura);
    }
    [HttpGet("nombre/{nombre}")]
    
    public async Task<ActionResult<Asignatura>> GetAsignaturaPorNombre(string nombre)
    {
        var asignatura = await _asignaturaService.ObtenerAsignaturaPorNombre(nombre);
        if (asignatura == null)
        {
            return NotFound();
        }
        return Ok(asignatura);
    }
    
    [HttpPost]
    public async Task<IActionResult> AgregarAsignatura([FromBody] createAsignaturaDto dto)
    {
        var asignatura= await _asignaturaService.AgregarAsignatura(dto);

        return CreatedAtAction(nameof(GetAsignatura), new { id = asignatura.Id }, asignatura);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Asignatura>> UpdateAsignatura(int id, [FromBody] createAsignaturaDto asignatura)
    {
        if (asignatura == null || id != asignatura.id)
        {
            return BadRequest("Los datos de la asignatura son incorrectos.");
        }
        var asignaturaActualizada = await _asignaturaService.ActualizarAsignatura(asignatura);
        if (asignaturaActualizada == null)
        {
            return NotFound();
        }
        return Ok(asignaturaActualizada);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAsignatura(int id)
    {
        var asignatura = await _asignaturaService.ObtenerAsignaturaPorId(id);
        if (asignatura == null)
        {
            return NotFound();
        }
        await _asignaturaService.EliminarAsignatura(asignatura.Id);
        return NoContent();
    }
    
    
}