import {
  AIResponseResponse,
  AIResponsesFilters,
  AIUsageStatisticsResponse,
  AnalyzeConversationResponse,
  DigestType,
  FollowUpRequiredEmailsFilters,
  FollowUpRequiredEmailsResponse,
  GenerateDigestResponse,
  GenerateResponseRequest,
  RelatedEmailsResponse,
  ResponsesResponse,
} from "@/types/AIServices";
import { obwbAPI as api } from "../base";

export const AIServices = {
  generateResponse: async (
    user_id: string,
    generate_response_request: GenerateResponseRequest
  ): Promise<AIResponseResponse> => {
    const response = await api.post(`/ai/${user_id}/generate-response`, {
      ...generate_response_request,
    });
    return response.data;
  },

  getUserResponses: async (
    user_id: string,
    filters: AIResponsesFilters = {}
  ): Promise<ResponsesResponse> => {
    const params: Record<string, string | number> = {
      page_num: filters.page_num || 1,
      page_size: Math.min(filters.page_size || 20, 100), // Ensure max 100
    };

    if (filters.conversation_id) {
      params.conversation_id = filters.conversation_id;
    }

    const response = await api.get(`/ai/${user_id}/responses`, { params });
    return response.data;
  },

  getResponseById: async (
    user_id: string,
    response_id: string
  ): Promise<AIResponseResponse> => {
    const response = await api.get(`/ai/${user_id}/responses/${response_id}`);
    return response.data;
  },

  deleteResponse: async (
    user_id: string,
    response_id: string
  ): Promise<void> => {
    await api.delete(`/ai/${user_id}/responses/${response_id}`);
  },

  getAiUsageStatistics: async (
    user_id: string
  ): Promise<AIUsageStatisticsResponse> => {
    const response = await api.get(`/ai/${user_id}/stats`);
    return response.data;
  },

  clearAiCacheForConversation: async (
    user_id: string,
    conversation_id: string
  ): Promise<void> => {
    await api.post(`/ai/${user_id}/clear-cache/${conversation_id}`);
  },

  analyzeConversation: async (
    user_id: string,
    conversation_id: string
  ): Promise<AnalyzeConversationResponse> => {
    const response = await api.post(
      `/ai/${user_id}/analyze-conversation/${conversation_id}`
    );
    return response.data;
  },

  generateDigest: async (
    user_id: string,
    digest_type: DigestType,
    date_range: string
  ): Promise<GenerateDigestResponse> => {
    const response = await api.post(`/ai/${user_id}/generate-digest`, {
      params: {
        digest_type,
        date_range,
      },
    });
    return response.data;
  },

  getRelatedEmails: async (
    user_id: string,
    conversation_id: string,
    limit: number
  ): Promise<RelatedEmailsResponse> => {
    const response = await api.get(
      `/ai/${user_id}/related-emails/${conversation_id}`,
      {
        params: {
          limit,
        },
      }
    );
    return response.data;
  },

  getFollowUpRequiredEmails: async (
    user_id: string,
    filters: FollowUpRequiredEmailsFilters
  ): Promise<FollowUpRequiredEmailsResponse> => {
    const response = await api.get(`/ai/${user_id}/follow-up-emails/`, {
      params: filters,
    });
    return response.data;
  },
};
