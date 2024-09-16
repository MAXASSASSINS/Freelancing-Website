import mongoose, {Document} from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {IUser, IPhone } from "../types/user.types";


const phoneSchema = new mongoose.Schema<IPhone>({
  code: {
    type: String,
    required: function (this: IPhone) {
      return !!(this as IPhone).number;
    }
  },
  number: {
    type: String,
    required: function (this: IPhone) {
      return !!(this as IPhone).code;
    },
    minlength: [10, "Phone number should have at least 10 characters"],
    maxlength: [15, "Phone number cannot exceed 15 characters"]
  },
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [50, "name cannot exceed 50 characters"],
    minlength: [4, "name should have at least 4 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password should be more than 8 characters"],
    select: false,
  },

  avatar: {
    public_id: {
      type: String,
      default: "myAvatar",
    },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/dyod45bn8/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1691056205/kisspng-computer-icons-user-avatar-woman-avatar-5b0c5b2f6ecaa1.2446433615275364314538_zsiim6.jpg",
    },
  },

  phone: phoneSchema,

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
        required: true,
      },
    },
  ],

  country: {
    type: String,
    required: true,
    default: "India",
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  tagline: {
    type: String,
  },

  description: {
    type: String,
  },

  languages: [
    {
      name: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        enum: ["basic", "conversational", "fluent", "native/bilingual"],
        required: true,
        default: "beginner",
      },
    },
  ],

  skills: [
    {
      name: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advance", "expert"],
        default: "beginner",
      },
    },
  ],

  education: [
    {
      country: {
        type: String,
        required: true,
      },
      collegeName: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      major: {
        type: String,
        required: true,
      },
      yearOfGraduation: {
        type: String,
        required: true,
        default: new Date().getFullYear,
      },
    },
  ],

  certificates: [
    {
      name: {
        type: String,
        required: true,
      },
      certifiedFrom: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
        default: new Date().getFullYear,
      },
    },
  ],

  userSince: {
    type: Date,
    default: Date.now,
  },

  lastSeen: {
    type: Date,
    default: Date.now,
  },

  balance: {
    type: Number,
    default: 0,
  },

  stripeAccountId: {
    type: String,
    default: "",
  },

  withdrawEligibility: {
    type: Boolean,
    default: false,
    required: true
  },

  razorPayAccountDetails: {
    accountId: {
      type: String,
      default: "",
    },
    stakeholderId: {
      type: String,
      default: "",
    },
    productId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "new",
        "pending",
        "activated",
        "under_review",
        "needs_clarification",
        "suspended",
      ],
      default: "new",
    },
    accountHolderName: {
      type: String,
      default: "",
    }
  },

  lastDelivery: {
    type: Date,
  },

  favouriteGigs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,

  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT Secret not found");
  }
  return jwt.sign({ id: this._id }, secret, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
  return resetToken;
};

userSchema.methods.getEmailVerifyToken = function () {
  // Generating token
  const emailVerifyToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to user schema
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(emailVerifyToken)
    .digest("hex");

  this.emailVerificationExpire = Date.now() + 2 * 24 * 60 * 60 * 1000;

  return emailVerifyToken;
};

const User = mongoose.model<IUser & Document>("User", userSchema);

export default User;
