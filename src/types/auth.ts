// Authentication related types

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  microsoft_user_id: string | null;
  created_at: string;
  updated_at: string;
  service: string;

}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
    microsoft_user_id: string;
  };
  service_tokens: ServiceToken[];
}

export interface ServiceToken {
  user_id: number;
  service_id: number;
  token: string;
  token_type: string;
  expires_at: string;
  id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  service: {
    name: string;
    login_endpoint: string;
    signup_endpoint: string;
    id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
  };
}


export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  userInServices: User[] | null;
  access_token: string | null;
  refresh_token: string | null;
  service_tokens: ServiceToken[];
  hydrated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  logout: () => void;
  setUser: (user: User) => void;
  setUsers: (user: User) => void;
  setHydrated: () => void;
  setMicrosoftUserId: (id: string) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  updateTokens: (access: string, refresh: string) => void;
  setIsLoading: (loading: boolean) => void;
  setServiceTokens: (tokens: ServiceToken[]) => void;
  getServiceToken: (serviceName: string) => string | null;
  getUserByService: (serviceName: string) => User | null;
}

export type AuthStore = AuthState & AuthActions;
