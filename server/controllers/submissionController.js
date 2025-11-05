import Submission from '../models/Submission.js';

// GET /api/submissions
// GET /api/submissions?assignmentId=xxx
export const getAllSubmissions = async (req, res) => {
  const filter = {};
  if (req.query.assignmentId) {
    filter.assignment = req.query.assignmentId;
  }
  const submissions = await Submission.find(filter)
    .sort({ createdAt: -1 });
  res.json(submissions);
};

// GET /api/submissions/:id
export const getSubmissionById = async (req, res) => {
  const sub = await Submission.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: 'Submission not found' });
  res.json(sub);
};

// POST /api/submissions   
export const createSubmission = async (req, res) => {
  const { assignment, student, content, grade, feedback } = req.body;
  if (!assignment || !student || !content) {
    return res.status(400).json({ message: 'assignment, student, content are required' });
  }
  const sub = await Submission.create({
    assignment,
    student,
    content,
    grade,
    feedback
  });
  res.status(201).json(sub);
};

// PUT /api/submissions/:id  
export const updateSubmission = async (req, res) => {
  const sub = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!sub) return res.status(404).json({ message: 'Submission not found' });
  res.json(sub);
};

// DELETE /api/submissions/:id
export const deleteSubmission = async (req, res) => {
  const sub = await Submission.findByIdAndDelete(req.params.id);
  if (!sub) return res.status(404).json({ message: 'Submission not found' });
  res.json({ message: 'Submission deleted' });
};

// DELETE /api/submissions
export const deleteAllSubmissions = async (req, res) => {
  await Submission.deleteMany({});
  res.json({ message: 'All submissions deleted' });
};
