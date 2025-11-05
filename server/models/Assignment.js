import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', AssignmentSchema);
