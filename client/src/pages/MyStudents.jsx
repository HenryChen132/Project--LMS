// client/src/pages/MyStudents.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function MyStudents() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/courses/my-students")
      .then((res) => setRows(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  if (!user) return <p>Please login first.</p>;
  if (user.role !== "teacher")
    return <p>Only teachers can view their students.</p>;

  return (
    <div>
      <h2>My Students</h2>
      {rows.length === 0 ? (
        <p>No students have joined your courses yet.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student Email</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.courseId}-${r.studentId}`}>
                <td>{r.studentName}</td>
                <td>{r.studentEmail}</td>
                <td>{r.courseTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyStudents;
