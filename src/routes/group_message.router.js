import { Router } from 'express';
import multipart from 'connect-multiparty';
import { GroupMessageControllers } from '../controllers/index.js';
import { mdAuth } from '../middlewares/index.js';

const mdUpload = multipart({ uploadDir: './src/uploads/images' });

const router = Router();

router.post(
  '/group/messages',
  [mdAuth.asureAuth],
  GroupMessageControllers.sendText
);

export const groupMessageRouter = router;
