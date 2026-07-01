import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,  //aunque ponga 10, sé que en la realidad comercial (y normalmente en el código) se suele puntuar de 1 a 5
    },
    comment: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    fechaDeVisualizacion: {
        type: String,
    },
})

export const Review = mongoose.model("Review", reviewSchema)