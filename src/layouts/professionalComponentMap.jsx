import CreateService from "../features/dashboard/CreateService";
import CreateAvailability from "../features/dashboard/CreateAvailability";
import BookingsList from "../features/Bookings/BookingsList";
import PlansPage from "../features/Plans/PlansPage";

/* CORE */
const Dashboard = () => <div>Dashboard</div>;
const Profile = () => <div>Profile</div>;

/* MENTOR */
const Students = () => <div>Students</div>;
const Sessions = () => <div>Sessions</div>;
const Notes = () => <div>Notes</div>;

/* FITNESS */
const Clients = () => <div>Clients</div>;
const Workouts = () => <div>Workouts</div>;
const Progress = () => <div>Progress</div>;

/* TEACHER */
const Assignments = () => <div>Assignments</div>;
const Attendance = () => <div>Attendance</div>;

/* CONSULTANT */
const Meetings = () => <div>Meetings</div>;
const Reports = () => <div>Reports</div>;

/* DOCTOR */
const Patients = () => <div>Patients</div>;
const Appointments = () => <div>Appointments</div>;
const MedicalRecords = () => <div>Medical Records</div>;
const CheckupAI = () => <div>AI Checkup</div>;

export const PROFESSIONAL_COMPONENT_MAP = {
  dashboard: Dashboard,

  services: CreateService,
  availability: CreateAvailability,
  bookings: BookingsList,

  profile: Profile,
  plans: PlansPage,

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