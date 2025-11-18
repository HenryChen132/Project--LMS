// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // 用于简单的“全局加载”控制（可选）
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // token 变化时确保 axios 拿得到
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { token: t, user: u } = res.data;

      const safeUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      };

      setUser(safeUser);
      setToken(t);
      localStorage.setItem("user", JSON.stringify(safeUser));

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      const { token: t, user: u } = res.data;
      const safeUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      };

      setUser(safeUser);
      setToken(t);
      localStorage.setItem("user", JSON.stringify(safeUser));

      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Register failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
