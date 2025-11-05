import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },

    student: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    grade: {
      type: Number
    },
    feedback: {
      type: String
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Submission', SubmissionSchema);
