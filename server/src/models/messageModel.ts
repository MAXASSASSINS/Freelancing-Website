import mongoose from "mongoose";
import { IMessage } from "../types/message.types";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    message: {
      text: {
        type: String,
      },
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
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
    markAsRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessage>("Message", messageSchema);
