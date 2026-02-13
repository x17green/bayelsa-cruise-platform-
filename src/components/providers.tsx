'use client'

import { ReactNode } from 'react'

import { AuthProvider } from '@/src/contexts/auth-context'

/**
 * Providers Component
 * Wraps the application with all necessary context providers
 * 
 * Current providers:
 * - AuthProvider: Centralized authentication state with role awareness
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
