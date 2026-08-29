import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Authentication token required." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    if (req.user.role !== requiredRole && req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: `Unauthorized role access. Required: ${requiredRole}, Found: ${req.user.role}`
      });
    }
    next();
  };
};
