import axiosInstance from "./axiosInstance";


/*
  CREATE WORKSPACE API

  POST /api/workspaces/

  Requires:
  • access_token in localStorage
*/

export const createWorkspace = async (workspaceData) => {

  try {

    const response = await axiosInstance.post(

      "/workspaces/",
      workspaceData

    );

    return response.data;

  }
  catch (error) {

    throw error.response?.data || error.message;

  }

};



/*
  GET USER WORKSPACES

  GET /api/workspaces/
*/

export const getWorkspaces = async () => {

  try {

    const response = await axiosInstance.get(

      "/workspaces/"

    );

    return response.data;

  }
  catch (error) {

    throw error.response?.data || error.message;

  }

};
