using WebApplication1.Models;
using WebApplication1.viewModels;
using WebApplication1.ViewModels;

namespace WebApplication1.Mappers
{
    public class BaseMapper
    {
        public TDestination Map<TSource, TDestination>(TSource source)
        {
            if (source == null)
                return default;

            var destination = Activator.CreateInstance<TDestination>();

            var sourceProperties = source.GetType().GetProperties();
            var destinationProperties = destination.GetType().GetProperties();

            foreach (var sourceProperty in sourceProperties)
            {
                var destinationProperty =
                    destinationProperties.FirstOrDefault(p => p.Name == sourceProperty.Name && p.CanWrite);
                if (destinationProperty != null)
                {
                    var value = sourceProperty.GetValue(source);
                    destinationProperty.SetValue(destination, value);
                }
            }

            return destination;
        }

        public List<JustificanteViewModel> MapJustificantes(List<Justificante> justificantes)
        {
            return justificantes
                .Select(j => Map<Justificante, JustificanteViewModel>(j))
                .ToList();
        }

        public List<AlumnoViewModel> MapAlumnos(List<Alumno> alumnos)
        {
            return alumnos
                .Select(a => Map<Alumno, AlumnoViewModel>(a))
                .ToList();
        }

        public AlumnoViewModel MapAlumnoToViewModel(Alumno alumno)
        {
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
                Notas = alumno.Notas.Select(n => n.Id).ToList(),
                CantidadRetrasos = alumno.Retrasos.Count,
                CantidadAsistenciasFaltadas = alumno.Asistencias.Count(a => !a.IsPresente)
            };
        }


        /*public JustificanteViewModel MapJustificanteToViewModel(Justificante justificante)
        {
            if (justificante == null)
                return null;

            return new JustificanteViewModel
            {
                Id = justificante.Id,
                Alias = justificante.Alias,
                Descripcion = justificante.Descripcion,
                FechaJustificacion = justificante.FechaJustificacion.ToUniversalTime(),
                AlumnoDni = justificante.Alumno?.Dni ?? "N/A",
                AsistenciaIdentificador = justificante.Asistencia?.Identificador ?? "N/A",
                AsistenciaIsPresente = justificante.Asistencia?.IsPresente ?? false,
                AsignaturaNombre = justificante.Asistencia?.Asignatura?.Nombre ?? "N/A",
                Motivo = justificante.Motivo
            };
        }
        */

        public List<ProfesorViewModel> MapProfesores(List<Profesor> profesores)
        {
            return profesores
                .Select(p => Map<Profesor, ProfesorViewModel>(p))
                .ToList();
        }

        public ProfesorViewModel MapProfesorToViewModel(Profesor profesor)
        {
            if (profesor == null)
                return null;

            return new ProfesorViewModel
            {
                Id = profesor.Id,
                Dni = profesor.Dni,
                Nombre = profesor.Nombre,
                Apellidos = profesor.Apellidos,
                Email = profesor.Email,
                Telefono = profesor.Telefono,
                Asignaturas = profesor.Asignaturas.Select(a => Map<Asignatura, AsignaturaViewModel>(a)).ToList()
            };
        }

        public List<AsignaturaViewModel> MapAsignaturas(List<Asignatura> asignaturas)
        {
            return asignaturas
                .Select(a => Map<Asignatura, AsignaturaViewModel>(a))
                .ToList();
        }

        public AsignaturaViewModel MapAsignaturaToViewModel(Asignatura asignatura)
        {
            if (asignatura == null)
                return null;

            return new AsignaturaViewModel
            {
                Id = asignatura.Id,
                Nombre = asignatura.Nombre,
                IsPresente = asignatura.Asistencias.Any(a => a.IsPresente),
                HorasInicio = asignatura.HorasDeClase.Select(h => h.HoraInicio.ToString(@"hh\:mm")).ToList(),
                HorasFin = asignatura.HorasDeClase.Select(h => h.HoraFin.ToString(@"hh\:mm")).ToList(),
                Dias = asignatura.HorasDeClase.Select(h => h.Dia.ToString()).ToList()

            };
        }

        public List<CursoViewModel> MapCursos(List<Curso> cursos)
        {
            return cursos
                .Select(c => Map<Curso, CursoViewModel>(c))
                .ToList();
        }

        public CursoViewModel MapCursoToViewModel(Curso curso)
        {
            if (curso == null)
                return null;

            return new CursoViewModel
            {
                Id = curso.Id,
                Nombre = curso.Nombre,
                FechaInicio = curso.FechaInicio,
                FechaFin = curso.FechaFin,
                Asignaturas = curso.Asignaturas.Select(a => Map<Asignatura, AsignaturaViewModel>(a)).ToList(),
                Alumnos = curso.Alumnos.Select(a => Map<Alumno, AlumnoViewModelSinCamposNoNecesarios>(a)).ToList()
            };
        }

        public List<NotaViewModel> MapNotas(List<Nota> notas)
        {
            return notas
                .Select(n => Map<Nota, NotaViewModel>(n))
                .ToList();
        }

        public NotaViewModel MapNotaToViewModel(Nota nota)
        {
            if (nota == null)
                return null;

            return new NotaViewModel
            {
                Id = nota.Id,
                NotaValue = nota.NotaValue,
                AlumnoDni = nota.Alumno?.Dni ?? "N/A",
                AlumnoNombre = nota.Alumno?.Nombre ?? "N/A",
                AsignaturaId = nota.AsignaturaId,
                AsignaturaNombre = nota.Asignatura?.Nombre ?? "N/A"
            };
        }

        public List<AsistenciaViewModel> MapAsistencias(List<Asistencia> asistencias)
        {
            return asistencias
                .Select(a => Map<Asistencia, AsistenciaViewModel>(a))
                .ToList();
        }

        public AsistenciaViewModel MapAsistenciaToViewModel(Asistencia asistencia)
        {
            if (asistencia == null)
                return null;

            return new AsistenciaViewModel
            {
                Id = asistencia.Id,
                IsPresente = asistencia.IsPresente,
                Identificador = asistencia.Identificador,
                AlumnoId = asistencia.AlumnoId,
                AlumnoDni = asistencia.Alumno?.Dni ?? "N/A",
                AlumnoNombre = asistencia.Alumno?.Nombre ?? "N/A",
                AsignaturaId = asistencia.AsignaturaId,
                AsignaturaNombre = asistencia.Asignatura?.Nombre ?? "N/A"
            };
        }

        public List<RetrasoViewModel> MapRetrasos(List<Retraso> retrasos)
        {
            return retrasos
                .Select(r => Map<Retraso, RetrasoViewModel>(r))
                .ToList();
        }

        public RetrasoViewModel MapRetrasoToViewModel(Retraso retraso)
        {
            if (retraso == null)
                return null;

            return new RetrasoViewModel
            {
                Id = retraso.Id,
                Fecha = retraso.Fecha.ToString("yyyy-MM-dd"),
                Justificado = retraso.Justificado,
                alumnoDni = retraso.Alumno?.Dni ?? "N/A",
                alumnoNombre = retraso.Alumno?.Nombre ?? "N/A",
                asignaturaNombre = retraso.Asignatura?.Nombre ?? "N/A",
                MinutosRetraso = retraso.MinutosRetraso
            };
        }

        public List<PadreViewModel> MapPadres(List<Padre> padres)
        {
            return padres
                .Select(p => Map<Padre, PadreViewModel>(p))
                .ToList();
        }

        public PadreViewModel MapPadreToViewModel(Padre padre)
        {
            if (padre == null)
                return null;

            return new PadreViewModel
            {
                Id = padre.Id,
                Dni = padre.Dni,
                Nombre = padre.Nombre,
                Apellidos = padre.Apellidos,
                Telefono = padre.Telefono,
                Alumnos = padre.Alumnos.Select(a => a.Dni).ToList()
            };
        }
    }
}