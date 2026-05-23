/**
 * CreateService.jsx
 * ──────────────────────────────────────────────
 * Slotify — Create Service Page
 *
 * Brand color   : #3838d2 (indigo-blue)
 * Font          : Adamina (serif, editorial) + DM Sans (UI body)
 * Framework     : React + Tailwind CSS
 * Icons         : Inline SVG only — zero emoji, zero external icon lib
 *
 * Add to index.html / _document.jsx:
 * <link href="https://fonts.googleapis.com/css2?family=Adamina&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
 *
 * Drop-in replacement. Only peer dep: react-router-dom (useParams).
 */

import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosInstance";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

/** Service categories with professional SVG icons */
const CATEGORIES = [
  {
    value: "Consulting",
    label: "Consulting",
    icon: (
      // Briefcase icon
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <rect x="2" y="7" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 11h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "Coaching",
    label: "Coaching",
    icon: (
      // Person with upward arrow
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 4l2-2m0 0l2 2m-2-2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: "Workshop",
    label: "Workshop",
    icon: (
      // Group / people icon
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 17c0-2.761 2.686-5 6-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 17c0-2.761-2.686-5-6-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 12c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "Design",
    label: "Design",
    icon: (
      // Pen tool / nib icon
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M10 17L3 10l7-7 7 7-7 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 17v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "Development",
    label: "Development",
    icon: (
      // Code brackets icon
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M6 7l-4 3 4 3M14 7l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 5l-2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "Other",
    label: "Other",
    icon: (
      // Dots / grid icon
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
        <circle cx="10" cy="5" r="1.5" fill="currentColor" />
        <circle cx="15" cy="5" r="1.5" fill="currentColor" />
        <circle cx="5" cy="10" r="1.5" fill="currentColor" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
        <circle cx="15" cy="10" r="1.5" fill="currentColor" />
        <circle cx="5" cy="15" r="1.5" fill="currentColor" />
        <circle cx="10" cy="15" r="1.5" fill="currentColor" />
        <circle cx="15" cy="15" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

/** Duration options */
const DURATIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hr" },
  { value: "90", label: "1.5 hr" },
];

/** Blank form state */
const INITIAL_FORM = {
  name:        "",
  description: "",
  category:    "",
  duration:    "30",
  price:       "",
};

// ─────────────────────────────────────────────
// ICON ATOMS  (inline SVG — no lib required)
// ─────────────────────────────────────────────

/** Text cursor / label icon */
const IconTag = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M3 5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 0 1.414l-5.586 5.586a1 1 0 0 1-1.414 0L4.293 10.293A1 1 0 0 1 4 9.586V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="7" cy="8" r="1" fill="currentColor" />
  </svg>
);

/** Description / lines icon */
const IconAlignLeft = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M3 5h14M3 9h10M3 13h12M3 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Clock icon */
const IconClock = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Currency / price icon */
const IconCurrency = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 6v8M7.5 8.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5S11.38 11 10 11s-2.5 1.12-2.5 2.5S8.62 16 10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Spinner for loading state */
const IconSpinner = () => (
  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Right arrow */
const IconArrow = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Checkmark */
const IconCheck = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─────────────────────────────────────────────
// SMALL UI COMPONENTS
// ─────────────────────────────────────────────

/**
 * FieldLabel
 * Consistent label with leading icon above every field.
 */
function FieldLabel({ icon, children }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 select-none"
           style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <span className="text-[#3838d2]">{icon}</span>
      {children}
    </label>
  );
}

/**
 * SectionDivider
 * Subtle hairline with centred label between major form sections.
 */
function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

/**
 * ServicePreviewCard
 * Live summary of what the service will look like once created.
 * Rendered in the right-hand panel.
 */
function ServicePreviewCard({ form, category }) {
  const isEmpty = !form.name && !form.category && !form.price;

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#3838d2]/20 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="bg-[#3838d2] px-5 py-3.5 flex items-center justify-between">
        <span className="text-white text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Service Preview
        </span>
        {/* Live indicator */}
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#a5b4fc] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Live</span>
        </span>
      </div>

      {/* Body */}
      <div className="bg-gradient-to-br from-[#3838d2]/5 to-white px-5 py-5 min-h-[160px] flex flex-col justify-center">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-2 opacity-40 py-4">
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10 text-[#3838d2]">
              <rect x="8" y="8" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M20 15v10M15 20h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Fill in the form to preview your service
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            {/* Category badge */}
            {form.category && (
              <span className="inline-flex items-center gap-1.5 bg-[#3838d2]/10 text-[#3838d2] text-xs font-bold px-3 py-1 rounded-full"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {category?.icon}
                {form.category}
              </span>
            )}

            {/* Service name */}
            <h3 className="text-xl font-bold text-gray-900 leading-snug"
                style={{ fontFamily: "'Adamina', serif" }}>
              {form.name || <span className="text-gray-300 italic font-normal text-base">Service name…</span>}
            </h3>

            {/* Description snippet */}
            {form.description && (
              <p className="text-sm text-gray-500 line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {form.description}
              </p>
            )}

            {/* Meta row — duration + price */}
            <div className="flex items-center gap-3 pt-1">
              {form.duration && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <IconClock />
                  {DURATIONS.find((d) => d.value === form.duration)?.label}
                </span>
              )}
              {form.price && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#3838d2] bg-[#3838d2]/10 px-3 py-1.5 rounded-full"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <IconCurrency />
                  ₹{Number(form.price).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function CreateService() {

  // ── Routing ────────────────────────────────
  const { slug } = useParams();

  // ── State ──────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form,    setForm]    = useState(INITIAL_FORM);

  // ── Derived ────────────────────────────────
  /** Currently selected category object (for icon in preview) */
  const selectedCategory = CATEGORIES.find((c) => c.value === form.category);

  // ── Handlers ───────────────────────────────

  /** Generic field updater */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** Category card click */
  const handleCategory = (value) =>
    setForm((prev) => ({ ...prev, category: value }));

  /** Duration pill click */
  const handleDuration = (value) =>
    setForm((prev) => ({ ...prev, duration: value }));

  /** Form submit → POST to API */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        name:        form.name,
        description: form.description,
        category:    form.category,
        duration:    Number(form.duration),
        price:       Number(form.price),
      };

      await API.post(`/tenant/${slug}/services/create/`, payload);

      // ── Success state ──
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm(INITIAL_FORM);
      }, 2400);

    } catch (err) {
      console.error("CreateService error:", err.response?.data || err);
      alert("Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      {/* ── Global styles + font imports ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Adamina&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.88); }
          70%  { transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1);    }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0);    }
        }

        .animate-fadeIn  { animation: fadeIn  0.35s ease both; }
        .animate-popIn   { animation: popIn   0.4s  ease both; }
        .animate-slideIn { animation: slideIn 0.3s  ease both; }

        /* Tailwind can't interpolate dynamic font-family strings — set via class */
        .font-adamina { font-family: 'Adamina', Georgia, serif; }
        .font-dm      { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Remove native number input arrows */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* ── Page shell ── */}
      <div className="min-h-screen bg-[#f5f6fb] font-dm flex items-start justify-center px-4 py-10">

        {/* ── Success overlay ── */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center gap-4 animate-popIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <IconCheck />
              </div>
              <p className="text-xl font-bold text-gray-800 font-adamina">Service Created</p>
              <p className="text-sm text-gray-400 font-dm">Your service is now live on Slotify.</p>
            </div>
          </div>
        )}

        {/* ── Two-column layout ── */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ════════════════════════════════════
              LEFT — Main form card
          ════════════════════════════════════ */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Card top accent bar */}
            <div className="h-1.5 bg-[#3838d2]" />

            <div className="px-7 py-8 sm:px-10">

              {/* Page title */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3838d2] mb-1 font-dm">
                  Slotify
                </p>
                <h1 className="text-3xl font-bold text-gray-900 font-adamina leading-tight">
                  Create a Service
                </h1>
                <p className="text-sm text-gray-400 mt-1 font-dm">
                  Define what you offer and how clients can book you.
                </p>
              </div>

              {/* ── FORM ── */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── SERVICE NAME ── */}
                <div className="animate-slideIn" style={{ animationDelay: "0ms" }}>
                  <FieldLabel icon={<IconTag />}>Service Name</FieldLabel>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Brand Strategy Session"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-800
                      font-dm text-[15px] bg-white placeholder-gray-300
                      focus:outline-none focus:border-[#3838d2] focus:ring-4 focus:ring-[#3838d2]/10
                      transition-all duration-200"
                  />
                </div>

                {/* ── DESCRIPTION ── */}
                <div className="animate-slideIn" style={{ animationDelay: "40ms" }}>
                  <FieldLabel icon={<IconAlignLeft />}>Description</FieldLabel>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Briefly describe what clients can expect from this service…"
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-800
                      font-dm text-[15px] bg-white placeholder-gray-300 resize-none
                      focus:outline-none focus:border-[#3838d2] focus:ring-4 focus:ring-[#3838d2]/10
                      transition-all duration-200 leading-relaxed"
                  />
                </div>

                <SectionDivider label="Details" />

                {/* ── CATEGORY ── */}
                <div className="animate-slideIn" style={{ animationDelay: "80ms" }}>
                  <FieldLabel icon={
                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                      <path d="M3 4h14M3 8h9M3 12h12M3 16h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  }>
                    Category
                  </FieldLabel>

                  {/* 3-column category card grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1">
                    {CATEGORIES.map((cat) => {
                      const active = form.category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => handleCategory(cat.value)}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 text-left
                            transition-all duration-200 select-none
                            ${active
                              ? "border-[#3838d2] bg-[#3838d2] text-white shadow-md shadow-[#3838d2]/25"
                              : "border-gray-200 bg-white text-gray-600 hover:border-[#3838d2]/40 hover:bg-[#3838d2]/5 hover:text-[#3838d2]"
                            }`}
                        >
                          {/* Icon inherits currentColor */}
                          <span className="shrink-0">{cat.icon}</span>
                          <span className="text-sm font-semibold font-dm">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Hidden required input to enforce selection */}
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={() => {}}
                    required
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden
                  />
                </div>

                {/* ── DURATION ── */}
                <div className="animate-slideIn" style={{ animationDelay: "120ms" }}>
                  <FieldLabel icon={<IconClock />}>Session Duration</FieldLabel>

                  {/* Pill row */}
                  <div className="flex gap-2 flex-wrap mt-1">
                    {DURATIONS.map((d) => {
                      const active = form.duration === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => handleDuration(d.value)}
                          className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold font-dm
                            transition-all duration-200 select-none
                            ${active
                              ? "border-[#3838d2] bg-[#3838d2] text-white shadow-md shadow-[#3838d2]/20"
                              : "border-gray-200 text-gray-600 hover:border-[#3838d2]/50 hover:text-[#3838d2]"
                            }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── PRICE ── */}
                <div className="animate-slideIn" style={{ animationDelay: "160ms" }}>
                  <FieldLabel icon={<IconCurrency />}>Price</FieldLabel>

                  {/* Prefix adorned input */}
                  <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden
                    focus-within:border-[#3838d2] focus-within:ring-4 focus-within:ring-[#3838d2]/10
                    transition-all duration-200 bg-white">
                    {/* Currency symbol box */}
                    <span className="px-4 py-3.5 text-sm font-bold text-[#3838d2] bg-[#3838d2]/5 border-r-2 border-gray-200 font-dm select-none">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      className="flex-1 px-4 py-3.5 text-gray-800 text-[15px] bg-transparent
                        outline-none placeholder-gray-300 font-dm"
                    />
                  </div>
                </div>

                {/* ── SUBMIT ── */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 py-4 rounded-2xl font-bold text-base font-dm tracking-wide
                    flex items-center justify-center gap-2.5 transition-all duration-200
                    ${loading
                      ? "bg-[#3838d2]/60 text-white/80 cursor-not-allowed"
                      : "bg-[#3838d2] text-white hover:bg-[#2a2aab] active:scale-[0.98] shadow-lg shadow-[#3838d2]/30 hover:shadow-xl hover:shadow-[#3838d2]/40"
                    }`}
                >
                  {loading ? (
                    <>
                      <IconSpinner />
                      <span>Creating service…</span>
                    </>
                  ) : (
                    <>
                      <span>Create Service</span>
                      <IconArrow />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* ════════════════════════════════════
              RIGHT — Sidebar: preview + tips
          ════════════════════════════════════ */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-10">

            {/* Brand wordmark */}
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-[#3838d2] flex items-center justify-center">
                {/* Slotify S-mark */}
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-white">
                  <path d="M14 6.5C14 5.12 12.88 4 11.5 4H9C7.34 4 6 5.34 6 7c0 1.48 1.12 2.7 2.57 2.96L11 10.4C12.17 10.63 13 11.67 13 12.88 13 14.06 12.06 15 10.88 15H8.5C7.12 15 6 13.88 6 12.5"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 3v1M10 16v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-base font-bold text-[#3838d2] font-adamina">Slotify</span>
            </div>

            {/* Live preview card */}
            <ServicePreviewCard form={form} category={selectedCategory} />

            {/* Help / tip cards */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-dm">
                Setup tips
              </p>
              <ul className="space-y-3">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 text-[#3838d2]">
                        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ),
                    text: "A clear name helps clients find you faster.",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 text-[#3838d2]">
                        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 5v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    text: "Duration sets how long each booked slot lasts.",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 text-[#3838d2]">
                        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                    text: "After saving, set availability on the next screen.",
                  },
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {tip.icon}
                    <p className="text-xs text-gray-500 font-dm leading-relaxed">{tip.text}</p>
                  </li>
                ))}
              </ul>
            </div>

          </aside>

        </div>
      </div>
    </>
  );
}