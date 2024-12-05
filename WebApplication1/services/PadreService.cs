using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.dtos.create;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class PadreService
    {
        private readonly DatabaseContext _context;
        private readonly BaseMapper _mapper;

        public PadreService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<PadreViewModel>> ObtenerTodosLosPadres()
        {
            return await _context.Padres
                .Include(p => p.Alumnos)  // Asegúrate de que la relación de Alumnos esté incluida
                .Select(p => new PadreViewModel
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellidos = p.Apellidos,
                    Telefono = p.Telefono,
                    Dni = p.Dni,
                    Alumnos = p.Alumnos.Select(a => a.Dni).ToList()
                        })
                .ToListAsync();
        }




        public async Task<PadreViewModel?> ObtenerPadrePorId(int id)
        {
            return await _context.Padres
                .Include(p => p.Alumnos)
                .Select(p => new PadreViewModel
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellidos = p.Apellidos,
                    Telefono = p.Telefono,
                    Dni = p.Dni,
                    Alumnos = p.Alumnos.Select(a => a.Dni).ToList()
                })
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        //obtener por dni
        public async Task<PadreViewModel?> ObtenerPadrePorDni(string dni)
        {
            return await _context.Padres
                .Include(p => p.Alumnos)
                .Select(p => new PadreViewModel
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Apellidos = p.Apellidos,
                    Telefono = p.Telefono,
                    Dni = p.Dni,
                    Alumnos = p.Alumnos.Select(a => a.Dni).ToList()
                })
                .FirstOrDefaultAsync(p => p.Dni == dni);
        }

        public async Task<Padre> AgregarPadre(createPadreDto createPadreDto)
        {
            var nuevoPadre = new Padre
            {
                Nombre = createPadreDto.Nombre,
                Apellidos = createPadreDto.Apellidos,
                Dni = createPadreDto.Dni,
                Telefono = createPadreDto.Telefono,
                Alumnos = new List<Alumno>() 
            };

            var alumnosSeleccionados = await _context.Alumnos
                .Where(a => createPadreDto.Alumnos.Contains(a.Dni))
                .ToListAsync();

            foreach (var alumno in alumnosSeleccionados)
            {
                nuevoPadre.Alumnos.Add(alumno);
            }

            _context.Padres.Add(nuevoPadre);

            await _context.SaveChangesAsync();

            return nuevoPadre;
        }

        public async Task<Padre> ActualizarPadre(createPadreDto padre)
        {
            var padreExistente = await _context.Padres.FindAsync(padre.id);
            if (padreExistente == null)
            {
                return null;
            }
            padreExistente.Id = padre.id;
            padreExistente.Dni = padre.Dni;
            padreExistente.Nombre = padre.Nombre;
            padreExistente.Apellidos = padre.Apellidos;
            padreExistente.Telefono = padre.Telefono;
            padreExistente.Alumnos =  await _context.Alumnos
                .Where(a => padre.Alumnos.Contains(a.Dni))
                .ToListAsync();
            

            _context.Padres.Update(padreExistente);
            await _context.SaveChangesAsync();

            return padreExistente;
        }

        public async Task<bool> EliminarPadre(int id)
        {
            var padre = await _context.Padres.FindAsync(id);
            if (padre != null)
            {
                _context.Padres.Remove(padre);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
