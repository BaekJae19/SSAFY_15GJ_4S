import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.post('/', authMiddleware, postController.createPost);
router.patch('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

export default router;
