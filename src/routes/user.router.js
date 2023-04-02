import { Router } from 'express';
import multipart from 'connect-multiparty';
import { UserController } from '../controllers/index.js';
import { mdAuth } from '../middlewares/index.js';

const mdUpload = multipart({ uploadDir: './src/uploads/avatar' });

const router = Router();

// endpoints
router.get('/users/me', [mdAuth.asureAuth], UserController.getMe);
router.patch('/users/me', [mdAuth.asureAuth, mdUpload], UserController.updateMyUser);
router.get('/users', [mdAuth.asureAuth], UserController.getUsers);
router.get('/users/:id', [mdAuth.asureAuth], UserController.getOneUser);

export const userRoutes = router;
