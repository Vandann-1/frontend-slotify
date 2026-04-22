import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    bg: "#e6f4ee",
    color: "#1a7f52",
    dot: "#22c76e",
  },
  pending: {
    label: "Pending",
    bg: "#fff8e6",
    color: "#a16207",
    dot: "#f59e0b",
  },
  cancelled: {
    label: "Cancelled",
    bg: "#fef2f2",
    color: "#b91c1c",
    dot: "#ef4444",
  },
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ ...styles.skel, width: 140, height: 14, marginBottom: 8 }} />
          <div style={{ ...styles.skel, width: 90, height: 11 }} />
        </div>
        <div style={{ ...styles.skel, width: 72, height: 22, borderRadius: 20 }} />
      </div>
      <div style={styles.divider} />
      <div style={{ display: "flex", gap: 32 }}>
        <div>
          <div style={{ ...styles.skel, width: 40, height: 10, marginBottom: 6 }} />
          <div style={{ ...styles.skel, width: 80, height: 13 }} />
        </div>
        <div>
          <div style={{ ...styles.skel, width: 40, height: 10, marginBottom: 6 }} />
          <div style={{ ...styles.skel, width: 64, height: 13 }} />
        </div>
        <div>
          <div style={{ ...styles.skel, width: 40, height: 10, marginBottom: 6 }} />
          <div style={{ ...styles.skel, width: 56, height: 13 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, index }) {
  const status = booking.status || "confirmed";
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed;

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);

  const formatted = (() => {
    try {
      const d = new Date(booking.date);
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    } catch {
      return booking.date;
    }
  })();

  const initials = (booking.service || "SV")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        ...styles.card,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <p style={styles.serviceName}>{booking.service || "—"}</p>
            {booking.provider && (
              <p style={styles.provider}>with {booking.provider}</p>
            )}
          </div>
        </div>
        {/* Status badge */}
        <span style={{ ...styles.badge, background: cfg.bg, color: cfg.color }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", marginRight: 5 }} />
          {cfg.label}
        </span>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Meta row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px" }}>
        <MetaItem icon={CalIcon} label="Date" value={formatted} />
        <MetaItem icon={ClockIcon} label="Time" value={booking.start_time || "—"} />
        {booking.duration && <MetaItem icon={TimerIcon} label="Duration" value={booking.duration} />}
        {booking.location && <MetaItem icon={PinIcon} label="Location" value={booking.location} />}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button style={styles.btnPrimary}>View details</button>
        {status !== "cancelled" && (
          <button style={styles.btnGhost}>Reschedule</button>
        )}
      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div>
      <p style={styles.metaLabel}>
        <Icon /> {label}
      </p>
      <p style={styles.metaValue}>{value}</p>
    </div>
  );
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ verticalAlign: "middle", marginRight: 3 }}>
    <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ verticalAlign: "middle", marginRight: 3 }}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const TimerIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ verticalAlign: "middle", marginRight: 3 }}>
    <circle cx="8" cy="9" r="6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 6v3l1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M6 1h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ verticalAlign: "middle", marginRight: 3 }}>
    <path d="M8 14S3 9.5 3 6a5 5 0 0 1 10 0c0 3.5-5 8-5 8z" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const FILTERS = ["All", "Confirmed", "Pending", "Cancelled"];

// ─── Main component ───────────────────────────────────────────────────────────
export default function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/booking/list/")
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.message || "Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => {
    const matchStatus =
      filter === "All" || (b.status || "confirmed").toLowerCase() === filter.toLowerCase();
    const matchSearch =
      !search ||
      (b.service || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.provider || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => (b.status || "confirmed") === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Bookings</h1>
          <p style={styles.subheading}>Manage and track all your appointments</p>
        </div>
        <button style={styles.newBtn}>+ New booking</button>
      </div>

      {/* ── Stats row ── */}
      <div style={styles.statsRow}>
        {[
          { label: "Total", value: stats.total, color: "#6366f1" },
          { label: "Confirmed", value: stats.confirmed, color: "#22c76e" },
          { label: "Pending", value: stats.pending, color: "#f59e0b" },
          { label: "Cancelled", value: stats.cancelled, color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ ...styles.statDot, background: s.color }} />
            <div>
              <p style={styles.statLabel}>{s.label}</p>
              <p style={styles.statValue}>{loading ? "—" : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={styles.toolbar}>
        {/* Search */}
        <div style={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={styles.searchIcon}>
            <circle cx="7" cy="7" r="5" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filter tabs */}
        <div style={styles.tabs}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.tab, ...(filter === f ? styles.tabActive : {}) }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={styles.empty}>
          <p style={{ color: "#ef4444", fontWeight: 500 }}>Error</p>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ marginBottom: 12 }}>
            <rect x="5" y="8" width="30" height="26" rx="4" stroke="#d1d5db" strokeWidth="1.8" />
            <path d="M13 3v10M27 3v10M5 16h30" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M14 24h12M17 29h6" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <p style={{ color: "#374151", fontWeight: 500 }}>No bookings found</p>
          <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>
            {search ? "Try a different search term" : "You have no bookings yet"}
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((b, i) => (
            <BookingCard key={b.id || i} booking={b} index={i} />
          ))}
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginTop: 24 }}>
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "32px 20px 60px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#111827",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subheading: {
    fontSize: 14,
    color: "#6b7280",
    margin: "4px 0 0",
  },
  newBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "-0.2px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: "#f9fafb",
    border: "1px solid #f0f0f0",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    margin: "2px 0 0",
    lineHeight: 1,
  },
  toolbar: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchWrap: {
    position: "relative",
    flex: "1 1 200px",
    minWidth: 180,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "9px 12px 9px 34px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  tabs: {
    display: "flex",
    background: "#f3f4f6",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  tab: {
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  tabActive: {
    background: "#fff",
    color: "#111827",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  card: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 16,
    padding: "18px 20px",
    marginBottom: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: "0.5px",
  },
  serviceName: {
    margin: 0,
    fontWeight: 600,
    fontSize: 15,
    color: "#0f172a",
  },
  provider: {
    margin: "2px 0 0",
    fontSize: 12,
    color: "#9ca3af",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  divider: {
    height: 1,
    background: "#f3f4f6",
    margin: "14px 0",
  },
  metaLabel: {
    margin: "0 0 3px",
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
  },
  metaValue: {
    margin: 0,
    fontSize: 13,
    color: "#374151",
    fontWeight: 500,
  },
  btnPrimary: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnGhost: {
    background: "transparent",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#374151",
  },
  skel: {
    background: "#f3f4f6",
    borderRadius: 6,
    display: "block",
    animation: "bpulse 1.4s ease-in-out infinite",
  },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@keyframes bpulse {
  0%,100% { opacity: 0.6 }
  50% { opacity: 1 }
}
`;