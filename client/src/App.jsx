// client/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import MyStudents from "./pages/MyStudents";
import CourseDetail from "./pages/CourseDetail";
import CourseAssignments from "./pages/CourseAssignments";
import SubmissionForm from "./pages/SubmissionForm";
import SubmissionList from "./pages/SubmissionList";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "70px", maxWidth: 900, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          <Route path="/courses/:id" element={<CourseDetail />} />

          <Route
            path="/courses/:id/assignments"
            element={
              <ProtectedRoute>
                <CourseAssignments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assignments/:assignmentId/submit"
            element={
              <ProtectedRoute>
                <SubmissionForm />
              </ProtectedRoute>
            }
          />
          <Route
  path="/assignments/:assignmentId/submissions"
  element={
    <ProtectedRoute>
      <SubmissionList />
    </ProtectedRoute>
  }
/>

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-students"
            element={
              <ProtectedRoute>
                <MyStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
