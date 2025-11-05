import { Router } from 'express';
import {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  deleteAllAssignments
} from '../controllers/assignmentController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);


router.post('/', requireAuth, createAssignment);
router.put('/:id', requireAuth, updateAssignment);
router.delete('/:id', requireAuth, deleteAssignment);
router.delete('/', requireAuth, deleteAllAssignments);

export default router;
