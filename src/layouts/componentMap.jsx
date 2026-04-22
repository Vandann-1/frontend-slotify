// 🔥 REAL PAGES (IMPORTANT)
import CreateService from "../features/dashboard/CreateService";
import CreateAvailability from "../features/dashboard/CreateAvailability";
import BookingsList from "../features/Bookings/BookingsList";
import TeamMembers from "../features/Team/TeamMembers";
import PlansPage from "../features/Plans/PlansPage";


/* ================= CORE ================= */

const Overview = () => <div>Overview Dashboard</div>;
const Settings = () => <div>Settings Page</div>;
const Bookings = () => <div>Bookings Page</div>;

/* ================= DUMMY PAGES (FOR TEMPLATES) ================= */   

/* ================= MENTOR ================= */

const Students = () => <div>Students Page</div>;
const Sessions = () => <div>Sessions Page</div>;
const Notes = () => <div>Notes Page</div>;

/* ================= FITNESS ================= */

const Clients = () => <div>Clients Page</div>;
const Workouts = () => <div>Workouts Page</div>;
const Progress = () => <div>Progress Tracking</div>;

/* ================= TEACHER ================= */

const Assignments = () => <div>Assignments Page</div>;
const Attendance = () => <div>Attendance Page</div>;

/* ================= CONSULTANT ================= */

const Meetings = () => <div>Meetings Page</div>;
const Reports = () => <div>Reports Page</div>;

/* ================= DOCTOR ================= */

const Patients = () => <div>Patients Page</div>;
const Appointments = () => <div>Appointments Page</div>;
const MedicalRecords = () => <div>Medical Records Page</div>;
const CheckupAI = () => <div>AI Checkup System</div>;

/* ================= EXPORT MAP ================= */

export const COMPONENT_MAP = {
  // 🔥 CORE (REAL SYSTEM)
  overview: Overview,

  services: CreateService,          // ✅ required
  availability: CreateAvailability, // ✅ required
  bookings: BookingsList,       // ✅ use real page (not dummy)

  plans: PlansPage,
  team: TeamMembers,
  settings: Settings,

  // 🔥 OPTIONAL TEMPLATES (placeholders until you build APIs)
  students: Students,
  sessions: Sessions,
  notes: Notes,

  clients: Clients,
  workouts: Workouts,
  progress: Progress,

  assignments: Assignments,
  attendance: Attendance,

  meetings: Meetings,
  reports: Reports,

  patients: Patients,
  appointments: Appointments,
  medical_records: MedicalRecords,
  checkup_system_ai: CheckupAI,
};