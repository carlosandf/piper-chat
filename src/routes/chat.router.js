import { Router } from 'express';
import { ChatController } from '../controllers/index.js';
import { mdAuth } from '../middlewares/index.js';

const router = Router();

router.post('/chats', [mdAuth.asureAuth], ChatController.create); // create new chat
router.get('/chats', [mdAuth.asureAuth], ChatController.getAll); // get all chats
router.get('/chats/:id', [mdAuth.asureAuth], ChatController.getChat); // get one chat
router.delete('/chats/:id', [mdAuth.asureAuth], ChatController.deleteChat); // delete one chat

export const chatRoutes = router;
