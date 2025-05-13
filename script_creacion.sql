
-- =============================================
-- Script de creación de base de datos para Registro de Estudiantes
-- =============================================

-- Crear tabla Profesores
CREATE TABLE Profesores (
    ProfesorId INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100)
);

-- Crear tabla Materias
CREATE TABLE Materias (
    MateriaId INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100),
    Creditos INT CHECK (Creditos = 3),
    ProfesorId INT FOREIGN KEY REFERENCES Profesores(ProfesorId)
);

-- Crear tabla Estudiantes
CREATE TABLE Estudiantes (
    EstudianteId INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100),
    Email NVARCHAR(100) UNIQUE,
    Contrasena NVARCHAR(100)
);

-- Crear tabla de relación Estudiante-Materias
CREATE TABLE EstudianteMaterias (
    Id INT PRIMARY KEY IDENTITY,
    EstudianteId INT FOREIGN KEY REFERENCES Estudiantes(EstudianteId),
    MateriaId INT FOREIGN KEY REFERENCES Materias(MateriaId)
);

-- Inserts de Profesores
INSERT INTO Profesores (Nombre) VALUES 
('Profesor A'), ('Profesor B'), ('Profesor C'), ('Profesor D'), ('Profesor E');

-- Inserts de Materias (2 por profesor)
INSERT INTO Materias (Nombre, Creditos, ProfesorId) VALUES
('Matemáticas', 3, 1),
('Física', 3, 1),
('Química', 3, 2),
('Biología', 3, 2),
('Historia', 3, 3),
('Geografía', 3, 3),
('Literatura', 3, 4),
('Inglés', 3, 4),
('Programación', 3, 5),
('Algoritmos', 3, 5);

-- =============================================
-- Procedimientos Almacenados
-- =============================================

-- Registrar estudiante
CREATE PROCEDURE sp_RegistrarEstudiante
    @Nombre NVARCHAR(100),
    @Email NVARCHAR(100),
    @Contrasena NVARCHAR(100)
AS
BEGIN
    INSERT INTO Estudiantes (Nombre, Email, Contrasena)
    VALUES (@Nombre, @Email, @Contrasena)
END
GO

-- Login estudiante (devuelve datos para validación en backend)
CREATE PROCEDURE sp_LoginEstudiante
    @Email NVARCHAR(100)
AS
BEGIN
    SELECT EstudianteId, Nombre, Email, Contrasena
    FROM Estudiantes
    WHERE Email = @Email
END
GO

-- Asignar materias al estudiante
CREATE PROCEDURE sp_AsignarMaterias
    @EstudianteId INT,
    @Materia1 INT,
    @Materia2 INT,
    @Materia3 INT
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM EstudianteMaterias
        WHERE EstudianteId = @EstudianteId
    )
    BEGIN
        RAISERROR('El estudiante ya tiene materias asignadas.', 16, 1)
        RETURN
    END

    INSERT INTO EstudianteMaterias (EstudianteId, MateriaId) VALUES
    (@EstudianteId, @Materia1),
    (@EstudianteId, @Materia2),
    (@EstudianteId, @Materia3)
END
GO

-- Obtener compañeros por materia
CREATE PROCEDURE sp_ObtenerCompaneros
    @EstudianteId INT
AS
BEGIN
    SELECT DISTINCT E2.Nombre AS Companero, M.Nombre AS Materia
    FROM EstudianteMaterias EM1
    JOIN EstudianteMaterias EM2 ON EM1.MateriaId = EM2.MateriaId AND EM1.EstudianteId <> EM2.EstudianteId
    JOIN Estudiantes E2 ON EM2.EstudianteId = E2.EstudianteId
    JOIN Materias M ON EM1.MateriaId = M.MateriaId
    WHERE EM1.EstudianteId = @EstudianteId
END
GO
