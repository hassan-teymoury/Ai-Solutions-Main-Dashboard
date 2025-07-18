// Dashboard related types

export interface NavigationItem {
  name: string
  href: string
  icon: string
  badge?: string | number
  children?: NavigationItem[]
}

export interface DashboardStats {
  totalUsers: number
  totalReports: number
  growthRate: number
  revenue: number
  changeFromLastMonth: {
    users: number
    reports: number
    growth: number
    revenue: number
  }
}

export interface RecentActivity {
  id: string
  type: 'user_registration' | 'report_generated' | 'system_update' | 'login' | 'logout'
  title: string
  description: string
  timestamp: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
  status: 'success' | 'warning' | 'error' | 'info'
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export interface DashboardCard {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease'
  icon: string
  color: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

export interface DashboardLayout {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  sidebarWidth: number
} 

import { LucideIcon } from "lucide-react";


export interface DashboardStats {
  totalTransactions: number;
  totalRevenue: number;
  profitMargin: number;
  returnRate: number;
  activeBranches: number;
  returnImpact: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface DashboardCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  variant?: "default" | "success" | "warning" | "danger";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface DashboardLayout {
  cards: DashboardCard[];
  charts: ChartData[];
  tables: unknown[];
}

// Branch Performance Types
export interface BranchData {
  name: string;
  revenue: number;
  netRevenue: number;
  profit: number;
  profitMargin: number;
  returnRate: number;
  transactions: number;
  avgTransaction: number;
}

export interface BranchPerformanceData {
  branches: BranchData[];
  totalTransactions: number;
  validRecords: number;
  totalRevenue: number;
  profitMargin: number;
  returnRate: number;
  activeBranches: number;
  returnImpact: number;
  revenueLoss: number;
}

// Customer Metrics Types
export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  revenue: number;
  avgRevenue: number;
}

export interface CustomerData {
  totalCustomers: number;
  averageCLV: number;
  retentionRate: number;
  oneTimeBuyerRate: number;
  vipCustomers: number;
  segments: CustomerSegment[];
  topCustomers: TopCustomer[];
  retention: {
    [key: string]: {
      count: number;
      percentage: number;
      revenue: number;
      avgRevenue: number;
    };
  };
}

export interface TopCustomer {
  name: string;
  spent: number;
  transactions: number;
  avgTransaction: number;
  frequency: number;
  segment: string;
}

// Staff Performance Types
export interface StaffMember {
  Sales_Person: string;
  Total_Sales: number;
  Total_Transactions: number;
  Active_Days: number;
  Total_Items_Sold: number;
  Daily_Sales: number;
  Sales_Per_Transaction: number;
  Transactions_Per_Day: number;
  Items_Per_Day: number;
  Average_Profit_Percentage: number;
  Revenue_Weighted_Profit_Percentage: number;
  Sales_Rank: number;
  Market_Share_Percentage: number;
  Performance_Class: string;
}

export interface TopPerformer {
  Sales_Person: string;
  Daily_Sales: number;
  Sales_Per_Transaction: number;
  Transactions_Per_Day: number;
  Items_Per_Day: number;
}

export interface ProfitabilityLeader {
  Sales_Person: string;
  Average_Profit_Percentage: number;
  Revenue_Weighted_Profit_Percentage: number;
  Total_Sales: number;
}

export interface CompanyTotals {
  total_staff: number;
  total_sales: number;
  total_transactions: number;
  average_sales_per_staff: number;
  average_daily_sales: number;
  average_profit_percentage: number;
  revenue_weighted_profit: number;
  performance_gap: number;
  top_performer: {
  name: string;
  sales: number;
    market_share: number;
    daily_sales: number;
  };
}

export interface QuartileAnalysis {
  count: number;
  percentage: number;
  total_sales: number;
  average_sales: number;
  revenue_share: number;
}

export interface TopPerformers {
  top_sales_performers: StaffMember[];
  top_productivity_leaders: TopPerformer[];
  top_profitability_leaders: ProfitabilityLeader[];
}

export interface StaffPerformanceData {
  company_totals: CompanyTotals;
  quartile_analysis: {
    [key: string]: QuartileAnalysis;
  };
  top_performers: TopPerformers;
  all_staff_performance: StaffMember[];
}

// Inventory Types
export interface ProductCategory {
  name: string;
  revenue: number;
  quantity: number;
  marketShare: number;
  performanceScore: number;
  margin: number;
}

export interface ProductBrand {
  name: string;
  revenue: number;
  quantity: number;
  varieties: number;
  brandScore: number;
  margin: number;
}

export interface PricePoint {
  range: string;
  revenue: number;
  quantity: number;
  marketShare: number;
  avgTransaction: number;
}

export interface TopProduct {
  rank: number;
  name: string;
  brand: string;
  category: string;
  quantity: number;
  revenue: number;
}

export interface InventoryData {
  totalProductPortfolio: number;
  totalBrands: number;
  totalCategories: number;
  totalRevenue: number;
  totalQuantitySold: number;
  dataQuality: number;
  validRecords: number;
  categories: ProductCategory[];
  topBrands: ProductBrand[];
  pricePoints: PricePoint[];
  topProducts: TopProduct[];
  topMarginBrands: {
    name: string;
    margin: number;
    revenue: number;
  }[];
}

export interface StatsCardConfig {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  formatValue?: (value: number) => string;
}

export interface OpticalDashboardData {
  branchPerformance: BranchPerformanceData | null;
  customer: CustomerData | null;
  staffPerformance: StaffPerformanceData | null;
  inventory: InventoryData | null;
}

export interface OpticalDashboardActions {
  setDashboardData: (data: OpticalDashboardData) => void;
}

export type ExtendedOpticalDashboardStore = OpticalDashboardData & OpticalDashboardActions