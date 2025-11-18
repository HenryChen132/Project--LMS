// client/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        {user && (
          <Link to="/my-courses" style={styles.link}>
            My Courses
          </Link>
        )}

        {user && user.role === "teacher" && (
          <Link to="/my-students" style={styles.link}>
            My Students
          </Link>
        )}
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.text}>Hi, {user.name}</span>
            <Link to="/profile" style={styles.link}>
              Profile
            </Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#333",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  left: {
    display: "flex",
    gap: "15px",
  },
  right: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    padding: "6px 12px",
  },
  text: {
    color: "#fff",
  },
};

export default Navbar;
