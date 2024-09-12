import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "./catchAsyncErrors";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import { log } from "console";
import { IUser } from "../types/user.types";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  if (!process.env.JWT_SECRET) {
    return next(new ErrorHandler("JWT_SECRET not defined in env", 500));
  }

  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }

  const user = await User.findById(decodedData.id);

  if (user === null) {
    return next(new ErrorHandler("User not found", 404));
  }
  

  req.user = user;

  next();
});

// export const authorisedRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `Role: ${req.user.role} is not allowed to access this resource`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };
