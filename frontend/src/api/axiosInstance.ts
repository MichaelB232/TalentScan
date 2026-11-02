// src/api/axiosInstance.ts
// Single Axios instance with base URL and default response shape handling.

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export default api;
