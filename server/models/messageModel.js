import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
      },
    },
    files: [
      {
        publicId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        blurhash: {
          type: String,
        },
        height: {
          type: Number,
        },
        width: {
          type: Number,
        },
      },
    ],
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // messageType: {
    //     type: String,
    //     default: "text",
    //     required: true,
    // },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    markAsRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
