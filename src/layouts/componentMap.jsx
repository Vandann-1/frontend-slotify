import TeamMembers from "../features/Team/TeamMembers";
import PlansPage from "../features/Plans/PlansPage";

/* ================= CORE ================= */

const Overview = () => <div>Overview Dashboard</div>;
const Bookings = () => <div>Bookings Page</div>;
const Settings = () => <div>Settings Page</div>;

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
  // 🔥 COMMON
  overview: Overview,
  bookings: Bookings,
  plans: PlansPage,
  team: TeamMembers,
  settings: Settings,

  // 🔥 MENTOR
  students: Students,
  sessions: Sessions,
  notes: Notes,

  // 🔥 FITNESS
  clients: Clients,
  workouts: Workouts,
  progress: Progress,

  // 🔥 TEACHER
  assignments: Assignments,
  attendance: Attendance,

  // 🔥 CONSULTANT
  meetings: Meetings,
  reports: Reports,

  // 🔥 DOCTOR
  patients: Patients,
  appointments: Appointments,
  medical_records: MedicalRecords,
  checkup_system_ai: CheckupAI,
};