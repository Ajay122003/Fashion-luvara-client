import axios from "axios";

const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 🔥 THIS IS THE FIX
  withCredentials: false,
});

export default publicClient;
