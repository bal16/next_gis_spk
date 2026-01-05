import axios from "axios";

export const publicClient = axios.create({
  baseURL: process.env.NEST_API_URL,
  headers: { "Content-Type": "application/json" },
});
