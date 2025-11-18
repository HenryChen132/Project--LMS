// server/routes/submissionRoutes.js
import { Router } from "express";
import {
  createSubmission,
  getAllSubmissions,
  getSubmissionsByAssignment,
  gradeSubmission,
} from "../controllers/submissionController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

// 学生提交
router.post("/", requireAuth, createSubmission);

// 老师看所有（可选）
router.get("/", requireAuth, getAllSubmissions);

// 按 assignment 查看提交（老师看到所有，学生只能看到自己）
router.get("/assignment/:assignmentId", requireAuth, getSubmissionsByAssignment);

// 老师评分 / 评语
router.patch("/:id", requireAuth, gradeSubmission);

export default router;
