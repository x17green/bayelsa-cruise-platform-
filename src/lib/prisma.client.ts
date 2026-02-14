/**
 * Prisma Client Instance
 * Singleton pattern for database connections
 * Integrates with Supabase PostgreSQL
 * 
 * Prisma v7 Pattern: Requires driver adapter
 * Single Source of Truth: All Prisma imports should come from this file
 */
import "dotenv/config"
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma.generated/client'

// Singleton pattern for Next.js (prevents multiple instances in dev mode)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize driver adapter (required in Prisma v7)
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })

// Instantiate PrismaClient with adapter and logging
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ✨ SINGLE SOURCE OF TRUTH: Re-export all Prisma types, enums, and utilities
export * from './prisma.generated/client'

// Optional: Explicit exports for better IDE discoverability
export type {
  // Models
  User, Operator, Vessel, Trip, TripSchedule,
  Booking, BookingItem, Payment, PriceTier, TripSeat, SeatLock,
  Manifest, Checkin, Review, EmailLog, PromoCode, WebhookEvent,
  
  // Prisma namespace for advanced types
  Prisma,
} from './prisma.generated/client'

export {
  // Enums
  BookingStatus, PaymentStatus, CheckinStatus, UserRole,
  EmailType, NotificationChannel,
} from './prisma.generated/client'

export default prisma
