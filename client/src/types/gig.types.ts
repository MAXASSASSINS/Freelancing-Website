import { IUser } from "./user.types";
import { FREE_TEXT, MULTIPLE_CHOICE, QuestionType } from "./../constants/globalConstants";

export interface IImage {
  _id: string;
  publicId: string;
  url: string;
  blurhash: string;
}

export interface IVideo {
  _id: string;
  publicId?: string;
  url?: string;
  blurhash?: string;
  name?: string;
  type?: string;
}

export interface IReview {
  user: IUser | string;
  name: string;
  avatar: {
    public_id: string;
    url: string;
  };
  country: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface IPricing {
  packageTitle: string;
  packageDescription: string;
  packageDeliveryTime: string;
  revisions: number;
  sourceFile: boolean;
  commercialUse: boolean;
  packagePrice: number;
}

export interface IGigRequirement {
  questionTitle: string;
  questionType: QuestionType;
  answerRequired: boolean;
  multipleOptionSelect: boolean;
  options: string[];
}

export interface IGig {
  _id: string;
  title?: string;
  category?: string;
  subCategory?: string;
  searchTags: string[];
  pricing: IPricing[];
  description?: string;
  images: IImage[];
  video?: IVideo;
  ratings: number;
  numOfRatings: number;
  numOfReviews: number;
  reviews: IReview[];
  createdAt?: Date;
  user: IUser | string;
  active?: boolean;
  requirements: IGigRequirement[];
}
