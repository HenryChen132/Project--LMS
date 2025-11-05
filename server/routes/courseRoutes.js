import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  deleteAllCourses
} from '../controllers/courseController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);

router.post('/', requireAuth, createCourse);
router.put('/:id', requireAuth, updateCourse);
router.delete('/:id', requireAuth, deleteCourse);
router.delete('/', requireAuth, deleteAllCourses);

export default router;