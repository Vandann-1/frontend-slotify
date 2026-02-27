import axiosInstance from "./axiosInstance";

/* ================================
   MEMBERSHIPS (real API)
================================ */
const getMyMemberships = async () => {
  return axiosInstance.get("/workspaces/my-memberships/");
};

/* ================================
   TEMP PROFILE STORAGE (LOCAL)
   ⚠️ REMOVE when backend ready
================================ */
const PROFILE_KEY = "professional_profile";

/* GET PROFILE */
const getMyProfile = async () => {
  const data = localStorage.getItem(PROFILE_KEY);

  if (!data) {
    // mimic 404 behavior
    return { data: null };
  }

  return { data: JSON.parse(data) };
};

/* UPSERT PROFILE */
const upsertMyProfile = async (payload) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
  return { data: payload };
};

export default {
  getMyMemberships,
  getMyProfile,
  upsertMyProfile,
};