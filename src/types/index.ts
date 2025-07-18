// Main types index file - export all types for easy importing

// Auth types
export type {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  AuthState,
  AuthActions,
  AuthStore,
} from "./auth";

// API types
export type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  ApiConfig,
  HttpMethod,
  RequestConfig,
  ApiEndpoint,
  ApiService,
} from "./api";

// Form types
export type {
  LoginFormData,
  SignupFormData,
  ProfileFormData,
  PasswordChangeFormData,
  FormError,
  FormErrors,
  FormState,
  FormField,
  ValidationRule,
} from "./forms";

// Dashboard types
export type {
  NavigationItem,
  DashboardStats,
  RecentActivity,
  QuickAction,
  DashboardCard,
  ChartData,
  DashboardLayout,
} from "./dashboard";

// Common types
export type {
  BaseEntity,
  PaginationParams,
  PaginationMeta,
  SelectOption,
  FileUpload,
  Notification,
  Breadcrumb,
  Theme,
  ThemeMode,
  ThemeState,
  LoadingState,
  ModalState,
  ConfirmDialog,
} from "./common";

// Emails types
export type { 
  Email, 
  EmailResponse, 
  ConversationResponse, 
  ConversationDetailResponse,
  ConversationFilters,
  ConversationDetailFilters 
} from "./emails";

export * from "./emails";

// AI Services types
export * from "./AIServices";
