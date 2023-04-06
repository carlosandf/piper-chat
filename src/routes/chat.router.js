import { Router } from 'express';
import { ChatController } from '../controllers/index.js';
import { mdAuth } from '../middlewares/index.js';

const router = Router();

router.post('/chats', [mdAuth.asureAuth], ChatController.create);
router.get('/chats', [mdAuth.asureAuth], ChatController.getAll);
router.delete('/chats/:id', [mdAuth.asureAuth], ChatController.deleteChat);

export const chatRoutes = router;
