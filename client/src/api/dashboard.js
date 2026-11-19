import api from "./axios";

export const getDashboard = (token) =>
  api.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
