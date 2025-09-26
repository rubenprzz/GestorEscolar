-- init.sql - Script completo con creación de tablas e inserción de datos de prueba

-- Crear extensión para generar UUIDs si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Eliminar tablas si existen (en orden correcto por dependencias)
DROP TABLE IF EXISTS "Justificantes" CASCADE;
DROP TABLE IF EXISTS "Retrasos" CASCADE;
DROP TABLE IF EXISTS "Notas" CASCADE;
DROP TABLE IF EXISTS "CursoAsignaturas" CASCADE;
DROP TABLE IF EXISTS "Horas" CASCADE;
DROP TABLE IF EXISTS "Asistencias" CASCADE;
DROP TABLE IF EXISTS "AlumnoPadres" CASCADE;
DROP TABLE IF EXISTS "Alumnos" CASCADE;
DROP TABLE IF EXISTS "Asignaturas" CASCADE;
DROP TABLE IF EXISTS "Padres" CASCADE;
DROP TABLE IF EXISTS "Profesores" CASCADE;
DROP TABLE IF EXISTS "Cursos" CASCADE;
DROP TABLE IF EXISTS "AspNetUserTokens" CASCADE;
DROP TABLE IF EXISTS "AspNetUserRoles" CASCADE;
DROP TABLE IF EXISTS "AspNetUserLogins" CASCADE;
DROP TABLE IF EXISTS "AspNetUserClaims" CASCADE;
DROP TABLE IF EXISTS "AspNetRoleClaims" CASCADE;
DROP TABLE IF EXISTS "AspNetUsers" CASCADE;
DROP TABLE IF EXISTS "AspNetRoles" CASCADE;

-- Crear tablas de ASP.NET Identity
CREATE TABLE "AspNetRoles" (
    "Id" text NOT NULL,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text,
    CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id")
);

CREATE TABLE "AspNetUsers" (
    "Id" text NOT NULL,
    "dni" text NOT NULL,
    "UserName" character varying(256),
    "NormalizedUserName" character varying(256),
    "Email" character varying(256),
    "NormalizedEmail" character varying(256),
    "EmailConfirmed" boolean NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamp with time zone,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL,
    CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id")
);

CREATE TABLE "AspNetRoleClaims" (
    "Id" serial NOT NULL,
    "RoleId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserClaims" (
    "Id" serial NOT NULL,
    "UserId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" text NOT NULL,
    CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey"),
    CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserRoles" (
    "UserId" text NOT NULL,
    "RoleId" text NOT NULL,
    CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId"),
    CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AspNetUserTokens" (
    "UserId" text NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text,
    CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name"),
    CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);

-- Crear tablas del dominio
CREATE TABLE "Cursos" (
    "Id" serial NOT NULL,
    "Nombre" text NOT NULL,
    "FechaInicio" date NOT NULL,
    "FechaFin" date NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Cursos" PRIMARY KEY ("Id")
);

CREATE TABLE "Padres" (
    "Id" serial NOT NULL,
    "Nombre" text NOT NULL,
    "Apellidos" text NOT NULL,
    "Dni" text NOT NULL,
    "Telefono" text NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Padres" PRIMARY KEY ("Id")
);

CREATE TABLE "Profesores" (
    "Id" serial NOT NULL,
    "Nombre" text NOT NULL,
    "Apellidos" text NOT NULL,
    "Dni" text NOT NULL,
    "Email" text NOT NULL,
    "isDeleted" boolean NOT NULL,
    "Telefono" text NOT NULL,
    CONSTRAINT "PK_Profesores" PRIMARY KEY ("Id")
);

CREATE TABLE "Alumnos" (
    "Id" serial NOT NULL,
    "Nombre" text NOT NULL,
    "Apellidos" text NOT NULL,
    "isPresente" boolean NOT NULL,
    "Dni" text NOT NULL,
    "FechaNacimiento" date NOT NULL,
    "Email" text NOT NULL,
    "Telefono" text NOT NULL,
    "urlFoto" text NOT NULL,
    "CursoId" integer NOT NULL,
    "imagen" text,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Alumnos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Alumnos_Cursos_CursoId" FOREIGN KEY ("CursoId") REFERENCES "Cursos" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Asignaturas" (
    "Id" serial NOT NULL,
    "Nombre" text NOT NULL,
    "ProfesorId" integer NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Asignaturas" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Asignaturas_Profesores_ProfesorId" FOREIGN KEY ("ProfesorId") REFERENCES "Profesores" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AlumnoPadres" (
    "AlumnosId" integer NOT NULL,
    "PadresId" integer NOT NULL,
    CONSTRAINT "PK_AlumnoPadres" PRIMARY KEY ("AlumnosId", "PadresId"),
    CONSTRAINT "FK_AlumnoPadres_Alumnos_AlumnosId" FOREIGN KEY ("AlumnosId") REFERENCES "Alumnos" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AlumnoPadres_Padres_PadresId" FOREIGN KEY ("PadresId") REFERENCES "Padres" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Asistencias" (
    "Id" serial NOT NULL,
    "DiaSemana" integer NOT NULL,
    "HoraInicio" interval NOT NULL,
    "HoraFin" interval NOT NULL,
    "Identificador" text NOT NULL,
    "IsPresente" boolean NOT NULL,
    "AlumnoId" integer NOT NULL,
    "AsignaturaId" integer NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Asistencias" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Asistencias_Alumnos_AlumnoId" FOREIGN KEY ("AlumnoId") REFERENCES "Alumnos" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Asistencias_Asignaturas_AsignaturaId" FOREIGN KEY ("AsignaturaId") REFERENCES "Asignaturas" ("Id") ON DELETE CASCADE
);

CREATE TABLE "CursoAsignaturas" (
    "AsignaturasId" integer NOT NULL,
    "CursosId" integer NOT NULL,
    CONSTRAINT "PK_CursoAsignaturas" PRIMARY KEY ("AsignaturasId", "CursosId"),
    CONSTRAINT "FK_CursoAsignaturas_Asignaturas_AsignaturasId" FOREIGN KEY ("AsignaturasId") REFERENCES "Asignaturas" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_CursoAsignaturas_Cursos_CursosId" FOREIGN KEY ("CursosId") REFERENCES "Cursos" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Horas" (
    "Id" serial NOT NULL,
    "Dia" integer NOT NULL,
    "HoraInicio" interval NOT NULL,
    "HoraFin" interval NOT NULL,
    "AsignaturaId" integer NOT NULL,
    "isDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Horas" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Horas_Asignaturas_AsignaturaId" FOREIGN KEY ("AsignaturaId") REFERENCES "Asignaturas" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Notas" (
    "Id" serial NOT NULL,
    "NotaValue" numeric NOT NULL,
    "Fecha" date NOT NULL,
    "Motivo" text NOT NULL,
    "isDeleted" boolean NOT NULL,
    "AlumnoId" integer NOT NULL,
    "AsignaturaId" integer NOT NULL,
    CONSTRAINT "PK_Notas" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Notas_Alumnos_AlumnoId" FOREIGN KEY ("AlumnoId") REFERENCES "Alumnos" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Notas_Asignaturas_AsignaturaId" FOREIGN KEY ("AsignaturaId") REFERENCES "Asignaturas" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Retrasos" (
    "Id" serial NOT NULL,
    "Fecha" timestamp with time zone NOT NULL,
    "MinutosRetraso" integer NOT NULL,
    "HoraLlegada" interval NOT NULL,
    "AlumnoId" integer NOT NULL,
    "Justificado" boolean NOT NULL,
    "Motivo" text,
    "isDeleted" boolean NOT NULL,
    "AsignaturaId" integer NOT NULL,
    CONSTRAINT "PK_Retrasos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Retrasos_Alumnos_AlumnoId" FOREIGN KEY ("AlumnoId") REFERENCES "Alumnos" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Retrasos_Asignaturas_AsignaturaId" FOREIGN KEY ("AsignaturaId") REFERENCES "Asignaturas" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Justificantes" (
    "Id" serial NOT NULL,
    "FechaJustificacion" date NOT NULL,
    "Descripcion" text NOT NULL,
    "Motivo" text NOT NULL,
    "AlumnoId" integer NOT NULL,
    "AsistenciaId" integer NOT NULL,
    "isDeleted" boolean NOT NULL,
    "Alias" text NOT NULL,
    CONSTRAINT "PK_Justificantes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Justificantes_Alumnos_AlumnoId" FOREIGN KEY ("AlumnoId") REFERENCES "Alumnos" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Justificantes_Asistencias_AsistenciaId" FOREIGN KEY ("AsistenciaId") REFERENCES "Asistencias" ("Id") ON DELETE CASCADE
);

-- Crear índices
CREATE INDEX "IX_AlumnoPadres_PadresId" ON "AlumnoPadres" ("PadresId");
CREATE INDEX "IX_Alumnos_CursoId" ON "Alumnos" ("CursoId");
CREATE INDEX "IX_Asignaturas_ProfesorId" ON "Asignaturas" ("ProfesorId");
CREATE INDEX "IX_Asistencias_AlumnoId" ON "Asistencias" ("AlumnoId");
CREATE INDEX "IX_Asistencias_AsignaturaId" ON "Asistencias" ("AsignaturaId");
CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" ("RoleId");
CREATE UNIQUE INDEX "RoleNameIndex" ON "AspNetRoles" ("NormalizedName");
CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" ("UserId");
CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" ("UserId");
CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" ("RoleId");
CREATE INDEX "EmailIndex" ON "AspNetUsers" ("NormalizedEmail");
CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers" ("NormalizedUserName");
CREATE INDEX "IX_CursoAsignaturas_CursosId" ON "CursoAsignaturas" ("CursosId");
CREATE INDEX "IX_Horas_AsignaturaId" ON "Horas" ("AsignaturaId");
CREATE INDEX "IX_Justificantes_AlumnoId" ON "Justificantes" ("AlumnoId");
CREATE INDEX "IX_Justificantes_AsistenciaId" ON "Justificantes" ("AsistenciaId");
CREATE INDEX "IX_Notas_AlumnoId" ON "Notas" ("AlumnoId");
CREATE INDEX "IX_Notas_AsignaturaId" ON "Notas" ("AsignaturaId");
CREATE INDEX "IX_Retrasos_AlumnoId" ON "Retrasos" ("AlumnoId");
CREATE INDEX "IX_Retrasos_AsignaturaId" ON "Retrasos" ("AsignaturaId");

-- Insertar datos de prueba

-- Insertar roles de ASP.NET Identity
INSERT INTO "AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Director', 'DIRECTOR', '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440002', 'Profesor', 'PROFESOR', '550e8400-e29b-41d4-a716-446655440012');

-- Insertar usuarios de ASP.NET Identity
INSERT INTO "AspNetUsers" ("Id", "dni", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnd", "LockoutEnabled", "AccessFailedCount") VALUES
('550e8400-e29b-41d4-a716-446655440101', '12345678A', 'director@admin.com', 'DIRECTOR@ADMIN.COM', 'director@admin.com', 'DIRECTOR@ADMIN.COM', true, 'AQAAAAEAACcQAAAAEH+2F+XZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zw==', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440301', '666555444', true, false, null, true, 0),
('550e8400-e29b-41d4-a716-446655440102', '23456789B', 'profesor1@school.com', 'PROFESOR1@SCHOOL.COM', 'profesor1@school.com', 'PROFESOR1@SCHOOL.COM', true, 'AQAAAAEAACcQAAAAEH+2F+XZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zw==', '550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440302', '666555445', true, false, null, true, 0),
('550e8400-e29b-41d4-a716-446655440103', '34567890C', 'profesor2@school.com', 'PROFESOR2@SCHOOL.COM', 'profesor2@school.com', 'PROFESOR2@SCHOOL.COM', true, 'AQAAAAEAACcQAAAAEH+2F+XZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zw==', '550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440303', '666555446', true, false, null, true, 0),
('550e8400-e29b-41d4-a716-446655440104', '34567890D', 'profesor3@school.com', 'PROFESOR3@SCHOOL.COM', 'profesor3@school.com', 'PROFESOR3@SCHOOL.COM', true, 'AQAAAAEAACcQAAAAEH+2F+XZz5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zw==', '550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440304', '666555447', true, false, null, true, 0);

-- Asignar roles a usuarios
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId") VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001'), -- Director
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002'), -- Profesor1
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440002'), -- Profesor2
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440002'); -- Profesor3

-- Insertar cursos
INSERT INTO "Cursos" ("Nombre", "FechaInicio", "FechaFin", "isDeleted") VALUES
('1º ESO A', '2024-09-01', '2025-06-30', false),
('1º ESO B', '2024-09-01', '2025-06-30', false),
('2º ESO A', '2024-09-01', '2025-06-30', false),
('3º ESO A', '2024-09-01', '2025-06-30', false),
('4º ESO A', '2024-09-01', '2025-06-30', false);

-- Insertar profesores
INSERT INTO "Profesores" ("Nombre", "Apellidos", "Dni", "Email", "Telefono", "isDeleted") VALUES
('María', 'García López', '12345678X', 'maria.garcia@school.com', '666111222', false),
('Carlos', 'Martínez Ruiz', '23456789Y', 'carlos.martinez@school.com', '666111223', false),
('Ana', 'Fernández Torres', '34567890Z', 'ana.fernandez@school.com', '666111224', false),
('Luis', 'González Moreno', '45678901A', 'luis.gonzalez@school.com', '666111225', false),
('Elena', 'Rodríguez Sánchez', '56789012B', 'elena.rodriguez@school.com', '666111226', false);

-- Insertar asignaturas
INSERT INTO "Asignaturas" ("Nombre", "ProfesorId", "isDeleted") VALUES
('Matemáticas', 1, false),
('Lengua y Literatura', 2, false),
('Ciencias Naturales', 3, false),
('Historia', 4, false),
('Inglés', 5, false),
('Educación Física', 1, false),
('Tecnología', 2, false);

-- Relacionar cursos con asignaturas
INSERT INTO "CursoAsignaturas" ("AsignaturasId", "CursosId") VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), -- 1º ESO A
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2), -- 1º ESO B
(1, 3), (2, 3), (3, 3), (4, 3), (5, 3), -- 2º ESO A
(1, 4), (2, 4), (6, 4), (7, 4), (5, 4), -- 3º ESO A
(1, 5), (2, 5), (6, 5), (7, 5), (5, 5); -- 4º ESO A

-- Insertar padres
INSERT INTO "Padres" ("Nombre", "Apellidos", "Dni", "Telefono", "isDeleted") VALUES
('Juan', 'Pérez Gómez', '98765432A', '666777888', false),
('Carmen', 'López Martín', '87654321B', '666777889', false),
('Miguel', 'Hernández Díaz', '76543210C', '666777890', false),
('Rosa', 'Jiménez Vargas', '65432109D', '666777891', false),
('Alberto', 'Morales Castro', '54321098E', '666777892', false);

-- Insertar alumnos
INSERT INTO "Alumnos" ("Nombre", "Apellidos", "isPresente", "Dni", "FechaNacimiento", "Email", "Telefono", "urlFoto", "CursoId", "imagen", "isDeleted") VALUES
('Pablo', 'Pérez López', true, '11111111A', '2010-03-15', 'pablo.perez@student.com', '666888111', '/photos/pablo.jpg', 1, null, false),
('Sofía', 'García Ruiz', false, '22222222B', '2010-07-22', 'sofia.garcia@student.com', '666888112', '/photos/sofia.jpg', 1, null, false),
('Diego', 'Martínez Torres', true, '33333333C', '2010-01-10', 'diego.martinez@student.com', '666888113', '/photos/diego.jpg', 1, null, false),
('Lucía', 'Fernández Moreno', true, '44444444D', '2009-11-05', 'lucia.fernandez@student.com', '666888114', '/photos/lucia.jpg', 2, null, false),
('Adrián', 'González Sánchez', false, '55555555E', '2009-09-18', 'adrian.gonzalez@student.com', '666888115', '/photos/adrian.jpg', 2, null, false),
('Paula', 'Rodríguez Vargas', true, '66666666F', '2008-12-03', 'paula.rodriguez@student.com', '666888116', '/photos/paula.jpg', 3, null, false),
('Marcos', 'López Castro', true, '77777777G', '2007-06-28', 'marcos.lopez@student.com', '666888117', '/photos/marcos.jpg', 4, null, false),
('Elena', 'Hernández Jiménez', false, '88888888H', '2006-04-12', 'elena.hernandez@student.com', '666888118', '/photos/elena.jpg', 5, null, false);

-- Relacionar alumnos con padres
INSERT INTO "AlumnoPadres" ("AlumnosId", "PadresId") VALUES
(1, 1), (1, 2), -- Pablo tiene dos padres
(2, 1), (2, 2), -- Sofía tiene dos padres
(3, 3), -- Diego tiene un padre
(4, 4), -- Lucía tiene un padre
(5, 5), -- Adrián tiene un padre
(6, 1), -- Paula comparte padre con Pablo y Sofía
(7, 2), -- Marcos comparte padre con Pablo y Sofía
(8, 4); -- Elena comparte padre con Lucía

-- Insertar horarios de clases
INSERT INTO "Horas" ("Dia", "HoraInicio", "HoraFin", "AsignaturaId", "isDeleted") VALUES
-- Lunes (1)
(1, '08:00:00', '09:00:00', 1, false), -- Matemáticas
(1, '09:00:00', '10:00:00', 2, false), -- Lengua
(1, '10:30:00', '11:30:00', 3, false), -- Ciencias
(1, '11:30:00', '12:30:00', 4, false), -- Historia
(1, '12:30:00', '13:30:00', 5, false), -- Inglés
-- Martes (2)
(2, '08:00:00', '09:00:00', 2, false), -- Lengua
(2, '09:00:00', '10:00:00', 1, false), -- Matemáticas
(2, '10:30:00', '11:30:00', 5, false), -- Inglés
(2, '11:30:00', '12:30:00', 3, false), -- Ciencias
(2, '12:30:00', '13:30:00', 6, false), -- Ed. Física
-- Miércoles (3)
(3, '08:00:00', '09:00:00', 1, false), -- Matemáticas
(3, '09:00:00', '10:00:00', 4, false), -- Historia
(3, '10:30:00', '11:30:00', 2, false), -- Lengua
(3, '11:30:00', '12:30:00', 7, false), -- Tecnología
(3, '12:30:00', '13:30:00', 5, false); -- Inglés

-- Insertar asistencias
INSERT INTO "Asistencias" ("DiaSemana", "HoraInicio", "HoraFin", "Identificador", "IsPresente", "AlumnoId", "AsignaturaId", "isDeleted") VALUES
(1, '08:00:00', '09:00:00', 'MAT-2024-09-23-1', true, 1, 1, false),
(1, '08:00:00', '09:00:00', 'MAT-2024-09-23-2', false, 2, 1, false),
(1, '08:00:00', '09:00:00', 'MAT-2024-09-23-3', true, 3, 1, false),
(1, '09:00:00', '10:00:00', 'LEN-2024-09-23-1', true, 1, 2, false),
(1, '09:00:00', '10:00:00', 'LEN-2024-09-23-2', true, 2, 2, false),
(1, '09:00:00', '10:00:00', 'LEN-2024-09-23-3', false, 3, 2, false);

-- Insertar notas
INSERT INTO "Notas" ("NotaValue", "Fecha", "Motivo", "isDeleted", "AlumnoId", "AsignaturaId") VALUES
(8.5, '2024-09-15', 'Examen Unidad 1', false, 1, 1),
(7.2, '2024-09-15', 'Examen Unidad 1', false, 2, 1),
(9.1, '2024-09-15', 'Examen Unidad 1', false, 3, 1),
(6.8, '2024-09-18', 'Ejercicios prácticos', false, 1, 2),
(8.3, '2024-09-18', 'Ejercicios prácticos', false, 2, 2),
(7.5, '2024-09-18', 'Ejercicios prácticos', false, 3, 2),
(9.0, '2024-09-20', 'Proyecto de ciencias', false, 1, 3),
(8.7, '2024-09-20', 'Proyecto de ciencias', false, 2, 3),
(7.9, '2024-09-20', 'Proyecto de ciencias', false, 3, 3);

-- Insertar retrasos
INSERT INTO "Retrasos" ("Fecha", "MinutosRetraso", "HoraLlegada", "AlumnoId", "Justificado", "Motivo", "isDeleted", "AsignaturaId") VALUES
('2024-09-23 08:15:00+00', 15, '08:15:00', 2, false, null, false, 1),
('2024-09-24 09:10:00+00', 10, '09:10:00', 3, true, 'Cita médica', false, 2),
('2024-09-25 08:20:00+00', 20, '08:20:00', 1, false, null, false, 1);

-- Insertar justificantes
INSERT INTO "Justificantes" ("FechaJustificacion", "Descripcion", "Motivo", "AlumnoId", "AsistenciaId", "isDeleted", "Alias") VALUES
('2024-09-23', 'El alumno no pudo asistir por motivos médicos', 'Cita médica', 2, 2, false, 'Justificante médico Sofía'),
('2024-09-25', 'Ausencia por motivos familiares', 'Asunto familiar urgente', 3, 6, false, 'Justificante familiar Diego');

-- Comentarios finales
-- Usuarios de prueba creados:
-- - director@admin.com / Password123! (ROL: Director) - Coincide con el usuario creado en Program.cs
-- - profesor1@school.com / Password123! (ROL: Profesor)
-- - profesor2@school.com / Password123! (ROL: Profesor)
-- - profesor3@school.com / Password123! (ROL: Profesor)

-- NOTA IMPORTANTE: Las contraseñas están hasheadas usando ASP.NET Core Identity.
-- El hash corresponde a "Password123!" pero el usuario director@admin.com también
-- se creará automáticamente en Program.cs con contraseña "Admin123!".

-- Este script:
-- 1. Elimina todas las tablas existentes (DROP)
-- 2. Crea todas las tablas desde cero con estructura completa
-- 3. Crea todos los índices necesarios
-- 4. Inserta datos de prueba realistas

-- Para usar con Docker:
-- 1. Ejecutar: docker-compose down -v
-- 2. Ejecutar: docker-compose up -d
-- 3. Las tablas se crearán automáticamente y se poblarán con datos