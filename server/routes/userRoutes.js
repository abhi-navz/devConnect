import express from 'express';
import { getAllUsers, getUserByUsername, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/', protect, getAllUsers);
router.get('/:username', protect, getUserByUsername);

export default router;