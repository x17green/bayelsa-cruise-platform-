'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Lock, Mail, Waves } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { login } from '@/src/app/auth/actions'
import PublicLayout from '@/src/components/layouts/public-layout'
import { Button } from '@/src/components/ui/button'

/**
 * Login Page
 * 
 * Professional authentication page with glassmorphic design
 * Following design system: dark-first, muted nautical, design tokens
 */
export default function LogIn() {
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-400)] mb-6 ring-4 ring-[var(--accent-900)] ring-offset-4 ring-offset-[var(--bg-900)]">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--fg)] mb-3">
              Welcome Back
            </h1>
            <p className="text-lg text-[var(--fg-muted)]">
              Sign in to your Blue Waters account
            </p>
          </div>

          {/* Form Card */}
          <div className="glass border border-[var(--border-default)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-medium)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-subtle border border-[var(--error-600)] rounded-[var(--radius-md)] p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-[var(--error-500)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--error-300)] leading-relaxed">{error}</p>
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[var(--fg)] mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="w-5 h-5 text-[var(--accent-500)]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 glass-subtle border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--glass-01)] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[var(--fg)] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-5 h-5 text-[var(--accent-500)]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-3 glass-subtle border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--glass-01)] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--border-default)] bg-[var(--glass-01)] text-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--bg-900)] transition-all duration-200"
                  />
                  <span className="text-sm text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-200">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[var(--accent-400)] hover:text-[var(--accent-300)] font-semibold transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[var(--accent-600)] hover:bg-[var(--accent-500)] text-white font-semibold py-3 rounded-[var(--radius-md)] shadow-lg shadow-[var(--accent-900)]/30 border border-[var(--accent-700)] transition-all duration-200 hover:shadow-xl hover:shadow-[var(--accent-900)]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-center text-sm text-[var(--fg-muted)]">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-[var(--accent-400)] hover:text-[var(--accent-300)] font-semibold transition-colors duration-200"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 glass-subtle border border-[var(--accent-900)] rounded-[var(--radius-md)] p-4">
              <p className="text-xs font-semibold text-[var(--accent-400)] mb-2 uppercase tracking-wide">
                Demo Credentials
              </p>
              <div className="space-y-1">
                <p className="text-xs text-[var(--fg-muted)]">
                  Email:{' '}
                  <span className="font-mono text-[var(--accent-300)] bg-[var(--glass-01)] px-2 py-0.5 rounded">
                    demo@bluewaters.com
                  </span>
                </p>
                <p className="text-xs text-[var(--fg-muted)]">
                  Password:{' '}
                  <span className="font-mono text-[var(--accent-300)] bg-[var(--glass-01)] px-2 py-0.5 rounded">
                    Demo@123456
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  )
}
