import * as wishlistService from "../services/wishlist.service.js"

export const addToWishlist = async (req, res, next) => {
    try {
        // userId extraído de forma segura del token JWT (no del body)
        const userId = String(req.user.id)
        // productId extraído de los parámetros de la URL
        const { productId } = req.params

        if (!productId) {
            return res.status(400).json({
                ok: false,
                error: "El id del producto es obligatorio",
            })
        }

        const wishlistItem = await wishlistService.addToWishlist(userId, productId)
        res.status(201).json({
            ok: true,
            data: wishlistItem,
        })
    } catch (error) {
        next(error);
    }
}

export const getWishlistByUser = async (req, res, next) => {
    try {
        // userId extraído de forma segura del token JWT
        const userId = String(req.user.id)

        const wishlistItems = await wishlistService.getWishlistByUser(userId)
        res.json({
            ok: true,
            data: wishlistItems,
        })
    } catch (error) {
        next(error);
    }
}

export const removeFromWishlist = async (req, res, next) => {
    try {
        const wishlistItem = await wishlistService.removeFromWishlist(req.params.id)

        if (!wishlistItem) {
            return res.status(404).json({
                ok: false,
                error: "Elemento no encontrado",
            })
        }
        res.json({
            ok: true,
            message: "Elemento eliminado de la wishlist",
        })
    } catch (error) {
        next(error);
    }
}