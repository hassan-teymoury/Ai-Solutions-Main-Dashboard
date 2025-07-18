import { createAPI } from "./createAPI";

const AUTH_STORAGE_KEY = "auth-storage";

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
  "https://api-dashboard-finitx.darkube.app",
  getDashboardTokens
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
  getObwbTokens
);
