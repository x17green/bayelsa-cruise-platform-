'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Lock, Mail, Phone, User, Waves } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { signup } from '@/src/app/auth/actions'
import PublicLayout from '@/src/components/layouts/public-layout'
import { Button } from '@/src/components/ui/button'

/**
 * Sign Up Page
 * 
 * Professional registration page with glassmorphic design
 * Following design system: dark-first, muted nautical, design tokens
 */
export default function SignUp() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!agreeToTerms) {
      setError('Please agree to terms and conditions to continue')
      return
    }

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.message) {
        setSuccess(result.message)
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
          className="w-full max-w-xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-400)] mb-6 ring-4 ring-[var(--accent-900)] ring-offset-4 ring-offset-[var(--bg-900)]">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--fg)] mb-3">
              Create Account
            </h1>
            <p className="text-lg text-[var(--fg-muted)]">
              Join us for amazing boat journeys across Bayelsa
            </p>
          </div>

          {/* Form Card */}
          <div className="glass border border-[var(--border-default)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-medium)]">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Success Alert */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-subtle border border-[var(--success-600)] rounded-[var(--radius-md)] p-4 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--success-500)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--success-300)] leading-relaxed">{success}</p>
                </motion.div>
              )}

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[var(--fg)] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="w-5 h-5 text-[var(--accent-500)]" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 glass-subtle border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--glass-01)] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[var(--fg)] mb-2">
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

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[var(--fg)] mb-2">
                    Phone Number <span className="text-[var(--fg-subtle)] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Phone className="w-5 h-5 text-[var(--accent-500)]" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      className="w-full pl-12 pr-4 py-3 glass-subtle border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--glass-01)] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {/* User Type */}
              <div>
                <label htmlFor="userType" className="block text-sm font-semibold text-[var(--fg)] mb-2">
                  I am a
                </label>
                <select
                  id="userType"
                  name="userType"
                  defaultValue="customer"
                  className="w-full px-4 py-3 glass-subtle border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--glass-01)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
                >
                  <option value="customer">Customer (Book Trips)</option>
                  <option value="operator">Boat Operator (List Trips)</option>
                </select>
              </div>

              {/* Password & Confirm Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[var(--fg)] mb-2">
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
                      placeholder="Create password"
                      className="w-full pl-12 pr-4 py-3 glass-subtle border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--glass-01)] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[var(--fg)] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock className="w-5 h-5 text-[var(--accent-500)]" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      className="w-full pl-12 pr-4 py-3 glass-subtle border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--glass-01)] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all duration-200"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[var(--border-default)] bg-[var(--glass-01)] text-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--bg-900)] transition-all duration-200 flex-shrink-0"
                  />
                  <span className="text-sm text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-200 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[var(--accent-400)] hover:text-[var(--accent-300)] font-semibold">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[var(--accent-400)] hover:text-[var(--accent-300)] font-semibold">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isPending || !agreeToTerms}
                className="w-full bg-[var(--accent-600)] hover:bg-[var(--accent-500)] text-white font-semibold py-3 rounded-[var(--radius-md)] shadow-lg shadow-[var(--accent-900)]/30 border border-[var(--accent-700)] transition-all duration-200 hover:shadow-xl hover:shadow-[var(--accent-900)]/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-center text-sm text-[var(--fg-muted)]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-[var(--accent-400)] hover:text-[var(--accent-300)] font-semibold transition-colors duration-200"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  )
}
