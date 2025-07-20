import { obwbAPI } from "../base";
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
      const response = await obwbAPI.get<AuthUrlResponse>("/emails/auth-url");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  connectEmail: async (microsoft_user_id: string): Promise<EmailConnectionResponse> => {
    try {
      // Try the direct endpoint first
      const response = await obwbAPI.post<EmailConnectionResponse>(
        `/emails/connect`,
        { microsoft_user_id }
      );
      return response.data;
    } catch (error) {
      // If that fails, try alternative endpoint
      try {
        const response = await obwbAPI.post<EmailConnectionResponse>(
          `/connect-email`,
          { microsoft_user_id }
        );
        return response.data;
      } catch {
        // If both fail, try another alternative
        try {
          const response = await obwbAPI.post<EmailConnectionResponse>(
            `/auth/connect-email`,
            { microsoft_user_id }
          );
          return response.data;
        } catch {
          throw error; // Return original error
        }
      }
    }
  },

  disconnectEmail: async (microsoft_user_id: string): Promise<EmailDisconnectResponse> => {
    try {
      // Try the direct endpoint first
      const response = await obwbAPI.delete<EmailDisconnectResponse>(
        `/emails/disconnect`,
        { data: { microsoft_user_id } }
      );
      return response.data;
    } catch (error) {
      // If that fails, try alternative endpoint
      try {
        const response = await obwbAPI.delete<EmailDisconnectResponse>(
          `/disconnect-email`,
          { data: { microsoft_user_id } }
        );
        return response.data;
      } catch {
        // If both fail, try another alternative
        try {
          const response = await obwbAPI.delete<EmailDisconnectResponse>(
            `/auth/disconnect-email`,
            { data: { microsoft_user_id } }
          );
          return response.data;
        } catch {
          throw error; // Return original error
        }
      }
    }
  },

  getEmails: async (
    microsoft_user_id: string,
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
        microsoft_user_id,
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [key, String(value)])
        ),
      });

      const response = await obwbAPI.get<EmailsResponse>(
        `/emails?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmailDetail: async (
    microsoft_user_id: string,
    email_id: string
  ): Promise<EmailDetailResponse> => {
    try {
      const response = await obwbAPI.get<EmailDetailResponse>(
        `/emails/${email_id}?microsoft_user_id=${microsoft_user_id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getConversations: async (
    microsoft_user_id: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ConversationsResponse> => {
    try {
      const response = await obwbAPI.get<ConversationsResponse>(
        `/conversations?microsoft_user_id=${microsoft_user_id}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFollowUpEmails: async (
    microsoft_user_id: string,
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<FollowUpEmailsResponse> => {
    try {
      const params = new URLSearchParams({
        microsoft_user_id,
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await obwbAPI.get<FollowUpEmailsResponse>(
        `/follow-up-emails?${params}`
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
      const response = await obwbAPI.post<{ emails_fetched: number; emails_saved: number }>(
        `/emails/sync`,
        { microsoft_user_id }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markEmailAsRead: async (microsoft_user_id: string, email_id: string): Promise<void> => {
    try {
      await obwbAPI.patch(
        `/emails/${email_id}/read`,
        { microsoft_user_id }
      );
    } catch (error) {
      // Fail silently for mark as read
      console.error('Failed to mark email as read:', error);
    }
  },
}; 