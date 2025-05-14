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

CREATE TABLE AuditoriaEstudiantes (
    AuditoriaId INT PRIMARY KEY IDENTITY(1,1),
    EstudianteId INT NOT NULL,
    CampoModificado VARCHAR(50) NOT NULL,
    ValorAnterior NVARCHAR(MAX) NULL,
    ValorNuevo NVARCHAR(MAX) NULL,
    Accion VARCHAR(10) NOT NULL, -- 'UPDATE'
    FechaHora DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario VARCHAR(100) NOT NULL DEFAULT SYSTEM_USER
);

CREATE TABLE AuditoriaEstudianteMaterias (
    AuditoriaId INT PRIMARY KEY IDENTITY(1,1),
    EstudianteId INT NOT NULL,
    MateriaId INT NOT NULL,
    Accion VARCHAR(10) NOT NULL, -- 'INSERT' o 'DELETE'
    FechaHora DATETIME NOT NULL DEFAULT GETDATE(),
    Usuario VARCHAR(100) NOT NULL DEFAULT SYSTEM_USER,
    IpAddress VARCHAR(50) NULL,
    CONSTRAINT FK_Auditoria_Estudiante FOREIGN KEY (EstudianteId) REFERENCES Estudiantes(EstudianteId),
    CONSTRAINT FK_Auditoria_Materia FOREIGN KEY (MateriaId) REFERENCES Materias(MateriaId)
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
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        ROLLBACK TRANSACTION;
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
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
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
-- Procedimiento para Materias Asignadas
CREATE PROCEDURE [dbo].[sp_ObtenerMateriasAsignadas]
    @EstudianteId INT
AS
BEGIN
    SELECT 
        m.MateriaId,
        m.Nombre,
        p.Nombre AS Profesor,
        m.Creditos
    FROM EstudianteMaterias em
    JOIN Materias m ON em.MateriaId = m.MateriaId
    JOIN Profesores p ON m.ProfesorId = p.ProfesorId
    WHERE em.EstudianteId = @EstudianteId
END

-- Procedimiento para Obtener el Histórico
CREATE PROCEDURE sp_ObtenerHistorialEstudiante
    @EstudianteId INT
AS
BEGIN
    -- Historial de materias
    SELECT 
        'MATERIA' AS TipoRegistro,
        CONVERT(VARCHAR(10), am.FechaHora, 120) AS Fecha,
        CONVERT(VARCHAR(8), am.FechaHora, 108) AS Hora,
        am.Accion,
        m.Nombre AS Materia,
        p.Nombre AS Profesor,
        am.Usuario,
        am.IpAddress
    FROM AuditoriaEstudianteMaterias am
    JOIN Materias m ON am.MateriaId = m.MateriaId
    JOIN Profesores p ON m.ProfesorId = p.ProfesorId
    WHERE am.EstudianteId = @EstudianteId
    
    UNION ALL
    
    -- Historial de cambios de datos
    SELECT 
        'DATOS' AS TipoRegistro,
        CONVERT(VARCHAR(10), ae.FechaHora, 120) AS Fecha,
        CONVERT(VARCHAR(8), ae.FechaHora, 108) AS Hora,
        ae.Accion,
        ae.CampoModificado + ': ' + ISNULL(ae.ValorAnterior, 'NULL') + ' → ' + ISNULL(ae.ValorNuevo, 'NULL') AS Detalle,
        '' AS Profesor,
        ae.Usuario,
        '' AS IpAddress
    FROM AuditoriaEstudiantes ae
    WHERE ae.EstudianteId = @EstudianteId
    
    ORDER BY Fecha DESC, Hora DESC;
END;

--Índices para Mejorar Rendimiento
CREATE INDEX IX_EstudianteMaterias_EstudianteId ON EstudianteMaterias(EstudianteId);
CREATE INDEX IX_EstudianteMaterias_MateriaId ON EstudianteMaterias(MateriaId);

-- Índice para búsquedas por estudiante
CREATE INDEX IX_AuditoriaEstudianteMaterias_EstudianteId ON AuditoriaEstudianteMaterias(EstudianteId);

-- Índice para búsquedas por fecha
CREATE INDEX IX_AuditoriaEstudianteMaterias_FechaHora ON AuditoriaEstudianteMaterias(FechaHora)

--Trigger para Histórico
CREATE OR ALTER TRIGGER tr_EstudianteMaterias_Auditoria
ON EstudianteMaterias
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @IpAddress VARCHAR(50) = NULL;
    
    -- Intentar obtener la IP del cliente desde el contexto de aplicación
    -- (Esto requiere que la aplicación la pase como parte del contexto)
    BEGIN TRY
        SELECT @IpAddress = CONVERT(VARCHAR(50), CONNECTIONPROPERTY('client_net_address'));
    END TRY
    BEGIN CATCH
        SET @IpAddress = 'Desconocida';
    END CATCH
    
    -- Registrar inserciones
    INSERT INTO AuditoriaEstudianteMaterias (EstudianteId, MateriaId, Accion, IpAddress)
    SELECT 
        i.EstudianteId,
        i.MateriaId,
        'INSERT',
        @IpAddress
    FROM inserted i;
    
    -- Registrar eliminaciones
    INSERT INTO AuditoriaEstudianteMaterias (EstudianteId, MateriaId, Accion, IpAddress)
    SELECT 
        d.EstudianteId,
        d.MateriaId,
        'DELETE',
        @IpAddress
    FROM deleted d;
END;

--Trigger Adicional para Actualización de Estudiantes
CREATE OR ALTER TRIGGER tr_Estudiantes_Auditoria
ON Estudiantes
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Auditoría para cambios en el nombre
    IF UPDATE(Nombre)
    BEGIN
        INSERT INTO AuditoriaEstudiantes (EstudianteId, CampoModificado, ValorAnterior, ValorNuevo, Accion)
        SELECT 
            i.EstudianteId,
            'Nombre',
            d.Nombre,
            i.Nombre,
            'UPDATE'
        FROM inserted i
        JOIN deleted d ON i.EstudianteId = d.EstudianteId
        WHERE i.Nombre <> d.Nombre OR (i.Nombre IS NULL AND d.Nombre IS NOT NULL) OR (i.Nombre IS NOT NULL AND d.Nombre IS NULL);
    END
    
    -- Auditoría para cambios en el email
    IF UPDATE(Email)
    BEGIN
        INSERT INTO AuditoriaEstudiantes (EstudianteId, CampoModificado, ValorAnterior, ValorNuevo, Accion)
        SELECT 
            i.EstudianteId,
            'Email',
            d.Email,
            i.Email,
            'UPDATE'
        FROM inserted i
        JOIN deleted d ON i.EstudianteId = d.EstudianteId
        WHERE i.Email <> d.Email OR (i.Email IS NULL AND d.Email IS NOT NULL) OR (i.Email IS NOT NULL AND d.Email IS NULL);
    END
    
    -- Auditoría para cambios en el documento de identidad
    IF UPDATE(DocumentoIdentidad)
    BEGIN
        INSERT INTO AuditoriaEstudiantes (EstudianteId, CampoModificado, ValorAnterior, ValorNuevo, Accion)
        SELECT 
            i.EstudianteId,
            'DocumentoIdentidad',
            d.DocumentoIdentidad,
            i.DocumentoIdentidad,
            'UPDATE'
        FROM inserted i
        JOIN deleted d ON i.EstudianteId = d.EstudianteId
        WHERE i.DocumentoIdentidad <> d.DocumentoIdentidad OR (i.DocumentoIdentidad IS NULL AND d.DocumentoIdentidad IS NOT NULL) OR (i.DocumentoIdentidad IS NOT NULL AND d.DocumentoIdentidad IS NULL);
    END
END;