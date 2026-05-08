import CreateService from "../features/dashboard/CreateService";
import CreateAvailability from "../features/dashboard/CreateAvailability";
import BookingsList from "../features/Bookings/BookingsList";
import TeamMembers from "../features/Team/TeamMembers";
import PlansPage from "../features/Plans/PlansPage";
import Profile from "../features/Professional/ProfessionalProfile";

/* CORE */
const Overview = () => <div>Overview</div>;
const Settings = () => <div>Settings</div>;


/* TEMPLATES */
const Students = () => <div>Students</div>;
const Sessions = () => <div>Sessions</div>;
const Notes = () => <div>Notes</div>;

const Clients = () => <div>Clients</div>;
const Workouts = () => <div>Workouts</div>;
const Progress = () => <div>Progress</div>;

const Assignments = () => <div>Assignments</div>;
const Attendance = () => <div>Attendance</div>;

const Meetings = () => <div>Meetings</div>;
const Reports = () => <div>Reports</div>;

const Patients = () => <div>Patients</div>;
const Appointments = () => <div>Appointments</div>;
const MedicalRecords = () => <div>Medical Records</div>;
const CheckupAI = () => <div>AI Checkup</div>;

export const COMPONENT_MAP = {
  overview: Overview,
  bookings: BookingsList,
  services: CreateService,
  availability: CreateAvailability,
  plans: PlansPage,

  team: TeamMembers,
  settings: Settings,
  profile: Profile,

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