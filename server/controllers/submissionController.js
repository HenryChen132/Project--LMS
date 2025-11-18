// server/controllers/submissionController.js
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";

// 学生提交作业
export const createSubmission = async (req, res) => {
  if (!req.user || req.user.role !== "student") {
    return res
      .status(403)
      .json({ message: "Only students can submit assignments." });
  }

  const { assignmentId, content } = req.body;
  if (!assignmentId) {
    return res.status(400).json({ message: "assignmentId is required." });
  }

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      content: content || "",
    });

    res
      .status(201)
      .json({ message: "Submission created", submissionId: submission._id });
  } catch (err) {
    console.error("createSubmission error:", err);
    res.status(500).json({ message: "Submit failed" });
  }
};

// 老师查看自己所有课程的所有提交（备用接口）
export const getAllSubmissions = async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can view submissions." });
  }

  try {
    // 只拿“自己作为 teacher 的 assignment”的提交
    const assignments = await Assignment.find({
      teacher: req.user.id,
    }).select("_id");

    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
    })
      .populate("student", "name email")
      .populate("assignment", "title")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("getAllSubmissions error:", err);
    res.status(500).json({ message: "Failed to load submissions" });
  }
};

// 按 assignment 查看提交
export const getSubmissionsByAssignment = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId).select(
      "teacher"
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const filter = { assignment: assignmentId };

    if (req.user.role === "teacher") {
      // 老师只能看自己的作业
      if (assignment.teacher.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          message: "You can only view submissions for your own assignments.",
        });
      }
    } else if (req.user.role === "student") {
      // 学生只能看到自己提交的
      filter.student = req.user.id;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const submissions = await Submission.find(filter)
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("getSubmissionsByAssignment error:", err);
    res.status(500).json({ message: "Failed to load submissions" });
  }
};

// 老师给提交评分 / 评语
export const gradeSubmission = async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can grade submissions." });
  }

  const { id } = req.params;
  const { grade, feedback } = req.body;

  try {
    const submission = await Submission.findById(id).populate({
      path: "assignment",
      select: "teacher",
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // 确保是自己的作业
    if (
      submission.assignment.teacher.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You can only grade submissions for your own assignments.",
      });
    }

    // 更新分数和评语
    if (grade !== undefined) submission.grade = grade;
    if (feedback !== undefined) submission.feedback = feedback;

    await submission.save();

    res.json({ message: "Saved", submission });
  } catch (err) {
    console.error("gradeSubmission error:", err);
    res.status(500).json({ message: "Failed to save grade" });
  }
};
