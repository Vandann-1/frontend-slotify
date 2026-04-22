import { useMemo } from "react";
import {
  LayoutDashboard, Calendar, Clock, User, CreditCard,
  Users, BookOpen, Activity, FileText, TrendingUp,
  BrainCircuit, ClipboardList, Stethoscope,
} from "lucide-react";

// ── 1. Every possible nav item ─────────────────────────────────────────────
const SIDEBAR_CONFIG = {
  // FIXED (always shown)
  dashboard:    { label: "Dashboard",      icon: LayoutDashboard },
  bookings:     { label: "Bookings",       icon: Calendar },
  availability: { label: "Availability",   icon: Clock },
  profile:      { label: "Profile",        icon: User },
  plans:        { label: "Plans",          icon: CreditCard },

  // DOCTOR
  patients:           { label: "Patients",        icon: Stethoscope },
  appointments:       { label: "Appointments",    icon: Calendar },
  medical_records:    { label: "Medical Records", icon: FileText },
  checkup_system_ai:  { label: "AI Checkup",      icon: BrainCircuit },

  // MENTOR
  students:     { label: "Students",      icon: BookOpen },
  sessions:     { label: "Sessions",      icon: Activity },
  notes:        { label: "Notes",         icon: FileText },

  // TEACHER
  assignments:  { label: "Assignments",   icon: ClipboardList },
  attendance:   { label: "Attendance",    icon: Calendar },

  // FITNESS
  clients:      { label: "Clients",       icon: Users },
  workouts:     { label: "Workouts",      icon: Activity },
  progress:     { label: "Progress",      icon: TrendingUp },

  // CONSULTANT
  meetings:     { label: "Meetings",      icon: Users },
  reports:      { label: "Reports",       icon: FileText },
};

// ── 2. Profession → dynamic feature keys ──────────────────────────────────
const PROFESSION_FEATURES = {
  doctor:      ["patients", "appointments", "medical_records", "checkup_system_ai"],
  mentor:      ["students", "sessions", "notes"],
  teacher:     ["students", "assignments", "attendance", "notes"],
  fitness:     ["clients", "workouts", "progress"],
  consultant:  ["meetings", "reports"],
};

// Fixed keys — always visible for every professional
const FIXED_KEYS = ["dashboard", "bookings", "availability", "profile", "plans"];

// ── 3. Hook ────────────────────────────────────────────────────────────────
export function useDynamicNav(specialization = "") {
  return useMemo(() => {
    const key         = specialization.toLowerCase().trim();
    const featureKeys = PROFESSION_FEATURES[key] ?? [];
    const toItem      = (k) => ({ key: k, ...SIDEBAR_CONFIG[k] });

    return {
      fixed:   FIXED_KEYS.filter((k) => SIDEBAR_CONFIG[k]).map(toItem),
      dynamic: featureKeys.filter((k) => SIDEBAR_CONFIG[k]).map(toItem),
    };
  }, [specialization]);
}