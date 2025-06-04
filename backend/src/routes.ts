import { Router } from 'express';
import authRoutes from './modules/auth/authRoutes';
import userRoutes from './modules/user/userRoutes';

const router: Router = Router();

router.use('/api', authRoutes);
router.use('/api', userRoutes);

export default router;
