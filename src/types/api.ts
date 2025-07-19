// API related types

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// HTTP method types
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Request configuration
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// API endpoint types
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  requiresAuth?: boolean;
}

// API service interface
export interface ApiService {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
}

export interface ConnectionStatusResponse {
  success: boolean;
  user_id: string;
  connected: boolean;
  message: string;
}

export interface EmailConnectionResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  microsoft_user_id: string;
  connected: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailDisconnectResponse {
  success: boolean;
  message: string;
}

export interface AuthUrlResponse {
  auth_url: string;
  state: string;
}

export interface EmailsResponse {
  emails: any[];
  total: number;
  page: number;
  limit: number;
  pagination: {
    page_num: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface EmailDetailResponse {
  id: string;
  subject: string;
  sender: string;
  sender_name: string;
  sender_email: string;
  body: string;
  body_preview?: string;
  received_at: string;
  is_read: boolean;
  importance: "high" | "normal" | "low";
  has_attachments: boolean;
  thread_id?: string;
}

export interface ConversationsResponse {
  conversations: any[];
  total: number;
  page: number;
  limit: number;
}

export interface FollowUpEmailsResponse {
  emails: any[];
  total: number;
  page: number;
  limit: number;
}


