import axios from "axios";
import { VITE_API_BASE_URL } from "../lib/config.js";

export const instance = axios.create({
  baseURL: VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});
