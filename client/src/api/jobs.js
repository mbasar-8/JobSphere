import api from "./axios";

export const getJobs = (token) =>
  api.get("/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getJob = (id, token) =>
  api.get(`/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createJob = (data, token) =>
  api.post("/jobs", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateJob = (id, data, token) =>
  api.put(`/jobs/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const publishJob = (id, token) =>
  api.patch(
    `/jobs/${id}/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const closeJob = (id, token) =>
  api.patch(
    `/jobs/${id}/close`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
