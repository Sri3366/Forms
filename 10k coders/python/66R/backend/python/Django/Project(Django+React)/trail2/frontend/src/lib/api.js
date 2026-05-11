import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
});

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem("adminToken", token);
  } else {
    localStorage.removeItem("adminToken");
  }
};

export const getAdminAuthConfig = () => {
  const token = localStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};