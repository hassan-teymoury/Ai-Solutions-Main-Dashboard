import axios from "axios";
import { dashboardAuthAPI as api } from "./base";
import type { LoginRequest, SignupRequest, AuthResponse, User } from "@/types";
import { RefreshTokenRequest, RefreshTokenResponse } from "@/types/auth";

// Auth API methods
export const authAPI = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.email);
      formData.append("password", credentials.password);

      const response = await api.post<AuthResponse>(
        "/auth/token",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in,
        user: response.data.user,
        service_tokens: response.data.service_tokens,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || "Login failed");
      }
      throw error;
    }
  },

  // Signup user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/signup", {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in,
        user: response.data.user,
        service_tokens: response.data.service_tokens
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail?.[0]?.msg || "Signup failed"
        );
      }
      throw error;
    }
  },

  refreshToken: async (
    tokenData: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    try {
      const response = await api.post<RefreshTokenResponse>("/auth/refresh", {
        refresh_token: tokenData.refresh_token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  me: async (access_token: string): Promise<User> => {
    try {
      const response = await api.get<User>("/auth/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const user_id = JSON.parse(localStorage.getItem("auth-storage")!).state
        .user.id;
      return {
        ...response.data,
        // microsoft_user_id: connectionStatus.connected
        //   ? response.data.microsoft_user_id
        //   : null,
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // await api.post("/auth/logout");
    } catch (error) {
      // Even if logout fails, we should clear local storage
      console.error("Logout error:", error);
    }
  },
};
