// Se registra al final de app.js (después de las rutas)
// Recibe errores propagados con next(error) desde cualquier controller

export const errorHandler = (error, req, res, next) => {
    console.error("Error:", error.message)

    res.status(500).json({
        ok: false,
        error: "Internal server error",
    })
}