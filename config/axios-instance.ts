import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api.worldota.net/api/b2b/v3",
  auth: {
    username: process.env.RATEHAWK_KEYID,
    password: process.env.RATEHAWK_API_KEY,
  },
  headers: {
    "Content-Type": "application/json",
  },
});
