import axios from "axios";

const publicClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false,
});

export default publicClient;
