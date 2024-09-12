import mongoose from "mongoose";
import { IGig } from "../types/gig.types";

const gigSchema = new mongoose.Schema<IGig>({
  title: {
    type: String,
    // required: [true, "Please enter you gig title"],
  },
  category: {
    type: String,
    // required: [true, "Please enter you gig category"],
  },
  subCategory: {
    type: String,
    // required: [true, "Please enter you gig sub category"],
  },
  searchTags: [String],
  pricing: [
    {
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
        default: "1 day",
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
  ],
  description: {
    type: String,
    // required: [true, "Please enter the description of your gig"]
  },
  images: [
    {
      publicId: {
        type: String,
        required: [true, "Please provide public id for your image"],
      },
      url: {
        type: String,
        required: [true, "Please provide image url"],
      },
      blurhash: {
        type: String,
        required: [true, "Please provide blur hash"],
      },
    },
  ],
  video: {
    publicId: {
      type: String,
    },
    url: {
      type: String,
    },
    blurhash: {
      type: String,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  ratings: {
    type: Number,
    default: 0,
  },

  numOfRatings: {
    type: Number,
    default: 0,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      country: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
        default: "",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  active: {
    required: true,
    type: Boolean,
    default: false,
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
      options: [
        {
          type: String,
        },
      ],
    },
  ],
});

gigSchema.index({ title: "text", searchTags: "text" });

export default mongoose.model("Gig", gigSchema);
