using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.DTOs;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.viewModels;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class CursoService
    {
        private readonly DatabaseContext _context;
        private readonly BaseMapper _mapper;

        public CursoService(DatabaseContext context, BaseMapper mapper)
        {
            _context = context;
            _mapper = mapper;  
        }

        public async Task<List<CursoViewModel>> ObtenerTodosLosCursos()
        {
            return await _context.Cursos
                .Include(c => c.Alumnos)
                .Include(c => c.Asignaturas)
                .ThenInclude(a => a.HorasDeClase)
                .Select(c => new CursoViewModel
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Alumnos = c.Alumnos
                        .Where(a => true)
                        .Select(a => new AlumnoViewModelSinCamposNoNecesarios
                        {
                            Id = a.Id,
                            Nombre = a.Nombre,
                            Apellidos = a.Apellidos,
                            Dni = a.Dni,
                            FechaNacimiento = a.FechaNacimiento,
                            Email = a.Email,
                            Padres = a.Padres.Select(p => p.Dni).ToList(),
                            Telefono = a.Telefono,
                        }).ToList(),
                    Asignaturas = c.Asignaturas
                        .Where(a => true)
                        

                        .Select(a => new AsignaturaViewModel
                        {
                            Id = a.Id,
                            profesorDni = a.Profesor.Dni,
                            Nombre = a.Nombre,
                            HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                            HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                            Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()
                            

                        }).ToList(),
                    FechaFin = c.FechaFin,
                    FechaInicio = c.FechaInicio
                })
                .ToListAsync();
        }

        public async Task<CursoViewModel> ObtenerCursoPorId(int id)
        {
            return await _context.Cursos
                .Include(c => c.Alumnos)
                .Include(c => c.Asignaturas)
                .ThenInclude(a => a.HorasDeClase)
                .AsSplitQuery()
                .Select(c => new CursoViewModel
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Alumnos = c.Alumnos
                        .Where(a => true)
                        .Select(a => new AlumnoViewModelSinCamposNoNecesarios
                        {
                            Id = a.Id,
                            Nombre = a.Nombre,
                            Apellidos = a.Apellidos,
                            Dni = a.Dni,
                            FechaNacimiento = a.FechaNacimiento,
                            Email = a.Email,
                            Padres = a.Padres.Select(p => p.Dni).ToList(),
                            Telefono = a.Telefono,
                        }).ToList(),
                    Asignaturas = c.Asignaturas
                        .Where(a => a != null)
                        .Select(a => new AsignaturaViewModel
                        {
                            Id = a.Id,
                            Nombre = a.Nombre,
                            HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                            HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                            Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()

                        }).ToList(),
                    FechaFin = c.FechaFin,
                    FechaInicio = c.FechaInicio
                })
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<CursoViewModel> ObtenerCursoPorNombre(string nombre)
        {
            return await _context.Cursos
                .Include(c => c.Alumnos)
                .Include(c => c.Asignaturas)
                .ThenInclude(a => a.HorasDeClase)
                .AsSplitQuery()
                .Select(c => new CursoViewModel
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Alumnos = c.Alumnos
                        .Where(a => a != null)
                        .Select(a => new AlumnoViewModelSinCamposNoNecesarios
                        {
                            Id = a.Id,
                            Nombre = a.Nombre,
                            Apellidos = a.Apellidos,
                            Dni = a.Dni,
                            FechaNacimiento = a.FechaNacimiento,
                            Email = a.Email,
                            Padres = a.Padres.Select(p => p.Dni).ToList(),
                            Telefono = a.Telefono,
                        }).ToList(),
                    Asignaturas = c.Asignaturas
                        .Where(a => a != null)
                        .Select(a => new AsignaturaViewModel
                        {
                            Id = a.Id,
                            Nombre = a.Nombre,
                            HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                            HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                            Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()

                        }).ToList(),
                    FechaFin = c.FechaFin,
                    FechaInicio = c.FechaInicio
                })
                .FirstOrDefaultAsync(c => c.Nombre == nombre);
        }
        
        public async Task<Curso> AgregarCurso(createCursoDto createCursoDto)
        {
            var nuevoCurso = new Curso
            {
                Nombre = createCursoDto?.Nombre,
                FechaInicio = createCursoDto.FechaInicio ?? DateOnly.MinValue, // Valor por defecto
                FechaFin = createCursoDto.FechaFin ?? DateOnly.MinValue,       // Valor por defecto
                Alumnos = new List<Alumno>()
            };


            var alumnosSeleccionados = await _context.Alumnos
                .Where(a => createCursoDto.AlumnosSeleccionados.Contains(a.Dni))
                .ToListAsync();

            foreach (var alumno in alumnosSeleccionados)
            {
                nuevoCurso.Alumnos.Add(alumno);
            }

            _context.Cursos.Add(nuevoCurso);

            await _context.SaveChangesAsync();

            return nuevoCurso;
        }




        public async Task<Curso> ActualizarCurso(Curso curso)
        {
            var cursoExistente = await _context.Cursos.FindAsync(curso.Id);
            if (cursoExistente == null)
            {
                return null;
            }

            cursoExistente.Nombre = curso.Nombre;

            _context.Cursos.Update(cursoExistente);
            await _context.SaveChangesAsync();

            return cursoExistente;
        }

        public async Task<bool> EliminarCurso(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);
            if (curso != null)
            {
                _context.Cursos.Remove(curso);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<List<AsignaturaViewModel>> ObtenerTodasLasAsignaturas()
        {
            return await _context.Asignaturas
                .Include(a => a.Profesor)
                .Include(a => a.Cursos)
                .Include(a => a.Asistencias)
                .Include(a => a.HorasDeClase)
                .Select(a => new AsignaturaViewModel
                {
                    Id = a.Id,
                    Nombre = a.Nombre,
                    HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                    HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                    Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()
                })
                .ToListAsync();
        }
    }
}