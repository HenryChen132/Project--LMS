// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./Home.css";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error("Expected array but got:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <div className="home-page">
      <img
        src="/Picture1.jpg" // public 下的图片，前面不要加 /public
        alt="STUDY BOX Logo"
        style={{ width: "300px", margin: "20px auto", display: "block" }}
      />

      <h1>STUDY BOX</h1>
      <h3>Welcome to STUDY BOX!</h3>
      <hr />
      <h3>Public Courses</h3>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {/* 点击进入课程详情页 */}
            <Link to={`/courses/${course._id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
