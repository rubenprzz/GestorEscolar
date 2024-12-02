using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.dtos.create;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class ProfesorService
    {
        private readonly DatabaseContext _context;

        public ProfesorService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<ProfesorViewModel>> ObtenerTodosLosProfesores()
        {
            return await _context.Profesores
                .Include(p => p.Asignaturas)  
                .Select(p => new ProfesorViewModel
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellidos = p.Apellidos,
                    Dni = p.Dni,
                    Email = p.Email,
                    Telefono = p.Telefono,
                    Asignaturas = p.Asignaturas.Select(a => new AsignaturaViewModel
                    {
                        Id = a.Id,
                        Nombre = a.Nombre
                    }).ToList()
                })
                .ToListAsync();
        }


        public async Task<ProfesorViewModel?> ObtenerProfesorPorId(int id)
        {
            return await _context.Profesores
                .Include(p => p.Asignaturas)
                .Select(p => new ProfesorViewModel
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellidos = p.Apellidos,
                    Dni = p.Dni,
                    Email = p.Email,
                    Telefono = p.Telefono,
                    Asignaturas = p.Asignaturas.Select(a => new AsignaturaViewModel
                    {
                        Id = a.Id,
                        Nombre = a.Nombre
                    }).ToList()
                })
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        

        public async Task<Profesor?> AgregarProfesor(createProfesorDto dto)
        {
            var asignatura = await _context.Asignaturas.FirstOrDefaultAsync(a => a.Nombre == dto.asignaturaNombre);
    
            // Verificar que la asignatura exista
            if (asignatura == null)
                return null;

            var nuevoProfesor = new Profesor
            {
                Nombre = dto.Nombre,
                Apellidos = dto.Apellidos,
                Dni = dto.Dni,
                Email = dto.Email,
                Telefono = dto.Telefono,
                Asignaturas = new List<Asignatura> { asignatura }
            };

            _context.Profesores.Add(nuevoProfesor);
            await _context.SaveChangesAsync();

            return nuevoProfesor;
        }



        public async Task<Profesor> ActualizarProfesor(Profesor profesor)
        {
            var profesorExistente = await _context.Profesores.FindAsync(profesor.Id);
            if (profesorExistente == null)
            {
                return null;
            }

            profesorExistente.Nombre = profesor.Nombre;
            profesorExistente.Apellidos = profesor.Apellidos;
            profesorExistente.Dni = profesor.Dni;
            profesorExistente.Email = profesor.Email;
            profesorExistente.Telefono = profesor.Telefono;

            _context.Profesores.Update(profesorExistente);
            await _context.SaveChangesAsync();

            return profesorExistente;
        }

        public async Task<bool> EliminarProfesor(int id)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor != null)
            {
                _context.Profesores.Remove(profesor);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
