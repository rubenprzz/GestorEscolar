using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Context;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Services
{
    public class AsistenciaService
    {
        private readonly DatabaseContext _context;

        public AsistenciaService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<AsistenciaViewModel>> ObtenerTodasLasAsistencias()
        {
            return await _context.Asistencias
                .Include(a => a.Alumno)  
                .Include(a => a.Asignatura)  
                .Select(a => new AsistenciaViewModel
                {
                    Id = a.Id,
                    Dia = a.DiaSemana,
                    HoraInicio = a.HoraInicio,
                    HoraFin = a.HoraFin,
                    IsPresente = a.IsPresente,
                    AlumnoNombre = a.Alumno.Nombre,  
                    AlumnoId = a.Alumno.Id,
                    AlumnoDni = a.Alumno.Dni,
                    Identificador = a.Identificador,
                    AsignaturaId = a.Asignatura.Id,
                    AsignaturaNombre = a.Asignatura.Nombre 
                })
                .ToListAsync();
        }
        public async Task<AsistenciaViewModel?> ObtenerAsistenciaPorAlumnoId(int id)
        {
            return await _context.Asistencias
                .Include(a => a.Alumno)
                .Include(a => a.Asignatura)
                .Select(a => new AsistenciaViewModel
                {
                    Id = a.Id,
                    Dia = a.DiaSemana,
                    HoraInicio = a.HoraInicio,
                    HoraFin = a.HoraFin,
                    IsPresente = a.IsPresente,
                    AlumnoNombre = a.Alumno.Nombre,
                    AlumnoId = a.Alumno.Id,
                    AlumnoDni = a.Alumno.Dni,
                    Identificador = a.Identificador,
                    AsignaturaId = a.Asignatura.Id,
                    AsignaturaNombre = a.Asignatura.Nombre
                })
                .FirstOrDefaultAsync(a => a.AlumnoId == id);
        }


        public async Task<AsistenciaViewModel?> ObtenerAsistenciaPorId(int id)
        {
            
            return await _context.Asistencias
                .Include(a => a.Alumno)
                .Include(a => a.Asignatura)
                .Select(a => new AsistenciaViewModel
                {
                    Id = a.Id,
                    Dia = a.DiaSemana,
                    HoraInicio = a.HoraInicio,
                    HoraFin = a.HoraFin,
                    IsPresente = a.IsPresente,
                    AlumnoNombre = a.Alumno.Nombre,
                    AlumnoId = a.Alumno.Id,
                    AlumnoDni = a.Alumno.Dni,
                    Identificador = a.Identificador,
                    AsignaturaId = a.Asignatura.Id,
                    AsignaturaNombre = a.Asignatura.Nombre
                })
                .FirstOrDefaultAsync(a => a.Id == id);
        }
        public async Task<AsistenciaViewModel?> ObtenerAsistenciaPorIdentificador(string identificador)
        {
            return await _context.Asistencias
                .Include(a => a.Alumno)
                .Include(a => a.Asignatura)
                .Select(a => new AsistenciaViewModel
                {
                    Id = a.Id,
                    Dia = a.DiaSemana,
                    HoraInicio = a.HoraInicio,
                    HoraFin = a.HoraFin,
                    IsPresente = a.IsPresente,
                    AlumnoNombre = a.Alumno.Nombre,
                    AlumnoId = a.Alumno.Id,
                    AlumnoDni = a.Alumno.Dni,
                    Identificador = a.Identificador,
                    AsignaturaId = a.Asignatura.Id,
                    AsignaturaNombre = a.Asignatura.Nombre
                })
                .FirstOrDefaultAsync(a => a.Identificador == identificador);
        }

        public async Task<Asistencia> CreateAsistencia(createAsistenciaDto dto)
        {
            var asignatura = await _context.Asignaturas
                .Include(a => a.HorasDeClase)
                .FirstOrDefaultAsync(a => a.Nombre == dto.asignaturaNombre);

            if (asignatura == null)
            {
                throw new Exception($"Asignatura with name {dto.asignaturaNombre} not found.");
            }

            // buscar las horas correspodientes al asignatura nombre 

    

            // Buscar el alumno por DNI
            var alumno = await _context.Alumnos.FirstOrDefaultAsync(a => a.Dni == dto.alumnoDNI);

            if (alumno == null)
            {
                throw new Exception($"Alumno with DNI {dto.alumnoDNI} not found.");
            }

            var asistencia = new Asistencia
            {
                DiaSemana = asignatura.HorasDeClase.FirstOrDefault().Dia,  // Usamos el día de la primera clase
                HoraInicio = asignatura.HorasDeClase.FirstOrDefault().HoraInicio,  // Usamos la hora de inicio de la clase
                HoraFin = asignatura.HorasDeClase.FirstOrDefault().HoraFin,  // Usamos la hora de fin de la clase
                IsPresente = dto.IsPresente,
                Identificador = await GenerarIdentificador(asignatura.Nombre, alumno.Nombre, alumno.Dni),
                AlumnoId = alumno.Id,
                AsignaturaId = asignatura.Id
            };

            _context.Asistencias.Add(asistencia);
            await _context.SaveChangesAsync();

            return asistencia;
        }
        
        public async Task<string> GenerarIdentificador(string asignaturaNombre, string alumnoNombre, string alumnoDNI)
        {
            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(asignaturaNombre) || 
                string.IsNullOrWhiteSpace(alumnoNombre) || 
                string.IsNullOrWhiteSpace(alumnoDNI))
            {
                throw new ArgumentException("El nombre de la asignatura, el nombre del alumno o el DNI no pueden estar vacíos.");
            }

            string alumnoIniciales = alumnoNombre.Length >= 3 
                ? alumnoNombre.Substring(0, 3).ToUpper() 
                : alumnoNombre.ToUpper();

            string asignaturaIniciales = asignaturaNombre.Length >= 3 
                ? asignaturaNombre.Substring(0, 3).ToUpper() 
                : asignaturaNombre.ToUpper();

            char ultimaLetraDNI = alumnoDNI.Last();

            // Formamos el identificador
            string identificador = $"{alumnoIniciales}{asignaturaIniciales}{ultimaLetraDNI}";

            return await Task.FromResult(identificador);
        }


           

        

     
        
    

        public async Task<Asistencia> ActualizarAsistencia(Asistencia asistencia)
        {
            var asistenciaExistente = await _context.Asistencias.FindAsync(asistencia.Id);
            if (asistenciaExistente == null)
            {
                return null;
            }

            asistenciaExistente.DiaSemana = asistencia.DiaSemana;
            asistenciaExistente.HoraInicio = asistencia.HoraInicio;
            asistenciaExistente.HoraFin = asistencia.HoraFin;
            asistenciaExistente.IsPresente = asistencia.IsPresente;
            asistenciaExistente.Identificador = asistencia.Identificador;
            asistenciaExistente.AlumnoId = asistencia.AlumnoId;
            asistenciaExistente.AsignaturaId = asistencia.AsignaturaId;

            _context.Asistencias.Update(asistenciaExistente);
            await _context.SaveChangesAsync();

            return asistenciaExistente;
        }

        public async Task<bool> EliminarAsistencia(int id)
        {
            var asistencia = await _context.Asistencias.FindAsync(id);
            if (asistencia != null)
            {
                _context.Asistencias.Remove(asistencia);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
