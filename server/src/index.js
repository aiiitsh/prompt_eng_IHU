import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { md5, publicAdmin, publicStudent, signToken } from "./auth.js";
import { requireAuth, requireRole } from "./middleware/auth.js";
import { store } from "./store.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const bookImageDir = path.join(projectRoot, "server", "uploads", "bookimg");
const bookPdfDir = path.join(projectRoot, "server", "uploads", "bookpdf");

fs.mkdirSync(bookImageDir, { recursive: true });
fs.mkdirSync(bookPdfDir, { recursive: true });

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/book-images", express.static(bookImageDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, file, cb) => {
      cb(null, file.fieldname === "pdf" ? bookPdfDir : bookImageDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${md5(`${file.originalname}${Date.now()}`)}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = file.fieldname === "pdf" ? [".pdf"] : [".jpg", ".jpeg", ".png", ".gif"];
    cb(null, allowed.includes(ext));
  },
});

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "library-management-api", storage: "json-file" });
});

app.post(
  "/api/auth/student/login",
  asyncRoute(async (req, res) => {
    const student = store.findStudentByLogin(req.body.email, req.body.password);
    if (!student) return res.status(401).json({ message: "Invalid email or password" });
    if (Number(student.Status) !== 1) return res.status(403).json({ message: "Account is blocked" });

    res.json({
      token: signToken({ role: "student", email: student.EmailId, studentId: student.StudentId }),
      user: publicStudent(student),
    });
  }),
);

app.post(
  "/api/auth/admin/login",
  asyncRoute(async (req, res) => {
    const admin = store.findAdminByLogin(req.body.username, req.body.password);
    if (!admin) return res.status(401).json({ message: "Invalid username or password" });

    res.json({
      token: signToken({ role: "admin", username: admin.UserName, adminId: admin.id }),
      user: publicAdmin(admin),
    });
  }),
);

app.post(
  "/api/auth/student/signup",
  asyncRoute(async (req, res) => {
    const { fullName, mobile, email, password } = req.body;
    if (![fullName, mobile, email, password].every(required)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = store.createStudent({ fullName, mobile, email, password });
    if (!student) return res.status(409).json({ message: "Email already exists" });
    res.status(201).json({ id: student.id, studentId: student.StudentId, message: "Account created" });
  }),
);

app.post(
  "/api/auth/student/forgot-password",
  asyncRoute(async (req, res) => {
    const changed = store.resetStudentPassword(req.body.email, req.body.mobile, req.body.newPassword);
    if (!changed) return res.status(404).json({ message: "Email and mobile number do not match" });
    res.json({ message: "Password changed" });
  }),
);

app.get(
  "/api/student/profile",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    res.json(publicStudent(store.getStudent(req.user.studentId)));
  }),
);

app.put(
  "/api/student/profile",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    const student = store.updateStudentProfile(req.user.studentId, {
      fullName: req.body.fullName,
      mobile: req.body.mobile,
    });
    res.json(publicStudent(student));
  }),
);

app.post(
  "/api/student/change-password",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    const changed = store.changeStudentPassword(req.user.studentId, req.body.currentPassword, req.body.newPassword);
    if (!changed) return res.status(400).json({ message: "Current password is incorrect" });
    res.json({ message: "Password changed" });
  }),
);

app.post(
  "/api/admin/change-password",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const changed = store.changeAdminPassword(req.user.username, req.body.currentPassword, req.body.newPassword);
    if (!changed) return res.status(400).json({ message: "Current password is incorrect" });
    res.json({ message: "Password changed" });
  }),
);

app.get(
  "/api/books",
  requireAuth,
  asyncRoute(async (req, res) => {
    res.json(store.listBooks(req.user.role === "student" ? req.user.studentId : null));
  }),
);

app.get(
  "/api/books/:id/download",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    const result = store.bookDownload(req.user.studentId, req.params.id);
    if (result.error) return res.status(result.status).json({ message: result.error });
    const filePath = path.join(bookPdfDir, result.file);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "PDF file is missing on the server" });
    res.download(filePath, result.name);
  }),
);

app.get(
  "/api/books/search",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    res.json(store.searchBooks(req.query.q || ""));
  }),
);

app.post(
  "/api/books/:id/view",
  requireAuth,
  asyncRoute(async (req, res) => {
    if (!store.recordBookView(req.params.id)) return res.status(404).json({ message: "Book not found" });
    res.status(201).json({ message: "Book view recorded" });
  }),
);

app.get(
  "/api/lookups",
  requireAuth,
  asyncRoute(async (_req, res) => {
    res.json(store.lookups());
  }),
);

app.get(
  "/api/student/dashboard",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    res.json(store.studentDashboard(req.user.studentId));
  }),
);

app.get(
  "/api/student/issues",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    res.json(store.studentIssues(req.user.studentId));
  }),
);

app.post(
  "/api/student/issues",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    const result = store.issueBook({
      studentId: req.user.studentId,
      bookId: req.body.bookId,
      remark: "Student purchase",
      purchase: true,
    });
    if (result.error) return res.status(result.status).json({ message: result.error });
    res.status(201).json({ id: result.issue.id, message: "Book added to issued books" });
  }),
);

app.delete(
  "/api/student/issues/:id",
  requireRole("student"),
  asyncRoute(async (req, res) => {
    const removed = store.deleteStudentIssue(req.user.studentId, req.params.id);
    if (!removed) return res.status(404).json({ message: "Issued book not found" });
    res.json({ message: "Book removed from your library" });
  }),
);

app.get(
  "/api/admin/dashboard",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    res.json(store.adminDashboard({ from: req.query.from, to: req.query.to }));
  }),
);

app.get(
  "/api/admin/authors",
  requireRole("admin"),
  asyncRoute(async (_req, res) => {
    res.json(store.authors());
  }),
);

app.post(
  "/api/admin/authors",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    res.status(201).json(store.addAuthor(req.body.name));
  }),
);

app.put(
  "/api/admin/authors/:id",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    if (!store.updateAuthor(req.params.id, req.body.name)) return res.status(404).json({ message: "Author not found" });
    res.json({ message: "Author updated" });
  }),
);

app.delete(
  "/api/admin/authors/:id",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    store.deleteAuthor(req.params.id);
    res.json({ message: "Author deleted" });
  }),
);

app.get(
  "/api/admin/categories",
  requireRole("admin"),
  asyncRoute(async (_req, res) => {
    res.json(store.categories());
  }),
);

app.post(
  "/api/admin/categories",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    res.status(201).json(store.addCategory(req.body.name, req.body.status ?? 1));
  }),
);

app.put(
  "/api/admin/categories/:id",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    if (!store.updateCategory(req.params.id, req.body.name, req.body.status ?? 1)) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category updated" });
  }),
);

app.delete(
  "/api/admin/categories/:id",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    store.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
  }),
);

app.post(
  "/api/admin/books",
  requireRole("admin"),
  upload.fields([{ name: "image", maxCount: 1 }, { name: "pdf", maxCount: 1 }]),
  asyncRoute(async (req, res) => {
    const book = store.addBook({
      bookName: req.body.bookName,
      categoryId: req.body.categoryId,
      authorName: req.body.authorName,
      isbn: req.body.isbn,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.files?.image?.[0]?.filename || "",
      pdf: req.files?.pdf?.[0]?.filename || "",
    });
    if (!book) return res.status(400).json({ message: "Author name is required" });
    res.status(201).json({ id: book.id, image: book.bookImage });
  }),
);

app.put(
  "/api/admin/books/:id",
  requireRole("admin"),
  upload.fields([{ name: "image", maxCount: 1 }, { name: "pdf", maxCount: 1 }]),
  asyncRoute(async (req, res) => {
    const updated = store.updateBook(req.params.id, {
      bookName: req.body.bookName,
      categoryId: req.body.categoryId,
      authorName: req.body.authorName,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.files?.image?.[0]?.filename,
      pdf: req.files?.pdf?.[0]?.filename,
    });
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated" });
  }),
);

app.delete(
  "/api/admin/books/:id",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    store.deleteBook(req.params.id);
    res.json({ message: "Book deleted" });
  }),
);

app.get(
  "/api/admin/students",
  requireRole("admin"),
  asyncRoute(async (_req, res) => {
    res.json(store.students());
  }),
);

app.patch(
  "/api/admin/students/:id/status",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    if (!store.setStudentStatus(req.params.id, req.body.status)) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student status updated" });
  }),
);

app.get(
  "/api/admin/students/:studentId/history",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    res.json(store.studentHistory(req.params.studentId));
  }),
);

app.get(
  "/api/admin/issues",
  requireRole("admin"),
  asyncRoute(async (_req, res) => {
    res.json(store.adminIssues());
  }),
);

app.post(
  "/api/admin/issues",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const result = store.issueBook({
      studentId: String(req.body.studentId || "").toUpperCase(),
      bookId: req.body.bookId,
      remark: req.body.remark,
    });
    if (result.error) return res.status(result.status).json({ message: result.error });
    res.status(201).json({ id: result.issue.id, message: "Book issued" });
  }),
);

app.patch(
  "/api/admin/issues/:id/return",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    if (!store.returnBook(req.params.id, req.body.fine)) return res.status(404).json({ message: "Issue not found" });
    res.json({ message: "Book returned" });
  }),
);

app.get(
  "/api/admin/validate/student/:studentId",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    const student = store.validateStudent(req.params.studentId.toUpperCase());
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  }),
);

app.get(
  "/api/admin/availability/email",
  asyncRoute(async (req, res) => {
    res.json({ available: store.emailAvailable(req.query.email) });
  }),
);

app.get(
  "/api/admin/availability/isbn",
  requireRole("admin"),
  asyncRoute(async (req, res) => {
    res.json({ available: store.isbnAvailable(req.query.isbn) });
  }),
);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", detail: err.message });
});

app.listen(port, () => {
  console.log(`Library API running on http://localhost:${port}`);
});
