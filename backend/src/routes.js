import { Router } from 'express';
import authRoutes from './modules/auth/authRoutes.js';
import userRoutes from './modules/user/userRoutes.js';

const router = Router();

router.use('/api', authRoutes);
router.use('/api', userRoutes);

export default router;
