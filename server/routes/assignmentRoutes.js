// server/routes/assignmentRoutes.js
import { Router } from "express";
import {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  deleteAllAssignments,
} from "../controllers/assignmentController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

// 获取所有作业（可带 ?courseId=xxx）
router.get("/", getAllAssignments);

// 获取单个作业（Submit 页面用来显示 Quiz1 标题/简介）
router.get("/:id", getAssignmentById);

// 老师创建作业
router.post("/", requireAuth, createAssignment);

// 老师更新作业
router.put("/:id", requireAuth, updateAssignment);

// 老师删除单个作业
router.delete("/:id", requireAuth, deleteAssignment);

// （可选）删除所有作业
router.delete("/", requireAuth, deleteAllAssignments);

export default router;
