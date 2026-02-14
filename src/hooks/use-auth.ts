/**
 * useAuth Hook
 * 
 * Re-export useAuth from auth-context for backward compatibility.
 * All components now use the centralized AuthContext instead of
 * creating individual Supabase subscriptions.
 * 
 * Features:
 * - Single auth state subscription for entire app
 * - Role-aware user data from database
 * - Utility methods for role checking
 * 
 * @example
 * const { user, appUser, isOperator, signOut } = useAuth()
 */
export { useAuth, type UserRole, type AppUser } from '@/src/contexts/auth-context'
