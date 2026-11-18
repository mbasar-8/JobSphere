import api from "./axios";

export const getCities = (token) =>
  api.get("/cities", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
