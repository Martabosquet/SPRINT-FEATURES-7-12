//SERVER SOLO ARRANCA EL SERVIDOR, NO TIENE RUTAS, SOLO SE ENCARGA DE ARRANCAR EL SERVIDOR Y DE GESTIONAR LOS ERRORES 404

import app from './app.js';

const PORT = process.env.PORT || 3000 // coge el puerto del .env y si no coge el 3000

app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: "Error 404: La ruta solicitada no existe",
        data: null
    });
});

app.listen(PORT, () => {
    console.log(`🔐 Auth API corriendo en http://localhost:${PORT}`)
    console.log(`POST /register  |  POST /login  |  POST /logout  |  GET /profile  |  GET /admin`)
});