import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
  name: String,
  image: String,
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

export const Group = model('Group', GroupSchema);
