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
      const response = await obwbAPI.post<EmailConnectionResponse>(
        `/users/${microsoft_user_id}/connect`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  disconnectEmail: async (microsoft_user_id: string): Promise<EmailDisconnectResponse> => {
    try {
      const response = await obwbAPI.post<EmailDisconnectResponse>(
        `/users/${microsoft_user_id}/disconnect`
      );
      return response.data;
    } catch (error) {
      throw error;
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
      
      // Create params object, filtering out undefined values
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      // Add filters only if they have actual values (not undefined, null, or empty string)
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      const response = await obwbAPI.get<EmailsResponse>(
        `/emails/${microsoft_user_id}?${queryString}`
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
        `/emails/${microsoft_user_id}/${email_id}`
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
        `/conversations/${microsoft_user_id}?page=${page}&limit=${limit}`
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
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await obwbAPI.get<FollowUpEmailsResponse>(
        `/ai/${microsoft_user_id}/follow-up-emails?${params}`
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

  syncEmails: async (microsoft_user_id: string, max_emails: number = 100): Promise<{ emails_fetched: number; emails_saved: number }> => {
    try {
      const response = await obwbAPI.post<{ emails_fetched: number; emails_saved: number }>(
        `/emails/sync/${microsoft_user_id}/async`,
        { max_emails }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markEmailAsRead: async (microsoft_user_id: string, email_id: string): Promise<void> => {
    try {
      await obwbAPI.post(
        `/emails/${microsoft_user_id}/${email_id}/read`
      );
    } catch (error) {
      // Fail silently for mark as read
      console.error('Failed to mark email as read:', error);
    }
  },
}; 