import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
// import { stripe } from "../utils/stripe.js";
import Stripe from "stripe";

// Register our user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  //   width: 150,
  //   crop: "scale",
  // });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    // avatar: {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
    // },
  });

  sendToken(user, 201, res);
});

// Login our User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given both email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  // const temp = await bcrypt.hash('3', 10);
  // 

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
});

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found"), 404);
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/password/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordURL} \n\n if you have not requested this email then, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Freelance Website by Mohd. Shadab",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("error.message", 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password is not matching with confirm password", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get my details
export const getMyDetails = catchAsyncErrors(async (req, res, next) => {
  const userId = await req.user.id;
  // const userId = "62c4882c0648ff3db722b3da";
  const user = await User.findById(userId);
  // const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Successfully fetched your details",
    user,
  });
});

// Change password
export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect"), 400);
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("password does not match with confirm password"),
      400
    );
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Get All Users -- admin
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: "Successfully fetched all users",
    users,
  });
});

// Get single user -- admin
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    message: "Successfully fetched user",
    user,
  });
});

// Update user data
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`)
    );
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User details updated sucessfully",
    user,
  });
});

export const widthdrawl = catchAsyncErrors(async (req, res, next) => {
  // 
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  if (!req.user.stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "standard",
      email: req.user.email,
      business_type: "individual",
      individual: {
        email: req.user.email,
      },
      country: "IN",
      default_currency: "inr",
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3000",
      return_url: "http://localhost:3000/balance/detail",
      type: "account_onboarding",
    });

    res.status(200).json({
      success: true,
      message: "Successfully fetched account link",
      // redirectUrl: accountLink.url,
      redirectUrl: process.env.accountLink,
    });
  } else {
    const accountId = req.user.stripeAccountId;
    const accountDetails = await stripe.accounts.retrieve(accountId);

    // const charge = await stripe.charges.create({
    //   amount: 10*100,
    //   currency: "inr",
    //   source: accountId,
    // });

    // const charge = await stripe.charges.create({
    //   customer: 'acct_1MtFFeSAmwdBmm1f',
    //   source: accountId,
    //   amount: 1 * 100,
    //   currency: "inr",
    //   // application_fee: 1 * 100,
    //   // destination: accountId,
    // });

    // await stripe.payouts.create(
    //   {
    //     amount: amount,
    //     currency: currency,
    //   },
    //   {
    //     stripeAccount: accountId,
    //   }
    // );

    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     number: '4242424242424242',
    //     exp_month: 8,
    //     exp_year: 2024,
    //     cvc: '314',
    //   },
    // });

    // const paymentIntent = await stripe.paymentIntents.create(
    //   {
    //     amount: 1000,
    //     currency: "usd",
    //     automatic_payment_methods: {
    //       enabled: true,
    //     },
    //     payment_method: 'card',
    //   },
    //   {
    //     stripeAccount: accountId,
    //   }
    // );


    
    

    res.status(200).json({
      success: true,
      message: "You have already created your account",
      accountDetails,
      // paymentIntent : paymentIntent ? paymentIntent : "",
    });
  }
});
