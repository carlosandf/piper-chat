import { Schema, model } from 'mongoose';

const ChatSchema = new Schema({
  member_one: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  member_two: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

export const Chat = model('Chat', ChatSchema);
