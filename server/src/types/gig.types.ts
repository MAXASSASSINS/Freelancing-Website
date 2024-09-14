import { Document, Schema } from 'mongoose';

export interface IImage {
  publicId: string;
  url: string;
  blurhash: string;
}

export interface IVideo {
  publicId?: string;
  url?: string;
  blurhash?: string;
  name?: string;
  type?: string;
}

export interface IReview {
  user: Schema.Types.ObjectId;
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
  questionType?: 'Free Text' | 'Multiple Choice';
  answerRequired?: boolean;
  multipleOptionSelect?: boolean;
  options?: string[];
}

export interface IGig extends Document {
  title?: string;
  category?: string;
  subCategory?: string;
  searchTags?: string[];
  pricing?: IPricing[];
  description?: string;
  images?: IImage[];
  video?: IVideo;
  ratings?: number;
  numOfRatings?: number;
  numOfReviews?: number;
  reviews?: IReview[];
  createdAt?: Date;
  user: Schema.Types.ObjectId;
  active?: boolean;
  requirements?: IGigRequirement[];
}
