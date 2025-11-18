// server/controllers/assignmentController.js
import Assignment from "../models/Assignment.js";

// GET /api/assignments?courseId=xxx
export const getAllAssignments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) {
      filter.course = req.query.courseId;
    }
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error("getAllAssignments error:", err);
    res.status(500).json({ message: "Failed to load assignments" });
  }
};

// GET /api/assignments/:id
export const getAssignmentById = async (req, res) => {
  try {
    const a = await Assignment.findById(req.params.id);
    if (!a) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(a);
  } catch (err) {
    console.error("getAssignmentById error:", err);
    res.status(500).json({ message: "Failed to load assignment" });
  }
};

// POST /api/assignments   （老师创建）
export const createAssignment = async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can create assignments." });
  }

  const { title, description, dueDate, courseId } = req.body;

  if (!title || !courseId) {
    return res
      .status(400)
      .json({ message: "title and courseId are required." });
  }

  try {
    const assignment = await Assignment.create({
      title,
      description: description || "",
      course: courseId,
      teacher: req.user.id,
      dueDate: dueDate || null,
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error("createAssignment error:", err);
    res.status(500).json({ message: "Failed to create assignment" });
  }
};

// PUT /api/assignments/:id   （老师更新）
export const updateAssignment = async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can update assignments." });
  }

  const { title, description, dueDate } = req.body;

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacher.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own assignments." });
    }

    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (dueDate !== undefined) assignment.dueDate = dueDate || null;

    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error("updateAssignment error:", err);
    res.status(500).json({ message: "Failed to update assignment" });
  }
};

// DELETE /api/assignments/:id   （老师删除）
export const deleteAssignment = async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can delete assignments." });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacher.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own assignments." });
    }

    await assignment.deleteOne();
    res.json({ message: "Assignment deleted." });
  } catch (err) {
    console.error("deleteAssignment error:", err);
    res.status(500).json({ message: "Failed to delete assignment" });
  }
};

// 可选：DELETE /api/assignments
export const deleteAllAssignments = async (_req, res) => {
  try {
    await Assignment.deleteMany({});
    res.json({ message: "All assignments deleted." });
  } catch (err) {
    console.error("deleteAllAssignments error:", err);
    res.status(500).json({ message: "Failed to delete all assignments" });
  }
};

// GET /api/courses/:courseId/assignments  （courseRoutes 里用的旧接口）
export const getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
    }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error("getAssignmentsByCourse error:", err);
    res.status(500).json({ message: "Failed to load assignments" });
  }
};
