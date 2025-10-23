import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './user_model.js';

export interface IStory extends Document {
  _id: Schema.Types.ObjectId;
  topic: string;
  originalStory: string;
  translatedStory?: string;
  language?: string;
  user: IUser['_id'];
  createdAt: Date;
}

const storySchema = new mongoose.Schema<IStory>({
  topic: {
    type: String,
    required: true,
  },
  originalStory: {
    type: String,
    required: true,
  },
  translatedStory: {
    type: String,
  },
  language: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Story: Model<IStory> = mongoose.model<IStory>('Story', storySchema);

export default Story;
