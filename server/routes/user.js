import express from "express";
import {
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  getMyDetails,
  changePassword,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import "../controllers/authGoogle.js";
import { googleCallback } from "../controllers/authGoogle.js";
import passport from "passport";
import User from "../models/userModel.js";
import { isAuthenticated, authorisedRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

router.get('/me', isAuthenticated, getMyDetails);

router.post("/forgotPassword", forgotPassword);

router.put("/forgotPassword:token", resetPassword);

router.put("/changePassword", isAuthenticated, changePassword);

router.get('/admin/allUsers', isAuthenticated, authorisedRoles('admin'), getAllUsers);

router.get('/user/:id', getUser);

router.put("/user/update/:id", updateUser);

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