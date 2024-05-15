import { Schema, model } from 'mongoose';

const GroupMessageSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    type: {
      type: String,
      enum: ['TEXT', 'IMAGE']
    }
  },
  {
    timestamps: true
  }
);

export const GroupMessage = model('GroupMessage', GroupMessageSchema);
