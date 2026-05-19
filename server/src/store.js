import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { md5 } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const dataFile = path.join(dataDir, "library.json");

const now = () => new Date().toISOString();

const seedData = {
  admin: [
    {
      id: 1,
      FullName: "Anuj Kumar",
      AdminEmail: "admin@gmail.com",
      UserName: "admin",
      Password: "21232f297a57a5a743894a0e4a801fc3",
      updationDate: "2024-12-31T19:03:56.000Z",
    },
  ],
  authors: [
    { id: 1, AuthorName: "Anuj kumar", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 2, AuthorName: "Chetan Bhagatt", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 3, AuthorName: "Anita Desai", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 4, AuthorName: "HC Verma", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 5, AuthorName: "R.D. Sharma", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 10, AuthorName: "Dr. Andy Williams", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 11, AuthorName: "Kyle Hill", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 12, AuthorName: "Robert T. Kiyosak", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 13, AuthorName: "Kelly Barnhill", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 14, AuthorName: "Herbert Schildt", creationDate: "2023-12-31T21:23:03.000Z" },
    { id: 16, AuthorName: "Tiffany Timbers", creationDate: "2025-01-07T06:55:54.000Z" },
  ],
  categories: [
    { id: 4, CategoryName: "Romantic", Status: 1, CreationDate: "2025-01-01T07:23:03.000Z" },
    { id: 5, CategoryName: "Technology", Status: 1, CreationDate: "2025-01-01T07:23:03.000Z" },
    { id: 6, CategoryName: "Science", Status: 1, CreationDate: "2025-01-01T07:23:03.000Z" },
    { id: 7, CategoryName: "Management", Status: 1, CreationDate: "2025-01-01T07:23:03.000Z" },
    { id: 8, CategoryName: "General", Status: 1, CreationDate: "2025-01-01T07:23:03.000Z" },
    { id: 9, CategoryName: "Programming", Status: 1, CreationDate: "2025-01-01T07:23:03.000Z" },
  ],
  books: [
    { id: 1, BookName: "PHP And MySql programming", CatId: 5, AuthorId: 1, ISBNNumber: "222333", BookPrice: 20, bookImage: "1efecc0ca822e40b7b673c0d79ae943f.jpg", bookQty: 10, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 3, BookName: "physics", CatId: 6, AuthorId: 4, ISBNNumber: "1111", BookPrice: 15, bookImage: "dd8267b57e0e4feee5911cb1e1a03a79.jpg", bookQty: 10, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 5, BookName: "Murach's MySQL", CatId: 5, AuthorId: 1, ISBNNumber: "9350237695", BookPrice: 455, bookImage: "5939d64655b4d2ae443830d73abc35b6.jpg", bookQty: 20, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 6, BookName: "WordPress for Beginners 2022: A Visual Step-by-Step Guide to Mastering WordPress", CatId: 5, AuthorId: 10, ISBNNumber: "B019MO3WCM", BookPrice: 100, bookImage: "144ab706ba1cb9f6c23fd6ae9c0502b3.jpg", bookQty: 15, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 7, BookName: "WordPress Mastery Guide:", CatId: 5, AuthorId: 11, ISBNNumber: "B09NKWH7NP", BookPrice: 53, bookImage: "90083a56014186e88ffca10286172e64.jpg", bookQty: 14, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 8, BookName: "Rich Dad Poor Dad: What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not", CatId: 8, AuthorId: 12, ISBNNumber: "B07C7M8SX9", BookPrice: 120, bookImage: "52411b2bd2a6b2e0df3eb10943a5b640.jpg", bookQty: 5, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 9, BookName: "The Girl Who Drank the Moon", CatId: 8, AuthorId: 13, ISBNNumber: "1848126476", BookPrice: 200, bookImage: "f05cd198ac9335245e1fdffa793207a7.jpg", bookQty: 1, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 10, BookName: "C++: The Complete Reference, 4th Edition", CatId: 5, AuthorId: 14, ISBNNumber: "007053246X", BookPrice: 142, bookImage: "36af5de9012bf8c804e499dc3c3b33a5.jpg", bookQty: 2, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 11, BookName: "ASP.NET Core 5 for Beginners", CatId: 9, AuthorId: 11, ISBNNumber: "GBSJ36344563", BookPrice: 422, bookImage: "b1b6788016bbfab12cfd2722604badc9.jpg", bookQty: 5, RegDate: "2024-01-02T01:23:03.000Z" },
    { id: 12, BookName: "Python Packages", CatId: 9, AuthorId: 16, ISBNNumber: "0367687771", BookPrice: 3034, bookImage: "ba719639def504c64ebac89cdd0d0a85.jpg", bookQty: 25, RegDate: "2025-01-07T06:56:50.000Z" },
  ],
  issues: [
    { id: 1, BookId: 1, StudentID: "SID002", IssuesDate: "2025-01-13T11:12:40.000Z", ReturnDate: "2025-01-14T06:00:56.000Z", RetrunStatus: 1, fine: 0, remark: "NA" },
    { id: 2, BookId: 7, StudentID: "SID010", IssuesDate: "2025-01-14T05:55:25.000Z", ReturnDate: null, RetrunStatus: null, fine: null, remark: "NA" },
    { id: 3, BookId: 1, StudentID: "SID010", IssuesDate: "2025-01-14T05:55:39.000Z", ReturnDate: null, RetrunStatus: null, fine: null, remark: "NA" },
    { id: 5, BookId: 1, StudentID: "SID002", IssuesDate: "2025-01-14T06:02:14.000Z", ReturnDate: "2025-01-14T06:03:36.000Z", RetrunStatus: 1, fine: 0, remark: "ds" },
  ],
  students: [
    { id: 1, StudentId: "SID002", FullName: "Anuj kumar", EmailId: "anujk@gmail.com", MobileNumber: "9865472555", Password: "21232f297a57a5a743894a0e4a801fc3", Status: 1, RegDate: "2024-01-03T07:23:03.000Z" },
    { id: 4, StudentId: "SID005", FullName: "sdfsd", EmailId: "csfsd@dfsfks.com", MobileNumber: "8569710025", Password: "92228410fc8b872914e023160cf4ae8f", Status: 1, RegDate: "2024-01-03T07:23:03.000Z" },
    { id: 8, StudentId: "SID009", FullName: "test", EmailId: "test@gmail.com", MobileNumber: "2359874527", Password: "21232f297a57a5a743894a0e4a801fc3", Status: 1, RegDate: "2024-01-03T07:23:03.000Z" },
    { id: 9, StudentId: "SID010", FullName: "Amit", EmailId: "amit@gmail.com", MobileNumber: "8585856224", Password: "21232f297a57a5a743894a0e4a801fc3", Status: 1, RegDate: "2024-01-03T07:23:03.000Z" },
    { id: 10, StudentId: "SID011", FullName: "Sarita Pandey", EmailId: "sarita@gmail.com", MobileNumber: "4672423754", Password: "21232f297a57a5a743894a0e4a801fc3", Status: 1, RegDate: "2024-01-03T07:23:03.000Z" },
    { id: 11, StudentId: "SID012", FullName: "John Doe", EmailId: "john@test.com", MobileNumber: "1234569870", Password: "21232f297a57a5a743894a0e4a801fc3", Status: 1, RegDate: "2024-01-03T07:23:03.000Z" },
  ],
  analytics: [
    { id: 1, type: "purchase", bookId: 1, quantity: 2, revenue: 40, createdAt: "2026-05-01T09:15:00.000Z" },
    { id: 2, type: "view", bookId: 1, createdAt: "2026-05-01T09:18:00.000Z" },
    { id: 3, type: "view", bookId: 5, createdAt: "2026-05-02T10:05:00.000Z" },
    { id: 4, type: "purchase", bookId: 5, quantity: 1, revenue: 455, createdAt: "2026-05-03T13:30:00.000Z" },
    { id: 5, type: "view", bookId: 7, createdAt: "2026-05-04T16:10:00.000Z" },
    { id: 6, type: "purchase", bookId: 7, quantity: 3, revenue: 159, createdAt: "2026-05-06T11:40:00.000Z" },
    { id: 7, type: "view", bookId: 8, createdAt: "2026-05-08T08:20:00.000Z" },
    { id: 8, type: "purchase", bookId: 8, quantity: 1, revenue: 120, createdAt: "2026-05-10T17:45:00.000Z" },
    { id: 9, type: "view", bookId: 10, createdAt: "2026-05-12T12:25:00.000Z" },
    { id: 10, type: "view", bookId: 10, createdAt: "2026-05-12T12:30:00.000Z" },
    { id: 11, type: "purchase", bookId: 10, quantity: 2, revenue: 284, createdAt: "2026-05-14T15:05:00.000Z" },
    { id: 12, type: "view", bookId: 12, createdAt: "2026-05-16T09:50:00.000Z" },
    { id: 13, type: "purchase", bookId: 12, quantity: 1, revenue: 3034, createdAt: "2026-05-18T18:20:00.000Z" },
    { id: 14, type: "view", bookId: 1, createdAt: "2026-05-01T11:45:00.000Z" },
    { id: 15, type: "view", bookId: 1, createdAt: "2026-05-02T14:15:00.000Z" },
    { id: 16, type: "view", bookId: 5, createdAt: "2026-05-03T09:35:00.000Z" },
    { id: 17, type: "view", bookId: 5, createdAt: "2026-05-03T19:05:00.000Z" },
    { id: 18, type: "view", bookId: 7, createdAt: "2026-05-06T10:25:00.000Z" },
    { id: 19, type: "view", bookId: 7, createdAt: "2026-05-07T16:40:00.000Z" },
    { id: 20, type: "view", bookId: 8, createdAt: "2026-05-10T13:20:00.000Z" },
    { id: 21, type: "view", bookId: 8, createdAt: "2026-05-11T08:55:00.000Z" },
    { id: 22, type: "view", bookId: 10, createdAt: "2026-05-14T14:30:00.000Z" },
    { id: 23, type: "view", bookId: 10, createdAt: "2026-05-15T17:05:00.000Z" },
    { id: 24, type: "view", bookId: 12, createdAt: "2026-05-18T12:10:00.000Z" },
    { id: 25, type: "view", bookId: 12, createdAt: "2026-05-19T09:25:00.000Z" },
  ],
};

let data;

function readData() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(seedData, null, 2));
  }
  data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  return data;
}

function saveData() {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function nextId(rows) {
  return Math.max(0, ...rows.map((row) => Number(row.id))) + 1;
}

function byId(rows, id) {
  return rows.find((row) => Number(row.id) === Number(id));
}

function findOrCreateAuthor(name) {
  const authorName = String(name || "").trim();
  if (!authorName) return null;
  const existing = data.authors.find((author) => author.AuthorName.toLowerCase() === authorName.toLowerCase());
  if (existing) return existing;
  const author = { id: nextId(data.authors), AuthorName: authorName, creationDate: now(), UpdationDate: null };
  data.authors.push(author);
  return author;
}

function activeIssue(issue) {
  return Number(issue.RetrunStatus) !== 1;
}

function purchaseIssue(issue) {
  return issue.remark === "Student purchase";
}

function ensureAnalytics() {
  if (!Array.isArray(data.analytics)) data.analytics = [];

  let changed = false;
  const issueById = new Map(data.issues.map((issue) => [Number(issue.id), issue]));
  const cleanAnalytics = data.analytics.filter((event) => {
    if (event.type !== "purchase" || !event.issueId) return true;
    const issue = issueById.get(Number(event.issueId));
    return issue && purchaseIssue(issue);
  });
  if (cleanAnalytics.length !== data.analytics.length) {
    data.analytics = cleanAnalytics;
    changed = true;
  }

  for (const issue of data.issues) {
    if (!purchaseIssue(issue)) continue;
    if (data.analytics.some((event) => event.type === "purchase" && Number(event.issueId) === Number(issue.id))) continue;
    const book = byId(data.books, issue.BookId);
    data.analytics.push({
      id: nextId(data.analytics),
      type: "purchase",
      bookId: Number(issue.BookId),
      issueId: issue.id,
      quantity: 1,
      revenue: Number(book?.BookPrice || 0),
      createdAt: issue.IssuesDate || now(),
    });
    changed = true;
  }

  if (changed) saveData();
}

function ensureBookPdfs() {
  let changed = false;
  for (const book of data.books) {
    if (book.bookPdf !== undefined) continue;
    book.bookPdf = "demo-library-book.pdf";
    changed = true;
  }
  if (changed) saveData();
}

function inDateRange(value, from, to) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;
  if (from) {
    const fromTime = new Date(`${from}T00:00:00.000Z`).getTime();
    if (time < fromTime) return false;
  }
  if (to) {
    const toTime = new Date(`${to}T23:59:59.999Z`).getTime();
    if (time > toTime) return false;
  }
  return true;
}

function analyticsForBook(bookId, from, to) {
  const events = data.analytics.filter((event) => Number(event.bookId) === Number(bookId) && inDateRange(event.createdAt, from, to));
  return events.reduce(
    (totals, event) => {
      if (event.type === "purchase") {
        totals.purchases += Number(event.quantity || 1);
        totals.revenue += Number(event.revenue || 0);
      }
      if (event.type === "view") totals.views += 1;
      return totals;
    },
    { purchases: 0, revenue: 0, views: 0 },
  );
}

function availability(bookId) {
  const book = byId(data.books, bookId);
  if (!book) return null;
  const activeIssues = data.issues.filter((issue) => Number(issue.BookId) === Number(bookId) && activeIssue(issue)).length;
  return {
    quantity: Number(book.bookQty || 0),
    activeIssues,
    available: Number(book.bookQty || 0) - activeIssues,
  };
}

function activeStudentIssue(studentId, bookId) {
  return data.issues.find((issue) => issue.StudentID === studentId && Number(issue.BookId) === Number(bookId) && activeIssue(issue));
}

function bookView(book, studentId = null) {
  const category = byId(data.categories, book.CatId);
  const author = byId(data.authors, book.AuthorId);
  const stats = availability(book.id);
  const studentIssue = studentId ? activeStudentIssue(studentId, book.id) : null;
  return {
    ...book,
    CategoryName: category?.CategoryName || "",
    AuthorName: author?.AuthorName || "",
    issuedBooks: data.issues.filter((issue) => Number(issue.BookId) === Number(book.id)).length,
    returnedBooks: data.issues.filter((issue) => Number(issue.BookId) === Number(book.id) && Number(issue.RetrunStatus) === 1).length,
    activeIssues: stats.activeIssues,
    availableQty: stats.available,
    analytics: analyticsForBook(book.id),
    hasPdf: Boolean(book.bookPdf),
    studentHasBook: Boolean(studentIssue),
    studentIssueId: studentIssue?.id || null,
  };
}

function issueView(issue) {
  const student = data.students.find((row) => row.StudentId === issue.StudentID);
  const book = byId(data.books, issue.BookId);
  return {
    FullName: student?.FullName || "",
    StudentId: student?.StudentId || issue.StudentID,
    EmailId: student?.EmailId || "",
    MobileNumber: student?.MobileNumber || "",
    BookName: book?.BookName || "",
    ISBNNumber: book?.ISBNNumber || "",
    bookImage: book?.bookImage || "",
    hasPdf: Boolean(book?.bookPdf),
    IssuesDate: issue.IssuesDate,
    ReturnDate: issue.ReturnDate,
    rid: issue.id,
    fine: issue.fine,
    RetrunStatus: issue.RetrunStatus,
    remark: issue.remark,
    bookId: issue.BookId,
    bid: issue.BookId,
  };
}

function nextStudentId() {
  const current = Math.max(0, ...data.students.map((student) => Number(String(student.StudentId).replace(/\D/g, ""))));
  return `SID${String(current + 1).padStart(3, "0")}`;
}

readData();
ensureAnalytics();
ensureBookPdfs();

export const store = {
  findStudentByLogin(email, password) {
    return data.students.find((student) => student.EmailId === email && student.Password === md5(password));
  },
  findAdminByLogin(username, password) {
    return data.admin.find((admin) => admin.UserName === username && admin.Password === md5(password));
  },
  createStudent({ fullName, mobile, email, password }) {
    if (data.students.some((student) => student.EmailId === email)) return null;
    const student = {
      id: nextId(data.students),
      StudentId: nextStudentId(),
      FullName: fullName,
      EmailId: email,
      MobileNumber: mobile,
      Password: md5(password),
      Status: 1,
      RegDate: now(),
      UpdationDate: null,
    };
    data.students.push(student);
    saveData();
    return student;
  },
  resetStudentPassword(email, mobile, newPassword) {
    const student = data.students.find((row) => row.EmailId === email && row.MobileNumber === mobile);
    if (!student) return false;
    student.Password = md5(newPassword);
    student.UpdationDate = now();
    saveData();
    return true;
  },
  getStudent(studentId) {
    return data.students.find((student) => student.StudentId === studentId);
  },
  updateStudentProfile(studentId, { fullName, mobile }) {
    const student = this.getStudent(studentId);
    if (!student) return null;
    student.FullName = fullName;
    student.MobileNumber = mobile;
    student.UpdationDate = now();
    saveData();
    return student;
  },
  changeStudentPassword(studentId, currentPassword, newPassword) {
    const student = this.getStudent(studentId);
    if (!student || student.Password !== md5(currentPassword)) return false;
    student.Password = md5(newPassword);
    student.UpdationDate = now();
    saveData();
    return true;
  },
  changeAdminPassword(username, currentPassword, newPassword) {
    const admin = data.admin.find((row) => row.UserName === username);
    if (!admin || admin.Password !== md5(currentPassword)) return false;
    admin.Password = md5(newPassword);
    admin.updationDate = now();
    saveData();
    return true;
  },
  listBooks(studentId = null) {
    return [...data.books].sort((a, b) => b.id - a.id).map((book) => bookView(book, studentId));
  },
  bookDownload(studentId, bookId) {
    const issue = data.issues.find((row) => row.StudentID === studentId && Number(row.BookId) === Number(bookId));
    if (!issue) return { error: "You need to buy this book before downloading it", status: 403 };
    const book = byId(data.books, bookId);
    if (!book) return { error: "Book not found", status: 404 };
    if (!book.bookPdf) return { error: "No PDF has been uploaded for this book", status: 404 };
    return {
      file: book.bookPdf,
      name: `${String(book.BookName || "book").replace(/[<>:"/\\|?*]+/g, "").trim() || "book"}.pdf`,
    };
  },
  recordBookView(bookId) {
    const book = byId(data.books, bookId);
    if (!book) return false;
    data.analytics.push({
      id: nextId(data.analytics),
      type: "view",
      bookId: Number(bookId),
      createdAt: now(),
    });
    saveData();
    return true;
  },
  searchBooks(query) {
    const q = String(query || "").toLowerCase();
    return this.listBooks().filter((book) => book.ISBNNumber === query || book.BookName.toLowerCase().includes(q));
  },
  lookups() {
    return {
      categories: [...data.categories].sort((a, b) => a.CategoryName.localeCompare(b.CategoryName)),
      authors: [...data.authors].sort((a, b) => a.AuthorName.localeCompare(b.AuthorName)),
    };
  },
  studentDashboard(studentId) {
    const studentIssues = data.issues.filter((issue) => issue.StudentID === studentId);
    return {
      books: data.books.length,
      activeIssues: studentIssues.filter(activeIssue).length,
      totalIssues: studentIssues.length,
    };
  },
  studentIssues(studentId) {
    return data.issues
      .filter((issue) => issue.StudentID === studentId)
      .sort((a, b) => b.id - a.id)
      .map(issueView);
  },
  adminDashboard({ from, to } = {}) {
    const filteredEvents = data.analytics.filter((event) => inDateRange(event.createdAt, from, to));
    const totals = filteredEvents.reduce(
      (result, event) => {
        if (event.type === "purchase") {
          result.purchases += Number(event.quantity || 1);
          result.revenue += Number(event.revenue || 0);
        }
        if (event.type === "view") result.views += 1;
        return result;
      },
      { purchases: 0, revenue: 0, views: 0 },
    );
    const byDate = new Map();
    for (const event of filteredEvents) {
      const date = String(event.createdAt || "").slice(0, 10);
      if (!date) continue;
      if (!byDate.has(date)) byDate.set(date, { date, purchases: 0, revenue: 0, views: 0 });
      const row = byDate.get(date);
      if (event.type === "purchase") {
        row.purchases += Number(event.quantity || 1);
        row.revenue += Number(event.revenue || 0);
      }
      if (event.type === "view") row.views += 1;
    }

    return {
      books: data.books.length,
      activeIssues: data.issues.filter(activeIssue).length,
      students: data.students.length,
      authors: data.authors.length,
      categories: data.categories.length,
      analytics: {
        ...totals,
        timeline: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
      },
    };
  },
  authors() {
    return [...data.authors].sort((a, b) => b.id - a.id);
  },
  addAuthor(name) {
    const author = { id: nextId(data.authors), AuthorName: name, creationDate: now(), UpdationDate: null };
    data.authors.push(author);
    saveData();
    return author;
  },
  updateAuthor(id, name) {
    const author = byId(data.authors, id);
    if (!author) return false;
    author.AuthorName = name;
    author.UpdationDate = now();
    saveData();
    return true;
  },
  deleteAuthor(id) {
    data.authors = data.authors.filter((author) => Number(author.id) !== Number(id));
    saveData();
  },
  categories() {
    return [...data.categories].sort((a, b) => b.id - a.id);
  },
  addCategory(name, status) {
    const category = { id: nextId(data.categories), CategoryName: name, Status: Number(status), CreationDate: now(), UpdationDate: null };
    data.categories.push(category);
    saveData();
    return category;
  },
  updateCategory(id, name, status) {
    const category = byId(data.categories, id);
    if (!category) return false;
    category.CategoryName = name;
    category.Status = Number(status);
    category.UpdationDate = now();
    saveData();
    return true;
  },
  deleteCategory(id) {
    data.categories = data.categories.filter((category) => Number(category.id) !== Number(id));
    saveData();
  },
  addBook({ bookName, categoryId, authorName, isbn, price, quantity, image, pdf }) {
    const author = findOrCreateAuthor(authorName);
    if (!author) return null;
    const book = {
      id: nextId(data.books),
      BookName: bookName,
      CatId: Number(categoryId),
      AuthorId: author.id,
      ISBNNumber: isbn,
      BookPrice: Number(price),
      bookImage: image || "",
      bookPdf: pdf || "",
      bookQty: Number(quantity),
      RegDate: now(),
      UpdationDate: null,
    };
    data.books.push(book);
    saveData();
    return book;
  },
  updateBook(id, values) {
    const book = byId(data.books, id);
    if (!book) return false;
    const author = findOrCreateAuthor(values.authorName);
    if (!author) return false;
    book.BookName = values.bookName;
    book.CatId = Number(values.categoryId);
    book.AuthorId = author.id;
    book.BookPrice = Number(values.price);
    book.bookQty = Number(values.quantity);
    if (values.image) book.bookImage = values.image;
    if (values.pdf) book.bookPdf = values.pdf;
    book.UpdationDate = now();
    saveData();
    return true;
  },
  deleteBook(id) {
    data.books = data.books.filter((book) => Number(book.id) !== Number(id));
    saveData();
  },
  students() {
    return [...data.students].sort((a, b) => b.id - a.id);
  },
  setStudentStatus(id, status) {
    const student = byId(data.students, id);
    if (!student) return false;
    student.Status = Number(status);
    student.UpdationDate = now();
    saveData();
    return true;
  },
  studentHistory(studentId) {
    return data.issues
      .filter((issue) => issue.StudentID === studentId)
      .sort((a, b) => b.id - a.id)
      .map(issueView);
  },
  adminIssues() {
    return [...data.issues].sort((a, b) => b.id - a.id).map(issueView);
  },
  issueBook({ studentId, bookId, remark, purchase = false }) {
    const student = data.students.find((row) => row.StudentId === studentId);
    if (!student) return { error: "Student not found", status: 404 };
    if (Number(student.Status) !== 1) return { error: "Student account is blocked", status: 400 };
    if (activeStudentIssue(studentId, bookId)) return { error: "You already have this book in your library", status: 409 };

    const stats = availability(bookId);
    if (!stats) return { error: "Book not found", status: 404 };
    if (stats.available <= 0) return { error: "Book is not available", status: 400 };

    const issue = {
      id: nextId(data.issues),
      BookId: Number(bookId),
      StudentID: studentId,
      IssuesDate: now(),
      ReturnDate: null,
      RetrunStatus: null,
      fine: null,
      remark: remark || "NA",
    };
    data.issues.push(issue);
    if (purchase) {
      const book = byId(data.books, bookId);
      data.analytics.push({
        id: nextId(data.analytics),
        type: "purchase",
        bookId: Number(bookId),
        issueId: issue.id,
        quantity: 1,
        revenue: Number(book?.BookPrice || 0),
        createdAt: issue.IssuesDate,
      });
    }
    saveData();
    return { issue };
  },
  deleteStudentIssue(studentId, issueId) {
    const issue = data.issues.find((row) => Number(row.id) === Number(issueId) && row.StudentID === studentId);
    if (!issue) return false;
    data.issues = data.issues.filter((row) => Number(row.id) !== Number(issueId));
    saveData();
    return true;
  },
  returnBook(issueId, fine) {
    const issue = byId(data.issues, issueId);
    if (!issue) return false;
    issue.fine = Number(fine || 0);
    issue.RetrunStatus = 1;
    issue.ReturnDate = now();
    saveData();
    return true;
  },
  validateStudent(studentId) {
    const student = data.students.find((row) => row.StudentId === studentId);
    if (!student) return null;
    return {
      FullName: student.FullName,
      Status: student.Status,
      EmailId: student.EmailId,
      MobileNumber: student.MobileNumber,
    };
  },
  emailAvailable(email) {
    return !data.students.some((student) => student.EmailId === email);
  },
  isbnAvailable(isbn) {
    return !data.books.some((book) => book.ISBNNumber === isbn);
  },
};
