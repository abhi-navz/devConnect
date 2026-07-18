import express from 'express';
import { addComment, getCommentsForPost, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', addComment);
router.get('/post/:postId', getCommentsForPost);
router.delete('/:commentId', deleteComment);

export default router;