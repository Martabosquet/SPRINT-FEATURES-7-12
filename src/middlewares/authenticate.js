import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        return res.status(500).json({ message: "No se encontró la clave secreta del servidor" });
    }

    //Validar si viene el header y si empieza con "bearer"
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Acceso denegado. No se proporcionó un token válido." });
    }

    const token = authHeader.split(' ')[1]; // Extraemos el token del header sin header

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verificamos el token con la clave secreta
        req.user = decoded; // Simulamos guardar el usuario en la req
        next(); // Continuamos al controlador
    } catch (error) {
        return res.status(401).json({ 
            message: "Sesión inválida o expirada",
            error: error.message
        });
    }
};