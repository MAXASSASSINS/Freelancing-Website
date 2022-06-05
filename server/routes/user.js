import express from "express";
import {
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resetPassword,
} from "../controllers/userController.js";
import "../controllers/authGoogle.js";
import { googleCallback } from "../controllers/authGoogle.js";
import passport from "passport";
import User from "../models/userModel.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "home route",
  });
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

router.post("/forgotPassword", forgotPassword);

router.put("/forgotPassword:token", resetPassword);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);


export default router;