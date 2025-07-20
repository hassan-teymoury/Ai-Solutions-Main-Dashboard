import { obwbAPI as api } from "../base";
import type {
  DigestType,
  FollowUpRequiredEmailsResponse,
  FollowUpRequiredEmailsFilters,
  GenerateResponseRequest,
  AIResponseResponse,
  AIResponsesFilters,
  ResponsesResponse,
  AIUsageStatisticsResponse,
  GenerateDigestResponse,
  AnalyzeConversationResponse,
  RelatedEmailsResponse,
} from "@/types/AIServices";

export const AIServices = {
  generateResponse: async (
    user_id: string,
    generate_response_request: GenerateResponseRequest
  ): Promise<AIResponseResponse> => {
    const response = await api.post(`/ai/generate-response`, {
      user_id,
      ...generate_response_request,
    });
    return response.data;
  },

  getUserResponses: async (
    user_id: string,
    filters: AIResponsesFilters = {}
  ): Promise<ResponsesResponse> => {
    const params: Record<string, string | number> = {
      user_id,
      page_num: filters.page_num || 1,
      page_size: Math.min(filters.page_size || 20, 100), // Ensure max 100
    };

    if (filters.conversation_id) {
      params.conversation_id = filters.conversation_id;
    }

    const response = await api.get(`/ai/responses`, { params });
    return response.data;
  },

  getResponseById: async (
    user_id: string,
    response_id: string
  ): Promise<AIResponseResponse> => {
    const response = await api.get(`/ai/responses/${response_id}`, {
      params: { user_id }
    });
    return response.data;
  },

  deleteResponse: async (
    user_id: string,
    response_id: string
  ): Promise<void> => {
    await api.delete(`/ai/responses/${response_id}`, {
      data: { user_id }
    });
  },

  getAiUsageStatistics: async (
    user_id: string
  ): Promise<AIUsageStatisticsResponse> => {
    const response = await api.get(`/ai/stats`, {
      params: { user_id }
    });
    return response.data;
  },

  clearAiCacheForConversation: async (
    user_id: string,
    conversation_id: string
  ): Promise<void> => {
    await api.post(`/ai/clear-cache/${conversation_id}`, {
      user_id
    });
  },

  generateDigest: async (
    user_id: string,
    digest_type: DigestType,
    date_range?: string
  ): Promise<GenerateDigestResponse> => {
    const response = await api.post(`/ai/generate-digest`, {
      user_id,
      digest_type,
      date_range,
    });
    return response.data;
  },

  analyzeConversation: async (
    user_id: string,
    conversation_id: string
  ): Promise<AnalyzeConversationResponse> => {
    const response = await api.post(
      `/ai/analyze-conversation/${conversation_id}`,
      { user_id }
    );
    return response.data;
  },

  getFollowUpRequiredEmails: async (
    user_id: string,
    filters: FollowUpRequiredEmailsFilters = {}
  ): Promise<FollowUpRequiredEmailsResponse> => {
    const params: Record<string, string | number> = {
      user_id,
      page_num: filters.page_num || 1,
      page_size: Math.min(filters.page_size || 20, 100), // Ensure max 100
    };

    if (filters.priority) {
      params.priority = filters.priority;
    }

    const response = await api.get(`/ai/follow-up-required`, {
      params,
    });
    return response.data;
  },

  getRelatedEmails: async (
    user_id: string,
    email_id: string
  ): Promise<RelatedEmailsResponse> => {
    const response = await api.get(`/ai/related-emails/${email_id}`, {
      params: { user_id }
    });
    return response.data;
  },
};
