/**
 * CreateAvailability.jsx
 * ──────────────────────
 * Slotify-inspired availability creation page.
 * Brand color  : #3838d2 (indigo-blue)
 * Font         : Adamina (Google Fonts) – serif, editorial feel
 * Framework    : React + Tailwind CSS
 * 
 * Drop-in replacement for the original page.
 * Only external dep added: Google Font import (add to index.html / _document).
 * 
 * <link href="https://fonts.googleapis.com/css2?family=Adamina&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
 */

import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

/** Python-style weekday index → label */
const DAYS = [
  { value: "1", label: "Monday",    short: "MON" },
  { value: "2", label: "Tuesday",   short: "TUE" },
  { value: "3", label: "Wednesday", short: "WED" },
  { value: "4", label: "Thursday",  short: "THU" },
  { value: "5", label: "Friday",    short: "FRI" },
  { value: "6", label: "Saturday",  short: "SAT" },
  { value: "7", label: "Sunday",    short: "SUN" },
];

/** Initial form state */
const INITIAL_FORM = {
  service:       "",
  mode:          "weekly",   // "weekly" | "specific"
  day_of_week:   "",
  date_specific: "",
  start_time:    "",
  end_time:      "",
};

// ─────────────────────────────────────────────
// SMALL REUSABLE UI ATOMS
// ─────────────────────────────────────────────

/** Step badge shown in the left sidebar */
function StepBadge({ number, label, active, done }) {
  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300
      ${active ? "bg-[#3838d2]/10 text-[#3838d2]" : done ? "text-green-600" : "text-gray-400"}`}>
      <span
        className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0 border-2 transition-all
          ${active
            ? "bg-[#3838d2] border-[#3838d2] text-white scale-110"
            : done
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 text-gray-400"}`}
      >
        {done ? "✓" : number}
      </span>
      <span className="text-sm font-medium font-[DM_Sans] tracking-wide">{label}</span>
    </div>
  );
}

/** Pill-style toggle for Weekly / Specific Date */
function ModeToggle({ value, onChange }) {
  return (
    <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
      {["weekly", "specific"].map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold font-[DM_Sans] transition-all duration-200
            ${value === mode
              ? "bg-[#3838d2] text-white shadow-md shadow-[#3838d2]/30"
              : "text-gray-500 hover:text-gray-700"}`}
        >
          {mode === "weekly" ? "🔁  Weekly Repeat" : "📅  Specific Date"}
        </button>
      ))}
    </div>
  );
}

/** Day-of-week pill grid */
function DayPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAYS.map((day) => {
        const selected = value === day.value;
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => onChange(day.value)}
            title={day.label}
            className={`flex flex-col items-center justify-center py-3 rounded-2xl text-xs font-bold font-[DM_Sans]
              transition-all duration-200 border-2 select-none
              ${selected
                ? "bg-[#3838d2] border-[#3838d2] text-white scale-105 shadow-lg shadow-[#3838d2]/30"
                : "bg-white border-gray-200 text-gray-500 hover:border-[#3838d2]/50 hover:text-[#3838d2]"}`}
          >
            <span>{day.short}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Slot-style time display inside the time inputs */
function TimeField({ label, name, value, onChange, icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 tracking-widest uppercase font-[DM_Sans]">
        {icon} {label}
      </label>
      <input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-800
          font-[DM_Sans] text-base tracking-wider bg-white
          focus:outline-none focus:border-[#3838d2] focus:ring-4 focus:ring-[#3838d2]/10
          transition-all duration-200 cursor-pointer"
      />
    </div>
  );
}

/** Animated slot preview card shown after all fields are filled */
function SlotPreview({ service, mode, day, date, start, end }) {
  if (!service || !start || !end) return null;

  const dayLabel = DAYS.find((d) => d.value === day)?.label ?? "";
  const when     = mode === "weekly" ? dayLabel : date;
  const startFmt = start ? formatTime(start) : "";
  const endFmt   = end   ? formatTime(end)   : "";

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border-2 border-[#3838d2]/20 animate-fadeIn">
      {/* Header bar */}
      <div className="bg-[#3838d2] px-5 py-3 flex items-center gap-2">
        <span className="text-white text-sm font-semibold font-[DM_Sans]">Slot Preview</span>
        <span className="ml-auto text-[#a5b4fc] text-xs font-[DM_Sans]">Live</span>
        {/* pulsing dot */}
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>

      {/* Body */}
      <div className="bg-gradient-to-br from-[#3838d2]/5 to-white px-5 py-4 flex items-center gap-4">
        {/* Time block */}
        <div className="text-center bg-white border-2 border-[#3838d2]/20 rounded-2xl px-4 py-3 min-w-[80px]">
          <div className="text-xl font-bold text-[#3838d2] font-[Adamina] leading-none">{startFmt}</div>
          <div className="text-[10px] text-gray-400 font-[DM_Sans] mt-0.5">START</div>
          <div className="my-1 border-t border-dashed border-[#3838d2]/20" />
          <div className="text-xl font-bold text-gray-700 font-[Adamina] leading-none">{endFmt}</div>
          <div className="text-[10px] text-gray-400 font-[DM_Sans] mt-0.5">END</div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1">
          <p className="text-base font-bold text-gray-800 font-[Adamina]">{service?.name}</p>
          <p className="text-sm text-gray-500 font-[DM_Sans]">
            {mode === "weekly" ? "Every " : ""}{when}
          </p>
          <span className="inline-flex items-center gap-1 bg-[#3838d2]/10 text-[#3838d2] text-xs font-bold font-[DM_Sans] px-3 py-1 rounded-full">
            ⏱ {service?.duration} min slots
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Convert "14:30" → "2:30 PM" */
function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm  = h >= 12 ? "PM" : "AM";
  const hour  = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Derive current wizard step (1–4) from form state */
function deriveStep(form) {
  if (!form.service)                             return 1;
  if (!form.day_of_week && !form.date_specific)  return 2;
  if (!form.start_time || !form.end_time)        return 3;
  return 4;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function CreateAvailability() {

  // ── State ──────────────────────────────────
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [form,     setForm]     = useState(INITIAL_FORM);
  const [success,  setSuccess]  = useState(false);

  // ── Tenant ─────────────────────────────────
  const tenantSlug = localStorage.getItem("tenant_slug");
  
  console.log("TENANT SLUG:", tenantSlug); 
  // ── Fetch services on mount ─────────────────
  useEffect(() => {
    if (tenantSlug) fetchServices();
  }, [tenantSlug]);

  const fetchServices = async () => {
    try {
      const res = await API.get(`/tenant/${tenantSlug}/services/`);
      console.log("SERVICES RESPONSE:", res.data);
      setServices(res.data || []);
    } catch (err) {
      console.error("Services fetch error:", err.response?.data || err);
    }
  };

  // ── Handle field changes ────────────────────
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** Called by ModeToggle – also reset day/date when switching */
  const handleModeChange = (mode) =>
    setForm((prev) => ({ ...prev, mode, day_of_week: "", date_specific: "" }));

  /** Called by DayPicker */
  const handleDayChange = (val) =>
    setForm((prev) => ({ ...prev, day_of_week: val }));

  // ── Derived values ──────────────────────────
  const selectedService = services.find(
    (s) => String(s.id) === String(form.service)
  );

  const currentStep = deriveStep(form);

  // ── Submit ──────────────────────────────────
 const handleSubmit = async (e) => {
  e.preventDefault();

  // -----------------------------
  // FRONTEND VALIDATION
  // -----------------------------

  if (!form.service) {
    alert("Please select a service");
    return;
  }

  if (form.mode === "weekly" && !form.day_of_week) {
    alert("Please select a weekday");
    return;
  }

  if (form.mode === "specific" && !form.date_specific) {
    alert("Please select a date");
    return;
  }

  if (!form.start_time || !form.end_time) {
    alert("Please select start and end time");
    return;
  }

  // IMPORTANT FIX
  if (form.start_time >= form.end_time) {
    alert("End time must be after start time");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      service: form.service,

      // Proper Django time format
      start_time: `${form.start_time}:00`,
      end_time: `${form.end_time}:00`,

      slot_duration: selectedService?.duration,
    };

    // Weekly / Specific
    if (form.mode === "weekly") {
      payload.day_of_week = parseInt(form.day_of_week);
    } else {
      payload.date_specific = form.date_specific;
    }

    // DEBUG
    console.log("FORM:", form);
    console.log("PAYLOAD:", payload);

    const res = await API.post(
      `/tenant/${tenantSlug}/availability/create/`,
      payload
    );

    console.log("SUCCESS:", res.data);

    // Success UI
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setForm(INITIAL_FORM);
    }, 2200);

  } catch (err) {

    console.error("FULL ERROR:", err.response?.data || err);

    if (err.response?.data) {
      Object.entries(err.response.data).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
    }

    alert(
      err.response?.data?.non_field_errors?.[0] ||
      "Could not create availability."
    );

  } finally {
    setLoading(false);
  }
};

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      {/* Google Fonts – Adamina + DM Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Adamina&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn   { animation: fadeIn   0.35s ease both; }
        .animate-slideDown { animation: slideDown 0.3s ease both; }
        .animate-popIn     { animation: popIn    0.4s ease both; }

        /* Ensure Adamina & DM Sans resolve via class names */
        .font-\\[Adamina\\]   { font-family: 'Adamina', Georgia, serif; }
        .font-\\[DM_Sans\\]   { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* ── Page background ── */}
      <div
        className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-10"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── Success toast overlay ── */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 animate-popIn">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">✅</div>
              <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Adamina', serif" }}>
                Availability Created!
              </p>
              <p className="text-sm text-gray-500">Your slots are ready to be booked.</p>
            </div>
          </div>
        )}

        {/* ── Outer card grid ── */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

          {/* ════════════════════════════════════
              LEFT SIDEBAR – Branding + Progress
          ════════════════════════════════════ */}
          <aside className="rounded-3xl bg-white shadow-sm border border-gray-100 p-6 flex flex-col gap-6 h-fit lg:sticky lg:top-10">

            {/* Logo / Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3838d2] flex items-center justify-center text-white font-bold text-base"
                   style={{ fontFamily: "'Adamina', serif" }}>
                S
              </div>
              <span className="text-lg font-bold text-[#3838d2]" style={{ fontFamily: "'Adamina', serif" }}>
                Slotify
              </span>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 leading-snug" style={{ fontFamily: "'Adamina', serif" }}>
                Create<br />Availability
              </p>
              <p className="text-xs text-gray-400 mt-1 font-[DM_Sans]">
                Define when clients can book you
              </p>
            </div>

            {/* Progress steps */}
            <div className="flex flex-col gap-1">
              <StepBadge number="1" label="Choose Service" active={currentStep === 1} done={currentStep > 1} />
              <StepBadge number="2" label="Set Schedule"   active={currentStep === 2} done={currentStep > 2} />
              <StepBadge number="3" label="Set Time Range" active={currentStep === 3} done={currentStep > 3} />
              <StepBadge number="4" label="Confirm & Save" active={currentStep === 4} done={false} />
            </div>

            {/* Tip box */}
            <div className="mt-auto bg-[#3838d2]/5 border border-[#3838d2]/15 rounded-2xl p-4">
              <p className="text-xs font-semibold text-[#3838d2] mb-1 font-[DM_Sans]">💡 Pro tip</p>
              <p className="text-xs text-gray-500 font-[DM_Sans] leading-relaxed">
                Set weekly availability to auto-repeat every week — no need to add each day manually.
              </p>
            </div>
          </aside>

          {/* ════════════════════════════════════
              RIGHT PANEL – The Form
          ════════════════════════════════════ */}
          <main className="rounded-3xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8">

            <form onSubmit={handleSubmit} className="flex flex-col gap-7">

              {/* ── STEP 1 : Service ── */}
              <section className="animate-slideDown">
                <SectionLabel step="1" title="Select a Service" />

                {/* Service cards (if ≤6) or fallback select */}
                {services.length === 0 ? (
                  <p className="text-sm text-gray-400 font-[DM_Sans]">Loading services…</p>
                ) : services.length <= 6 ? (
                  /* Card grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {services.map((svc) => {
                      const active = String(svc.id) === String(form.service);
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, service: String(svc.id) }))}
                          className={`text-left rounded-2xl border-2 px-4 py-3.5 transition-all duration-200
                            ${active
                              ? "border-[#3838d2] bg-[#3838d2]/5 shadow-md shadow-[#3838d2]/10"
                              : "border-gray-200 hover:border-[#3838d2]/40 hover:bg-gray-50"}`}
                        >
                          <p className={`font-semibold text-sm font-[DM_Sans] ${active ? "text-[#3838d2]" : "text-gray-800"}`}>
                            {svc.name}
                          </p>
                          <p className="text-xs text-gray-400 font-[DM_Sans] mt-0.5">
                            ⏱ {svc.duration} min session
                          </p>
                          {active && (
                            <span className="inline-block mt-2 text-[10px] font-bold bg-[#3838d2] text-white px-2 py-0.5 rounded-full font-[DM_Sans] tracking-wide">
                              SELECTED
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Fallback: native select for long lists */
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                    className="w-full mt-3 px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-800
                      font-[DM_Sans] text-sm bg-white
                      focus:outline-none focus:border-[#3838d2] focus:ring-4 focus:ring-[#3838d2]/10
                      transition-all duration-200"
                  >
                    <option value="">— Choose a service —</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.duration} mins)
                      </option>
                    ))}
                  </select>
                )}
              </section>

              {/* ── STEP 2 : Schedule type + Day/Date ── */}
              {form.service && (
                <section className="animate-slideDown">
                  <SectionLabel step="2" title="Set Your Schedule" />

                  {/* Weekly / Specific toggle */}
                  <div className="mt-3">
                    <ModeToggle value={form.mode} onChange={handleModeChange} />
                  </div>

                  {/* Weekly → day picker */}
                  {form.mode === "weekly" && (
                    <div className="mt-4 animate-slideDown">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2.5 font-[DM_Sans]">
                        Pick a day
                      </p>
                      <DayPicker value={form.day_of_week} onChange={handleDayChange} />
                    </div>
                  )}

                  {/* Specific → date input */}
                  {form.mode === "specific" && (
                    <div className="mt-4 animate-slideDown">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block font-[DM_Sans]">
                        Pick a date
                      </label>
                      <input
                        type="date"
                        name="date_specific"
                        value={form.date_specific}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-800
                          font-[DM_Sans] text-sm bg-white
                          focus:outline-none focus:border-[#3838d2] focus:ring-4 focus:ring-[#3838d2]/10
                          transition-all duration-200"
                      />
                    </div>
                  )}
                </section>
              )}

              {/* ── STEP 3 : Time range ── */}
{(form.day_of_week || form.date_specific) && (
  <section className="animate-slideDown">
    <SectionLabel step="3" title="Set Time Window" />
    
    <div className="mt-3 grid grid-cols-2 gap-4">
      {/* Start Time Selection */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3l14 9-14 9V3z" />
          </svg>
          Start Time
        </label>
        <div className="flex gap-1">
          <select 
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#3838d2]/20 focus:border-[#3838d2] outline-none appearance-none cursor-pointer"
          >
            {Array.from({ length: 48 }).map((_, i) => {
              const hour = Math.floor(i / 2);
              const min = i % 2 === 0 ? "00" : "30";
              const ampm = hour >= 12 ? "PM" : "AM";
              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
              const value = `${hour.toString().padStart(2, '0')}:${min}`;
              return (
                <option key={value} value={value}>
                  {displayHour}:{min} {ampm}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* End Time Selection */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 6h12v12H6z" />
          </svg>
          End Time
        </label>
        <select 
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#3838d2]/20 focus:border-[#3838d2] outline-none appearance-none cursor-pointer"
        >
          {Array.from({ length: 48 }).map((_, i) => {
            const hour = Math.floor(i / 2);
            const min = i % 2 === 0 ? "00" : "30";
            const ampm = hour >= 12 ? "PM" : "AM";
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const value = `${hour.toString().padStart(2, '0')}:${min}`;
            return (
              <option key={value} value={value}>
                {displayHour}:{min} {ampm}
              </option>
            );
          })}
        </select>
      </div>
    </div>

    {/* Validation & Duration Footer */}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
      {selectedService && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-[DM_Sans]">Service Duration:</span>
          <span className="bg-[#3838d2]/10 text-[#3838d2] text-[11px] font-bold px-2 py-0.5 rounded-md font-[DM_Sans]">
            {selectedService.duration} mins
          </span>
        </div>
      )}

      {form.start_time && form.end_time && (
        <div className="flex items-center gap-1.5">
          {(() => {
            const startArr = form.start_time.split(':');
            const endArr = form.end_time.split(':');
            const startTotal = parseInt(startArr[0]) * 60 + parseInt(startArr[1]);
            const endTotal = parseInt(endArr[0]) * 60 + parseInt(endArr[1]);
            const diff = endTotal - startTotal;
            const isValid = diff >= (selectedService?.duration || 0);

            return (
              <>
                <div className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-green-500' : 'bg-rose-500'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tight ${isValid ? 'text-gray-500' : 'text-rose-600'}`}>
                  {isValid ? `Window: ${Math.floor(diff/60)}h ${diff%60}m` : 'Invalid Time Window'}
                </span>
              </>
            );
          })()}
        </div>
      )}
    </div>
  </section>
)}

              {/* ── STEP 4 : Preview + Submit ── */}
              {form.start_time && form.end_time && (
                <section className="animate-slideDown">
                  <SectionLabel step="4" title="Review & Confirm" />

                  {/* Live slot preview */}
                  <SlotPreview
                    service={selectedService}
                    mode={form.mode}
                    day={form.day_of_week}
                    date={form.date_specific}
                    start={form.start_time}
                    end={form.end_time}
                  />

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`mt-5 w-full py-4 rounded-2xl text-white font-bold text-base font-[DM_Sans]
                      tracking-wide transition-all duration-200 flex items-center justify-center gap-2
                      ${loading
                        ? "bg-[#3838d2]/60 cursor-not-allowed"
                        : "bg-[#3838d2] hover:bg-[#2a2aab] active:scale-[0.98] shadow-lg shadow-[#3838d2]/30 hover:shadow-[#3838d2]/50"}`}
                  >
                    {loading ? (
                      <>
                        {/* Spinner */}
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Creating slots…
                      </>
                    ) : (
                      <>
                        <span>Create Availability</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </section>
              )}

            </form>
          </main>

        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// SECTION LABEL
// ─────────────────────────────────────────────

/** Numbered section header used inside the form */
function SectionLabel({ step, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <span className="w-6 h-6 rounded-full bg-[#3838d2] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
        {step}
      </span>
      <h2 className="text-base font-bold text-gray-800" style={{ fontFamily: "'Adamina', serif" }}>
        {title}
      </h2>
    </div>
  );
}