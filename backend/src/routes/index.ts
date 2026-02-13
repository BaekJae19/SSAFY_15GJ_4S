import { Router } from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/', dashboardRoutes);

export default router;
