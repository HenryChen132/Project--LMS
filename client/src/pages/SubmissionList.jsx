// src/pages/SubmissionList.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function SubmissionList() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!user) return;

    // 先拿作业标题（Quiz1）
    api
      .get(`/assignments/${assignmentId}`)
      .then((res) => setAssignmentTitle(res.data.title))
      .catch(() => setAssignmentTitle("Assignment"));

    // 再拿所有提交，从中筛选出属于这个 assignment 的
    api
      .get("/submissions")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];

        const filtered = all.filter((s) => {
          const a = s.assignment;
          if (!a) return false;
          const idStr = typeof a === "string" ? a : a._id;
          return idStr === assignmentId;
        });

        setSubmissions(filtered);
      })
      .catch((err) => {
        console.error("Load submissions error:", err);
      });
  }, [assignmentId, user]);

  if (!user) return <p>Please login first.</p>;
  if (user.role !== "teacher")
    return <p>Only teachers can view submissions.</p>;

  return (
    <div>
      <h2>Submissions - {assignmentTitle || "Assignment"}</h2>

      {submissions.length === 0 ? (
        <p>No students have submitted this assignment yet.</p>
      ) : (
        <ul>
          {submissions.map((s) => (
            <li key={s._id} style={{ marginBottom: "12px" }}>
              <strong>
                {s.student?.username || s.student?.name || "Unknown student"}
              </strong>
              {s.student?.email && (
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  {s.student.email}
                </div>
              )}
              <div
                style={{
                  marginTop: "4px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {s.content}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
