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
            // Crear el nuevo curso con los datos del DTO
            var nuevoCurso = new Curso
            {
                Nombre = createCursoDto?.Nombre,
                FechaInicio = createCursoDto?.FechaInicio ?? DateOnly.MinValue, // Valor por defecto
                FechaFin = createCursoDto?.FechaFin ?? DateOnly.MinValue,
                Asignaturas = new List<Asignatura>(), // Inicializa la lista de asignaturas
                Alumnos = new List<Alumno>() // Inicializa la lista de alumnos
            };

            var alumnosSeleccionados = await _context.Alumnos
                .Where(a => createCursoDto.alumnos.Contains(a.Dni))
                .ToListAsync();

            foreach (var alumno in alumnosSeleccionados)
            {
                nuevoCurso.Alumnos.Add(alumno);
            }

            var asignaturasSeleccionadas = await _context.Asignaturas
                .Where(a => createCursoDto.asignaturas.Contains(a.Nombre)) // Suponiendo que estás buscando por el nombre de la asignatura
                .ToListAsync();

            // Asociar las asignaturas al curso
            foreach (var asignatura in asignaturasSeleccionadas)
            {
                nuevoCurso.Asignaturas.Add(asignatura);
            }

            // Agregar el nuevo curso al contexto y guardar los cambios
            _context.Cursos.Add(nuevoCurso);
            await _context.SaveChangesAsync();

            // Retornar el nuevo curso con las asignaturas y los alumnos
            return nuevoCurso;
        }





      public async Task<CursoViewModel> ActualizarCurso(int id, createCursoDto dto)
{
    // Buscar el curso en la base de datos
    var cursoExistente = await _context.Cursos
        .Include(c => c.Alumnos)
        .Include(c => c.Asignaturas)
        .FirstOrDefaultAsync(c => c.Id == id);
    
    if (cursoExistente == null)
    {
        // Si no se encuentra el curso, retornar null o lanzar una excepción
        return null;
    }

    // Actualizar los campos del curso con los datos del DTO
    cursoExistente.Nombre = dto.Nombre ?? cursoExistente.Nombre;
    cursoExistente.FechaInicio = dto.FechaInicio ?? cursoExistente.FechaInicio;
    cursoExistente.FechaFin = dto.FechaFin ?? cursoExistente.FechaFin;

    // Actualizar la lista de alumnos
    if (dto.alumnos != null && dto.alumnos.Any())
    {
        var alumnosSeleccionados = await _context.Alumnos
            .Where(a => dto.alumnos.Contains(a.Dni))
            .ToListAsync();

        // Limpiar los alumnos anteriores y agregar los nuevos
        cursoExistente.Alumnos.Clear();
        foreach (var alumno in alumnosSeleccionados)
        {
            cursoExistente.Alumnos.Add(alumno);
        }
    }

    // Actualizar la lista de asignaturas
    if (dto.asignaturas != null && dto.asignaturas.Any())
    {
        var asignaturasSeleccionadas = await _context.Asignaturas
            .Where(a => dto.asignaturas.Contains(a.Nombre))
            .ToListAsync();

        // Limpiar las asignaturas anteriores y agregar las nuevas
        cursoExistente.Asignaturas.Clear();
        foreach (var asignatura in asignaturasSeleccionadas)
        {
            cursoExistente.Asignaturas.Add(asignatura);
        }
    }

    // Guardar los cambios en la base de datos
    _context.Cursos.Update(cursoExistente);
    await _context.SaveChangesAsync();

    // Devolver el curso actualizado en el formato adecuado (CursoViewModel)
    var cursoViewModel = new CursoViewModel
    {
        Id = cursoExistente.Id,
        Nombre = cursoExistente.Nombre,
        FechaInicio = cursoExistente.FechaInicio,
        FechaFin = cursoExistente.FechaFin,
        Alumnos = cursoExistente.Alumnos.Select(a => new AlumnoViewModelSinCamposNoNecesarios
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
        Asignaturas = cursoExistente.Asignaturas.Select(a => new AsignaturaViewModel
        {
            Id = a.Id,
            Nombre = a.Nombre,
            HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
            HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
            Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()
        }).ToList(),
    };

    return cursoViewModel;
}


        public async Task<bool> EliminarCurso(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);
            if (curso != null)
            {
                curso.isDeleted = true;
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