// server/routes/courseRoutes.js
import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  getMyCourses,
  getMyStudents,
} from "../controllers/courseController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.get("/", getAllCourses);
router.get("/my-courses", requireAuth, getMyCourses);
router.get("/my-students", requireAuth, getMyStudents);
router.post("/", requireAuth, createCourse);
router.get("/:id", getCourseById);
router.post("/:id/enroll", requireAuth, enrollInCourse);

export default router;
