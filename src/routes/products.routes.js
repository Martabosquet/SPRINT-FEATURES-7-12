//PUNTO 3: ESTA RUTA SE ENCARGA DE GESTIONAR LOS PRODUCTOS, ES DECIR, DE OBTENER LOS PRODUCTOS, CREAR NUEVOS PRODUCTOS, ACTUALIZAR PRODUCTOS EXISTENTES Y ELIMINAR PRODUCTOS

import express from "express"
import products from "../data/products.js"

const router = express.Router()

//Ruta para obtener todos los productos

router.get("/products", (req, res) => {
    res.json({
        ok: true, message: "Productos obtenidos correctamente", //mensaje de éxito
        count: products.length, // la cantidad de productos
        data: products //aquí irían los productos obtenidos de la base de datos
    })
})

//Ruta para obtener por id un producto específico

router.get("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id) //obtenemos el id del producto a través de los parámetros de la ruta
    const product = products.find((p) => p.id === productId) //buscamos el producto en el array de productos

    if(!product) {
        return res.status(404).json({
            ok: false, 
            message: `Producto con id: ${productId} no encontrado`, //mensaje de error si el producto no se encuentra
        })
    }
    res.json({
        ok: true,
        data: product,
        message: `Producto con id: ${productId} obtenido correctamente` //mensaje de éxito si el producto se encuentra
    })
})