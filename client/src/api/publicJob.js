import api from "./axios";

export const getPublicJobs = (params = {}) =>
  api.get("/public/jobs", {
    params,
  });

export const getPublicJob = (slug) => api.get(`/public/jobs/${slug}`);
