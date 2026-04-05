import {
  LayoutDashboard, Users, Calendar, Settings,
  BookOpen, Activity, ClipboardList, FileText,  TrendingUp,   
  Stethoscope, HeartPulse, BrainCircuit
} from "lucide-react";

export const SIDEBAR_CONFIG = {

  // 🔥 COMMON
  overview: {
    label: "Overview",
    icon: LayoutDashboard,
    group: "core",
  },
  bookings: {
    label: "Bookings",
    icon: Calendar,
    group: "core",
  },
  plans: {
    label: "Plans",
    icon: ClipboardList,
    group: "core",
  },
  team: {
    label: "Team",
    icon: Users,
    group: "core",
  },
  settings: {
    label: "Settings",
    icon: Settings,
    group: "core",
  },

  // 🔥 MENTOR
  students: {
    label: "Students",
    icon: BookOpen,
    group: "features",
  },
  sessions: {
    label: "Sessions",
    icon: Activity,
    group: "features",
  },
  notes: {
    label: "Notes",
    icon: FileText,
    group: "features",
  },

  // 🔥 FITNESS
  clients: {
    label: "Clients",
    icon: Users,
    group: "features",
  },
  workouts: {
    label: "Workouts",
    icon: Activity,
    group: "features",
  },
  progress: {
    label: "Progress",
    icon: TrendingUp,
    group: "features",
  },

  // 🔥 TEACHER
  assignments: {
    label: "Assignments",
    icon: ClipboardList,
    group: "features",
  },
  attendance: {
    label: "Attendance",
    icon: Calendar,
    group: "features",
  },

  // 🔥 CONSULTANT
  meetings: {
    label: "Meetings",
    icon: Users,
    group: "features",
  },
  reports: {
    label: "Reports",
    icon: FileText,
    group: "features",
  },

  // 🔥 DOCTOR (🔥 IMPORTANT)
  patients: {
    label: "Patients",
    icon: Users,
    group: "features",
  },
  appointments: {
    label: "Appointments",
    icon: Calendar,
    group: "features",
  },
  medical_records: {
    label: "Medical Records",
    icon: FileText,
    group: "features",
  },
  checkup_system_ai: {
    label: "AI Checkup",
    icon: BrainCircuit,
    group: "features",
  },
};