using Microsoft.AspNetCore.Mvc;
using WebApplication1.dtos.create;
using WebApplication1.Models;
using WebApplication1.Services;
using WebApplication1.ViewModels;

namespace WebApplication1.Controllers;


[Route("api/[controller]")]
[ApiController]
public class JustificanteController : ControllerBase
{
    private readonly JustificanteService _justificanteService;

    public JustificanteController(JustificanteService justificanteService)
    {
        _justificanteService = justificanteService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Justificante>>> GetJustificantesConAsignatura()
    {
        var justificantes = await _justificanteService.ObtenerJustificantesConAsignatura();
    
        if (justificantes == null || !justificantes.Any())
        {
            return NotFound("No se encontraron justificantes.");
        }

        return Ok(justificantes);
    }
    //obtener por fecha
    
    [HttpGet("fecha/{fecha}")]
    public async Task<ActionResult<Justificante> > GetJustificantePorFecha(DateOnly fecha)
    {
        var justificante = await _justificanteService.ObtenerJustificantesPorFecha(fecha);
        if (justificante == null)
        {
            return NotFound();
        }
        return Ok(justificante);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Justificante>> GetJustificante(int id)
    {
        var justificante = await _justificanteService.ObtenerJustificanteById(id);
        if (justificante == null)
        {
            return NotFound();
        }
        return Ok(justificante);
    }
    
    [HttpPost]
    public async Task<ActionResult<Justificante>> CreateJustificante([FromBody] createJustificanteDto dto)
    {
        var justificante = await _justificanteService.CreateJustificante(dto);
        return CreatedAtAction(nameof(GetJustificante), new { id = justificante.Id }, justificante);
    }
    
    
    
    [HttpGet("alias/{alias}")]
    public async Task<ActionResult<JustificanteViewModel>> GetJustificantePorAlias(string alias)
    {
        var justificante = await _justificanteService.ObtenerJustificanteByAlias(alias);
        if (justificante == null)
        {
            return NotFound();
        }
        return Ok(justificante);
    }
  
}
    
