import express from "express"
import { authController } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/authenticate.js"
import { requireRole } from "../middlewares/requireRole.js"

const router = express.Router()

// Ruta pública
router.post('/auth/register', authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

// Rutas protegidas
router.get("/users/profile", authMiddleware, authController.getProfile);

// Ruta restringida por rol
router.get(
  "/admin",
  authMiddleware,
  requireRole("admin"),
  authController.getAdmin,
)

export default router