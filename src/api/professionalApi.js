import axiosInstance from "./axiosInstance";

const getMyMemberships = async () => {
  return axiosInstance.get("/workspaces/my-memberships/");
};

export default {
  getMyMemberships,
};