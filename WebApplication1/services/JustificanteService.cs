using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.dtos.create;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class JustificanteService
    {
        private readonly DatabaseContext _context;
        private readonly BaseMapper _mapper = new BaseMapper();

        public JustificanteService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<JustificanteViewModel?> ObtenerJustificanteById(int id)
        {
            var justificante = await _context.Justificantes
                .Include(j => j.Alumno) // Incluye Alumno
                .Include(j => j.Asistencia) // Incluye Asistencia
                .ThenInclude(a => a.Asignatura) // Incluye Asignatura
                .ThenInclude(asig => asig.Profesor) // Incluye Profesor
                .FirstOrDefaultAsync(j => j.Id == id);

            if (justificante == null)
            {
                return null;
            }

            var justificanteViewModel = new JustificanteViewModel
            {
                Id = justificante.Id,
                FechaJustificacion = justificante.FechaJustificacion,
                Descripcion = justificante.Descripcion,
                Alias = justificante.Alias,
                Motivo = justificante.Motivo,

                AsistenciaIdentificador = justificante.Asistencia.Identificador,
                AsistenciaIsPresente = justificante.Asistencia.IsPresente,
                AlumnoDni = justificante.Alumno.Dni,

                AsignaturaNombre = justificante.Asistencia.Asignatura.Nombre,
            };

            return justificanteViewModel;
        }

        public async Task<List<JustificanteViewModel>> obtenerJustificantesPorAlumnoId(int id)
        {
            var justificantes = await _context.Justificantes
                .Include(j => j.Alumno) // Incluye Alumno
                .Include(j => j.Asistencia) // Incluye Asistencia
                .ThenInclude(a => a.Asignatura) // Incluye Asignatura
                .ThenInclude(asig => asig.Profesor) // Incluye Profesor
                .Where(j => j.AlumnoId == id)
                .AsSplitQuery() // Usar múltiples consultas
                .ToListAsync();

            var justificantesViewModel = justificantes
                .Select(j => new JustificanteViewModel
                {
                    Id = j.Id,
                    FechaJustificacion = j.FechaJustificacion,
                    Descripcion = j.Descripcion,
                    Alias = j.Alias,
                    Motivo = j.Motivo,

                    AsistenciaIdentificador = j.Asistencia.Identificador,
                    AsistenciaIsPresente = j.Asistencia.IsPresente,
                    AlumnoDni = j.Alumno.Dni,

                    AsignaturaNombre = j.Asistencia.Asignatura.Nombre,
                })
                .ToList();

            return justificantesViewModel;
        }

        public async Task<Justificante> CreateJustificante(createJustificanteDto dto)
        {
            // Validar la asistencia por identificador
            var asistencia = await _context.Asistencias
                .FirstOrDefaultAsync(a => a.Identificador == dto.AsistenciaIdentificador);

            if (asistencia == null)
            {
                throw new Exception($"Asistencia with identifier {dto.AsistenciaIdentificador} not found.");
            }

            // Buscar al alumno por DNI
            var alumno = await _context.Alumnos.FirstOrDefaultAsync(a => a.Dni == dto.AlumnoDni);

            if (alumno == null)
            {
                throw new Exception($"Alumno with DNI {dto.AlumnoDni} not found.");
            }

            // Generar alias en el mismo formato que el front
            string alias = $"{alumno.Dni.Substring(0, 4)}{dto.AsistenciaIdentificador}{alumno.Dni[^1]}";

            // Crear el justificante
            var justificante = new Justificante
            {
                Id = dto.id,
                FechaJustificacion = dto.FechaJustificacion,
                Descripcion = dto.Descripcion,
                Motivo = dto.Motivo,
                Alias = alias,
                AlumnoId = alumno.Id,
                AsistenciaId = asistencia.Id
            };

            // Agregar el justificante al contexto
            _context.Justificantes.Add(justificante);
            await _context.SaveChangesAsync();

            return justificante;
        }


        public async Task<List<JustificanteViewModel>> ObtenerJustificantesPorFecha(DateOnly fecha)
        {
            var justificantes = await _context.Justificantes
                .Include(j => j.Alumno) // Incluye Alumno
                .Include(j => j.Asistencia) // Incluye Asistencia
                .ThenInclude(a => a.Asignatura) // Incluye Asignatura
                .ThenInclude(asig => asig.Profesor) // Incluye Profesor
                .Where(j => j.FechaJustificacion == fecha)
                .AsSplitQuery() // Usar múltiples consultas
                .ToListAsync();

            var justificantesViewModel = justificantes
                .Select(j => new JustificanteViewModel
                {
                    Id = j.Id,
                    FechaJustificacion = j.FechaJustificacion,
                    Descripcion = j.Descripcion,
                    Alias = j.Alias,
                    Motivo = j.Motivo,

                    AsistenciaIdentificador = j.Asistencia.Identificador,
                    AsistenciaIsPresente = j.Asistencia.IsPresente,
                    AlumnoDni = j.Alumno.Dni,

                    AsignaturaNombre = j.Asistencia.Asignatura.Nombre,
                })
                .ToList();

            return justificantesViewModel;
        }

        public async Task<JustificanteViewModel?> ObtenerJustificanteByAlias(string alias)
        {
            var justificante = await _context.Justificantes
                .Include(j => j.Alumno) // Incluye Alumno
                .Include(j => j.Asistencia) // Incluye Asistencia
                .ThenInclude(a => a.Asignatura) // Incluye Asignatura
                .ThenInclude(asig => asig.Profesor) // Incluye Profesor
                .FirstOrDefaultAsync(j => j.Alias == alias);

            if (justificante == null)
            {
                return null;
            }

            var justificanteViewModel = new JustificanteViewModel
            {
                Id = justificante.Id,
                FechaJustificacion = justificante.FechaJustificacion,
                Descripcion = justificante.Descripcion,
                Alias = justificante.Alias,
                Motivo = justificante.Motivo,

                AsistenciaIdentificador = justificante.Asistencia.Identificador,
                AsistenciaIsPresente = justificante.Asistencia.IsPresente,
                AlumnoDni = justificante.Alumno.Dni,

                AsignaturaNombre = justificante.Asistencia.Asignatura.Nombre,
            };

            return justificanteViewModel;
        }

        public async Task<List<JustificanteViewModel>> ObtenerJustificantesConAsignatura()
        {
            var justificantes = await _context.Justificantes
                .Include(j => j.Alumno) // Incluye Alumno
                .Include(j => j.Asistencia) // Incluye Asistencia
                .ThenInclude(a => a.Asignatura) // Incluye Asignatura
                .ThenInclude(asig => asig.Profesor) // Incluye Profesor
                .AsSplitQuery() // Usar múltiples consultas
                .ToListAsync();

            var justificantesViewModel = justificantes
                .Select(j => new JustificanteViewModel
                {
                    Id = j.Id,
                    FechaJustificacion = j.FechaJustificacion,
                    Descripcion = j.Descripcion,
                    Alias = j.Alias,
                    Motivo = j.Motivo,

                    // Asistencia
                    AsistenciaIdentificador = j.Asistencia.Identificador,
                    AsistenciaIsPresente = j.Asistencia.IsPresente,
                    AlumnoDni = j.Alumno.Dni,

                    // Información de la asignatura
                    AsignaturaNombre = j.Asistencia.Asignatura.Nombre,

                })
                .ToList();

            return justificantesViewModel;
        }

        public async Task<bool> deleteJustificante(int id)
        {
            var justificante = await _context.Justificantes.FindAsync(id);
            if (justificante != null)
            {
                _context.Justificantes.Remove(justificante);
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<Justificante> EditJustificante(int id, createJustificanteDto dto)
        {
            var justificante = await _context.Justificantes.FindAsync(id);

            if (justificante == null)
            {
                return null;
            }

            var alumno = await _context.Alumnos.FirstOrDefaultAsync(a => a.Dni == dto.AlumnoDni);
            if (alumno == null)
            {
                return null;
            }

            var asistencia =
                await _context.Asistencias.FirstOrDefaultAsync(a => a.Identificador == dto.AsistenciaIdentificador);
            if (asistencia == null)
            {
                return null;
            }

            justificante.FechaJustificacion = dto.FechaJustificacion;
            justificante.Descripcion = dto.Descripcion;
            justificante.Motivo = dto.Motivo;
            justificante.Alias = dto.Alias;
            justificante.AlumnoId = alumno.Id;
            justificante.AsistenciaId = asistencia.Id;

            _context.Justificantes.Update(justificante);

            await _context.SaveChangesAsync();

            return justificante;
        }
    }
}