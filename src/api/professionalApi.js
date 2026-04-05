import axiosInstance from "./axiosInstance";

/* ================================
   MEMBERSHIPS
================================ */
export const getMyMemberships = async () => {
  return axiosInstance.get("/workspaces/my-memberships/");
};

/* ================================
   PROFESSIONAL PROFILE
================================ */

/**
 * GET /auth/professional/me/
 */
export const getMyProfile = async () => {
  const res = await axiosInstance.get("/auth/professional/me/");
  console.log("GET PROFILE RESPONSE:", res.data);
  return res;
};

/**
 * PUT /auth/professional/me/
 */
export const upsertMyProfile = async (payload) => {
  // ✅ CLEAN + FIXED PAYLOAD
  const cleanPayload = {
    qualifications: payload.qualifications || "",
    specialization: payload.specialization || "",
    bio: payload.bio || "",

    // ✅ FIXED NAME (MOST IMPORTANT)
    linkedin_url: payload.linkedin_url || "",

    // ✅ SAFE NUMBER HANDLING
    experience_years:
      payload.experience_years !== "" &&
      payload.experience_years !== null &&
      payload.experience_years !== undefined
        ? Number(payload.experience_years)
        : null,
  };

  // 🔍 DEBUG LOG (DON'T REMOVE UNTIL WORKS)
  console.log("SENDING PAYLOAD:", cleanPayload);

  try {
    const res = await axiosInstance.put(
      "/auth/professional/me/",
      cleanPayload
    );

    console.log("SAVE RESPONSE:", res.data);
    return res;

  } catch (error) {
    console.error("API ERROR:", error?.response?.data || error);
    throw error;
  }
};

export default {
  getMyMemberships,
  getMyProfile,
  upsertMyProfile,
};