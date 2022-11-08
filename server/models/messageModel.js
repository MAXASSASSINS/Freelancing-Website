import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        message: {
            text: {
                type: String,
                required: true,
            },
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        messageType: {
            type: String,
            default: "text",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);



export default mongoose.model("Message", messageSchema);
