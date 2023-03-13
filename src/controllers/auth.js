import { User } from '../models/index.js';

const register = (req, res) => {
  res.status(200).send({ message: 'Todo OK' });
};

export const AuthController = {
  register
};
