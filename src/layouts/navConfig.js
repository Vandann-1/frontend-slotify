import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  Settings,
  BookOpen,
  Activity,
  FileText,
  TrendingUp,
  BrainCircuit,
  User,
  CreditCard
} from "lucide-react";

export const NAV_CONFIG = {
  // 🔥 CORE (common for all)
  overview: {
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["admin", "professional"],
  },

  bookings: {
    label: "Bookings",
    icon: Calendar,
    roles: ["admin", "professional"],
  },

  services: {
    label: "Services",
    icon: ClipboardList,
    roles: ["admin", "professional"],
  },

  availability: {
    label: "Availability",
    icon: Calendar,
    roles: ["admin", "professional"],
  },

  plans: {
    label: "Plans",
    icon: CreditCard,
    roles: ["admin", "professional"],
  },

  settings: {
    label: "Settings",
    icon: Settings,
    roles: ["admin", "professional"],
  },

  // 🔥 ROLE BASED
  team: {
    label: "Team",
    icon: Users,
    roles: ["admin"],
  },

  profile: {
    label: "Profile",
    icon: User,
    roles: ["professional"],
  },

  // 🔥 TEMPLATE BASED
  students: {
    label: "Students",
    icon: BookOpen,
    templates: ["mentor", "teacher"],
  },

  sessions: {
    label: "Sessions",
    icon: Activity,
    templates: ["mentor"],
  },

  notes: {
    label: "Notes",
    icon: FileText,
    templates: ["mentor", "teacher"],
  },

  clients: {
    label: "Clients",
    icon: Users,
    templates: ["fitness"],
  },

  workouts: {
    label: "Workouts",
    icon: Activity,
    templates: ["fitness"],
  },

  progress: {
    label: "Progress",
    icon: TrendingUp,
    templates: ["fitness"],
  },

  assignments: {
    label: "Assignments",
    icon: ClipboardList,
    templates: ["teacher"],
  },

  attendance: {
    label: "Attendance",
    icon: Calendar,
    templates: ["teacher"],
  },

  meetings: {
    label: "Meetings",
    icon: Users,
    templates: ["consultant"],
  },

  reports: {
    label: "Reports",
    icon: FileText,
    templates: ["consultant"],
  },

  patients: {
    label: "Patients",
    icon: Users,
    templates: ["doctor"],
  },

  appointments: {
    label: "Appointments",
    icon: Calendar,
    templates: ["doctor"],
  },

  medical_records: {
    label: "Medical Records",
    icon: FileText,
    templates: ["doctor"],
  },

  checkup_system_ai: {
    label: "AI Checkup",
    icon: BrainCircuit,
    templates: ["doctor"],
  },
};