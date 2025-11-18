// client/src/pages/CourseAssignments.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const CourseAssignments = () => {
  const { id } = useParams(); // course id
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);

  // 老师创建作业用的表单状态
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  // 老师编辑作业用
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDue, setEditDue] = useState("");

  useEffect(() => {
    api
      .get(`/assignments?courseId=${id}`)
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Error loading assignments:", err));
  }, [id]);

  if (!user) {
    return <p>Please login to view assignments.</p>;
  }

  const isTeacher = user.role === "teacher";

  // 老师创建 assignment（Create）
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post("/assignments", {
        title,
        description: desc,
        dueDate,
        courseId: id,
      });

      setAssignments((prev) => [res.data, ...prev]);
      setTitle("");
      setDesc("");
      setDueDate("");
      alert("Assignment created.");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to create assignment. (Teacher only)"
      );
    }
  };

  // 进入编辑状态（Update）
  const startEdit = (assignment) => {
    setEditId(assignment._id);
    setEditTitle(assignment.title);
    setEditDesc(assignment.description || "");
    setEditDue(
      assignment.dueDate ? assignment.dueDate.substring(0, 10) : ""
    );
  };

  // 保存编辑（Update）
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editId) return;

    try {
      const res = await api.put(`/assignments/${editId}`, {
        title: editTitle,
        description: editDesc,
        dueDate: editDue,
      });

      setAssignments((prev) =>
        prev.map((a) => (a._id === editId ? res.data : a))
      );
      setEditId(null);
      alert("Assignment updated.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update assignment.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  // 删除作业（Delete）
  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }
    try {
      await api.delete(`/assignments/${assignmentId}`);
      setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
      alert("Assignment deleted.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete assignment.");
    }
  };

  return (
    <div className="overlay-box">
      <h2>Assignments</h2>

      {/* 老师专用：创建作业表单（Create） */}
      {isTeacher && (
        <div style={{ marginBottom: "24px" }}>
          <h3>Create a new assignment</h3>
          <form onSubmit={handleCreate}>
            <div>
              <label>Title</label>
              <br />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <br />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label>Due date</label>
              <br />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button type="submit" style={{ marginTop: "8px" }}>
              Create Assignment
            </button>
          </form>
        </div>
      )}

      {/* Assignment 列表（Read） */}
      {assignments.length === 0 ? (
        <p>
          {isTeacher
            ? "No assignments yet. Use the form above to create one."
            : "No assignments yet. Your teacher might add an assignment for this course later."}
        </p>
      ) : (
        <ul>
          {assignments.map((a) => (
            <li key={a._id} style={{ marginBottom: "12px" }}>
              {/* 如果正在编辑这一条，就显示编辑表单 */}
              {isTeacher && editId === a._id ? (
                <form onSubmit={handleSaveEdit}>
                  <div>
                    <label>Title</label>
                    <br />
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <br />
                    <textarea
                      rows={3}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Due date</label>
                    <br />
                    <input
                      type="date"
                      value={editDue}
                      onChange={(e) => setEditDue(e.target.value)}
                    />
                  </div>
                  <button type="submit" style={{ marginRight: "8px" }}>
                    Save
                  </button>
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  {/* 正常显示模式 */}
                  <div>
                    <strong>{a.title}</strong>
                    {a.description ? ` – ${a.description}` : ""}
                    {a.dueDate && (
                      <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                        (Due: {a.dueDate.substring(0, 10)})
                      </span>
                    )}
                  </div>

                  {/* 学生视角：Submit */}
                  {!isTeacher && (
                    <div>
                      <Link to={`/assignments/${a._id}/submit`}>Submit</Link>
                    </div>
                  )}

                  {/* 老师视角：View Submissions + Edit/Delete */}
                  {isTeacher && (
                    <div style={{ marginTop: "4px" }}>
                      
                      <button
                        type="button"
                        onClick={() => startEdit(a)}
                        style={{ marginRight: "4px" }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a._id)}
                      >
                        Delete
                      </button>
                      <br />
                      <Link
                        to={`/assignments/${a._id}/submissions`}
                        style={{ marginRight: "8px" }}
                      >
                        View Submissions
                      </Link>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseAssignments;
