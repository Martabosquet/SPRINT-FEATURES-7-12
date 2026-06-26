import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        return res.status(500).json({ message: "No se encontró la clave secreta del servidor" });
    }

    let token = null;

    // 1. Intentamos obtener el token de las cookies (Recomendado para React/Web)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 2. Si no está en cookies, intentamos de la cabecera Authorization (Fallback para Postman/Móvil)
    else {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(403).json({ message: "Acceso denegado. No se proporcionó un token válido." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verificamos el token con la clave secreta
        req.user = { ...decoded, id: String(decoded.id) }; // Guardamos el usuario decodificado en la req y normalizamos el id a String
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: "Sesión inválida o expirada",
            error: error.message
        });
    }
};