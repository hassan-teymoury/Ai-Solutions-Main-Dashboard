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
        `/conversations/${microsoft_user_id}`,
        {
          params: filters,
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
        `/conversations/${microsoft_user_id}/${conversation_id}`,
        {
          params: filters,
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

  getConversationEmails: async (
    microsoft_user_id: string,
    conversation_id: string,
    filters: ConversationDetailFilters = {}
  ): Promise<EmailResponse> => {
    try {
      const response = await api.get<EmailResponse>(
        `/conversations/${microsoft_user_id}/${conversation_id}/emails`,
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail || "Failed to get conversation emails"
        );
      }
      throw error;
    }
  },
}; 