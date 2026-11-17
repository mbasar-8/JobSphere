import api from "./axios";

export const createCompany = (data, token) =>
  api.post("/company", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getCompany = (token) =>
  api.get("/company", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateCompany = (data, token) =>
  api.put("/company", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
