import * as reviewService from "../services/review.service.js"

export const createReview = async (req, res) => {
    try {
        // Enlazar de forma segura el userId extraído del token del usuario logueado
        const reviewData = {
            ...req.body,
            userId: String(req.user.id)
        }
        
        const review = await reviewService.createReview(reviewData)
        res.status(201).json({
            ok: true,
            data: review,
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: error.message,
        })
    }
}

export const getReviewsByMovie = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewsByMovie(req.params.movieId)
        res.json({
            ok: true,
            data: reviews,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message,
        })
    }
}

export const updateReview = async (req, res) => {
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
        res.status(400).json({
            ok: false,
            error: error.message,
        })
    }
}

export const deleteReview = async (req, res) => {
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
        res.status(500).json({
            ok: false,
            error: error.message,
        })
    }
}