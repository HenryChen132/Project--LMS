import Assignment from '../models/Assignment.js';

// GET /api/assignments
// GET /api/assignments?courseId=xxxx
export const getAllAssignments = async (req, res) => {
  const filter = {};
  if (req.query.courseId) {
    filter.course = req.query.courseId;
  }
  const assignments = await Assignment.find(filter)
    .populate('course', 'title')
    .sort({ createdAt: -1 });
  res.json(assignments);
};

// GET /api/assignments/:id
export const getAssignmentById = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).populate('course', 'title');
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json(assignment);
};

// POST /api/assignments   
export const createAssignment = async (req, res) => {
  const { course, title, description, dueDate } = req.body;
  if (!course || !title || !description) {
    return res.status(400).json({ message: 'course, title, description are required' });
  }
  const assignment = await Assignment.create({ course, title, description, dueDate });
  res.status(201).json(assignment);
};

// PUT /api/assignments/:id
export const updateAssignment = async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json(assignment);
};

// DELETE /api/assignments/:id
export const deleteAssignment = async (req, res) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json({ message: 'Assignment deleted' });
};

// DELETE /api/assignments
export const deleteAllAssignments = async (req, res) => {
  await Assignment.deleteMany({});
  res.json({ message: 'All assignments deleted' });
};
