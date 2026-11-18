import api from "./axios";

export const getSavedJobs = (token) =>
  api.get("/saved-jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const saveJob = (jobId, token) =>
  api.post(
    `/saved-jobs/${jobId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const removeSavedJob = (jobId, token) =>
  api.delete(`/saved-jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const checkSavedJob = (jobId, token) =>
  api.get(`/saved-jobs/check/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
