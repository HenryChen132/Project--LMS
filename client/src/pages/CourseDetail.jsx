// client/src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load course.");
      });
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "student") {
      setMessage("Only students can add courses.");
      return;
    }

    try {
      const res = await api.post(`/courses/${id}/enroll`);
      setMessage(res.data.message || "Course added.");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to add course.");
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  const isEnrolled =
    user &&
    Array.isArray(course.students) &&
    course.students.some(
      (s) => s === user.id || s._id === user.id || s.id === user.id
    );

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>
        Teacher:{" "}
        {course.teacher ? course.teacher.name || course.teacher.email : "N/A"}
      </p>

      {user ? (
        user.role === "student" ? (
          isEnrolled ? (
            <button disabled>Already in My Courses</button>
          ) : (
            <button onClick={handleEnroll}>Add to My Courses</button>
          )
        ) : (
          <p>Teachers cannot enroll in courses.</p>
        )
      ) : (
        <p>
          Please <Link to="/login">login</Link> to add this course.
        </p>
      )}

      <div style={{ marginTop: "16px" }}>
        <Link to={`/courses/${id}/assignments`}>View Assignments</Link>
      </div>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default CourseDetail;
