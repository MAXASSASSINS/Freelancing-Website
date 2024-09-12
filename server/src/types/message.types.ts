import { Document, Schema } from 'mongoose';
import { IFile } from './file.types';

export interface IMessage extends Document {
  message: {
    text?: string;
  };
  files?: IFile[];
  users?: Schema.Types.ObjectId[]; // Adjust type if users is an array of user objects
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  orderId?: Schema.Types.ObjectId;
  markAsRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}