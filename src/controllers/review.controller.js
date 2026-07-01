import * as reviewService from "../services/review.service.js"

export const createReview = async (req, res, next) => {
    try {
        const { productId } = req.params

        if (!productId) {
            return res.status(400).json({
                ok: false,
                error: "El productId es obligatorio en la URL",
            })
        }

        const reviewData = {
            ...req.body,
            userId: String(req.user.id),
            productId,
        }

        const review = await reviewService.createReview(reviewData)
        res.status(201).json({
            ok: true,
            data: review,
        })
    } catch (error) {
        next(error);
    }
}

export const getReviewsByProduct = async (req, res, next) => {
    try {
        const { productId } = req.params
        const reviews = await reviewService.getReviewsByProduct(productId)
        res.json({
            ok: true,
            data: reviews,
        })
    } catch (error) {
        next(error);
    }
}

export const updateReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id

        // 1. Obtener la review actual para verificar la propiedad
        const existingReview = await reviewService.getReviewById(reviewId)
        if (!existingReview) {
            return res.status(404).json({
                ok: false,
                error: "Review no encontrada",
            })
        }

        // 2. Comprobar si el usuario es el creador de la review o un admin
        if (existingReview.userId !== String(req.user.id) && req.user.role !== "admin") {
            return res.status(403).json({
                ok: false,
                error: "Acceso denegado. No tienes permisos para actualizar esta review.",
            })
        }

        // 3. Proceder con la actualización
        const review = await reviewService.updateReview(reviewId, req.body)

        res.json({
            ok: true,
            data: review,
        })
    } catch (error) {
        next(error);
    }
}

export const deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id

        // 1. Obtener la review actual para verificar la propiedad
        const existingReview = await reviewService.getReviewById(reviewId)
        if (!existingReview) {
            return res.status(404).json({
                ok: false,
                error: "Review no encontrada",
            })
        }

        // 2. Comprobar si el usuario es el creador de la review o un admin
        if (existingReview.userId !== String(req.user.id) && req.user.role !== "admin") {
            return res.status(403).json({
                ok: false,
                error: "Acceso denegado. No tienes permisos para eliminar esta review.",
            })
        }

        // 3. Proceder a eliminar
        await reviewService.deleteReview(reviewId)

        res.json({
            ok: true,
            message: "Review eliminada",
        })
    } catch (error) {
        next(error);
    }
}