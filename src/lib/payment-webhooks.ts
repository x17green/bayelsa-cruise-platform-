/**
 * Payment Webhook Utilities
 * 
 * Shared functions for processing payment webhooks from
 * MetaTickets and Paystack
 */

import { prisma } from '@/src/lib/prisma.client'
import { releaseSeats } from '@/src/lib/seat-lock'
import crypto from 'crypto'

export interface WebhookPayload {
  event: string
  data: any
  provider: 'metatickets' | 'paystack'
  signature?: string
  timestamp?: string
}

/**
 * Verify webhook signature (HMAC-SHA256)
 * 
 * @param payload - Raw request body
 * @param signature - Signature from header
 * @param secret - Webhook secret
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Process successful payment
 * Updates booking status and generates QR code
 * 
 * @param bookingReference - Booking reference number
 * @param paymentData - Payment provider data
 * @returns Updated booking
 */
export async function processPaymentSuccess(
  bookingReference: string,
  paymentData: {
    provider: 'metatickets' | 'paystack'
    transactionId: string
    amountKobo: number
    paidAt: Date
    paymentMethod?: string
    metadata?: any
  }
) {
  return await prisma.$transaction(async (tx) => {
    // Find booking
    const booking = await tx.booking.findUnique({
      where: { bookingReference },
      include: {
        tripSchedule: true,
      },
    })

    if (!booking) {
      throw new Error(`Booking not found: ${bookingReference}`)
    }

    // Check if already processed (idempotency)
    if (booking.paymentStatus === 'succeeded') {
      console.log(`Payment already processed for booking: ${bookingReference}`)
      return booking
    }

    // Verify amount matches
    if (Number(booking.totalAmountKobo) !== paymentData.amountKobo) {
      throw new Error(
        `Amount mismatch: expected ${booking.totalAmountKobo}, got ${paymentData.amountKobo}`
      )
    }

    // Generate QR code data
    const qrCodeData = JSON.stringify({
      bookingId: booking.id,
      reference: booking.bookingReference,
      scheduleId: booking.tripScheduleId,
      passengers: booking.numberOfPassengers,
    })

    // Update booking
    const updatedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: 'confirmed',
        paymentStatus: 'succeeded',
        qrCode: qrCodeData,
        confirmedAt: new Date(),
      },
    })

    // Create payment record
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        provider: paymentData.provider,
        providerPaymentId: paymentData.transactionId,
        amountKobo: BigInt(paymentData.amountKobo),
        status: 'succeeded',
      },
    })

    // Update trip schedule booked seats
    await tx.tripSchedule.update({
      where: { id: booking.tripScheduleId },
      data: {
        bookedSeats: {
          increment: booking.numberOfPassengers || 1,
        },
      },
    })

    // Create audit log
    await tx.auditLog.create({
      data: {
        entityType: 'booking',
        entityId: booking.id,
        action: 'payment_confirmed',
        userId: booking.userId,
        changes: {
          status: 'confirmed',
          paymentStatus: 'paid',
          provider: paymentData.provider,
          transactionId: paymentData.transactionId,
        },
      },
    })

    // Release seat locks (they're no longer needed)
    await releaseSeats(booking.tripScheduleId, booking.userId || 'system')

    return updatedBooking
  })
}

/**
 * Process failed payment
 * Releases seat locks and updates booking status
 * 
 * @param bookingReference - Booking reference number
 * @param reason - Failure reason
 */
export async function processPaymentFailure(
  bookingReference: string,
  reason: string
) {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { bookingReference },
    })

    if (!booking) {
      throw new Error(`Booking not found: ${bookingReference}`)
    }

    // Update booking
    await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: 'cancelled',
        paymentStatus: 'failed',
        failureReason: reason,
      },
    })

    // Create audit log
    await tx.auditLog.create({
      data: {
        entityType: 'booking',
        entityId: booking.id,
        action: 'payment_failed',
        userId: booking.userId,
        changes: {
          status: 'cancelled',
          paymentStatus: 'failed',
          reason,
        },
      },
    })

    // Release seat locks
    await releaseSeats(booking.tripScheduleId, booking.userId || 'system')

    return booking
  })
}

/**
 * Store raw webhook event for audit trail
 * 
 * @param webhookData - Webhook payload
 */
export async function storeWebhookEvent(webhookData: WebhookPayload) {
  return await prisma.webhookEvent.create({
    data: {
      provider: webhookData.provider,
      eventType: webhookData.event,
      providerEventId: `${webhookData.provider}-${Date.now()}`,
      payload: webhookData.data,
      signature: webhookData.signature,
      processed: false,
      receivedAt: new Date(),
    },
  })
}

/**
 * Mark webhook event as processed
 * 
 * @param eventId - Webhook event ID
 * @param success - Whether processing was successful
 * @param error - Error message if failed
 */
export async function markWebhookProcessed(
  eventId: string,
  success: boolean,
  error?: string
) {
  return await prisma.webhookEvent.update({
    where: { id: eventId },
    data: {
      processed: true,
      processedAt: new Date(),
      processingError: error,
    },
  })
}
