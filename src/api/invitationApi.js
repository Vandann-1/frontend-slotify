import axiosInstance from "./axiosInstance";

/*
  SEND PROFESSIONAL INVITE
  POST /api/invitations/workspaces/{slug}/invite/
*/

const sendProfessionalInvite = async (slug, data) => {
  return axiosInstance.post(
    `/invitations/workspaces/${slug}/invite/`,
    data
  );
};

export default {
  sendProfessionalInvite,
};