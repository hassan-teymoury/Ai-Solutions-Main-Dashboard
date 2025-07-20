import { createAPI } from "./createAPI";
import { useAuthStore } from "@/lib/store";

// Dashboard API for main authentication and user management
export const dashboardAuthAPI = createAPI(
  "https://api-dashboard-finitx.darkube.app",
  () => {
    const { access_token, refresh_token } = useAuthStore.getState();
    return { 
      access_token: access_token || undefined, 
      refresh_token: refresh_token || undefined 
    };
  }
);

// OBWB API for email management services
export const obwbAPI = createAPI(
  "https://obwbapi.finitx.com",
  () => {
    const { getServiceToken } = useAuthStore.getState();
    const obwbToken = getServiceToken('obwb');
    return { 
      access_token: obwbToken || undefined, 
      refresh_token: undefined 
    };
  }
);
