import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['TEXT', 'IMAGE']
    }
  },
  {
    timestamps: true
  }
);

export const Message = model('Chat_message', MessageSchema);
