import axiosInstance from "./axiosInstance";

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/auth/register/", data);
  return response.data;
};

export const loginUser = async (data) => {

  const response = await axiosInstance.post("/auth/login/", data);

  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
};
