// server/controllers/courseController.js
import Course from "../models/Course.js";
import User from "../models/User.js";

export const getAllCourses = async (_req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    console.error("getAllCourses error:", err);
    res.status(500).json({ message: "Failed to load courses" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    console.error("getCourseById error:", err);
    res.status(500).json({ message: "Failed to load course" });
  }
};

export const createCourse = async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can create courses." });
  }

  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  try {
    const course = await Course.create({
      title,
      description: description || "",
      teacher: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { courses: course._id },
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("createCourse error:", err);
    res.status(500).json({ message: "Failed to create course" });
  }
};

export const enrollInCourse = async (req, res) => {
  if (!req.user || req.user.role !== "student") {
    return res
      .status(403)
      .json({ message: "Only students can enroll in courses." });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const already = course.students.some(
      (s) => s.toString() === req.user.id.toString()
    );
    if (already) {
      return res.status(400).json({ message: "You already joined this course." });
    }

    course.students.push(req.user.id);
    await course.save();

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { courses: course._id },
    });

    res.json({ message: "Course added to your list." });
  } catch (err) {
    console.error("enrollInCourse error:", err);
    res.status(500).json({ message: "Failed to enroll in course" });
  }
};

export const getMyCourses = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    let courses;
    if (req.user.role === "student") {
      courses = await Course.find({ students: req.user.id }).populate(
        "teacher",
        "name email"
      );
    } else if (req.user.role === "teacher") {
      courses = await Course.find({ teacher: req.user.id }).populate(
        "students",
        "name email"
      );
    } else {
      courses = [];
    }
    res.json(courses);
  } catch (err) {
    console.error("getMyCourses error:", err);
    res.status(500).json({ message: "Failed to load your courses" });
  }
};

export const getMyStudents = async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can view their students." });
  }

  try {
    const courses = await Course.find({ teacher: req.user.id }).populate(
      "students",
      "name email"
    );

    const result = [];
    courses.forEach((course) => {
      course.students.forEach((stu) => {
        result.push({
          studentId: stu._id,
          studentName: stu.name,
          studentEmail: stu.email,
          courseId: course._id,
          courseTitle: course.title,
        });
      });
    });

    res.json(result);
  } catch (err) {
    console.error("getMyStudents error:", err);
    res.status(500).json({ message: "Failed to load students" });
  }
};
