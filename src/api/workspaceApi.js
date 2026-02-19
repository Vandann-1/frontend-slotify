import axiosInstance from "./axiosInstance";

/* ============================================
   CREATE WORKSPACE
   POST /api/workspaces/
============================================ */
export const createWorkspace = async (workspaceData) => {
  try {
    const response = await axiosInstance.post(
      "/workspaces/",
      workspaceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* ============================================
   GET ALL USER WORKSPACES
   GET /api/workspaces/
============================================ */
export const getWorkspaces = async () => {
  try {
    const response = await axiosInstance.get("/workspaces/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* ============================================
   GET WORKSPACE BY SLUG
   GET /api/workspaces/{slug}/
============================================ */
export const getWorkspaceBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(
      `/workspaces/${slug}/`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* ============================================
   UPDATE WORKSPACE
   PUT /api/workspaces/{slug}/
============================================ */
export const updateWorkspace = async (slug, workspaceData) => {
  try {
    const response = await axiosInstance.put(
      `/workspaces/${slug}/`,
      workspaceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* ============================================
   DELETE WORKSPACE
   DELETE /api/workspaces/{slug}/
============================================ */
export const deleteWorkspace = async (slug) => {
  try {
    const response = await axiosInstance.delete(
      `/workspaces/${slug}/`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
