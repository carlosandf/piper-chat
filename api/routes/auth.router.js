import { Router } from 'express';
import { AuthController } from '../controllers/index.js'; // importar los controladores de autenticación

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/refresh-access-toker', AuthController.refreshAccessToken);

export const authRoutes = router;
