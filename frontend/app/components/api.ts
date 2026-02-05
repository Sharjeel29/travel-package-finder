import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTravelerIdFromToken = (): number | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    const id = payload.userId || payload.id || payload.sub;

    if (!id) return null;

    return Number(id);
  } catch (err) {
    return null;
  }
};

export default api;
