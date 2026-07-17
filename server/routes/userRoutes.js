import express from 'express';
import { getUserByUsername, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/:username', protect, getUserByUsername);

export default router;