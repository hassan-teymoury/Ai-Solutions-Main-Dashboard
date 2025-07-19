import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore, User } from "@/types";
import { ServiceToken } from "@/types/auth";
import { ExtendedOpticalDashboardStore, OpticalDashboardData } from "@/types/dashboard";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      userInServices: null,
      access_token: null,
      refresh_token: null,
      service_tokens: [],
      isLoading: false,
      hydrated: false,

      logout: () => {
        localStorage.removeItem('auth-storage');
        set({
          user: null,
          userInServices: null,
          access_token: null,
          refresh_token: null,
          service_tokens: [],
          isLoading: false,
          hydrated: true,
        });
      },

      setUser: (user) => {
        set({ user });
        
        // Also add to userInServices for compatibility
        set((state) => {
          const existingUserIndex = state.userInServices?.findIndex(u => u.service === user.service);
          
          if (existingUserIndex !== undefined && existingUserIndex !== -1) {
            // User exists, update the existing user
            const updatedUsers = [...state.userInServices!];
            updatedUsers[existingUserIndex] = { ...updatedUsers[existingUserIndex], ...user };
            return { userInServices: updatedUsers };
          } else {
            // User does not exist, add a new user
            return { userInServices: state.userInServices ? [...state.userInServices, user] : [user] };
          }
        });
      },

      setUsers: (user: User) => set((state) => {
        const existingUserIndex = state.userInServices?.findIndex(u => u.service === user.service);

        if (existingUserIndex !== undefined && existingUserIndex !== -1) {
          // User exists, update the existing user
          const updatedUsers = [...state.userInServices!];
          updatedUsers[existingUserIndex] = { ...updatedUsers[existingUserIndex], ...user };
          return { userInServices: updatedUsers };
        } else {
          // User does not exist, add a new user
          return { userInServices: state.userInServices ? [...state.userInServices, user] : [user] };
        }
      }),
      
      getUserByService: (serviceName: string) => {
        const { userInServices, user } = get();
        
        // Check main user first
        if (user && user.service === serviceName) {
          return user;
        }
        
        // Then check userInServices
        return userInServices?.find((user) => user.service === serviceName) || null;
      },
      
      setAccessToken: (access_token: string) => set({ access_token }),
      setRefreshToken: (refresh_token: string) => set({ refresh_token }),
      updateTokens: (access_token: string, refresh_token: string) =>
        set({ access_token, refresh_token }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),

      setServiceTokens: (tokens: ServiceToken[]) => set({ service_tokens: tokens }),
      getServiceToken: (serviceName: string) => {
        const { service_tokens } = get();
        const match = service_tokens.find((t) => t.service.name === serviceName);
        return match?.token || null;
      },

      setHydrated: () => set({ hydrated: true, isLoading: false }),
      setMicrosoftUserId: (microsoft_user_id: string) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, microsoft_user_id }
          });
        }
        
        const { userInServices } = get();
        if (userInServices) {
          const updatedUsers = userInServices.map((user) =>
            user.service === 'obwb'
              ? { ...user, microsoft_user_id }
              : user
          );
          set({ userInServices: updatedUsers });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        userInServices: state.userInServices,
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        service_tokens: state.service_tokens,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);



export const useOpticalDashboardStore = create<ExtendedOpticalDashboardStore>()(
  persist(
    (set) => ({
      branchPerformance: null,
      customer: null,
      staffPerformance: null,
      inventory: null,

      setDashboardData: (data: OpticalDashboardData) => {
        set(data);
      },
    }),
    // TODO: Remove persist to ensure user must login after refresh
    { partialize: () => ({}), name: "" }
    // {
    //   name: 'auth-storage',
    //   partialize: (state) => ({
    //     user: state.user,
    //     token: state.token,
    //     isAuthenticated: state.isAuthenticated
    //   })
    // }
  )
);

export const useBranchPerformanceData = () => {
  const { branchPerformance } = useOpticalDashboardStore();
  return branchPerformance;
};