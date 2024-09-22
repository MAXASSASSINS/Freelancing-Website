import { Document, Types, PopulatedDoc } from "mongoose";
import { IGig } from "./gig.types";

export interface IPhone {
  code?: string;
  number?: string;
}

export interface IAvatar {
  public_id: string;
  url: string;
}

export interface ILanguage {
  name: string;
  level: "basic" | "conversational" | "fluent" | "native/bilingual";
}

export interface IReview {
  user: PopulatedDoc<IUser & Document>;
  name: string;
  avatar: IAvatar;
  country: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface ISkill {
  name: string;
  level: "beginner" | "intermediate" | "advance" | "expert";
}

export interface IEducation {
  country: string;
  collegeName: string;
  degree: string;
  major: string;
  yearOfGraduation: string;
}

export interface ICertificate {
  name: string;
  certifiedFrom: string;
  year: string;
}

export interface IRazorPayAccountDetails {
  accountId: string;
  stakeholderId: string;
  productId: string;
  status:
    | "new"
    | "pending"
    | "activated"
    | "under_review"
    | "needs_clarification"
    | "suspended";
  accountHolderName: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: IAvatar;
  phone?: IPhone;
  ratings: number;
  numOfRatings: number;
  numOfReviews: number;
  reviews: IReview[];
  country: string;
  role: "user" | "admin";
  tagline?: string;
  description?: string;
  languages: ILanguage[];
  skills: ISkill[];
  education: IEducation[];
  certificates: ICertificate[];
  userSince: Date;
  lastSeen: Date;
  balance: number;
  stripeAccountId: string;
  withdrawEligibility: boolean;
  razorPayAccountDetails: IRazorPayAccountDetails;
  lastDelivery?: Date;
  favouriteGigs: PopulatedDoc<IGig & Document>[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  isEmailVerified: boolean;

  getJWTToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
  getEmailVerifyToken(): string;
}
