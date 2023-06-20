import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
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
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Incomplete",
  },
  deliveryDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  requirements: [
    {
      questionTitle: {
        type: String,
        required: [true, "Please enter the question"],
      },
      questionType: {
        type: String,
        enum: ["Free Text", "Multiple Choice"],
        default: "Free Text",
      },
      answerRequired: {
        type: Boolean,
        default: false,
      },
      multipleOptionSelect: {
        type: Boolean,
        default: false,
      },
      answerText: String,
      options: [
        {
          title: {
            type: String,
            required: true,
          },
          selected: {
            type: Boolean,
            default: false,
            required: true,
          },
        },
      ],
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
        },
      ],
    },
  ],
  packageDetails: {
    packageTitle: {
      type: String,
      required: [true, "Please enter the title of your package"],
    },
    packageDescription: {
      type: String,
      required: [true, "Please enter the description of your package"],
    },
    packageDeliveryTime: {
      type: String,
      required: [true, "Please enter the delivery time of your package"],
      default: 1,
    },
    revisions: {
      type: Number,
      required: [true, "Please enter the delivery time of your package"],
      default: 1,
    },
    sourceFile: {
      type: Boolean,
      default: false,
      required: [
        true,
        "Please tell whether to include source file or not for your package",
      ],
    },
    commercialUse: {
      type: Boolean,
      default: false,
      required: [
        true,
        "Please tell whether to include commercial use  or not for your package",
      ],
    },
    packagePrice: {
      type: Number,
      required: [true, "Please enter the price of your package"],
      default: 0,
    },
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ["Paypal", "Stripe"],
      default: "Paypal",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Not Paid"],
      default: "Not Paid",
    },
    paymentId: String,
    paymentToken: String,
    payerId: String,
    paymentDate: Date,
  },
  image: {
    imgPublicId: {
      type: String,
      required: [true, "Please provide public id for your image"],
    },
    imgUrl: {
      type: String,
      required: [true, "Please provide image url"],
    },
  },
  gigTitle: {
    type: String,
    required: [true, "Please enter the title of your gig"],
  },
});

export default mongoose.model("Order", orderSchema);
