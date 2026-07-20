import express from 'express';
import {
  applyToRole,
  getApplicationsForProject,
  getMyApplications,
  acceptApplication,
  rejectApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', applyToRole);
router.get('/mine', getMyApplications);
router.get('/project/:projectId', getApplicationsForProject);
router.put('/:applicationId/accept', acceptApplication);
router.put('/:applicationId/reject', rejectApplication);

export default router;