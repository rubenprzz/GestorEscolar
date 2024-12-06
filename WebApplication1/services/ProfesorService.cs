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
        // Obtener un profesor por su id
        public async Task<ProfesorViewModel?> ObtenerProfesorPorId(int id)
        {
            return await _context.Profesores
                .Include(p => p.Asignaturas)
                .Where(p => p.Id == id)
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
                .FirstOrDefaultAsync();
        }


      

        public async Task<Profesor> AgregarProfesor(createProfesorDto createDto)
        {
            var asignaturas = await _context.Asignaturas
                .Where(a => createDto.asignaturasId.Contains(a.Id))
                .ToListAsync();

            if (!asignaturas.Any())
            {
                throw new Exception("No se encontraron asignaturas con los nombres proporcionados.");
            }

            var profesor = new Profesor
            {
                Nombre = createDto.Nombre,
                Apellidos = createDto.Apellidos,
                Dni = createDto.Dni,
                Email = createDto.Email,
                Telefono = createDto.Telefono,
                Asignaturas = asignaturas 
            };

            // Agregar el profesor a la base de datos
            _context.Profesores.Add(profesor);
            await _context.SaveChangesAsync();

            return profesor;
        }

     


        public async Task<Profesor> ActualizarProfesor(createProfesorDto profesor)
        {
            
            var asignaturas = await _context.Asignaturas
                .Where(a => profesor.asignaturasId.Contains(a.Id))
                .ToListAsync();
            
            var profesorExistente = await _context.Profesores.FindAsync(profesor.id);
            if (profesorExistente == null)
            {
                return null;
            }
            profesorExistente.Id = profesor.id;
            profesorExistente.Nombre = profesor.Nombre;
            profesorExistente.Apellidos = profesor.Apellidos;
            profesorExistente.Dni = profesor.Dni;
            profesorExistente.Email = profesor.Email;
            profesorExistente.Telefono = profesor.Telefono;
            profesorExistente.Asignaturas = asignaturas;

            _context.Profesores.Update(profesorExistente);
            await _context.SaveChangesAsync();

            return profesorExistente;
        }

        public async Task<bool> EliminarProfesor(int id)
        {
            var profesor = await _context.Profesores.FindAsync(id);
            if (profesor != null)
            {
                profesor.isDeleted = true;
                _context.Profesores.Update(profesor);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
