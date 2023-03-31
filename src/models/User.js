import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
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
  },
  id: Schema.Types.ObjectId
});

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  }
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, saltRounds);

    user.password = hash;
  } catch (error) {
    console.error(error);
    next();
  }
});

export const User = model('user', UserSchema);
