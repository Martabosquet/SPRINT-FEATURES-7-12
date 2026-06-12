//PUNTO 3: ESTA RUTA SE ENCARGA DE GESTIONAR LOS PRODUCTOS, ES DECIR, DE OBTENER LOS PRODUCTOS, CREAR NUEVOS PRODUCTOS, ACTUALIZAR PRODUCTOS EXISTENTES Y ELIMINAR PRODUCTOS

import express from "express"
import { requireRole } from "../middlewares/requireRole.js"
import { authMiddleware } from "../middlewares/authenticate.js"
import { productsController } from "../controllers/products.controller.js"

const router = express.Router()

router.get("/api/products", productsController.getProducts) //http://localhost:3000/api/products
router.get("/api/products/:id", productsController.getProductById) //http://localhost:3000/api/products/1
router.post("/api/products", authMiddleware, requireRole("admin"), productsController.createProduct) //http://localhost:3000/api/products
router.put("/api/products/:id", authMiddleware, requireRole("admin"), productsController.updateProduct) //http://localhost:3000/api/products/5
router.delete("/api/products/:id", authMiddleware, requireRole("admin"), productsController.deleteProduct)  //http://localhost:3000/api/products/3

export default router