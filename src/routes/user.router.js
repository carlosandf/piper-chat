import { Router } from 'express';
import multipart from 'connect-multiparty';
import { UserControler } from '../controllers/index.js';
import { mdAuth } from '../middlewares/index.js';

const mdUpload = multipart({ uploadDir: './src/uploads/avatar' });

const router = Router();

// endpoints
router.get('/users/me', [mdAuth.asureAuth], UserControler.getMe);
router.patch('/users/me', [mdAuth.asureAuth, mdUpload], UserControler.updateMyUser);
router.get('/users', [mdAuth.asureAuth], UserControler.getUsers);
router.get('/users/:id', [mdAuth.asureAuth], UserControler.getOneUser);

export const userRoutes = router;
