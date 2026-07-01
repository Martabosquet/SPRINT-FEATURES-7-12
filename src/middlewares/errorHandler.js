export const errorHandler = (error, req, res, next) => {
    console.error("❌ Error capturado en el handler:", error.message);

    // Formateo automático de errores de Base de Datos (Prisma)
    if (error.code === 'P2002') {
        error.statusCode = 409;
        error.message = "El registro ya existe (campo duplicado).";
    }

    if (error.code === 'P2025') { // Registro no encontrado en Prisma (para update/delete)
        error.statusCode = 404;
        error.message = "El recurso solicitado no existe.";
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Error interno del servidor";

    res.status(statusCode).json({
        ok: false,
        error: message,
        statusCode,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
};