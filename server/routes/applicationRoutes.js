import express from 'express';
import {
  applyToRole,
  getApplicationsForProject,
  getMyApplications,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', applyToRole);
router.get('/mine', getMyApplications);
router.get('/project/:projectId', getApplicationsForProject);

export default router;