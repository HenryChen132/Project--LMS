// server/models/Submission.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,

    // ✅ 新增：老师打分（0-100，可选）
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },

    // ✅ 新增：老师评语（可选）
    feedback: String,

    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
