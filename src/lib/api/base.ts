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
