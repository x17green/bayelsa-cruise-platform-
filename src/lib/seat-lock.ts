/**
 * Seat Locking System
 * 
 * Prevents double-booking by temporarily locking seats during checkout.
 * Uses Redis for distributed locking across serverless functions.
 */

import { redis, buildRedisKey, REDIS_KEYS, REDIS_TTL } from './redis'
import { prisma } from './prisma.client'

export interface SeatLock {
  scheduleId: string
  userId: string
  seats: number
  bookingId?: string
  expiresAt: Date
}

export interface LockResult {
  success: boolean
  lockId?: string
  message: string
}

/**
 * Attempt to lock seats for a user during checkout
 * 
 * @param scheduleId - Trip schedule ID
 * @param userId - User attempting to book
 * @param seats - Number of seats to lock
 * @returns Lock result with success status
 */
export async function lockSeats(
  scheduleId: string,
  userId: string,
  seats: number
): Promise<LockResult> {
  try {
    // 1. Check if user already has a lock for this schedule
    const existingLockKey = buildRedisKey(REDIS_KEYS.SEAT_LOCK, scheduleId, userId)
    const existingLock = await redis.get<SeatLock>(existingLockKey)

    if (existingLock) {
      return {
        success: true,
        lockId: existingLockKey,
        message: 'Lock already exists for this user',
      }
    }

    // 2. Check real-time capacity from database
    const schedule = await prisma.tripSchedule.findUnique({
      where: { id: scheduleId },
      select: {
        capacity: true,
        bookedSeats: true,
      },
    })

    if (!schedule) {
      return {
        success: false,
        message: 'Trip schedule not found',
      }
    }

    // 3. Get all active locks for this schedule
    const lockPattern = buildRedisKey(REDIS_KEYS.SEAT_LOCK, scheduleId, '*')
    const lockKeys = await redis.keys(lockPattern)
    
    let totalLockedSeats = 0
    for (const key of lockKeys) {
      const lock = await redis.get<SeatLock>(key)
      if (lock) {
        totalLockedSeats += lock.seats
      }
    }

    // 4. Calculate available seats
    const availableSeats = schedule.capacity - schedule.bookedSeats - totalLockedSeats

    if (availableSeats < seats) {
      return {
        success: false,
        message: `Insufficient capacity. Only ${availableSeats} seats available.`,
      }
    }

    // 5. Create lock
    const lock: SeatLock = {
      scheduleId,
      userId,
      seats,
      expiresAt: new Date(Date.now() + REDIS_TTL.SEAT_LOCK * 1000),
    }

    const lockKey = buildRedisKey(REDIS_KEYS.SEAT_LOCK, scheduleId, userId)
    await redis.setex(lockKey, REDIS_TTL.SEAT_LOCK, JSON.stringify(lock))

    return {
      success: true,
      lockId: lockKey,
      message: `Successfully locked ${seats} seats`,
    }
  } catch (error) {
    console.error('Error locking seats:', error)
    return {
      success: false,
      message: 'Failed to lock seats',
    }
  }
}

/**
 * Release seat locks for a user
 * 
 * @param scheduleId - Trip schedule ID
 * @param userId - User who owns the lock
 */
export async function releaseSeats(
  scheduleId: string,
  userId: string
): Promise<boolean> {
  try {
    const lockKey = buildRedisKey(REDIS_KEYS.SEAT_LOCK, scheduleId, userId)
    const result = await redis.del(lockKey)
    return result === 1
  } catch (error) {
    console.error('Error releasing seats:', error)
    return false
  }
}

/**
 * Extend seat lock expiration (e.g., if user is still in checkout)
 * 
 * @param scheduleId - Trip schedule ID
 * @param userId - User who owns the lock
 * @param additionalSeconds - Seconds to extend (default: 600 = 10 minutes)
 */
export async function extendSeatLock(
  scheduleId: string,
  userId: string,
  additionalSeconds: number = REDIS_TTL.SEAT_LOCK
): Promise<boolean> {
  try {
    const lockKey = buildRedisKey(REDIS_KEYS.SEAT_LOCK, scheduleId, userId)
    const lock = await redis.get<SeatLock>(lockKey)

    if (!lock) {
      return false
    }

    // Update expiration time
    lock.expiresAt = new Date(Date.now() + additionalSeconds * 1000)
    await redis.setex(lockKey, additionalSeconds, JSON.stringify(lock))

    return true
  } catch (error) {
    console.error('Error extending seat lock:', error)
    return false
  }
}

/**
 * Get available seats for a trip schedule (considering locks)
 * 
 * @param scheduleId - Trip schedule ID
 * @returns Number of available seats
 */
export async function getAvailableSeats(scheduleId: string): Promise<number> {
  try {
    // Get schedule capacity
    const schedule = await prisma.tripSchedule.findUnique({
      where: { id: scheduleId },
      select: {
        capacity: true,
        bookedSeats: true,
      },
    })

    if (!schedule) {
      return 0
    }

    // Try to get locked seats from Redis, but fall back gracefully if Redis is unavailable
    let totalLockedSeats = 0
    try {
      const lockPattern = buildRedisKey(REDIS_KEYS.SEAT_LOCK, scheduleId, '*')
      const lockKeys = await redis.keys(lockPattern)

      for (const key of lockKeys) {
        const lock = await redis.get<SeatLock>(key)
        if (lock) {
          totalLockedSeats += lock.seats
        }
      }
    } catch (redisError) {
      // Redis is not available, continue with just booked seats
      console.warn('Redis unavailable for seat lock check, using basic calculation:', redisError)
    }

    return Math.max(0, schedule.capacity - schedule.bookedSeats - totalLockedSeats)
  } catch (error) {
    console.error('Error getting available seats:', error)
    // Fallback: just return capacity minus booked seats if everything fails
    try {
      const schedule = await prisma.tripSchedule.findUnique({
        where: { id: scheduleId },
        select: { capacity: true, bookedSeats: true },
      })
      return schedule ? Math.max(0, schedule.capacity - schedule.bookedSeats) : 0
    } catch (fallbackError) {
      console.error('Fallback calculation also failed:', fallbackError)
      return 0
    }
  }
}

/**
 * Clean up expired locks (called by cron or background job)
 */
export async function cleanupExpiredLocks(): Promise<number> {
  try {
    const allLockKeys = await redis.keys(buildRedisKey(REDIS_KEYS.SEAT_LOCK, '*'))
    let deletedCount = 0

    for (const key of allLockKeys) {
      const lock = await redis.get<SeatLock>(key)
      if (lock && new Date(lock.expiresAt) < new Date()) {
        await redis.del(key)
        deletedCount++
      }
    }

    return deletedCount
  } catch (error) {
    console.error('Error cleaning up expired locks:', error)
    return 0
  }
}
