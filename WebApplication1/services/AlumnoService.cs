using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.DTOs;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services

{
    public class AlumnoService
    {
        private readonly DatabaseContext _context;
        private readonly BaseMapper _mapper;
        private readonly IMapper _mappingProfile;

        public AlumnoService(DatabaseContext context, BaseMapper mapper, IMapper mappingProfile)
        {
            _context = context;
            _mapper = mapper;
            _mappingProfile = mappingProfile;
        }
       
        

        public async Task<List<AlumnoViewModel>> ObtenerTodosLosAlumnos()
        {
            return await _context.Alumnos
                .Include(a => a.Curso)
                .Include(a => a.Notas)  // Asegúrate de incluir Notas
                .Include(a => a.Asistencias)
                .Include(a => a.Padres)
                .Include(a => a.Retrasos)
                .Include(a => a.Justificantes)
                .Select(a => new AlumnoViewModel
                {
                    Id = a.Id,
                    Nombre = a.Nombre,
                    Apellidos = a.Apellidos,
                    Dni = a.Dni,
                    FechaNacimiento = a.FechaNacimiento,
                    Email = a.Email,
                    Telefono = a.Telefono,
                    Curso = a.Curso.Nombre,
                    Justificantes = a.Justificantes != null ? a.Justificantes.Select(j => j.Alias).ToList() : new List<string>(),
                    Notas = a.Notas != null ? a.Notas.Select(n => n.Id).ToList() : new List<int>(),
                    CantidadRetrasos = a.Asistencias != null ? a.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                    CantidadAsistenciasFaltadas = a.Asistencias != null ? a.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                    Padres = a.Padres != null ? a.Padres.Select(p => p.Dni).ToList() : new List<string>(),
                    urlFoto = a.urlFoto

                    
                })
                .ToListAsync();
        }
        public async Task<AlumnoViewModel> ObtenerAlumnoPorId(int id, string usuarioId)
        {
            if (id.ToString() != usuarioId)
                return null;

            var alumno = await _context.Alumnos
                .Include(a => a.Curso)
                .Include(a => a.Notas)
                .Include(a => a.Asistencias)
                .Include(a => a.Padres)
                .Include(a => a.Retrasos)
                .Include(a => a.Justificantes)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (alumno == null)
                return null;

            return new AlumnoViewModel
            {
                Id = alumno.Id,
                Nombre = alumno.Nombre,
                Apellidos = alumno.Apellidos,
                Dni = alumno.Dni,
                FechaNacimiento = alumno.FechaNacimiento,
                Email = alumno.Email,
                Telefono = alumno.Telefono,
                Curso = alumno.Curso?.Nombre,
                Justificantes = alumno.Justificantes != null ? alumno.Justificantes.Select(j => j.Alias).ToList() : new List<string>(),
                Notas = alumno.Notas != null ? alumno.Notas.Select(n => n.Id).ToList() : new List<int>(),
                CantidadRetrasos = alumno.Asistencias != null ? alumno.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                CantidadAsistenciasFaltadas = alumno.Asistencias != null ? alumno.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                Padres = alumno.Padres != null ? alumno.Padres.Select(p => p.Dni).ToList() : new List<string>(),
                urlFoto = alumno.urlFoto
            };
        }

        
        public async Task<AlumnoViewModel> ObtenerAlumnoPorDni(string dni)
        {
            var alumno = await _context.Alumnos
                .Include(a => a.Curso)
                .Include(a => a.Notas)
                .Include(a => a.Asistencias)
                .Include(a => a.Padres)
                .Include(a => a.Retrasos)
                .Include(a => a.Justificantes)
                .FirstOrDefaultAsync(a => a.Dni == dni);

            if (alumno == null)
                return null;

            return new AlumnoViewModel
            {
                Id = alumno.Id,
                Nombre = alumno.Nombre,
                Apellidos = alumno.Apellidos,
                Dni = alumno.Dni,
                FechaNacimiento = alumno.FechaNacimiento,
                Email = alumno.Email,
                Telefono = alumno.Telefono,
                Curso = alumno.Curso?.Nombre,
                Justificantes = alumno.Justificantes.Select(j => j.Alias).ToList(),
                Notas = alumno.Notas != null ? alumno.Notas.Select(n => n.Id).ToList() : new List<int>(),
                CantidadRetrasos = alumno.Asistencias != null ? alumno.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                CantidadAsistenciasFaltadas = alumno.Asistencias != null ? alumno.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                Padres = alumno.Padres != null ? alumno.Padres.Select(p => p.Dni).ToList() : new List<string>(),
                urlFoto = alumno.urlFoto

            };
        }



        public async Task<AlumnoViewModel> ObtenerAlumnoPorId(int id)
        {
            var alumno = await _context.Alumnos
                .Include(a => a.Curso)
                .Include(a => a.Notas)
                .Include(a => a.Asistencias)
                .Include(a => a.Padres)
                .Include(a => a.Retrasos)
                .Include(a => a.Justificantes)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (alumno == null)
                return null;

            return new AlumnoViewModel
            {
                Id = alumno.Id,
                Nombre = alumno.Nombre,
                Apellidos = alumno.Apellidos,
                Dni = alumno.Dni,
                FechaNacimiento = alumno.FechaNacimiento,
                Email = alumno.Email,
                Telefono = alumno.Telefono,
                Curso = alumno.Curso?.Nombre,
                Justificantes = alumno.Justificantes != null ? alumno.Justificantes.Select(j => j.Alias).ToList() : new List<string>(),
                Notas = alumno.Notas != null ? alumno.Notas.Select(n => n.Id).ToList() : new List<int>(),
                CantidadRetrasos = alumno.Asistencias != null ? alumno.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                CantidadAsistenciasFaltadas = alumno.Asistencias != null ? alumno.Asistencias.Count(asist => asist != null && asist.IsPresente == false) : 0,
                Padres = alumno.Padres != null ? alumno.Padres.Select(p => p.Dni).ToList() : new List<string>(),
                urlFoto = alumno.urlFoto
            };
        }


        public async Task<Alumno?> CrearAlumno(CrearAlumnoDto dto, string imageUrl)
        {
            // Verificar que el curso exista
            var curso = await _context.Cursos.FirstOrDefaultAsync(c => c.Nombre == dto.cursoNombre);
            if (curso == null)
                return null;

            // Verificar que los padres existan
            var padres = await _context.Padres
                .Where(p => dto.padresDnis.Contains(p.Dni))
                .ToListAsync();

            padres = padres.Distinct().ToList();

            if (padres.Count != dto.padresDnis.Count)
                return null;

            // Crear una instancia del nuevo alumno
            var nuevoAlumno = _mappingProfile.Map<Alumno>(dto);
            nuevoAlumno.Curso = curso;

            // Asignar la URL de la imagen
            nuevoAlumno.urlFoto = imageUrl;

            // Asignar los padres
            nuevoAlumno.Padres = padres;

            // Guardar el nuevo alumno en la base de datos
            _context.Alumnos.Add(nuevoAlumno);
            await _context.SaveChangesAsync();

            return nuevoAlumno;
        }




        public async Task<Alumno> ActualizarAlumno(CrearAlumnoDto alumno,string imageUrl)
        {
            var alumnoExistente = await _context.Alumnos.FindAsync(alumno.id);
            if (alumnoExistente == null)
            {
                return null;
            }
            DateOnly fechaNacimiento = DateOnly.FromDateTime(alumno.FechaNacimiento);
            
            alumnoExistente.Nombre = alumno.nombre;
            alumnoExistente.Apellidos = alumno.apellidos;
            alumnoExistente.Dni = alumno.dni;
            //pasar a dateonly
            alumnoExistente.FechaNacimiento = fechaNacimiento;
            alumnoExistente.Email = alumno.email;
            alumnoExistente.Telefono = alumno.telefono;
            alumnoExistente.Curso = alumno.cursoNombre != null ? await _context.Cursos.FirstOrDefaultAsync(c => c.Nombre == alumno.cursoNombre) : null;
            if (!string.IsNullOrEmpty(imageUrl))
            {
                alumnoExistente.urlFoto = imageUrl;
            }
            _context.Alumnos.Update(alumnoExistente);
            await _context.SaveChangesAsync();

            return alumnoExistente;
        }

        public async Task<bool> EliminarAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno != null)
            {
                alumno.isDeleted = true;
                _context.Alumnos.Update(alumno);
                await _context.SaveChangesAsync();
                return true;
            }
            return false; 
        }
    }
}
