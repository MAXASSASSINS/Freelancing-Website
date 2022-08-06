import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    duration: {
        type: Number,
        required: true,
    },
    gig: {
        type: mongoose.Schema.ObjectId,
        ref: "Gig",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
    },
    deliveryDate: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }


})

export default mongoose.model("Order", orderSchema);