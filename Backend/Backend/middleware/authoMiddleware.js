import jwt from "jsonwebtoken";

// Existing middleware - keep intact
const verifyToke = (req, res, next) => {
  let token;
  // headers are always lowercase in Node.js
  let authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token, authorization required" });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log("Decoded user:", req.user);
      next();
    } catch (err) {
      res.status(400).json({ message: "Token is not valid" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization required" });
  }
};

// New middleware - named exports
const requireAuth = (req, res, next) => {
  // Just reuse verifyToke logic internally
  verifyToke(req, res, next);
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: insufficient rights" });
    }
  };
};

// Export all
export default verifyToke; // keep default for backward compatibility
export { requireAuth, requireRole };
