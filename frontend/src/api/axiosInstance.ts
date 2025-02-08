import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const protectedEndpoints: Record<string, string[]> = {
  "/projects": ["POST", "PUT", "DELETE"],
  "/languages": ["POST", "PUT", "DELETE"],
  "/frameworks": ["POST", "PUT", "DELETE"],
  "/technologies": ["POST", "PUT", "DELETE"],
  "/comments": ["POST", "PATCH", "DELETE"],
  "/about": ["PUT"],
  "/services": ["POST", "PUT", "DELETE"],
};

export const setAuthToken = (getToken: () => Promise<string | null>) => {
  axiosInstance.interceptors.request.use(
    async (config) => {

      const url = config.url || "";
      const method = config.method?.toUpperCase() || "";

      const isProtected = Object.entries(protectedEndpoints).some(([endpoint, methods]) =>
        url.startsWith(endpoint) && methods.includes(method)
      );

      if (isProtected && getToken) {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("No access token available. Skipping Authorization header.");
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default axiosInstance;
