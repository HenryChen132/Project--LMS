// server/middleware/requireAuth.js
import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 同时兼容 { id, email, name, role } 和 { userId, username, role } 两种 token
    const id = payload.id || payload.userId;
    const name = payload.name || payload.username || null;

    if (!id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      id,
      email: payload.email || null,
      name,
      role: payload.role || null,
    };

    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
