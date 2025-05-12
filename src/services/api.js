import axios from "axios";

const API = axios.create({
  // baseURL: "https://splitease-backend-production.up.railway.app/",
  baseURL: "http://localhost:8000",
});

// Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getGroups = async () => {
  try {
    const res = await API.get("/group/");
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Unauthorized: Please login again.");
    } else {
      throw new Error(error.response?.data?.message || "Failed to fetch groups.");
    }
  }
};

export default API;
