import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = (data) => API.post("/register", data);

export const login = (data) => API.post("/login", data);

export const forgotPassword = (data) =>
  API.post("/forgot-password", data);

export const verifyOtp = (data) =>
  API.post("/verify-otp", data);

export const resetPassword = (data) =>
  API.post("/reset-password", data);

export default API;