import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {

    title: { type: String, required: true },

    description: { type: String, required: true },

    instructor: { type: String, required: true },

    startDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Course', CourseSchema);
