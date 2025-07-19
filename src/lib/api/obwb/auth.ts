import { dashboardAuthAPI as api } from "../base";
import type { User } from "@/types";

// Auth API methods
export const obwbAuthAPI = {
  me: async (access_token: string): Promise<User> => {
    try {
      const response = await api.get<User>("/auth/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      // Just return the user data without connection status check
      return {
        ...response.data,
        service: "obwb"
      };
    } catch (error) {
      throw error;
    }
  }
};
