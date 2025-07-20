import axios from "axios";
import { obwbAPI as api } from "../base";
import type {
  ConversationResponse,
  ConversationFilters,
  ConversationDetailResponse,
  ConversationDetailFilters,
  EmailResponse,
} from "@/types";

// Conversations API methods
export const conversationsAPI = {
  getConversations: async (
    microsoft_user_id: string,
    filters: ConversationFilters = {}
  ): Promise<ConversationResponse> => {
    try {
      const response = await api.get<ConversationResponse>(
        `/conversations`,
        {
          params: {
            microsoft_user_id,
            ...filters,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail || "Failed to get conversations"
        );
      }
      throw error;
    }
  },

  getConversationDetail: async (
    microsoft_user_id: string,
    conversation_id: string,
    filters: ConversationDetailFilters = {}
  ): Promise<ConversationDetailResponse> => {
    try {
      const response = await api.get<ConversationDetailResponse>(
        `/conversations/${conversation_id}`,
        {
          params: {
            microsoft_user_id,
            ...filters,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail || "Failed to get conversation detail"
        );
      }
      throw error;
    }
  },

  getRelatedEmails: async (
    microsoft_user_id: string,
    conversation_id: string
  ): Promise<EmailResponse> => {
    try {
      const response = await api.get<EmailResponse>(
        `/conversations/${conversation_id}/related-emails`,
        {
          params: {
            microsoft_user_id,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail || "Failed to get related emails"
        );
      }
      throw error;
    }
  },
}; 