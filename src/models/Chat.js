import { Schema, model } from 'mongoose';

const ChatSchema = new Schema({
  member_one: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  member_two: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

export const Chat = model('chat', ChatSchema);
