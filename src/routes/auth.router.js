import { Router } from 'express';
import { AuthController } from '../controllers/index.js';

const router = Router();

router.post('/auth/register', AuthController.register);

export const authRoutes = router;
