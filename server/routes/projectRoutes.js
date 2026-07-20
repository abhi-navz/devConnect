import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  updateProject,
  updateProjectStatus,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/mine', getMyProjects);
router.get('/:projectId', getProjectById);
router.put('/:projectId', updateProject);
router.put('/:projectId/status', updateProjectStatus);
router.delete('/:projectId', deleteProject);

export default router;