'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Bell, 
  Calendar, 
  ClipboardCheck, 
  DollarSign, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  Ship, 
  Users, 
  Waves,
  X 
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/contexts/auth-context'
import { Badge } from '@/src/components/ui/badge'

/**
 * Operator Dashboard Header
 * Professional glassmorphic navigation for operators
 */
function OperatorDashboardHeader() {
  const { appUser, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/operator/dashboard', label: 'Overview', icon: Home },
    { href: '/operator/trips', label: 'Trips', icon: Ship },
    { href: '/operator/bookings', label: 'Bookings', icon: Calendar },
    { href: '/operator/manifests', label: 'Manifests', icon: ClipboardCheck },
    { href: '/operator/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/operator/revenue', label: 'Revenue', icon: DollarSign },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-[800] glass backdrop-blur-2xl border-b border-accent-900">
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Branding */}
        <Link href="/operator/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-500 opacity-20 blur-xl rounded-full" />
            <div className="relative glass-strong rounded-lg p-2">
              <Ship className="w-5 h-5 text-accent-300" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-fg tracking-tight">
              Operator Portal
            </h1>
            <p className="text-xs text-accent-400 -mt-0.5">
              {appUser?.fullName || 'Operator Dashboard'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-250
                ${
                  isActive(item.href)
                    ? 'text-accent-300'
                    : 'text-fg-muted hover:text-fg'
                }
              `}
            >
              {/* Active indicator */}
              {isActive(item.href) && (
                <motion.div
                  layoutId="operatorActiveTab"
                  className="absolute inset-0 glass-strong rounded-lg border border-accent-900"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative glass-hover rounded-lg p-2 hover:bg-glass-02 transition-colors">
            <Bell className="w-5 h-5 text-fg-muted" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </button>

          {/* Settings */}
          <Link 
            href="/operator/settings"
            className="glass-hover rounded-lg p-2 hover:bg-glass-02 transition-colors"
          >
            <Settings className="w-5 h-5 text-fg-muted" />
          </Link>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3 ml-2 pl-3 border-l border-border-subtle">
            <div className="text-right">
              <p className="text-sm font-semibold text-fg">
                {appUser?.fullName || 'Operator'}
              </p>
              <p className="text-xs text-accent-400 capitalize flex items-center justify-end gap-1">
                <Users className="w-3 h-3" />
                {appUser?.role || 'operator'}
              </p>
            </div>

            <Button
              onClick={() => signOut()}
              variant="ghost"
              size="sm"
              className="glass-hover"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden glass-hover rounded-lg p-2 hover:bg-glass-02 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-fg" />
            ) : (
              <Menu className="w-5 h-5 text-fg" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border-subtle"
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive(item.href)
                      ? 'glass-strong text-accent-300 border border-accent-900'
                      : 'text-fg-muted hover:text-fg hover:bg-glass-01'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            {/* Mobile User Actions */}
            <div className="pt-4 mt-4 border-t border-border-subtle">
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-semibold text-fg">
                  {appUser?.fullName || 'Operator'}
                </p>
                <p className="text-xs text-accent-400 capitalize">
                  {appUser?.role || 'operator'}
                </p>
              </div>
              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="w-full justify-start glass-hover"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}

/**
 * Operator Dashboard Footer
 * Compact operational footer with system status
 */
function OperatorDashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass border-t border-border-subtle mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-3">
            <div className="glass-subtle rounded-lg p-2">
              <Waves className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">
                Blue Waters Operator Portal
              </p>
              <p className="text-xs text-fg-muted">
                © {currentYear} Ministry of Blue Waters
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs text-fg-muted">
            <Link href="/operator/support" className="hover:text-accent-400 transition-colors">
              Support
            </Link>
            <Link href="/operator/documentation" className="hover:text-accent-400 transition-colors">
              Documentation
            </Link>
            <Link href="/operator/terms" className="hover:text-accent-400 transition-colors">
              Terms
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Operator Dashboard Layout
 * Professional layout for operator portal with enhanced navigation
 * 
 * Features:
 * - Professional glassmorphic header with extensive navigation
 * - Notification center
 * - Mobile-responsive menu
 * - Role-aware user information
 * - System status indicator
 * - Compact operational footer
 */
export default function OperatorDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-950">
      <OperatorDashboardHeader />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <OperatorDashboardFooter />
    </div>
  )
}
