import { Router } from 'express';
import multipart from 'connect-multiparty';
import { MessageController } from '../controllers/index.js';
import { mdAuth } from '../middlewares/authenticated.js';

const mdUpload = multipart({ uploadDir: './src/uploads/images' });

const router = Router();

router.get(
  '/chat/messages/:chat_id',
  [mdAuth.asureAuth],
  MessageController.getMessages
);

router.get(
  '/chat/messages/total/:chat_id',
  [mdAuth.asureAuth],
  MessageController.getTotalMessages
);

router.get(
  '/chat/messages/last/:chat_id',
  [mdAuth.asureAuth],
  MessageController.getLastMessage
);

router.get(
  '/chat/messages/unread/:chat_id',
  [mdAuth.asureAuth, mdUpload],
  MessageController.getUnreadMessages
);

router.post(
  '/chat/messages',
  [mdAuth.asureAuth],
  MessageController.sendMessage
);

router.post(
  '/chat/messages/image',
  [mdAuth.asureAuth, mdUpload],
  MessageController.sendImage
);

router.patch(
  '/chat/messages/:id',
  [mdAuth.asureAuth, mdUpload],
  MessageController.updateReadMessage
);

export const messageRoutes = router;
