//WISHLIST: Guardar productos en la lista de favoritos del usuario logueado

import express from "express"
import * as wishlistController from "../controllers/wishlist.controller.js"
import { authMiddleware } from "../middlewares/authenticate.js"

const router = express.Router()

// Todas las rutas de wishlist son privadas (requieren estar autenticado)
router.get("/api/wishlist", authMiddleware, wishlistController.getWishlistByUser)
router.post("/api/wishlist/:productId", authMiddleware, wishlistController.addToWishlist)
router.delete("/api/wishlist/:id", authMiddleware, wishlistController.removeFromWishlist)

export default router