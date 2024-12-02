using AutoMapper;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.ViewModels;

namespace WebApplication1.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
           CreateMap<CrearAlumnoDto,Alumno>()
                .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.nombre))
                .ForMember(dest => dest.Apellidos, opt => opt.MapFrom(src => src.apellidos))
                .ForMember(dest => dest.Dni, opt => opt.MapFrom(src => src.dni))
                .ForMember(dest => dest.FechaNacimiento, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.FechaNacimiento))) // Convertir DateTime a DateOnly
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.email))
                .ForMember(dest => dest.Telefono, opt => opt.MapFrom(src => src.telefono))
                .ForMember(dest => dest.Curso, opt => opt.Ignore()) 
                .ForMember(dest => dest.Padres, opt => opt.Ignore()); 


           CreateMap<Alumno, AlumnoViewModel>()
               .ForMember(dest => dest.Padres, opt => opt.MapFrom(src => src.Padres.Select(p => p.Dni).ToList()))
               .ForMember(dest => dest.Curso, opt => opt.MapFrom(src => src.Curso.Nombre))
               .ForMember(dest => dest.Justificantes, opt => opt.MapFrom(src => src.Justificantes.Select(j => j.Descripcion).ToList()));

           CreateMap<createAsignaturaDto, Asignatura>()
               .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.nombre))
               .ForMember(dest => dest.Profesor, opt => opt.Ignore())
               .ForMember(dest => dest.Cursos, opt => opt.Ignore())
               .ForMember(dest => dest.HorasDeClase, opt => opt.Ignore());  
           

                
            
                
        




        }
        }
    }
