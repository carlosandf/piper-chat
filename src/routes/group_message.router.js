import { Router } from 'express';
import multipart from 'connect-multiparty';
import { GroupMessageControllers } from '../controllers/index.js';
import { mdAuth } from '../middlewares/index.js';

const mdUpload = multipart({ uploadDir: './src/uploads/images' });

const router = Router();

export const groupMessageRouter = router;
