import axios from "axios";
import { dashboardAuthAPI as api } from "../base";
import type {
  EmailResponse,
  EmailFilters,
  Email,
  SyncEmailsResponse,
} from "@/types";
import { ConnectionStatusResponse, EmailConnectionResponse } from "@/types/api";

// Email API methods
export const emailAPI = {
  // Get email authentication URL
  getAuthUrl: async (): Promise<{ auth_url: string; state: string }> => {
    try {
      const response = await api.get<{ auth_url: string; state: string }>(
        "/emails/auth-url"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail?.[0]?.msg || "Failed to get auth URL"
        );
      }
      throw error;
    }
  },

  getEmails: async (
    microsoft_user_id: string,
    filters: EmailFilters = {}
  ): Promise<EmailResponse> => {
    try {
      const response = await api.get<EmailResponse>(
        `/emails/${microsoft_user_id}`,
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmailById: async (
    microsoft_user_id: string,
    id: string
  ): Promise<Email> => {
    try {
      const response = await api.get<Email>(
        `/emails/${microsoft_user_id}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markEmailAsRead: async (
    microsoft_user_id: string,
    id: string
  ): Promise<void> => {
    try {
      await api.patch(`/emails/${microsoft_user_id}/${id}/read`, "true");
    } catch (error) {
      throw error;
    }
  },

  syncEmails: async (
    microsoft_user_id: string
  ): Promise<SyncEmailsResponse> => {
    try {
      const response = await api.post<SyncEmailsResponse>(
        `/emails/sync/${microsoft_user_id}`,
        {
          max_emails: 100,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  disconnectEmail: async (microsoft_user_id: string): Promise<void> => {
    try {
      await api.post(`/users/${microsoft_user_id}/disconnect`, {
        user_id: microsoft_user_id,
      });
    } catch (error) {
      throw error;
    }
  },

  connectEmail: async (user_id: string): Promise<ConnectionStatusResponse> => {
    try {
      const response = await api.post<ConnectionStatusResponse>(
        `/users/${user_id}/connect`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  connectionStatus: async (
    user_id: string
  ): Promise<EmailConnectionResponse> => {
    try {
      const response = await api.get<EmailConnectionResponse>(
        `/users/${user_id}/connection-status`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 