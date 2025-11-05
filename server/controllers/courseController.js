import Course from '../models/Course.js';

// GET /api/courses
export const getAllCourses = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
};

// GET /api/courses/:id
export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

// POST /api/courses   
export const createCourse = async (req, res) => {
  const { title, description, instructor, startDate, endDate } = req.body;
  if (!title || !description || !instructor) {
    return res.status(400).json({ message: 'title, description, instructor are required' });
  }
  const course = await Course.create({ title, description, instructor, startDate, endDate });
  res.status(201).json(course);
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ message: 'Course deleted' });
};

// DELETE /api/courses   
export const deleteAllCourses = async (req, res) => {
  await Course.deleteMany({});
  res.json({ message: 'All courses deleted' });
};
