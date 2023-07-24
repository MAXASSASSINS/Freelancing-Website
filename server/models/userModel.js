import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
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
      required: true,
    },
    url: {
      type: String,
      required: true,
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

  country: {
    type: String,
    required: true,
  },

  role: {
    type: String,
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
      type: String,
      required: true,
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

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
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

export default mongoose.model("User", userSchema);
