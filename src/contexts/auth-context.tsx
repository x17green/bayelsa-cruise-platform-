'use client'

import { type User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { createClient } from '@/src/lib/supabase/client'

/**
 * User role type from database
 */
export type UserRole = 'customer' | 'operator' | 'staff' | 'admin'

/**
 * Extended user data from database
 */
export interface AppUser {
  id: string
  email: string | null
  phone: string | null
  fullName: string | null
  role: UserRole
  profilePictureUrl: string | null
  isActive: boolean
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

/**
 * Auth context state and methods
 */
interface AuthContextType {
  // Auth state
  user: SupabaseUser | null
  appUser: AppUser | null
  loading: boolean
  isAuthenticated: boolean
  
  // Role checking utilities
  isCustomer: boolean
  isOperator: boolean
  isStaff: boolean
  isAdmin: boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
  
  // Auth methods
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 * Manages centralized authentication state with role awareness
 * Syncs Supabase auth with database user record
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  /**
   * Fetch user data from database
   * Uses maybeSingle() to handle missing records gracefully
   */
  const fetchAppUser = useCallback(async (userId: string): Promise<AppUser | null> => {
    try {
      // Use maybeSingle() to avoid errors if user doesn't exist yet
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('[AuthContext] Error fetching app user:', error)
        // If permission error, user might need to be created by trigger
        if (error.code === '42501') {
          console.warn('[AuthContext] Permission denied - user record might not exist yet')
        }
        return null
      }

      return data as AppUser
    } catch (err) {
      console.error('[AuthContext] Exception fetching app user:', err)
      return null
    }
  }, [supabase])

  /**
   * Initialize user session
   */
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true)

      // Get current session
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      setUser(authUser)

      // Fetch app user data if authenticated
      if (authUser) {
        const userData = await fetchAppUser(authUser.id)
        setAppUser(userData)
      } else {
        setAppUser(null)
      }
    } catch (err) {
      console.error('[AuthContext] Error initializing auth:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, fetchAppUser])

  /**
   * Set up auth listener
   */
  useEffect(() => {
    // Initialize on mount
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          const userData = await fetchAppUser(session.user.id)
          setAppUser(userData)
        } else {
          setAppUser(null)
        }

        setLoading(false)
        router.refresh()
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, initializeAuth, fetchAppUser])

  /**
   * Refresh user data from database
   */
  const refreshUser = useCallback(async () => {
    if (user) {
      const userData = await fetchAppUser(user.id)
      setAppUser(userData)
    }
  }, [user, fetchAppUser])

  /**
   * Sign out user
   */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAppUser(null)
    router.push('/login')
  }, [supabase, router])

  /**
   * Role checking utilities
   */
  const isCustomer = appUser?.role === 'customer'
  const isOperator = appUser?.role === 'operator'
  const isStaff = appUser?.role === 'staff'
  const isAdmin = appUser?.role === 'admin'

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!appUser) return false
    
    if (Array.isArray(role)) {
      return role.includes(appUser.role)
    }
    
    return appUser.role === role
  }, [appUser])

  const value: AuthContextType = {
    user,
    appUser,
    loading,
    isAuthenticated: !!user,
    isCustomer,
    isOperator,
    isStaff,
    isAdmin,
    hasRole,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 * Consume auth context with role awareness
 * 
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
