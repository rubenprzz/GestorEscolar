using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.dtos.create;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class RetrasoService
    {
        private readonly DatabaseContext _context;

        public RetrasoService(DatabaseContext context)
        {
            _context = context;
        }
        

        public async Task<RetrasoViewModel?> ObtenerRetrasoPorId(int id)
        {
            return await _context.Retrasos
                .Include(r => r.Alumno)
                .Select(r => new RetrasoViewModel
                {
                    Id = r.Id,
                    Fecha = r.Fecha.ToString("yyyy-MM-dd"), // Formatear la fecha
                    alumnoDni = r.Alumno.Dni,
                    MinutosRetraso = r.MinutosRetraso,
                    Motivo = r.Motivo,
                    alumnoNombre = r.Alumno.Nombre,
                    Justificado = r.Justificado,
                    asignaturaNombre = r.Asignatura.Nombre,
                    HoraInicio = r.Asignatura.HorasDeClase.FirstOrDefault() != null 
                        ? r.Asignatura.HorasDeClase.FirstOrDefault().HoraInicio 
                        : TimeSpan.Zero
                    
                    
                })
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<RetrasoViewModel?> ObtenerRetrasosPorIdAlumno(int id)
        {
            return await _context.Retrasos
                .Include(r => r.Alumno)
                .Select(r => new RetrasoViewModel
                {
                    Id = r.Id,
                    Fecha = r.Fecha.ToString("yyyy-MM-dd"), // Formatear la fecha
                    alumnoDni = r.Alumno.Dni,
                    MinutosRetraso = r.MinutosRetraso,
                    Motivo = r.Motivo,
                    alumnoNombre = r.Alumno.Nombre,
                    Justificado = r.Justificado,
                    asignaturaNombre = r.Asignatura.Nombre
                })
                .FirstOrDefaultAsync(r => r.Id == id);
        }
        

        public async Task<List<RetrasoViewModel>> ObtenerTodosLosRetrasos()
        {
            return await _context.Retrasos
                .Include(r => r.Alumno)
                .Include(r => r.Asignatura)
                .ThenInclude(a => a.HorasDeClase)
                .Select(r => new RetrasoViewModel
                {
                    Id = r.Id,
                    Fecha = r.Fecha.ToString("yyyy-MM-dd"),
                    alumnoDni = r.Alumno.Dni,
                    alumnoNombre = r.Alumno.Nombre,
                    MinutosRetraso = r.MinutosRetraso,
                    Motivo = r.Motivo,
                    Justificado = r.Justificado,
                    asignaturaNombre = r.Asignatura.Nombre,
                    HoraInicio = r.Asignatura.HorasDeClase.Count > 0 
                        ? r.Asignatura.HorasDeClase.First().HoraInicio 
                        : TimeSpan.Zero, 
                    HoraLlegada = r.HoraLlegada 
                })
                .ToListAsync();
        }

        public async Task<Retraso> AgregarRetraso(createRetrasoDto createDto)
        {
            // Convertir la fecha recibida a UTC
            var fechaUtc = DateTime.SpecifyKind(DateTime.Parse(createDto.Fecha), DateTimeKind.Utc);

            // Obtener la asignatura y su hora de inicio
            var asignatura = await _context.Asignaturas
                .Include(a => a.HorasDeClase)
                .FirstOrDefaultAsync(a => a.Nombre == createDto.AsignaturaNombre);

            if (asignatura == null || !asignatura.HorasDeClase.Any())
                throw new Exception("La asignatura no tiene horas de clase definidas.");

            var horaInicio = asignatura.HorasDeClase.First().HoraInicio;

            // Obtener el alumno
            var alumno = await _context.Alumnos.FirstOrDefaultAsync(a => a.Dni == createDto.AlumnoDni);
            if (alumno == null)
            {
                throw new Exception($"Alumno con DNI {createDto.AlumnoDni} no encontrado.");
            }

            // Crear el objeto Retraso
            var retraso = new Retraso
            {
                Fecha = fechaUtc,
                AlumnoId = alumno.Id,
                HoraLlegada = createDto.HoraLlegada,
                Motivo = createDto.Motivo,
                Justificado = createDto.Justificado,
                AsignaturaId = asignatura.Id,
            };

            // Calcular minutos de retraso
            retraso.MinutosRetraso = retraso.CalcularMinutosDeRetraso(horaInicio);

            // Guardar en la base de datos
            _context.Retrasos.Add(retraso);
            await _context.SaveChangesAsync();

            return retraso;
        }




        public async Task<Retraso> ActualizarRetraso(int id, createRetrasoDto retraso)
        {
            var retrasoDb = await _context.Retrasos.FindAsync(id);
            if (retrasoDb == null)
            {
                throw new Exception("Retraso no encontrado.");
            }

            // Convertir la fecha recibida a UTC
            var fechaUtc = DateTime.SpecifyKind(DateTime.Parse(retraso.Fecha), DateTimeKind.Utc);

            // Obtener la asignatura y su hora de inicio
            var asignatura = await _context.Asignaturas
                .Include(a => a.HorasDeClase)
                .FirstOrDefaultAsync(a => a.Nombre == retraso.AsignaturaNombre);

            if (asignatura == null || !asignatura.HorasDeClase.Any())
                throw new Exception("La asignatura no tiene horas de clase definidas.");

            var horaInicio = asignatura.HorasDeClase.First().HoraInicio;

            var alumno = await _context.Alumnos.FirstOrDefaultAsync(a => a.Dni == retraso.AlumnoDni);
            if (alumno == null)
            {
                throw new Exception($"Alumno con DNI {retraso.AlumnoDni} no encontrado.");
            }

            // Actualizar los datos del retraso
            retrasoDb.Fecha = fechaUtc;
            retrasoDb.AlumnoId = alumno.Id;
            retrasoDb.HoraLlegada = retraso.HoraLlegada;
            retrasoDb.Motivo = retraso.Motivo;
            retrasoDb.Justificado = retraso.Justificado;
            retrasoDb.AsignaturaId = asignatura.Id;

            // Calcular minutos de retraso
            retrasoDb.MinutosRetraso = retrasoDb.CalcularMinutosDeRetraso(horaInicio);

            // Guardar en la base de datos
            await _context.SaveChangesAsync();

            return retrasoDb;
        }

        public async Task<bool> EliminarRetraso(int id)
        {
            var retraso = await _context.Retrasos.FindAsync(id);
            if (retraso != null)
            {
                _context.Retrasos.Remove(retraso);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}