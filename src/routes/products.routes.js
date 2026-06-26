//PRODUCTOS: Crear productos, leer productos, actualizar productos y eliminar productos

import express from "express"
import { requireRole } from "../middlewares/requireRole.js"
import { authMiddleware } from "../middlewares/authenticate.js"
import { validateProduct } from "../middlewares/validateProduct.js"
import { productsController } from "../controllers/products.controller.js"

const router = express.Router()

router.get("/api/products", productsController.getProducts)
router.get("/api/products/:id", productsController.getProductById)
router.post("/api/products", authMiddleware, requireRole("admin"), validateProduct, productsController.createProduct)
router.put("/api/products/:id", authMiddleware, requireRole("admin"), productsController.updateProduct)
router.delete("/api/products/:id", authMiddleware, requireRole("admin"), productsController.deleteProduct)

export default router