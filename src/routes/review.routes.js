//REVIEWS: Crear reviews, obtener reviews, actualizar review y borrar review

import express from "express"
import * as reviewController from "../controllers/review.controller.js"
import { authMiddleware } from "../middlewares/authenticate.js"
import { requireRole } from "../middlewares/requireRole.js"

const router = express.Router()

//Ruta pública
router.get("/reviews/movie/:movieId", reviewController.getReviewsByMovie)

// Rutas privadas con autenticación (Solo administradores pueden gestionar las reseñas)
router.post("/reviews", authMiddleware, requireRole("admin"), reviewController.createReview)
router.put("/reviews/:id", authMiddleware, requireRole("admin"), reviewController.updateReview)
router.delete("/reviews/:id", authMiddleware, requireRole("admin"), reviewController.deleteReview)

export default router