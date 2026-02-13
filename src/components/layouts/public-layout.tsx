'use client'

import { motion } from 'framer-motion'
import { 
  Anchor, 
  Facebook, 
  Instagram, 
  LogIn, 
  Mail, 
  MapPin, 
  Phone, 
  Twitter, 
  UserPlus, 
  Waves 
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode } from 'react'

import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/hooks/use-auth'

/**
 * Public Layout Header
 * Glassmorphic navigation for public-facing pages
 */
function PublicHeader() {
  const { user, appUser } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#trips', label: 'Book Now' },
    { href: '/#how', label: 'How It Works' },
    { href: '/#testimonials', label: 'Reviews' },
  ]

  const isActive = (href: string) => pathname === href

  const handleDashboardClick = () => {
    if (!user || !appUser) return

    // Role-based routing
    if (appUser.role === 'operator' || appUser.role === 'staff' || appUser.role === 'admin') {
      router.push('/operator/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <header className="sticky top-0 z-[var(--z-header)] glass backdrop-blur-[var(--blur-strong)] border-b border-[var(--border-subtle)]">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-400)] flex items-center justify-center ring-2 ring-[var(--accent-700)] ring-offset-2 ring-offset-[var(--bg-900)] transition-transform duration-300 group-hover:scale-105">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-[var(--accent-500)] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30" />
          </div>
          <div>
            <p className="font-bold text-xl text-[var(--fg)] tracking-tight">
              Blue Waters
            </p>
            <p className="text-xs text-[var(--fg-muted)] -mt-0.5">
              Bayelsa Boat Booking
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? 'text-[var(--accent-400)]'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Button
              onClick={handleDashboardClick}
              className="glass-strong border border-[var(--accent-700)] text-[var(--accent-300)] hover:text-[var(--accent-200)] hover:border-[var(--accent-600)] transition-all duration-200"
            >
              <Anchor className="w-4 h-4 mr-2" />
              {appUser?.role === 'operator' || appUser?.role === 'staff' || appUser?.role === 'admin' 
                ? 'Operator Portal' 
                : 'My Dashboard'}
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="ghost"
                  className="text-[var(--accent-400)] hover:text-[var(--accent-300)] hover:bg-[var(--glass-01)]"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[var(--accent-600)] text-white hover:bg-[var(--accent-500)] border border-[var(--accent-700)] shadow-lg shadow-[var(--accent-900)]/30 transition-all duration-200">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

/**
 * Public Layout Footer
 * Professional footer with contact info and links
 */
function PublicFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/#how' },
      { label: 'Safety Guidelines', href: '/safety' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cancellation Policy', href: '/cancellation' },
    ],
    services: [
      { label: 'Book a Trip', href: '/book' },
      { label: 'Search Routes', href: '/search' },
      { label: 'Popular Destinations', href: '/#trips' },
      { label: 'Operator Portal', href: '/login' },
    ],
  }

  return (
    <footer className="glass border-t border-[var(--border-subtle)] mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-400)] flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-xl text-[var(--fg)]">Blue Waters</p>
            </div>
            <p className="text-sm text-[var(--fg-muted)] mb-4 leading-relaxed">
              Safe, reliable, and affordable boat booking across Bayelsa waterways. 
              Experience the beauty of water travel.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-[var(--fg-muted)]">
                <MapPin className="w-4 h-4 mt-0.5 text-[var(--accent-500)]" />
                <span>Ministry of Blue Waters<br />Yenagoa, Bayelsa State</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--fg-muted)]">
                <Phone className="w-4 h-4 text-[var(--accent-500)]" />
                <span>+234 800 BLUE WATERS</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--fg-muted)]">
                <Mail className="w-4 h-4 text-[var(--accent-500)]" />
                <span>support@bluewaters.gov.ng</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-[var(--fg)] mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--fg-muted)] hover:text-[var(--accent-400)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-[var(--fg)] mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--fg-muted)] hover:text-[var(--accent-400)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-[var(--fg)] mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--fg-muted)] hover:text-[var(--accent-400)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--fg-muted)]">
            © {currentYear} Blue Waters. Ministry of Blue Waters, Bayelsa State. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-subtle p-2 rounded-full hover:glass-strong transition-all duration-200 group"
            >
              <Facebook className="w-5 h-5 text-[var(--fg-muted)] group-hover:text-[var(--accent-400)] transition-colors duration-200" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-subtle p-2 rounded-full hover:glass-strong transition-all duration-200 group"
            >
              <Twitter className="w-5 h-5 text-[var(--fg-muted)] group-hover:text-[var(--accent-400)] transition-colors duration-200" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-subtle p-2 rounded-full hover:glass-strong transition-all duration-200 group"
            >
              <Instagram className="w-5 h-5 text-[var(--fg-muted)] group-hover:text-[var(--accent-400)] transition-colors duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Public Layout
 * 
 * Main layout wrapper for public-facing pages (home, about, etc.)
 * Features:
 * - Role-aware navigation (shows dashboard link based on user role)
 * - Glassmorphic header with sticky positioning
 * - Professional footer with links and contact info
 * - Design system aligned with dark glassmorphism theme
 */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-900)] to-[var(--bg-950)] text-[var(--fg)]">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
