import api from "./axios";

export const getIndustries = (token) =>
  api.get("/industries", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getCities = (token) =>
  api.get("/cities", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
