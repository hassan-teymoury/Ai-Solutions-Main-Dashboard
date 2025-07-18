import { obwbAPI as api } from "../base";
import type { User } from "@/types";
import { emailAPI } from "./email";

// Auth API methods
export const obwbAuthAPI = {

  me: async (access_token: string): Promise<User> => {
    try {
      const response = await api.get<User>("/auth/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const connectionStatus = await emailAPI.connectionStatus(
        response.data.id.toString()
      );
      return {
        ...response.data,
        microsoft_user_id: connectionStatus.connected
          ? response.data.microsoft_user_id
          : null,
      };
    } catch (error) {
      throw error;
    }
  }
};
