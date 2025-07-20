import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";
import { obwbAuthAPI } from "@/lib/api/obwb/auth";
import { useAuthStore } from "@/lib/store";
import type { LoginRequest } from "@/types";

// Get OBWB user data hook
export function useObwbUser() {
  const { getServiceToken, setUsers } = useAuthStore();
  const obwbToken = getServiceToken('obwb');

  return useQuery({
    queryKey: ["obwb-user"],
    queryFn: async () => {
      const obwbUser = await obwbAuthAPI.me();
      // Store the OBWB user in our store
      setUsers(obwbUser);
      return obwbUser;
    },
    enabled: !!obwbToken, // Only run if we have OBWB token
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Get current user hook
export function useCurrentUser() {
  const { user } = useAuthStore();
  return user;
}

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
      console.log("Attempting login...");
      const response = await authAPI.login(credentials);
      console.log("Login successful:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("Setting user data in store...");
      
      // Update store with user data
      setUser({
        ...data.user, 
        service: 'dashboard',
        microsoft_user_id: data.user.microsoft_user_id || null
      });
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setServiceTokens(data.service_tokens || []);

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      console.log("User data set successfully");
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
      setUser({
        ...data.user, 
        service: "dashboard",
        microsoft_user_id: data.user.microsoft_user_id || null
      });
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
