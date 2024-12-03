using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
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

        public async Task<List<RetrasoViewModel>> ObtenerTodosLosRetrasos()
        {
            return await _context.Retrasos
                .Include(r => r.Alumno)  
                .Select(r => new RetrasoViewModel
                {
                    Id = r.Id,
                    Fecha = r.Fecha,
                    alumnoDni = r.Alumno.Dni,
                    MinutosRetraso = r.MinutosRetraso,
                    Motivo = r.Motivo,
                    alumnoNombre = r.Alumno.Nombre  ,
                    Justificado = r.Justificado,
                    asignaturaNombre = r.Asignatura.Nombre
                })
                .ToListAsync();
        }


        public async Task<RetrasoViewModel?> ObtenerRetrasoPorId(int id)
        {
            return await _context.Retrasos
                .Include(r => r.Alumno)
                .Select(r => new RetrasoViewModel
                {
                    Id = r.Id,
                    Fecha = r.Fecha,
                    alumnoDni = r.Alumno.Dni,
                    MinutosRetraso = r.MinutosRetraso,
                    Motivo = r.Motivo,
                    alumnoNombre = r.Alumno.Nombre,
                    Justificado = r.Justificado,
                    asignaturaNombre = r.Asignatura.Nombre
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
                    Fecha = r.Fecha,
                    alumnoDni = r.Alumno.Dni,
                    MinutosRetraso = r.MinutosRetraso,
                    Motivo = r.Motivo,
                    alumnoNombre = r.Alumno.Nombre,
                    Justificado = r.Justificado,
                    asignaturaNombre = r.Asignatura.Nombre
                })
                .FirstOrDefaultAsync(r => r.Id == id);
        }
        

        public async Task<Retraso> AgregarRetraso(Retraso retraso)
        {
            _context.Retrasos.Add(retraso);
            await _context.SaveChangesAsync();
            return retraso;
        }

        public async Task<Retraso> ActualizarRetraso(Retraso retraso)
        {
            var retrasoExistente = await _context.Retrasos.FindAsync(retraso.Id);
            if (retrasoExistente == null)
            {
                return null;
            }

            retrasoExistente.Fecha = retraso.Fecha;
            retrasoExistente.Motivo = retraso.Motivo;
            retrasoExistente.AlumnoId = retraso.AlumnoId;

            _context.Retrasos.Update(retrasoExistente);
            await _context.SaveChangesAsync();

            return retrasoExistente;
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