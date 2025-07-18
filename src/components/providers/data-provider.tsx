"use client";

import React, { createContext, useContext, ReactNode } from 'react';
// import { useDashboardData, useAuthStore } from '@/lib/store';
import type {
  BranchPerformanceData,
  CustomerData,
  StaffPerformanceData,
  InventoryData,
} from "@/types/dashboard";
import { useAuthStore, useOpticalDashboardStore } from '@/lib/store';

interface DataContextType {
  branchPerformance: BranchPerformanceData | null;
  customer: CustomerData | null;
  staffPerformance: StaffPerformanceData | null;
  inventory: InventoryData | null;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { branchPerformance, inventory, customer, staffPerformance } = useOpticalDashboardStore();
  const { isLoading } = useAuthStore();

  const value: DataContextType = {
    branchPerformance: branchPerformance || null,
    customer: customer || null,
    staffPerformance: staffPerformance || null,
    inventory: inventory || null,
    isLoading: isLoading || false,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Convenience hooks for specific data types
export function useBranchData() {
  const { branchPerformance } = useData();
  return branchPerformance;
}

export function useCustomerData() {
  const { customer } = useData();
  return customer;
}

export function useStaffData() {
  const { staffPerformance } = useData();
  return staffPerformance;
}

export function useInventoryData() {
  const { inventory } = useData();
  return inventory;
} 