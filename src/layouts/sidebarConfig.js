import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  BookOpen,
  Activity,
  ClipboardList,
  FileText,
  TrendingUp,
  BrainCircuit
} from "lucide-react";

export const SIDEBAR_CONFIG = {

  // 🔥 CORE SYSTEM (ALWAYS PRESENT)
  overview: {
    label: "Overview",
    icon: LayoutDashboard,
    group: "core",
    path: "/dashboard",
  },

  services: {
    label: "Services",
    icon: ClipboardList,
    group: "core",
    path: "/admin/create-service",
  },

  availability: {
    label: "Availability",
    icon: Calendar,
    group: "core",
    path: "/admin/create-availability",
  },

  bookings: {
    label: "Bookings",
    icon: Calendar,
    group: "core",
    path: "/admin/bookings",
  },

  team: {
    label: "Team",
    icon: Users,
    group: "core",
    path: "/team",
  },

  settings: {
    label: "Settings",
    icon: Settings,
    group: "core",
    path: "/settings",
  },

  // 🔥 MENTOR TEMPLATE
  students: {
    label: "Students",
    icon: BookOpen,
    group: "features",
    template: "mentor",
  },

  sessions: {
    label: "Sessions",
    icon: Activity,
    group: "features",
    template: "mentor",
  },

  notes: {
    label: "Notes",
    icon: FileText,
    group: "features",
    template: "mentor",
  },

  // 🔥 FITNESS TEMPLATE
  clients: {
    label: "Clients",
    icon: Users,
    group: "features",
    template: "fitness",
  },

  workouts: {
    label: "Workouts",
    icon: Activity,
    group: "features",
    template: "fitness",
  },

  progress: {
    label: "Progress",
    icon: TrendingUp,
    group: "features",
    template: "fitness",
  },

  // 🔥 TEACHER TEMPLATE
  assignments: {
    label: "Assignments",
    icon: ClipboardList,
    group: "features",
    template: "teacher",
  },

  attendance: {
    label: "Attendance",
    icon: Calendar,
    group: "features",
    template: "teacher",
  },

  // 🔥 CONSULTANT TEMPLATE
  meetings: {
    label: "Meetings",
    icon: Users,
    group: "features",
    template: "consultant",
  },

  reports: {
    label: "Reports",
    icon: FileText,
    group: "features",
    template: "consultant",
  },

  // 🔥 DOCTOR TEMPLATE
  patients: {
    label: "Patients",
    icon: Users,
    group: "features",
    template: "doctor",
  },

  appointments: {
    label: "Appointments",
    icon: Calendar,
    group: "features",
    template: "doctor",
  },

  medical_records: {
    label: "Medical Records",
    icon: FileText,
    group: "features",
    template: "doctor",
  },

  checkup_system_ai: {
    label: "AI Checkup",
    icon: BrainCircuit,
    group: "features",
    template: "doctor",
  },
};