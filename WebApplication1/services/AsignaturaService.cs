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
            // Buscar al profesor asociado por su DNI
            var profesor = await _context.Profesores
                .FirstOrDefaultAsync(p => p.Dni == dto.ProfesorDni);

            if (profesor == null)
                throw new Exception("El profesor especificado no existe.");

            // Buscar el curso asociado
            var cursos = await _context.Cursos
                .Where(c => dto.CursoNombres.Contains(c.Nombre))
                .ToListAsync();

            if (cursos == null)
                throw new Exception("El curso especificado no existe.");

            // Crear la nueva asignatura
            var asignaturaNueva = new Asignatura
            {
                Nombre = dto.Nombre,
                Profesor = profesor,
                ProfesorId = profesor.Id,
                Cursos = cursos,
                HorasDeClase = new List<Hora>() // Inicializamos la lista de horas
            };

            // Crear las horas de clase asociadas
            for (int i = 0; i < dto.HorasInicio.Count; i++)
            {
                var hora = new Hora
                {
                    Asignatura = asignaturaNueva,
                    AsignaturaId = asignaturaNueva.Id,
                    Dia = Enum.Parse<DiaSemana>(dto.Dias[i]), // Convertir el día en enum
                    HoraInicio = TimeSpan.Parse(dto.HorasInicio[i]), // Convertir la hora de inicio en TimeSpan
                    HoraFin = TimeSpan.Parse(dto.HorasFin[i]) // Convertir la hora de fin en TimeSpan
                };

                asignaturaNueva.HorasDeClase.Add(hora); // Añadir la hora a la lista de horas de clase
            }

            // Guardar la nueva asignatura en la base de datos
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
