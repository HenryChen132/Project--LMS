import { Router } from 'express';
import {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  deleteAllSubmissions
} from '../controllers/submissionController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', getAllSubmissions);
router.get('/:id', getSubmissionById);


router.post('/', requireAuth, createSubmission);


router.put('/:id', requireAuth, updateSubmission);
router.delete('/:id', requireAuth, deleteSubmission);
router.delete('/', requireAuth, deleteAllSubmissions);

export default router;
