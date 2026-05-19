import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  DollarSign,
  Download,
  X,
  Edit3,
  Eye,
  KeyRound,
  Library,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ANALYTICS_START_DATE = "2026-05-01";

function imageUrl(file) {
  return file ? `${API_URL}/book-images/${file}` : "";
}

function formatDate(value) {
  if (!value) return "Not returned";
  return new Date(value).toLocaleString();
}

function money(value) {
  return Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function dateInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function defaultAnalyticsRange() {
  return { from: ANALYTICS_START_DATE, to: dateInputValue() };
}

function useStoredAuth() {
  const [auth, setAuthState] = useState(() => {
    const raw = localStorage.getItem("library-auth");
    return raw ? JSON.parse(raw) : null;
  });

  function setAuth(next) {
    setAuthState(next);
    if (next) localStorage.setItem("library-auth", JSON.stringify(next));
    else localStorage.removeItem("library-auth");
  }

  return [auth, setAuth];
}

function useApi(auth) {
  return useMemo(() => {
    async function request(path, options = {}) {
      const headers = { ...(options.headers || {}) };
      if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
      if (!(options.body instanceof FormData) && options.body !== undefined) headers["Content-Type"] = "application/json";

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) throw new Error(data?.message || "Request failed");
      return data;
    }

    async function download(path, filename) {
      const headers = {};
      if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
      const response = await fetch(`${API_URL}${path}`, { headers });
      if (!response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        throw new Error(data?.message || "Download failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    return { request, download };
  }, [auth]);
}

function App() {
  const [auth, setAuth] = useStoredAuth();

  if (!auth) return <AuthScreen onAuth={setAuth} />;
  if (auth.role === "admin") return <AdminApp auth={auth} onLogout={() => setAuth(null)} />;
  return <StudentApp auth={auth} onLogout={() => setAuth(null)} />;
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("student");
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const authApi = useApi(null);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      if (mode === "student") {
        const data = await authApi.request("/api/auth/student/login", {
          method: "POST",
          body: { email: form.email, password: form.password },
        });
        onAuth({ role: "student", ...data });
      }
      if (mode === "admin") {
        const data = await authApi.request("/api/auth/admin/login", {
          method: "POST",
          body: { username: form.username, password: form.password },
        });
        onAuth({ role: "admin", ...data });
      }
      if (mode === "signup") {
        await authApi.request("/api/auth/student/signup", {
          method: "POST",
          body: {
            fullName: form.fullName,
            mobile: form.mobile,
            email: form.email,
            password: form.password,
          },
        });
        setMode("student");
        setMessage("Account created. You can log in now.");
      }
      if (mode === "forgot") {
        await authApi.request("/api/auth/student/forgot-password", {
          method: "POST",
          body: { email: form.email, mobile: form.mobile, newPassword: form.newPassword },
        });
        setMode("student");
        setMessage("Password changed. You can log in now.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="brand">
          <Library size={34} />
          <div>
            <h1>Library Management</h1>
            <p>React, Express and JSON storage</p>
          </div>
        </div>

        <div className="segmented">
          <button className={mode === "student" ? "active" : ""} onClick={() => setMode("student")}>Student</button>
          <button className={mode === "admin" ? "active" : ""} onClick={() => setMode("admin")}>Admin</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign up</button>
        </div>

        <form className="form-grid" onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Full name
              <input required value={form.fullName || ""} onChange={(e) => update("fullName", e.target.value)} />
            </label>
          )}
          {mode === "admin" ? (
            <label>
              Username
              <input required value={form.username || ""} onChange={(e) => update("username", e.target.value)} />
            </label>
          ) : (
            <label>
              Email
              <input required type="email" value={form.email || ""} onChange={(e) => update("email", e.target.value)} />
            </label>
          )}
          {(mode === "signup" || mode === "forgot") && (
            <label>
              Mobile number
              <input required value={form.mobile || ""} onChange={(e) => update("mobile", e.target.value)} />
            </label>
          )}
          {mode !== "forgot" ? (
            <label>
              Password
              <input required type="password" value={form.password || ""} onChange={(e) => update("password", e.target.value)} />
            </label>
          ) : (
            <label>
              New password
              <input required type="password" value={form.newPassword || ""} onChange={(e) => update("newPassword", e.target.value)} />
            </label>
          )}
          <button className="primary" type="submit">
            {mode === "signup" ? <Plus size={18} /> : <KeyRound size={18} />}
            {mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Log in"}
          </button>
        </form>

        <button className="link-button" onClick={() => setMode(mode === "forgot" ? "student" : "forgot")}>
          {mode === "forgot" ? "Back to login" : "Forgot student password"}
        </button>
        {message && <p className="notice">{message}</p>}
      </section>
    </main>
  );
}

function Shell({ title, role, tabs, active, onTab, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand compact">
          <Library size={28} />
          <div>
            <h1>Library</h1>
            <p>{role}</p>
          </div>
        </div>
        <nav>
          {tabs.map((tab) => (
            <button key={tab.id} className={active === tab.id ? "active" : ""} onClick={() => onTab(tab.id)}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={onLogout}>
          <LogOut size={18} />
          Log out
        </button>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <div>
            <p>{role}</p>
            <h2>{title}</h2>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function StatGrid({ stats }) {
  return (
    <section className="stats">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <span>{stat.icon}</span>
          <strong>{stat.value}</strong>
          <p>{stat.label}</p>
        </article>
      ))}
    </section>
  );
}

function StudentApp({ auth, onLogout }) {
  const api = useApi(auth);
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [profile, setProfile] = useState(auth.user);
  const [message, setMessage] = useState("");

  async function refresh() {
    try {
      const [dashboard, bookRows, issueRows, profileRow] = await Promise.all([
        api.request("/api/student/dashboard"),
        api.request("/api/books"),
        api.request("/api/student/issues"),
        api.request("/api/student/profile"),
      ]);
      setStats(dashboard);
      setBooks(bookRows);
      setIssues(issueRows);
      setProfile(profileRow);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Library size={18} /> },
    { id: "books", label: "Books", icon: <BookOpen size={18} /> },
    { id: "issues", label: "Issued books", icon: <CheckCircle size={18} /> },
    { id: "profile", label: "Profile", icon: <UserRound size={18} /> },
    { id: "password", label: "Password", icon: <KeyRound size={18} /> },
  ];

  return (
    <Shell title={tabs.find((item) => item.id === tab)?.label} role="Student" tabs={tabs} active={tab} onTab={setTab} onLogout={onLogout}>
      {message && <p className="notice">{message}</p>}
      {tab === "dashboard" && stats && (
        <StatGrid
          stats={[
            { label: "Listed books", value: stats.books, icon: <BookOpen size={24} /> },
            { label: "Active issues", value: stats.activeIssues, icon: <RefreshCw size={24} /> },
            { label: "Issue history", value: stats.totalIssues, icon: <CheckCircle size={24} /> },
          ]}
        />
      )}
      {tab === "books" && <BookGallery books={books} api={api} onViewed={refresh} onPurchased={async () => { await refresh(); setTab("issues"); }} />}
      {tab === "issues" && <StudentIssues api={api} rows={issues} refresh={refresh} />}
      {tab === "profile" && <ProfileForm profile={profile} api={api} onSaved={(next) => setProfile(next)} />}
      {tab === "password" && <PasswordForm api={api} path="/api/student/change-password" />}
    </Shell>
  );
}

function BookGallery({ books, api, onViewed, onPurchased }) {
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState("");
  const [buyingId, setBuyingId] = useState(null);
  const rows = books.filter((book) => `${book.BookName} ${book.AuthorName} ${book.ISBNNumber}`.toLowerCase().includes(query.toLowerCase()));

  async function openBook(book) {
    setSelectedBook(book);
    try {
      await api.request(`/api/books/${book.id}/view`, { method: "POST" });
      await onViewed?.();
    } catch (error) {
      console.error(error);
    }
  }

  async function buyBook(book) {
    if (book.studentHasBook || Number(book.availableQty || 0) <= 0) return;
    setMessage("");
    setBuyingId(book.id);
    try {
      await api.request("/api/student/issues", {
        method: "POST",
        body: { bookId: book.id },
      });
      setSelectedBook(null);
      await onPurchased();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBuyingId(null);
    }
  }

  async function downloadBook(book) {
    setMessage("");
    try {
      await api.download(`/api/books/${book.id}/download`, `${book.BookName}.pdf`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <div className="toolbar">
        <label className="search">
          <Search size={18} />
          <input placeholder="Search books" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      {message && <p className="notice">{message}</p>}
      <div className="book-grid">
        {rows.map((book) => (
          <article className="book-card" key={book.id}>
            <img src={imageUrl(book.bookImage)} alt={book.BookName} />
            <div>
              <h3>{book.BookName}</h3>
              <p>{book.AuthorName}</p>
              <p>{book.CategoryName}</p>
              <dl>
                <dt>ISBN</dt>
                <dd>{book.ISBNNumber}</dd>
                <dt>Price</dt>
                <dd>{money(book.BookPrice)}</dd>
                <dt>Available</dt>
                <dd>{book.availableQty}</dd>
              </dl>
              <div className="book-actions">
                {book.studentHasBook ? (
                  <button className="primary" type="button" disabled={!book.hasPdf} onClick={() => downloadBook(book)}>
                    <Download size={17} />
                    {book.hasPdf ? "Download" : "No PDF"}
                  </button>
                ) : (
                  <button className="primary" type="button" disabled={Number(book.availableQty || 0) <= 0 || buyingId === book.id} onClick={() => buyBook(book)}>
                    <Plus size={17} />
                    {buyingId === book.id ? "Adding..." : "Buy"}
                  </button>
                )}
                <button type="button" onClick={() => openBook(book)}>
                  <BookOpen size={17} />
                  Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {selectedBook && <BookDetailsModal book={selectedBook} buying={buyingId === selectedBook.id} onBuy={() => buyBook(selectedBook)} onDownload={() => downloadBook(selectedBook)} onClose={() => setSelectedBook(null)} />}
    </section>
  );
}

function BookDetailsModal({ book, buying, onBuy, onDownload, onClose }) {
  const available = Number(book.availableQty || 0);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="book-modal" role="dialog" aria-modal="true" aria-label={`${book.BookName} details`} onClick={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" type="button" aria-label="Close details" title="Close" onClick={onClose}>
          <X size={20} />
        </button>
        <img src={imageUrl(book.bookImage)} alt={book.BookName} />
        <div className="book-modal-content">
          <span className={available > 0 ? "status-pill available" : "status-pill unavailable"}>
            {available > 0 ? `${available} available` : "Not available"}
          </span>
          <h3>{book.BookName}</h3>
          <p className="muted">{book.AuthorName}</p>
          <div className="detail-grid">
            <div>
              <span>Category</span>
              <strong>{book.CategoryName}</strong>
            </div>
            <div>
              <span>ISBN</span>
              <strong>{book.ISBNNumber}</strong>
            </div>
            <div>
              <span>Price</span>
              <strong>{money(book.BookPrice)}</strong>
            </div>
            <div>
              <span>Total copies</span>
              <strong>{book.bookQty}</strong>
            </div>
            <div>
              <span>Currently issued</span>
              <strong>{book.activeIssues || 0}</strong>
            </div>
            <div>
              <span>Book ID</span>
              <strong>{book.id}</strong>
            </div>
          </div>
          {book.studentHasBook ? (
            <button className="primary modal-buy" type="button" disabled={!book.hasPdf} onClick={onDownload}>
              <Download size={18} />
              {book.hasPdf ? "Download PDF" : "No PDF uploaded"}
            </button>
          ) : (
            <button className="primary modal-buy" type="button" disabled={available <= 0 || buying} onClick={onBuy}>
              <Plus size={18} />
              {buying ? "Adding to issued books..." : "Buy"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function StudentIssues({ api, rows, refresh }) {
  const [message, setMessage] = useState("");

  async function downloadBook(row) {
    setMessage("");
    try {
      await api.download(`/api/books/${row.bookId}/download`, `${row.BookName}.pdf`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function removeIssue(row) {
    if (!confirm("Remove this book from your library?")) return;
    setMessage("");
    try {
      await api.request(`/api/student/issues/${row.rid}`, { method: "DELETE" });
      await refresh();
      setMessage("Book removed from your library");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      {message && <p className="notice">{message}</p>}
      <div className="table-panel">
        <table>
          <thead><tr><th>Book</th><th>ISBN</th><th>Issued</th><th>Returned</th><th>Fine</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rid}>
                <td>{row.BookName}</td>
                <td>{row.ISBNNumber}</td>
                <td>{formatDate(row.IssuesDate)}</td>
                <td>{formatDate(row.ReturnDate)}</td>
                <td>{row.fine ?? 0}</td>
                <td>{row.RetrunStatus === 1 ? "Returned" : "Issued"}</td>
                <td className="actions">
                  <button title="Download PDF" disabled={!row.hasPdf} onClick={() => downloadBook(row)}><Download size={17} /></button>
                  <button title="Remove" onClick={() => removeIssue(row)}><Trash2 size={17} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProfileForm({ profile, api, onSaved }) {
  const [form, setForm] = useState(profile || {});
  const [message, setMessage] = useState("");

  useEffect(() => setForm(profile || {}), [profile]);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const next = await api.request("/api/student/profile", {
        method: "PUT",
        body: { fullName: form.fullName, mobile: form.mobile },
      });
      onSaved(next);
      setMessage("Profile updated");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className="panel-form" onSubmit={submit}>
      <label>
        Student ID
        <input value={form.studentId || ""} disabled />
      </label>
      <label>
        Full name
        <input value={form.fullName || ""} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
      </label>
      <label>
        Email
        <input value={form.email || ""} disabled />
      </label>
      <label>
        Mobile
        <input value={form.mobile || ""} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
      </label>
      <button className="primary" type="submit"><Edit3 size={18} />Update profile</button>
      {message && <p className="notice">{message}</p>}
    </form>
  );
}

function PasswordForm({ api, path }) {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.request(path, {
        method: "POST",
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      setForm({});
      setMessage("Password changed");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className="panel-form" onSubmit={submit}>
      <label>
        Current password
        <input required type="password" value={form.currentPassword || ""} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
      </label>
      <label>
        New password
        <input required type="password" value={form.newPassword || ""} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
      </label>
      <button className="primary" type="submit"><KeyRound size={18} />Change password</button>
      {message && <p className="notice">{message}</p>}
    </form>
  );
}

function AdminApp({ auth, onLogout }) {
  const api = useApi(auth);
  const [tab, setTab] = useState("dashboard");
  const [editingBook, setEditingBook] = useState(null);
  const [analyticsRange, setAnalyticsRange] = useState(defaultAnalyticsRange);
  const [state, setState] = useState({ stats: null, books: [], issues: [], students: [], authors: [], categories: [], lookups: { authors: [], categories: [] } });
  const [message, setMessage] = useState("");

  async function refresh() {
    try {
      const dashboardQuery = new URLSearchParams();
      if (analyticsRange.from) dashboardQuery.set("from", analyticsRange.from);
      if (analyticsRange.to) dashboardQuery.set("to", analyticsRange.to);
      const dashboardPath = `/api/admin/dashboard${dashboardQuery.toString() ? `?${dashboardQuery}` : ""}`;
      const [stats, books, issues, students, authors, categories, lookups] = await Promise.all([
        api.request(dashboardPath),
        api.request("/api/books"),
        api.request("/api/admin/issues"),
        api.request("/api/admin/students"),
        api.request("/api/admin/authors"),
        api.request("/api/admin/categories"),
        api.request("/api/lookups"),
      ]);
      setState({ stats, books, issues, students, authors, categories, lookups });
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    refresh();
  }, [analyticsRange.from, analyticsRange.to]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Shield size={18} /> },
    { id: "books", label: "Books", icon: <BookOpen size={18} /> },
    { id: "add-book", label: "Add book", icon: <Plus size={18} /> },
    { id: "issues", label: "Issues", icon: <RefreshCw size={18} /> },
    { id: "students", label: "Students", icon: <UsersRound size={18} /> },
    { id: "authors", label: "Authors", icon: <Edit3 size={18} /> },
    { id: "categories", label: "Categories", icon: <Library size={18} /> },
    { id: "password", label: "Password", icon: <KeyRound size={18} /> },
  ];

  function openTab(id) {
    if (id === "add-book") setEditingBook(null);
    setTab(id);
  }

  function editBook(book) {
    setEditingBook(book);
    setTab("add-book");
  }

  return (
    <Shell title={editingBook && tab === "add-book" ? "Edit book" : tabs.find((item) => item.id === tab)?.label} role="Admin" tabs={tabs} active={tab} onTab={openTab} onLogout={onLogout}>
      {message && <p className="notice">{message}</p>}
      {tab === "dashboard" && state.stats && <AdminDashboard stats={state.stats} range={analyticsRange} onRange={setAnalyticsRange} />}
      {tab === "books" && <AdminBooks api={api} books={state.books} refresh={refresh} onEdit={editBook} />}
      {tab === "add-book" && <AdminBookForm api={api} lookups={state.lookups} refresh={refresh} initialBook={editingBook} onSaved={() => setEditingBook(null)} />}
      {tab === "issues" && <AdminIssues api={api} issues={state.issues} books={state.books} refresh={refresh} />}
      {tab === "students" && <Students api={api} rows={state.students} refresh={refresh} />}
      {tab === "authors" && <Authors api={api} rows={state.authors} refresh={refresh} />}
      {tab === "categories" && <Categories api={api} rows={state.categories} refresh={refresh} />}
      {tab === "password" && <PasswordForm api={api} path="/api/admin/change-password" />}
    </Shell>
  );
}

function AdminDashboard({ stats, range, onRange }) {
  const analytics = stats.analytics || { purchases: 0, revenue: 0, views: 0, timeline: [] };
  return (
    <section className="dashboard-stack">
      <StatGrid
        stats={[
          { label: "Books", value: stats.books, icon: <BookOpen size={24} /> },
          { label: "Issued books", value: stats.activeIssues, icon: <RefreshCw size={24} /> },
          { label: "Students", value: stats.students, icon: <UsersRound size={24} /> },
          { label: "Authors", value: stats.authors, icon: <Edit3 size={24} /> },
          { label: "Categories", value: stats.categories, icon: <Library size={24} /> },
          { label: "Purchased books", value: analytics.purchases, icon: <BarChart3 size={24} /> },
          { label: "Revenue", value: money(analytics.revenue), icon: <DollarSign size={24} /> },
          { label: "Book clicks", value: analytics.views, icon: <Eye size={24} /> },
        ]}
      />
      <div className="analytics-panel">
        <div className="analytics-header">
          <h3>Activity over time</h3>
          <div className="date-filters">
            <label>From<input type="date" value={range.from} onChange={(event) => onRange({ ...range, from: event.target.value })} /></label>
            <label>To<input type="date" value={range.to} onChange={(event) => onRange({ ...range, to: event.target.value })} /></label>
            <button type="button" onClick={() => onRange(defaultAnalyticsRange())}>Reset</button>
          </div>
        </div>
        <AnalyticsCharts rows={analytics.timeline || []} />
      </div>
    </section>
  );
}

function AnalyticsCharts({ rows }) {
  const metrics = [
    { key: "purchases", label: "Purchased books", color: "#2b7a78", integer: true, format: (value) => String(Math.round(value)) },
    { key: "revenue", label: "Revenue", color: "#b7791f", format: money },
    { key: "views", label: "Book clicks", color: "#475569", integer: true, format: (value) => String(Math.round(value)) },
  ];

  if (!rows.length) {
    return <div className="empty-chart">No analytics recorded for this time range.</div>;
  }

  return (
    <div className="chart-grid-panel">
      {metrics.map((metric) => (
        <MetricChart key={metric.key} rows={rows} metric={metric} />
      ))}
    </div>
  );
}

function MetricChart({ rows, metric }) {
  const width = 720;
  const height = 260;
  const padding = { top: 20, right: 18, bottom: 46, left: 74 };
  const maxValue = Math.max(1, ...rows.map((row) => Number(row[metric.key] || 0)));
  const middleTick = metric.integer ? Math.ceil(maxValue / 2) : maxValue / 2;
  const ticks = [...new Set([0, middleTick, maxValue])];
  const x = (index) => padding.left + (rows.length <= 1 ? 0 : (index * (width - padding.left - padding.right)) / (rows.length - 1));
  const y = (value) => padding.top + (height - padding.top - padding.bottom) * (1 - Number(value || 0) / maxValue);
  const points = rows.map((row, index) => `${x(index)},${y(row[metric.key])}`).join(" ");

  return (
    <article className="metric-chart">
      <h4>{metric.label}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${metric.label} chart`}>
        <line className="chart-axis" x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} />
        <line className="chart-axis" x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} />
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="chart-grid" x1={padding.left} y1={y(tick)} x2={width - padding.right} y2={y(tick)} />
            <text className="chart-label" x={padding.left - 10} y={y(tick) + 4} textAnchor="end">{metric.format(tick)}</text>
          </g>
        ))}
        <polyline className="chart-line" points={points} stroke={metric.color} />
        {rows.map((row, index) => (
          <circle key={`${metric.key}-${row.date}`} cx={x(index)} cy={y(row[metric.key])} r="4" fill={metric.color} />
        ))}
        {rows.map((row, index) => (
          <text key={row.date} className="chart-label" x={x(index)} y={height - 20} textAnchor={index === 0 ? "start" : index === rows.length - 1 ? "end" : "middle"}>
            {row.date.slice(5)}
          </text>
        ))}
      </svg>
    </article>
  );
}

function AdminBookForm({ api, lookups, refresh, initialBook, onSaved }) {
  const [form, setForm] = useState({ categoryId: "", authorName: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!initialBook) {
      setForm({ categoryId: "", authorName: "" });
      setMessage("");
      return;
    }

    setForm({
      id: initialBook.id,
      bookName: initialBook.BookName,
      categoryId: initialBook.CatId,
      authorName: initialBook.AuthorName,
      isbn: initialBook.ISBNNumber,
      price: initialBook.BookPrice,
      quantity: initialBook.bookQty,
    });
    setMessage("");
  }, [initialBook]);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    const data = new FormData();
    ["bookName", "categoryId", "authorName", "isbn", "price", "quantity"].forEach((field) => data.append(field, form[field] || ""));
    if (form.image) data.append("image", form.image);
    if (form.pdf) data.append("pdf", form.pdf);

    try {
      await api.request(form.id ? `/api/admin/books/${form.id}` : "/api/admin/books", {
        method: form.id ? "PUT" : "POST",
        body: data,
      });
      setForm({ categoryId: "", authorName: "" });
      await refresh();
      onSaved?.();
      setMessage(form.id ? "Book updated" : "Book added");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function cancelEdit() {
    setForm({ categoryId: "", authorName: "" });
    onSaved?.();
  }

  return (
    <form className="panel-form" onSubmit={submit}>
      <h3>{form.id ? "Edit book" : "Add book"}</h3>
      <label>Book name<input required value={form.bookName || ""} onChange={(e) => setForm({ ...form, bookName: e.target.value })} /></label>
      <label>Category<select required value={form.categoryId || ""} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
        <option value="">Select category</option>
        {lookups.categories.map((item) => <option key={item.id} value={item.id}>{item.CategoryName}</option>)}
      </select></label>
      <label>Author<input required value={form.authorName || ""} onChange={(e) => setForm({ ...form, authorName: e.target.value })} /></label>
      <label>ISBN<input required disabled={Boolean(form.id)} value={form.isbn || ""} onChange={(e) => setForm({ ...form, isbn: e.target.value })} /></label>
      <label>Price<input required type="number" step="0.01" value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
      <label>Quantity<input required type="number" value={form.quantity || ""} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
      <label>Book image<input type="file" accept="image/*" required={!form.id} onChange={(e) => setForm({ ...form, image: e.target.files[0] })} /></label>
      <label>Book PDF<input type="file" accept="application/pdf,.pdf" required={!form.id} onChange={(e) => setForm({ ...form, pdf: e.target.files[0] })} /></label>
      <button className="primary" type="submit"><Plus size={18} />{form.id ? "Save book" : "Add book"}</button>
      {form.id && <button type="button" onClick={cancelEdit}>Cancel edit</button>}
      {message && <p className="notice">{message}</p>}
    </form>
  );
}

function AdminBooks({ api, books, refresh, onEdit }) {
  const [message, setMessage] = useState("");

  async function remove(id) {
    if (!confirm("Delete this book?")) return;
    try {
      await api.request(`/api/admin/books/${id}`, { method: "DELETE" });
      await refresh();
      setMessage("Book deleted");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      {message && <p className="notice">{message}</p>}
      <div className="table-panel">
        <table>
          <thead><tr><th>Book</th><th>Author</th><th>ISBN</th><th>Available</th><th>Purchases</th><th>Revenue</th><th>Clicks</th><th></th></tr></thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td className="book-cell"><img src={imageUrl(book.bookImage)} alt="" />{book.BookName}</td>
                <td>{book.AuthorName}</td>
                <td>{book.ISBNNumber}</td>
                <td>{book.availableQty}</td>
                <td>{book.analytics?.purchases || 0}</td>
                <td>{money(book.analytics?.revenue || 0)}</td>
                <td>{book.analytics?.views || 0}</td>
                <td className="actions">
                  <button title="Edit" onClick={() => onEdit(book)}><Edit3 size={17} /></button>
                  <button title="Delete" onClick={() => remove(book.id)}><Trash2 size={17} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminIssues({ api, issues, books, refresh }) {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const availableBooks = books.filter((book) => book.availableQty > 0);

  async function issue(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.request("/api/admin/issues", { method: "POST", body: form });
      setForm({});
      await refresh();
      setMessage("Book issued");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function returnBook(row) {
    const fine = prompt("Fine amount", row.fine || "0");
    if (fine === null) return;
    await api.request(`/api/admin/issues/${row.rid}/return`, { method: "PATCH", body: { fine } });
    refresh();
  }

  return (
    <section className="admin-grid">
      <form className="panel-form" onSubmit={issue}>
        <h3>Issue book</h3>
        <label>Student ID<input required value={form.studentId || ""} onChange={(e) => setForm({ ...form, studentId: e.target.value.toUpperCase() })} /></label>
        <label>Book<select required value={form.bookId || ""} onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
          <option value="">Select available book</option>
          {availableBooks.map((book) => <option key={book.id} value={book.id}>{book.BookName} ({book.availableQty})</option>)}
        </select></label>
        <label>Remark<textarea value={form.remark || ""} onChange={(e) => setForm({ ...form, remark: e.target.value })} /></label>
        <button className="primary" type="submit"><Plus size={18} />Issue book</button>
        {message && <p className="notice">{message}</p>}
      </form>
      <div className="table-panel">
        <table>
          <thead><tr><th>Student</th><th>Book</th><th>Issued</th><th>Returned</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {issues.map((row) => (
              <tr key={row.rid}>
                <td>{row.FullName}<small>{row.StudentId}</small></td>
                <td>{row.BookName}<small>{row.ISBNNumber}</small></td>
                <td>{formatDate(row.IssuesDate)}</td>
                <td>{formatDate(row.ReturnDate)}</td>
                <td>{row.RetrunStatus === 1 ? "Returned" : "Issued"}</td>
                <td>{row.RetrunStatus === 1 ? "" : <button onClick={() => returnBook(row)}>Return</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Students({ api, rows, refresh }) {
  async function toggle(row) {
    await api.request(`/api/admin/students/${row.id}/status`, {
      method: "PATCH",
      body: { status: Number(row.Status) === 1 ? 0 : 1 },
    });
    refresh();
  }

  return (
    <div className="table-panel">
      <table>
        <thead><tr><th>Student ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.StudentId}</td>
              <td>{row.FullName}</td>
              <td>{row.EmailId}</td>
              <td>{row.MobileNumber}</td>
              <td>{Number(row.Status) === 1 ? "Active" : "Blocked"}</td>
              <td><button onClick={() => toggle(row)}>{Number(row.Status) === 1 ? "Block" : "Activate"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Authors({ api, rows, refresh }) {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.request(`/api/admin/authors/${form.id}`, {
        method: "PUT",
        body: { name: form.name },
      });
      setForm({});
      await refresh();
      setMessage("Author saved");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this author?")) return;
    await api.request(`/api/admin/authors/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <>
      {form.id && (
        <form className="panel-form edit-panel" onSubmit={submit}>
          <h3>Edit author</h3>
          <label>Author<input required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <button className="primary" type="submit"><Edit3 size={18} />Save</button>
          <button type="button" onClick={() => setForm({})}>Cancel edit</button>
          {message && <p className="notice">{message}</p>}
        </form>
      )}
      {!form.id && message && <p className="notice">{message}</p>}
      <div className="table-panel">
        <table>
          <thead><tr><th>Author</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.AuthorName}</td>
                <td>{formatDate(row.creationDate || row.CreationDate)}</td>
                <td className="actions">
                  <button title="Edit" onClick={() => setForm({ id: row.id, name: row.AuthorName })}><Edit3 size={17} /></button>
                  <button title="Delete" onClick={() => remove(row.id)}><Trash2 size={17} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Categories({ api, rows, refresh }) {
  const [form, setForm] = useState({ status: 1 });
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.request(form.id ? `/api/admin/categories/${form.id}` : "/api/admin/categories", {
        method: form.id ? "PUT" : "POST",
        body: { name: form.name, status: Number(form.status) },
      });
      setForm({ status: 1 });
      await refresh();
      setMessage("Category saved");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this category?")) return;
    await api.request(`/api/admin/categories/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <section className="admin-grid">
      <form className="panel-form" onSubmit={submit}>
        <h3>{form.id ? "Edit category" : "Add category"}</h3>
        <label>Category<input required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select></label>
        <button className="primary" type="submit"><Plus size={18} />Save</button>
        {form.id && <button type="button" onClick={() => setForm({ status: 1 })}>Cancel edit</button>}
        {message && <p className="notice">{message}</p>}
      </form>
      <div className="table-panel">
        <table>
          <thead><tr><th>Category</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.CategoryName}</td>
                <td>{Number(row.Status) === 1 ? "Active" : "Inactive"}</td>
                <td className="actions">
                  <button title="Edit" onClick={() => setForm({ id: row.id, name: row.CategoryName, status: row.Status })}><Edit3 size={17} /></button>
                  <button title="Delete" onClick={() => remove(row.id)}><Trash2 size={17} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-panel">
      <table>
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
