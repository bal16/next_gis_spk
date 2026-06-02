import axios from "axios";

export const publicClient = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NEST_API_URL // Sisi Server
      : process.env.NEXT_PUBLIC_NEST_API_URL, // Sisi Client
  headers: { "Content-Type": "application/json" },
});
