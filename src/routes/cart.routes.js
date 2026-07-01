//RUTAS DEL CARRITO: Gestión del carrito de compra del usuario logueado

import express from "express"
import { authMiddleware } from "../middlewares/authenticate.js"
import {
    getCartController,
    addItemController,
    removeItemController,
    decreaseItemQuantityController,
    checkoutController,
    getOrdersController,
    getOrderByIdController,
} from "../controllers/cart.controller.js"

const router = express.Router()

// Todas las rutas del carrito son privadas (requieren estar autenticado)
router.get("/api/cart", authMiddleware, getCartController)
router.post("/api/cart/items", authMiddleware, addItemController) //y si le sumo al mismo, se van acumulando las cantidades de ese producto en el carrito
router.delete("/api/cart/items/:itemId", authMiddleware, removeItemController)
router.patch("/api/cart/items/:itemId", authMiddleware, decreaseItemQuantityController) //lo he creado para poder restar quantity de un item del carrito y si llega a 0, se elimina el item del carrito
router.post("/api/cart/checkout", authMiddleware, checkoutController)

// Historial de pedidos del usuario
router.get("/api/orders", authMiddleware, getOrdersController)
router.get("/api/orders/:orderId", authMiddleware, getOrderByIdController)

export default router