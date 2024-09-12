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
  updateFavouriteList,
  withdrawl,
  addAccount,
  getProductConfig,
  getAccount,
  updateAccount,
  updateAccountStatus,
  resetPasswordForm,
  verifyEmail,
} from "../controllers/userController.js";
import "../controllers/authGoogle.js";
import { googleCallback } from "../controllers/authGoogle.js";
import passport from "passport";
import User from "../models/userModel.js";
import { isAuthenticated, authorisedRoles } from "../middleware/auth.js";
import { verifyCode, verifyNumber } from "../utils/twilio.js";
import { sendSendGridEmail } from "../utils/sendEmail.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

router.get("/me", isAuthenticated, getMyDetails);

// send email to user for password reset
router.post("/forgotPassword", forgotPassword);

// reset password
router.post("/forgotPassword/:token", resetPassword);

// show reset password form
router.get('/forgotPassword/:token', resetPasswordForm);

router.put("/changePassword", isAuthenticated, changePassword);

router.post("/withdrawl", isAuthenticated, withdrawl);

router.post("/user/favourite/gig/:id", isAuthenticated, updateFavouriteList);

router.get(
  "/admin/allUsers",
  isAuthenticated,
  authorisedRoles("admin"),
  getAllUsers
);

router.get("/user/:id", getUser);

router.put("/user/update", isAuthenticated, updateUser);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

router.post("/verify/number", isAuthenticated, verifyNumber);
router.post("/verify/by/call", isAuthenticated, verifyNumber);
router.post("/verify/code", isAuthenticated, verifyCode);

router.post("/add/account", isAuthenticated, addAccount);
router.get("/get/account", isAuthenticated, getAccount);
router.put("/update/account", isAuthenticated, updateAccount);
router.get("/get/product/config", isAuthenticated, getProductConfig);
router.post("/update/account/status", updateAccountStatus);

router.post(
  "/test/email",
  catchAsyncErrors(async (req, res, next) => {
    const { email, subject, templateId, data, text } = req.body;
    await sendSendGridEmail({to:email, subject, templateId, data, text});
    res.status(200).json({ success: true });
  })
);

router.get('/test', (req, res) => {
  // res.send('Hello World!')
  res.render('error', {
    error: 'Page not found'
  })
})

router.get('/verifyEmail/:token/:userId', verifyEmail);

export default router;
