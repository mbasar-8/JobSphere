import api from "./axios";

// Candidate Profile
export const createCandidateProfile = (data, token) =>
  api.post("/candidate-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getCandidateProfile = (token) =>
  api.get("/candidate-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateCandidateProfile = (data, token) =>
  api.put("/candidate-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Recruiter Profile
export const createRecruiterProfile = (data, token) =>
  api.post("/recruiter-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getRecruiterProfile = (token) =>
  api.get("/recruiter-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateRecruiterProfile = (data, token) =>
  api.put("/recruiter-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
