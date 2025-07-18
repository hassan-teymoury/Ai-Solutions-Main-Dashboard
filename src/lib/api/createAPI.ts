// utils/createAPI.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

type TokenUpdater = ((access_token: string, refresh_token: string) => void) | null;

export const createAPI = (
  baseURL: string,
  getTokens: () => { access_token?: string; refresh_token?: string },
  updateTokens: TokenUpdater = null,
  refreshUrl?: string
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const isAuthEndpoint =
        config.url?.includes("/auth/signin") ||
        config.url?.includes("/auth/signup") ||
        config.url?.includes("/auth/refresh") ||
        config.url?.includes("/auth/token");

      if (!isAuthEndpoint) {
        const { access_token } = getTokens();
        if (access_token) {
          config.headers.Authorization = `Bearer ${access_token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;

      const isAuthEndpoint =
        originalRequest.url?.includes("/auth/signin") ||
        originalRequest.url?.includes("/auth/signup") ||
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/token");

      if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
        originalRequest._retry = true;

        console.error("Token expired or invalid, redirecting to login");
        
        // Since this API doesn't support refresh tokens, just redirect to login
        localStorage.removeItem("auth-storage");
        window.location.href = "/";
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
