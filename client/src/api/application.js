import api from "./axios";

export const getApplications = (token) =>
  api.get("/applications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getApplication = (id, token) =>
  api.get(`/applications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const applyJob = (data, token) =>
  api.post("/applications", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const withdrawApplication = (id, token) =>
  api.patch(
    `/applications/${id}/withdraw`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const checkApplication = (jobId, token) =>
  api.get(`/applications/check/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
