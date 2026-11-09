import api from "./axios";

export const register = (data) => api.post("/register", data);

export const verifyOtp = (data) => api.post("/verify-otp", data);

export const login = (data) => api.post("/login", data);

export const logout = (token) =>
  api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const getUser = (token) =>
  api.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
