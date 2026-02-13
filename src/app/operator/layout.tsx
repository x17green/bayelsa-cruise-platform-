import OperatorDashboardLayout from '@/src/components/layouts/operator-dashboard-layout'

/**
 * Operator Dashboard Layout
 * 
 * Wraps all operator dashboard routes (operator/*) with OperatorDashboardLayout.
 * This ensures consistent navigation, header, and footer across all operator pages.
 * 
 * Routes covered:
 * - /operator/dashboard (operator overview)
 * - /operator/trips (trip management)
 * - /operator/bookings (booking management)
 * - /operator/* (any nested operator routes)
 */
export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OperatorDashboardLayout>{children}</OperatorDashboardLayout>
}
