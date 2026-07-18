import express from 'express';
import {
  createPost,
  getFeed,
  getPostsByUser,
  deletePost,
  toggleLike,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createPost);
router.get('/', getFeed);
router.get('/user/:userId', getPostsByUser);
router.delete('/:postId', deletePost);
router.put('/:postId/like', toggleLike);

export default router;