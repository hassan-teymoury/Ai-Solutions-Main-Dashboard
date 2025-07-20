import { obwbAPI } from "../base";
import type { User } from "@/types";

// Auth API methods for OBWB service
export const obwbAuthAPI = {
  me: async (): Promise<User> => {
    try {
      const response = await obwbAPI.get<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        created_at: string;
        updated_at: string;
        microsoft_user_id: string;
      }>("/auth/me");
      
      // Transform OBWB response to our User type
      return {
        id: response.data.id,
        email: response.data.email,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        microsoft_user_id: response.data.microsoft_user_id,
        service: "obwb"
      };
    } catch (error) {
      throw error;
    }
  }
};
