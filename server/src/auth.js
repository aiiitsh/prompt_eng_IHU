import crypto from "crypto";
import jwt from "jsonwebtoken";

export function md5(value) {
  return crypto.createHash("md5").update(String(value)).digest("hex");
}

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "library-dev-secret", {
    expiresIn: "8h",
  });
}

export function publicStudent(row) {
  if (!row) return null;
  return {
    id: row.id,
    studentId: row.StudentId,
    fullName: row.FullName,
    email: row.EmailId,
    mobile: row.MobileNumber,
    status: row.Status,
    regDate: row.RegDate,
    updationDate: row.UpdationDate,
  };
}

export function publicAdmin(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.FullName,
    email: row.AdminEmail,
    username: row.UserName,
  };
}
