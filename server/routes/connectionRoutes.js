import express from 'express';
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getConnectionStatus,
} from '../controllers/connectionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // every route below requires auth

router.post('/request/:userId', sendRequest);
router.put('/accept/:connectionId', acceptRequest);
router.put('/reject/:connectionId', rejectRequest);
router.delete('/:connectionId', removeConnection);
router.get('/', getMyConnections);
router.get('/pending', getPendingRequests);
router.get('/status/:userId', getConnectionStatus);

export default router;