import axios from "axios";

const bffClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor (Opsional): Handle jika sesi habis (401)
bffClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    // Redirect ke login jika session Next.js mati
    // window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

export default bffClient;
