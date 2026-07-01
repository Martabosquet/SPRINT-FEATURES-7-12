// Captura cualquier petición a una url inexistente

export const notFound = (req, res) => {
    res.status(404).json({
        ok: false,
        error: `Ruta no encontrada: ${req.method} ${req.url}`,
    })
}

//Llamar a next() después es una mala práctica que podría desencadenar la ejecución del siguiente middleware
// (habitualmente el manejador de errores global), provocando errores de tipo "Cannot set headers after they are
// sent to the client".