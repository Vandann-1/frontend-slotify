import axiosInstance from "./axiosInstance";

/* CREATE WORKSPACE */
export const createWorkspace = async (workspaceData) => {
  try {
    const response = await axiosInstance.post("/workspaces/", workspaceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* GET ALL WORKSPACES */
export const getWorkspaces = async () => {
  try {
    const response = await axiosInstance.get("/workspaces/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* GET WORKSPACE BY SLUG */
export const getWorkspaceBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/workspaces/${slug}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* 🔥 MOST IMPORTANT FOR STEP 4 */
export const getDashboard = async (slug) => {
  try {
    const response = await axiosInstance.get(`/workspaces/${slug}/dashboard/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/* UPDATE WORKSPACE */
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

/* DELETE WORKSPACE */
export const deleteWorkspace = async (slug) => {
  try {
    const response = await axiosInstance.delete(`/workspaces/${slug}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};