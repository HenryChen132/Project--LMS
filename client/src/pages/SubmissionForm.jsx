// src/pages/SubmissionForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function SubmissionForm() {
  const { assignmentId } = useParams();
  const { user } = useContext(AuthContext);

  const [assignment, setAssignment] = useState(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [fakeFileName, setFakeFileName] = useState("");

  // 读一下作业标题和简介（Quiz1、10 multiple choice）
  useEffect(() => {
    api
      .get(`/assignments/${assignmentId}`)
      .then((res) => setAssignment(res.data))
      .catch(() => {
        // 出错就不管，标题用默认
      });
  }, [assignmentId]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    setMessage("Please login first.");
    return;
  }

  try {
    await api.post("/submissions", {
      assignmentId,
      content,
    });

    // ✅ 真·弹窗
    alert("Submitted successfully.");

    // 页面上的提示文字
    setMessage("Submitted successfully.");
    setContent("");
    setFakeFileName("");
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "Submit failed.");
  }
};


  // 这个 file 只是 UI，不会真的上传
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFakeFileName(file ? file.name : "");
  };

  return (
    <div className="overlay-box">
      <h1>Submit Assignment</h1>

      <h2>{assignment?.title || "Assignment"}</h2>
      {assignment?.description && <p>{assignment.description}</p>}

      {!user && (
        <p>
          Please <Link to="/login">login</Link> before submitting.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            cols={60}
            placeholder="Write your answer here or describe the file you upload."
            required
          />
        </div>

        <div style={{ marginTop: "8px" }}>
          <label>Optional file: </label>
          <input type="file" onChange={handleFileChange} />
          {fakeFileName && (
            <span style={{ marginLeft: "8px", fontSize: "12px" }}>
              Selected: {fakeFileName}
            </span>
          )}
        </div>

        <p style={{ fontSize: "12px", marginTop: "4px" }}>
          (The file is not actually uploaded in the backend – this is just for
          UI.)
        </p>

        <button type="submit" disabled={!user} style={{ marginTop: "8px" }}>
          Submit
        </button>
      </form>

      {message && <p style={{ marginTop: "8px" }}>{message}</p>}
    </div>
  );
}

export default SubmissionForm;
