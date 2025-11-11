import { Router } from 'express';
import authRoutes from './modules/auth/authRoutes';
import userRoutes from './modules/user/userRoutes';
import messageRoutes from './modules/messages/messageRoutes';
import postRoutes from './modules/posts/postRoutes';

const router: Router = Router();

router.use('/api', authRoutes);
router.use('/api', userRoutes);
router.use('/api', messageRoutes);
router.use('/api', postRoutes);

export default router;
