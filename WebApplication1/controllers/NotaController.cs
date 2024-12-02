using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;
[Route("api/[controller]")]
[ApiController]
public class NotaController : ControllerBase
{
    private  readonly NotaService _notaService;
    public NotaController(NotaService notaService)
    {
        _notaService = notaService;
    }
    [HttpGet]
    public async Task<ActionResult<List<Nota>>> GetNotas()
    {
        var notas = await _notaService.ObtenerTodasLasNotas();
        return Ok(notas);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Nota>> GetNota(int id)
    {
        var nota = await _notaService.ObtenerNotaPorId(id);
        if (nota == null)
        {
            return NotFound();
        }
        return Ok(nota);
    }
    [HttpPost]
    public async Task<ActionResult<Nota>> CreateNota([FromBody] Nota nota)
    {
        if (nota == null)
        {
            return BadRequest("La nota no puede ser nula.");
        }
        var nuevaNota = await _notaService.AgregarNota(nota);
        return CreatedAtAction(nameof(GetNota), new { id = nuevaNota.Id }, nuevaNota);
    }
    [HttpPut("{id}")]
    public async Task<ActionResult<Nota>> UpdateNota(int id, [FromBody] Nota nota)
    {
        if (nota == null || id != nota.Id)
        {
            return BadRequest("Los datos de la nota son incorrectos.");
        }
        var notaActualizada = await _notaService.ActualizarNota(nota);
        if (notaActualizada == null)
        {
            return NotFound();
        }
        return Ok(notaActualizada);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNota(int id)
    {
        var nota = await _notaService.ObtenerNotaPorId(id);
        if (nota == null)
        {
            return NotFound();
        }
        await _notaService.EliminarNota(nota.Id);
        return NoContent();
    }
}