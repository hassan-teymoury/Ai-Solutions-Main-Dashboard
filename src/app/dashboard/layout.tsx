'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout>
      <AuthGuard>{children}</AuthGuard>
    </DashboardLayout>
  )
} 