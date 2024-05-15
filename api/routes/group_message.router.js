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

router.post(
  '/group/messages/image',
  [mdAuth.asureAuth, mdUpload],
  GroupMessageControllers.sendImage
);

router.get(
  '/group/messages/:group_id',
  [mdAuth.asureAuth],
  GroupMessageControllers.getAllMessages
);

router.get(
  '/group/messages/total/:group_id',
  [mdAuth.asureAuth],
  GroupMessageControllers.getTotalMessages
);

router.get(
  '/group/messages/last/:group_id',
  [mdAuth.asureAuth],
  GroupMessageControllers.getLastMessage
);
export const groupMessageRouter = router;
