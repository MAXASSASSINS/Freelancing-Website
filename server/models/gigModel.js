import mongoose from "mongoose";
const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter you gig title"],
    },
    category: {
        type: String,
        required: [true, "Please enter you gig category"],
    },
    searchTags: [
        {
            type: String,
            required: [true, "Please enter at least 1 tag"],
        },
    ],
    pricing: [
        {
            packageTitle: {
                type: String,
                required: [true, "Please enter the title of your package"]
            },
            packageDescription: {
                type: String,
                required: [true, "Please enter the description of your package"]
            },
            packageDeliveryTime: {
                type: Number,
                required: [true, "Please enter the delivery time of your package"],
                default: 1
            },
            revisions: {
                type: Number,
                required: [true, "Please enter the delivery time of your package"],
                default: 1
            },
            sourceFile: {
                type: Boolean,
                default: false,
                required: [true, "Please tell whether to include source file or not for your package"]
            },
            commercialUse: {
                type: Boolean,
                default: false,
                required: [true, "Please tell whether to include commercial use  or not for your package"]
            },
            packagePrice: {
                type: Number,
                required: [true, "Please enter the price of your package"],
                default: 0
            }

        }
    ],
    description: {
        type: String,
        required: [true, "Please enter the description of your gig"]
    },
    images: [
        {
            imgPublicId: {
                type: String,
                required: [true, "Please provide public id for your image"]
            },
            imgUrl: {
                type: String,
                required: [true, "Please provide image url"]
            }
        }
    ],
    video: {
        videoPublicId: String,
        videoUrl: String
    },
    ratings: {
        type: Number,
        default: 0,
    },

    numOfRatings: {
        type: Number,
        default: 0
    },

    numOfReviews: {
        type: Number,
        default: 0
    },
    
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
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
                required:true,
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
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
});
export default mongoose.model('Gig', gigSchema);
