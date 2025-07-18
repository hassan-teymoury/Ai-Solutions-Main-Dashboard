// utils/createAPI.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

type TokenUpdater = ((access_token: string, refresh_token: string) => void) | null;

export const createAPI = (
  baseURL: string,
  getTokens: () => { access_token?: string; refresh_token?: string },
  updateTokens: TokenUpdater = null,
  refreshUrl: string = "http://135.181.250.208:8050/auth/refresh"
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
        config.url?.includes("/auth/refresh");

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
        originalRequest.url?.includes("/auth/refresh");

      if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
        originalRequest._retry = true;

        const { refresh_token } = getTokens();
        if (refresh_token && refreshUrl) {
          try {
            const refreshRes = await axios.post(refreshUrl, {
              refresh_token,
            });

            const { access_token, refresh_token: newRefreshToken } = refreshRes.data;

            if (updateTokens) updateTokens(access_token, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return instance(originalRequest);
          } catch {
            localStorage.removeItem("auth-storage");
            window.location.href = "/";
          }
        } else {
          localStorage.removeItem("auth-storage");
          window.location.href = "/";
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
