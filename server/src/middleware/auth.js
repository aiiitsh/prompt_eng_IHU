import jwt from "jsonwebtoken";

function readToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "library-dev-secret");
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(role) {
  return [
    requireAuth,
    (req, res, next) => {
      if (req.user?.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    },
  ];
}
