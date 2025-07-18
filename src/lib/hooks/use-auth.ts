import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { authAPI } from "@/lib/api";
import type { LoginRequest } from "@/types";

// Validate user hook
export function useValidateUser() {
  const { access_token } = useAuthStore();

  return useQuery({
    queryKey: ["user", "validate"],
    queryFn: async () => {
      if (!access_token) {
        throw new Error("No access token");
      }
      const user = await authAPI.me(access_token);
      return user;
    },
    enabled: !!access_token, // Only run if we have a token
    retry: false, // Don't retry on failure
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation hook
export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser, setAccessToken, setRefreshToken, setServiceTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authAPI.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      // Update store with user data
      setUser({...data.user, service: 'dashboard'});
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setServiceTokens(data.service_tokens || []);

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
}

// Signup mutation hook
export function useSignup() {
  const queryClient = useQueryClient();
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    }) => {
      const response = await authAPI.signup(userData);
      return response;
    },
    onSuccess: (data) => {
      // Update Zustand store
      setUser({...data.user, service: "dashboard"});
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
  });
}

// Logout mutation hook
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await authAPI.logout();
    },
    onSuccess: () => {
      // Clear Zustand store
      logout();

      // Clear all queries from cache
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      logout();
      queryClient.clear();
    },
  });
}
