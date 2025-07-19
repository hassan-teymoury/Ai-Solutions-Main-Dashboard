export interface AIResponsesFilters {
  page_num?: number;
  page_size?: number;
  conversation_id?: string;
}

export type DigestType = "daily" | "real_time";

export interface GenerateDigestResponse {
  digest_id: string;
  user_id: string;
  digest_type: DigestType;
  date_range: string;
  summary: string;
  key_insights: string[];
  action_items: {
    description: string;
    deadline: string;
    priority: string;
    conversation_id: string;
  }[];
  priority_emails: {
    email_id: string;
    subject: string;
    sender: string;
    priority: string;
    reason: string;
  }[];
  conversation_summaries: {
    conversation_id: string;
    subject: string;
    summary: string;
    participants: string[];
  }[];
  created_at: string;
}

// AI Response Generation
export interface GenerateResponseRequest {
  conversation_id: string;
  force_regenerate: boolean;
  context: string;
  max_tokens: number;
}

export interface AIResponseResponse {
  id: string;
  conversation_id: string;
  user_id: string;
  response_text: string;
  model_used: string;
  tokens_used: number;
  processing_time_ms: number;
  is_cached: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResponsesResponse {
  responses: AIResponseResponse[];
  total_count: number;
  page_num: number;
  page_size: number;
  total_pages: number;
}

// AI Usage Statistics
export interface AIUsageStatisticsResponse {
  total_responses_generated: number;
  total_tokens_used: number;
  average_processing_time_ms: number;
  cache_hit_rate: number;
  most_used_model: string;
  responses_by_month: {
    [key: string]: number;
  };
  total_cost_estimate: number;
}

// AI Conversation Analysis
export interface AnalyzeConversationResponse {
  conversation_id: string;
  summary: string;
  key_points: string[];
  sentiment: string;
  urgency_level: string;
  suggested_actions: string[];
  participants_summary: {
    [key: string]: string;
  };
  created_at: string;
}

export interface RelatedEmailsResponse {
  conversation_id: string;
  related_emails: {
    email_id: string;
    conversation_id: string;
    subject: string;
    sender_email: string;
    sender_name: string;
    received_date: string;
    relevance_score: number;
    relevance_reason: string;
    summary: string;
  }[];
  total_count: number;
}

export interface FollowUpRequiredEmailsFilters {
  priority?: "low" | "medium" | "high";
  page_num?: number;
  page_size?: number;
}

export interface FollowUpRequiredEmailsResponse {
  emails: {
    email_id: string;
    conversation_id: string;
    subject: string;
    sender_email: string;
    sender_name: string;
    received_date: string;
    priority: string;
    urgency_reason: string;
    suggested_action: string;
    deadline: string;
    days_since_received: number;
  }[];
  total_count: number;
  page_num: number;
  page_size: number;
  total_pages: number;
  priority_breakdown: {
    [key: string]: number;
  };
}
