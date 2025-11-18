// client/src/pages/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .get("/courses/my-courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.post("/courses", {
        title: newTitle,
        description: newDesc,
      });
      setCourses((prev) => [res.data, ...prev]);
      setNewTitle("");
      setNewDesc("");
      alert("Course created and now visible in Public Courses.");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to create course. (Teacher only)"
      );
    }
  };

  if (!user) {
    return <p>Please login to view your courses.</p>;
  }

  return (
    <div>
      <h2>My Courses</h2>

      {user.role === "teacher" && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Create a New Course (Teacher Only)</h3>
          <form onSubmit={handleCreateCourse}>
            <div>
              <label>Title</label>
              <br />
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <br />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <button type="submit">Create Course</button>
          </form>
        </div>
      )}

      <ul>
        {courses.map((course) => (
          <li key={course._id} style={{ marginBottom: "8px" }}>
            <strong>{course.title}</strong>{" "}
            {user.role === "student" && (
              <Link to={`/courses/${course._id}/assignments`}>
                &nbsp;- View Assignments
              </Link>
            )}
            {user.role === "teacher" && (
              <>
                &nbsp;- <Link to={`/courses/${course._id}`}>View Detail</Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyCourses;
