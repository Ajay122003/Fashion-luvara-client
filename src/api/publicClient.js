import axios from "axios";

const publicClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // 🔥 THIS IS THE FIX
  withCredentials: false,
});

export default publicClient;
