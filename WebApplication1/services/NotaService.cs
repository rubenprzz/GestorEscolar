using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class NotaService
    {
        private readonly DatabaseContext _context;

        public NotaService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<NotaViewModel>> ObtenerTodasLasNotas()
        {
            return await _context.Notas
                .Include(n => n.Alumno)  // Cargar el Alumno
                .Include(n => n.Asignatura)  // Cargar la Asignatura
                .Where(n => n.Alumno != null && n.Asignatura != null) 
                .Select(n => new NotaViewModel
                {
                    Id = n.Id,
                    AlumnoNombre = n.Alumno != null ? n.Alumno.Nombre : "Desconocido",
                    AsignaturaNombre = n.Asignatura != null ? n.Asignatura.Nombre : "Desconocido", 
                    NotaValue = n.NotaValue,
                    AlumnoDni = n.Alumno != null ? n.Alumno.Dni : "Desconocido", // Manejo de null
                    AsignaturaId = n.Asignatura != null ? n.Asignatura.Id : 0, // Manejo de null
                    Fecha = n.Fecha,
                    Motivo = n.Motivo
                })
                .ToListAsync();
        }



        public async Task<NotaViewModel> ObtenerNotaPorId(int id)
        {
            return await _context.Notas
                .Include(n => n.Alumno)
                .Include(n => n.Asignatura)
                .Select(n => new NotaViewModel
                {
                    Id = n.Id,
                    AlumnoNombre = n.Alumno != null ? n.Alumno.Nombre : "Desconocido",
                    AsignaturaNombre = n.Asignatura != null ? n.Asignatura.Nombre : "Desconocido",
                    NotaValue = n.NotaValue,
                    AlumnoDni = n.Alumno != null ? n.Alumno.Dni : "Desconocido",
                    AsignaturaId = n.Asignatura != null ? n.Asignatura.Id : 0,
                    Fecha = n.Fecha,
                    Motivo = n.Motivo
                })
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<Nota> AgregarNota(Nota nota)
        {
            _context.Notas.Add(nota);
            await _context.SaveChangesAsync();
            return nota;
        }

        public async Task<Nota> ActualizarNota(Nota nota)
        {
            var notaExistente = await _context.Notas.FindAsync(nota.Id);
            if (notaExistente == null)
            {
                return null;
            }
            notaExistente.Fecha = nota.Fecha;
            notaExistente.AsignaturaId = nota.AsignaturaId;
            notaExistente.Motivo = nota.Motivo;
            notaExistente.NotaValue = nota.NotaValue;
            notaExistente.AlumnoId = nota.AlumnoId;

            _context.Notas.Update(notaExistente);
            await _context.SaveChangesAsync();

            return notaExistente;
        }

        public async Task<bool> EliminarNota(int id)
        {
            var nota = await _context.Notas.FindAsync(id);
            if (nota != null)
            {
                _context.Notas.Remove(nota);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
