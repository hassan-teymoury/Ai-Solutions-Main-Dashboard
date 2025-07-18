import { createAPI } from "./createAPI";

const AUTH_STORAGE_KEY = "auth-storage";

// Shared token updater
let updateAuthStore:
  | ((access_token: string, refresh_token: string) => void)
  | null = null;

export const setAuthStoreUpdater = (
  updater: (access_token: string, refresh_token: string) => void
) => {
  updateAuthStore = updater;
};

// Dashboard tokens (main login)
const getDashboardTokens = () => {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}");
    return auth?.state || {};
  } catch {
    return {};
  }
};

export const dashboardAuthAPI = createAPI(
  "http://135.181.250.208:8050",
  getDashboardTokens,
  updateAuthStore,
  "http://135.181.250.208:8050/auth/refresh"
);

// OBWB Service
const getObwbTokens = () => {
  const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}");
  const token = auth?.state?.service_tokens?.find(
    (t: unknown) => {
      const token = t as { service?: { name?: string }; token?: string };
      return token.service?.name === "obwb"
    }
  )?.token;

  return { access_token: token };
};

export const obwbAPI = createAPI(
  "https://obwbapi.finitx.com",
  getObwbTokens,
  updateAuthStore
);
