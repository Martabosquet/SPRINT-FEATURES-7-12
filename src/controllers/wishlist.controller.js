import * as wishlistService from "../services/wishlist.service.js"

export const addToWishlist = async (req, res) => {
    try {
        // userId extraído de forma segura del token JWT (no del body)
        const userId = String(req.user.id)
        // productId extraído de los parámetros de la URL (/api/wishlist/:productId)
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
        res.status(400).json({
            ok: false,
            error: error.message,
        })
    }
}

export const getWishlistByUser = async (req, res) => {
    try {
        // userId extraído de forma segura del token JWT
        const userId = String(req.user.id)

        const wishlistItems = await wishlistService.getWishlistByUser(userId)
        res.json({
            ok: true,
            data: wishlistItems,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message,
        })
    }
}

export const removeFromWishlist = async (req, res) => {
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
        res.status(500).json({
            ok: false,
            error: error.message,
        })
    }
}