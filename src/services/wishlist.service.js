import { Wishlist } from "../models/wishlist.model.js"
import prisma from "../config/prismaClient.js"

export const addToWishlist = async (userId, productId) => {
    //Verificar que el producto existe en Supabase
    const productExists = await prisma.product.findUnique({
        where: { id: productId }
    })

    if (!productExists) {
        throw new Error("El producto no existe")
    }

    //Si existe, guardarlo en la wishlist de MongoDB
    const wishlist = new Wishlist({ userId, productId })
    return await wishlist.save()
}

export const getWishlistByUser = async (userId) => {
    return await Wishlist.find({ userId })
}

export const removeFromWishlist = async (id) => {
    return await Wishlist.findByIdAndDelete(id)
}

//Funciones puras para testeo

export const addMovieToWishlist = (list, productId) => {
    if (list.includes(productId)) {  // comprobamos que el producto existe dentro de la lista para evitar duplicados
        return list
    }

    return [...list, productId] // si no está, creamos nuevo array clonando la lista y añadiendo el nuevo producto
}

export const removeMovieFromWishlist = (list, productId) => {
    return list.filter((id) => id !== productId) // Elimina una película de la lista
}

export const isMovieInWishlist = (list, productId) => {
    return list.includes(productId) // Comprueba si una película está en la lista, devuelve true o false
}