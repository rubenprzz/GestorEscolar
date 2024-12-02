using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.DTOs;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class AsignaturaService
    {
        private readonly DatabaseContext _context;
        private readonly BaseMapper _mapper;
        private readonly IMapper _mappingProfile;

        public AsignaturaService(DatabaseContext context, BaseMapper mapper, IMapper mappingProfile)
        {
            
            _context = context;
            _mapper = mapper;
            _mappingProfile = mappingProfile;
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
                    profesorDni = a.Profesor.Dni,
                    HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                    HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                    Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()  
                })
                .ToListAsync();
        }


        public async Task<AsignaturaViewModel?> ObtenerAsignaturaPorId(int id)
        {
            return await _context.Asignaturas
                .Include(a => a.Profesor)
                .Include(a => a.Cursos)
                .Include(a => a.Asistencias)
                .Select(a => new AsignaturaViewModel
                {
                    Id = a.Id,
                    profesorDni = a.Profesor.Dni,
                    CursoNombres = a.Cursos.Select(c => c.Nombre).ToList(),
                    Nombre = a.Nombre,
                    HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                    HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                    Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()
                    
                    
                })
                .FirstOrDefaultAsync(a => a.Id == id);
        }
        public async Task<Asignatura> AgregarAsignatura(createAsignaturaDto dto)
        {
            var profesor = await _context.Profesores
                .FirstOrDefaultAsync(p => p.Dni == dto.profesorDni);

            if (profesor == null)
                return null;
            var cursos = await _context.Cursos
                .Where(c => dto.cursoNombres.Contains(c.Nombre))
                .ToListAsync();

            var asignaturaNueva = _mappingProfile.Map<Asignatura>(dto);
            asignaturaNueva.Profesor = profesor;
            asignaturaNueva.Cursos = cursos;

            
            if (asignaturaNueva.HorasDeClase == null)
            {
                asignaturaNueva.HorasDeClase = new List<Hora>();
            }

            for (int i = 0; i < dto.horasInicio.Count; i++)
            {
                var hora = new Hora
                {
                    Asignatura = asignaturaNueva,
                    AsignaturaId = asignaturaNueva.Id,
                    Dia = Enum.Parse<DiaSemana>(dto.dias[i]), 
                    HoraInicio = TimeSpan.Parse(dto.horasInicio[i]), // Convierte la hora de inicio en TimeSpan
                    HoraFin = TimeSpan.Parse(dto.horasFin[i]) // Convierte la hora de fin en TimeSpan
                };

                asignaturaNueva.HorasDeClase.Add(hora);
            }

            _context.Asignaturas.Add(asignaturaNueva);
            await _context.SaveChangesAsync();

            return asignaturaNueva;
        }



        

        

        public async Task<AsignaturaViewModel?> ObtenerAsignaturaPorNombre(string nombre)
        {
            return await _context.Asignaturas
                .Include(a => a.Profesor)
                .Include(a => a.Cursos)
                .Include(a => a.Asistencias)
                .Include(a=> a.HorasDeClase)
                .Select(a => new AsignaturaViewModel
                {
                    Id = a.Id,
                    Nombre = a.Nombre,
                    HorasInicio = a.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                    HorasFin = a.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                    Dias = a.HorasDeClase.Select(h => h.Dia.ToString()).ToList()

                    
                    
                })
                .FirstOrDefaultAsync(a => a.Nombre == nombre);
        }

        public async Task<Asignatura> ActualizarAsignatura(Asignatura asignatura)
        {
            var asignaturaExistente = await _context.Asignaturas.FindAsync(asignatura.Id);
            if (asignaturaExistente == null)
            {
                return null;
            }

            asignaturaExistente.Nombre = asignatura.Nombre;
            asignaturaExistente.ProfesorId = asignatura.ProfesorId;

            _context.Asignaturas.Update(asignaturaExistente);
            await _context.SaveChangesAsync();

            return asignaturaExistente;
        }

        public async Task<bool> EliminarAsignatura(int id)
        {
            var asignatura = await _context.Asignaturas.FindAsync(id);
            if (asignatura != null)
            {
                _context.Asignaturas.Remove(asignatura);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
