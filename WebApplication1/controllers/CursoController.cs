using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers;
[Authorize(Roles = "Director", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

[Route("api/[controller]")]
[ApiController]
public class CursoController : ControllerBase
{
    private readonly CursoService _cursoService;
    
    public CursoController(CursoService cursoService)
    {
        _cursoService = cursoService;
    }
    [HttpGet]
    public async Task<ActionResult<List<Curso>>> GetCursos()
    {
        var cursos = await _cursoService.ObtenerTodosLosCursos();
        return Ok(cursos);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Curso>> GetCurso(int id)
    {
        var curso = await _cursoService.ObtenerCursoPorId(id);
        if (curso == null)
        {
            return NotFound();
        }
        return Ok(curso);
    }
    [HttpGet("nombre/{nombre}")]
    
    public async Task<ActionResult<Curso>> GetCursoPorNombre(string nombre)
    {
        var curso = await _cursoService.ObtenerCursoPorNombre(nombre);
        if (curso == null)
        {
            return NotFound();
        }
        return Ok(curso);
    }
    
    [HttpPost]
    public async Task<ActionResult<Curso>> CreateCurso([FromBody] createCursoDto curso)
    {
        if (curso == null)
        {
            return BadRequest("El curso no puede ser nulo.");
        }
        var nuevoCurso = await _cursoService.AgregarCurso(curso);
        return CreatedAtAction(nameof(GetCurso), new { id = nuevoCurso.Id }, nuevoCurso);
    }
    [HttpPut("{id}")]
    public async Task<ActionResult<Curso>> UpdateCurso(int id, [FromBody] createCursoDto curso)
    {
        if (curso == null || id != curso.Id)
        {
            return BadRequest("Los datos del curso son incorrectos.");
        }
        var cursoActualizado = await _cursoService.ActualizarCurso(id,curso);
        if (cursoActualizado == null)
        {
            return NotFound();
        }
        return Ok(cursoActualizado);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCurso(int id)
    {
        var curso = await _cursoService.ObtenerCursoPorId(id);
        if (curso == null)
        {
            return NotFound();
        }
        await _cursoService.EliminarCurso(curso.Id);
        return NoContent();
    }
    
}