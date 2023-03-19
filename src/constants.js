import dotenv from 'dotenv';

dotenv.config();

export const IP_SERVER = 'localhost';
export const PORT = process.env.PORT || 3001;
export const MONGO_URI = process.env.MONGO_URI;
export const SECRET_KEY = process.env.SECRET_KEY;
