import api from "./axios";

export const register = (data) => api.post("/auth/register", data);

export const verifyOtp = (data) => api.post("/auth/verify-otp", data);

export const resendOtp = (data) => api.post("/auth/resend-otp", data);

export const login = (data) => api.post("/auth/login", data);

export const logout = (token) =>
  api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const getCurrentUser = (token) =>
  api.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
