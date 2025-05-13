-- =============================================
-- Script para crear la base de datos académica
-- Incluye tablas y procedimientos almacenados
-- =============================================

-- Creación de tablas
CREATE TABLE Profesores (
    ProfesorId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL
);

CREATE TABLE Materias (
    MateriaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Creditos INT NOT NULL CHECK (Creditos = 3),
    ProfesorId INT NOT NULL FOREIGN KEY REFERENCES Profesores(ProfesorId)
);

CREATE TABLE Estudiantes (
    EstudianteId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Contrasena NVARCHAR(100) NOT NULL,
    DocumentoIdentidad NVARCHAR(20) NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE()
);

CREATE TABLE EstudianteMaterias (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EstudianteId INT NOT NULL FOREIGN KEY REFERENCES Estudiantes(EstudianteId),
    MateriaId INT NOT NULL FOREIGN KEY REFERENCES Materias(MateriaId),
    CONSTRAINT UQ_EstudianteMateria UNIQUE (EstudianteId, MateriaId)
);

-- =============================================
-- Procedimientos almacenados
-- =============================================

-- Procedimiento para actualizar datos de estudiante
CREATE OR ALTER PROCEDURE [dbo].[sp_ActualizarEstudiante]
    @EstudianteId INT,
    @NuevoNombre NVARCHAR(100) = NULL,
    @NuevoEmail NVARCHAR(100) = NULL,
    @IdTableStudent INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que el estudiante exista
    IF NOT EXISTS (SELECT 1 FROM Estudiantes WHERE EstudianteId = @EstudianteId)
    BEGIN
        RAISERROR('El estudiante no existe.', 16, 1);
        RETURN;
    END
    
    -- Actualizar nombre solo si se proporciona un nuevo nombre
    IF @NuevoNombre IS NOT NULL
    BEGIN
        UPDATE Estudiantes
        SET Nombre = @NuevoNombre
        WHERE EstudianteId = @EstudianteId;
    END
    
    -- Actualizar email solo si se proporciona un nuevo email
    IF @NuevoEmail IS NOT NULL
    BEGIN
        -- Verificar que el nuevo email no esté en uso
        IF EXISTS (SELECT 1 FROM Estudiantes WHERE Email = @NuevoEmail AND EstudianteId <> @EstudianteId)
        BEGIN
            RAISERROR('El email ya está en uso por otro estudiante.', 16, 1);
            RETURN;
        END
        
        UPDATE Estudiantes
        SET Email = @NuevoEmail
        WHERE EstudianteId = @EstudianteId;
    END

    SET @IdTableStudent = @EstudianteId;
END
GO

-- Procedimiento para asignar materias a estudiante
CREATE OR ALTER PROCEDURE [dbo].[sp_AsignarMaterias]
    @EstudianteId INT,
    @Materia1 INT,
    @Materia2 INT,
    @Materia3 INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que el estudiante exista
    IF NOT EXISTS (SELECT 1 FROM Estudiantes WHERE EstudianteId = @EstudianteId)
    BEGIN
        RAISERROR('El estudiante no existe.', 16, 1);
        RETURN;
    END
    
    -- Verificar que el estudiante no tenga materias asignadas
    IF EXISTS (SELECT 1 FROM EstudianteMaterias WHERE EstudianteId = @EstudianteId)
    BEGIN
        RAISERROR('El estudiante ya tiene materias asignadas.', 16, 1);
        RETURN;
    END
    
    -- Verificar que las materias existan
    IF NOT EXISTS (SELECT 1 FROM Materias WHERE MateriaId = @Materia1) 
       OR NOT EXISTS (SELECT 1 FROM Materias WHERE MateriaId = @Materia2)
       OR NOT EXISTS (SELECT 1 FROM Materias WHERE MateriaId = @Materia3)
    BEGIN
        RAISERROR('Una o más materias no existen.', 16, 1);
        RETURN;
    END
    
    -- Verificar que los profesores de las 3 materias sean distintos
    IF (
        SELECT COUNT(DISTINCT ProfesorId)
        FROM Materias
        WHERE MateriaId IN (@Materia1, @Materia2, @Materia3)
    ) < 3
    BEGIN
        RAISERROR('No puede tener materias con el mismo profesor.', 16, 1);
        RETURN;
    END

    -- Asignar las materias
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO EstudianteMaterias (EstudianteId, MateriaId) VALUES
        (@EstudianteId, @Materia1),
        (@EstudianteId, @Materia2),
        (@EstudianteId, @Materia3);
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        RAISERROR('Error al asignar materias: %s', 16, 1, ERROR_MESSAGE());
    END CATCH
END
GO

-- Procedimiento para eliminar materia de estudiante
CREATE OR ALTER PROCEDURE [dbo].[sp_EliminarMateriaEstudiante]
    @EstudianteId INT,
    @MateriaId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que la relación exista
    IF NOT EXISTS (SELECT 1 FROM EstudianteMaterias 
                  WHERE EstudianteId = @EstudianteId AND MateriaId = @MateriaId)
    BEGIN
        RAISERROR('El estudiante no tiene asignada esta materia.', 16, 1);
        RETURN;
    END
    
    DELETE FROM EstudianteMaterias
    WHERE EstudianteId = @EstudianteId AND MateriaId = @MateriaId;
END
GO

-- Procedimiento para login de estudiante
CREATE OR ALTER PROCEDURE [dbo].[sp_LoginEstudiante]
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT EstudianteId, Nombre, Email, Contrasena
    FROM Estudiantes
    WHERE Email = @Email;
END
GO

-- Procedimiento para obtener compañeros de clase
CREATE OR ALTER PROCEDURE [dbo].[sp_ObtenerCompaneros]
    @EstudianteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que el estudiante exista
    IF NOT EXISTS (SELECT 1 FROM Estudiantes WHERE EstudianteId = @EstudianteId)
    BEGIN
        RAISERROR('El estudiante no existe.', 16, 1);
        RETURN;
    END
    
    SELECT DISTINCT 
        E2.EstudianteId,
        E2.Nombre AS Compañero, 
        M.Nombre AS Materia,
        M.MateriaId
    FROM EstudianteMaterias EM1
    JOIN EstudianteMaterias EM2 ON EM1.MateriaId = EM2.MateriaId AND EM1.EstudianteId <> EM2.EstudianteId
    JOIN Estudiantes E2 ON EM2.EstudianteId = E2.EstudianteId
    JOIN Materias M ON EM1.MateriaId = M.MateriaId
    WHERE EM1.EstudianteId = @EstudianteId
    ORDER BY M.Nombre, E2.Nombre;
END
GO

-- Procedimiento para obtener materias con profesores
CREATE OR ALTER PROCEDURE [dbo].[sp_ObtenerMateriasConProfesores]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        m.MateriaId, 
        m.Nombre AS Nombre_Materia,
        m.Creditos,
        p.ProfesorId,
        p.Nombre AS Nombre_Profesor
    FROM Materias m
    INNER JOIN Profesores p ON m.ProfesorId = p.ProfesorId
    ORDER BY m.Nombre;
END
GO

-- Procedimiento para registrar nuevo estudiante
CREATE OR ALTER PROCEDURE [dbo].[sp_RegistrarEstudiante]
    @Nombre NVARCHAR(100),
    @Email NVARCHAR(100),
    @Contrasena NVARCHAR(100),
    @DocumentoIdentidad NVARCHAR(20),
    @NuevoID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar email único
    IF EXISTS (SELECT 1 FROM Estudiantes WHERE Email = @Email)
    BEGIN
        RAISERROR('Ya existe un estudiante con este email.', 16, 1);
        RETURN;
    END
    
    -- Validar documento único
    IF EXISTS (SELECT 1 FROM Estudiantes WHERE DocumentoIdentidad = @DocumentoIdentidad)
    BEGIN
        RAISERROR('Ya existe un estudiante con este documento de identidad.', 16, 1);
        RETURN;
    END
    
    BEGIN TRY
        INSERT INTO Estudiantes (Nombre, Email, Contrasena, DocumentoIdentidad)
        VALUES (@Nombre, @Email, @Contrasena, @DocumentoIdentidad);

        SET @NuevoID = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        RAISERROR('Error al registrar el estudiante: %s', 16, 1, ERROR_MESSAGE());
    END CATCH
END
GO
