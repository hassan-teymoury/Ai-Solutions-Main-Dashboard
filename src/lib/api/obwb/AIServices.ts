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
    const response = await api.post(`/ai/${user_id}/generate-response`, {
      ...generate_response_request,
    });
    return response.data;
  },

  getUserResponses: async (
    user_id: string,
    filters: AIResponsesFilters = {}
  ): Promise<ResponsesResponse> => {
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page_num', String(filters.page_num || 1));
    params.append('page_size', String(Math.min(filters.page_size || 20, 100)));
    
    // Add optional filters
    if (filters.conversation_id) {
      params.append('conversation_id', filters.conversation_id);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/ai/${user_id}/responses${queryString}`);
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

  generateDigest: async (
    user_id: string,
    digest_type: DigestType,
    date_range?: string
  ): Promise<GenerateDigestResponse> => {
    const response = await api.post(`/ai/${user_id}/generate-digest`, {
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
      `/ai/${user_id}/analyze-conversation/${conversation_id}`
    );
    return response.data;
  },

  getFollowUpRequiredEmails: async (
    user_id: string,
    filters: FollowUpRequiredEmailsFilters = {}
  ): Promise<FollowUpRequiredEmailsResponse> => {
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page_num', String(filters.page_num || 1));
    params.append('page_size', String(Math.min(filters.page_size || 20, 100)));
    
    // Add optional filters
    if (filters.priority) {
      params.append('priority', filters.priority);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/ai/${user_id}/follow-up-emails${queryString}`);
    return response.data;
  },

  getRelatedEmails: async (
    user_id: string,
    email_id: string
  ): Promise<RelatedEmailsResponse> => {
    const response = await api.get(`/ai/${user_id}/related-emails/${email_id}`);
    return response.data;
  },
};
