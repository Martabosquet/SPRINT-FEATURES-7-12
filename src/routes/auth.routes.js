//AUTENTICACIÓN: GESTIONA REGISTRO, LOGIN, JWT, MIDDLEWARE AUTH Y ROLES DE USUARIO

import express from "express"
import { authController } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/authenticate.js"
import { requireRole } from "../middlewares/requireRole.js"

const router = express.Router()

// Rutas públicas
router.post('/api/auth/register', authController.register);
router.post("/api/auth/login", authController.login);
router.post("/api/auth/logout", authController.logout); //es pública porque si metemos el authMiddleware y un token q no existe o está caducado podríamos entrar en un bucle sin poder cerrar sesión

// Ruta protegida (accedemos al perfil de usuario con el token)
router.get("/api/me", authMiddleware, authController.getProfile);

// Ruta restringida por rol (Panel de admin)
router.get(
  "/api/admin",
  authMiddleware,
  requireRole("admin"),
  authController.getAdmin,
);

export default router