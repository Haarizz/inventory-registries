import api from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

// 🔐 Login API
export const login = async (username, password) => {
  const res = await api.post("/api/auth/login", {
    username,
    password,
  });
  return res.data; // { token }
};

// 🔍 Decode JWT
export const getDecodedToken = () => {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

// 🔑 Roles from JWT
export const getRoles = () => {
  const decoded = getDecodedToken();
  return decoded?.roles || [];
};

export const hasRole = (role) => {
  const roles = getRoles();
  if (roles.includes("ROLE_SUPER_ADMIN")) return true;
  return roles.includes(`ROLE_${role}`);
};

// 🔐 Auth check
export const isAuthenticated = () => {
  return !!sessionStorage.getItem("token");
};

// 🔓 Logout
export const logout = () => {
  sessionStorage.removeItem("token");
};
