import UserDashboardLayout from '@/src/components/layouts/user-dashboard-layout'

/**
 * Dashboard Layout
 * 
 * Wraps all customer dashboard routes (dashboard/*) with UserDashboardLayout.
 * This ensures consistent navigation, header, and footer across all dashboard pages.
 * 
 * Routes covered:
 * - /dashboard (main dashboard)
 * - /dashboard/* (any nested routes)
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>
}
