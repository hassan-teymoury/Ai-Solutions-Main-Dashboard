export interface Email {
  id: number;
  user_id: number;
  message_id: string;
  subject: string;
  sender_email: string;
  sender_name: string;
  recipient_email: string;
  recipient_name: string;
  body: string;
  body_preview: string;
  received_date: string;
  is_read: boolean;
  has_attachments: boolean;
  importance: string;
  categories: string[];
  created_at: string;
  updated_at: string;
}

export interface EmailPagination {
  page_num: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface EmailResponse {
  emails: Email[];
  pagination: EmailPagination;
}

export interface EmailFilters {
  page_num?: number;
  page_size?: number;
  subject_contains?: string;
  sender_email?: string;
  sender_name_contains?: string;
  body_contains?: string;
  received_after?: string; // YYYY-MM-DD
  received_before?: string; // YYYY-MM-DD
  is_read?: boolean;
  has_attachments?: boolean;
  importance?: "low" | "normal" | "high";
  search_text?: string;
  sort_by?: string; // e.g. "received_date"
  sort_order?: "asc" | "desc";
}

export interface SyncEmailsResponse {
  success: boolean;
  user_id: string;
  emails_fetched: number;
  emails_saved: number;
  total_emails: number;
  message: string;
  sync_timestamp: string;
}

export interface Conversation {
  conversation_id: string;
  subject: string;
  sender_email: string;
  sender_name: string;
  participant_count: number;
  email_count: number;
  latest_email_date: string;
  first_email_date: string;
  has_unread: boolean;
  has_attachments: boolean;
  importance: "low" | "normal" | "high";
}

export interface ConversationPagination {
  page_num: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ConversationResponse {
  conversations: Conversation[];
  pagination: ConversationPagination;
}

export interface ConversationFilters {
  page_num?: number;
  page_size?: number;
  subject_contains?: string;
  sender_email?: string;
  has_unread?: boolean;
  has_attachments?: boolean;
  importance?: "low" | "normal" | "high";
  sort_by?: "latest_email_date" | "first_email_date" | "email_count" | "subject" | "participant_count";
  sort_order?: "asc" | "desc";
}

export interface ConversationDetailFilters {
  page_num?: number;
  page_size?: number;
}

export interface ConversationDetailResponse {
  conversation_id: string;
  subject: string;
  participants: Record<string, string>;
  emails: Email[];
  total_emails: number;
  conversation_duration_days: number;
  latest_email_date: string;
  first_email_date: string;
}
