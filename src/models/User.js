import { Schema, model } from 'mongoose';

const UserSchema = Schema({
  email: {
    type: String,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  password: {
    type: String
  },
  avatar: {
    type: String
  }
});

export const User = model('user', UserSchema);
