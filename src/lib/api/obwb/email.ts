import { dashboardAuthAPI } from "../base";
import {
  EmailConnectionResponse,
  EmailDisconnectResponse,
  AuthUrlResponse,
  EmailsResponse,
  EmailDetailResponse,
  ConversationsResponse,
  FollowUpEmailsResponse,
} from "@/types/api";
import { useAuthStore } from "@/lib/store";

export const emailAPI = {
  getAuthUrl: async (): Promise<AuthUrlResponse> => {
    try {
      const response = await dashboardAuthAPI.get<AuthUrlResponse>("/emails/auth-url");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  connectEmail: async (user_id: string): Promise<EmailConnectionResponse> => {
    try {
      const response = await dashboardAuthAPI.post<EmailConnectionResponse>(
        `/users/${user_id}/connect-email`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  disconnectEmail: async (microsoft_user_id: string): Promise<EmailDisconnectResponse> => {
    try {
      const response = await dashboardAuthAPI.delete<EmailDisconnectResponse>(
        `/users/microsoft/${microsoft_user_id}/disconnect-email`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmails: async (
    user_id: string,
    options: {
      page?: number;
      limit?: number;
      [key: string]: any;
    } = {}
  ): Promise<EmailsResponse> => {
    try {
      const { page = 1, limit = 10, ...filters } = options;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [key, String(value)])
        ),
      });

      const response = await dashboardAuthAPI.get<EmailsResponse>(
        `/users/${user_id}/emails?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmailDetail: async (
    user_id: string,
    email_id: string
  ): Promise<EmailDetailResponse> => {
    try {
      const response = await dashboardAuthAPI.get<EmailDetailResponse>(
        `/users/${user_id}/emails/${email_id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getConversations: async (
    user_id: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ConversationsResponse> => {
    try {
      const response = await dashboardAuthAPI.get<ConversationsResponse>(
        `/users/${user_id}/conversations?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFollowUpEmails: async (
    user_id: string,
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<FollowUpEmailsResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await dashboardAuthAPI.get<FollowUpEmailsResponse>(
        `/users/${user_id}/follow-up-emails?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Instead of connectionStatus, check user's microsoft_user_id from auth store
  checkEmailConnection: (): { connected: boolean; email?: string; user_id?: string } => {
    const { user } = useAuthStore.getState();
    
    return {
      connected: !!user?.microsoft_user_id,
      email: user?.email || undefined,
      user_id: user?.microsoft_user_id || undefined,
    };
  },

  syncEmails: async (microsoft_user_id: string): Promise<{ emails_fetched: number; emails_saved: number }> => {
    try {
      const response = await dashboardAuthAPI.post<{ emails_fetched: number; emails_saved: number }>(
        `/users/microsoft/${microsoft_user_id}/sync-emails`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markEmailAsRead: async (user_id: string, email_id: string): Promise<void> => {
    try {
      await dashboardAuthAPI.patch(`/users/${user_id}/emails/${email_id}/read`);
    } catch (error) {
      // Fail silently for mark as read
      console.error('Failed to mark email as read:', error);
    }
  },
}; 