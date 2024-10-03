import { QuestionType } from "../constants/globalConstants";
import { IFile } from "./file.types";
import { IGig } from "./gig.types";
import { IUser } from "./user.types";

export type Option = {
  title: string;
  selected: boolean;
};

export interface IOrderRequirement {
  questionTitle: string;
  questionType: QuestionType;
  answerRequired: boolean;
  multipleOptionSelect: boolean;
  answerText?: string;
  options: Option[];
  files: IFile[];
}

export interface IPackageDetails {
  packageTitle: string;
  packageDescription: string;
  packageDeliveryTime: string;
  revisions: number;
  sourceFile: boolean;
  commercialUse: boolean;
  packagePrice: number;
}

export interface IDelivery {
  _id: string;
  message?: string;
  files: IFile[];
  deliveredAt: Date;
}

export interface IRevision {
  _id: string;
  message?: string;
  files: IFile[];
  requestedAt: Date;
}

export interface IBuyerFeedback {
  communication: number;
  service: number;
  recommend: number;
  comment?: string;
  createdAt: Date;
}

export interface ISellerFeedback {
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IOrder {
  _id: string;
  orderId: string;
  amount: number;
  transferredAmount: number;
  duration: number;
  gig: IGig | string;
  seller: IUser | string;
  buyer: IUser | string;
  status:
    | "Pending"
    | "In Progress"
    | "Completed"
    | "Cancelled"
    | "Delivered"
    | "In Revision";
  createdAt: Date;
  requirements: IOrderRequirement[];
  requirementsSubmitted: boolean;
  requirementsSubmittedAt: Date;
  packageDetails: IPackageDetails;
  paymentDetails: {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };
  image: IFile;
  gigTitle: string;
  deliveries: IDelivery[];
  revisions: IRevision[];
  deliveryDate: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  buyerFeedback?: IBuyerFeedback;
  sellerFeedback?: ISellerFeedback;
  sellerFeedbackSubmitted: boolean;
  buyerFeedbackSubmitted: boolean;
}
