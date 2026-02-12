# 🧾 REST API Reference

## Architecture: Hybrid Approach

**Authentication**: Handled client-side via Supabase SDK (NO backend auth endpoints)  
**Business Logic**: Next.js API Routes (`/app/api/*`) with Prisma database access  
**Authorization**: JWT verification middleware in protected routes

---

## Authentication Flow

### Client-Side Authentication (No API Endpoints)

All authentication is handled directly by Supabase Auth SDK:

```typescript
// Frontend: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Usage in components
import { supabase } from '@/lib/supabase'

// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123'
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
})

// Logout
const { error } = await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Password reset
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com'
)
```

**No custom auth endpoints needed!** Supabase handles:
- ✅ Email/password registration
- ✅ Email verification
- ✅ Password reset
- ✅ Social login (Google, Facebook, etc.)
- ✅ JWT token generation and refresh
- ✅ Session management

---

## API Routes

All API routes are located in `/app/api/*` and use Next.js App Router conventions.

### Protected Route Pattern

```typescript
// Example: src/app/api/bookings/route.ts
import { NextRequest } from 'next/server'
import { verifyAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  // 1. Verify JWT token from Supabase
  const user = await verifyAuth(req)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 2. Business logic with Prisma
  const booking = await prisma.booking.create({
    data: { userId: user.id, ... }
  })
  
  return Response.json({ booking }, { status: 201 })
}
```

---

## Public Endpoints (No Auth Required)

### Trips

**List all cruise types**
```
GET /api/trips?location=yenagoa&date=2026-02-15
```

Query Parameters:
- `location` (optional): Filter by departure/destination
- `date` (optional): Filter by date
- `capacity_min` (optional): Minimum available seats

Response:
```json
{
  "trips": [
    {
      "id": "uuid",
      "title": "Sunset Bay Cruise",
      "description": "Romantic evening cruise...",
      "duration_minutes": 120,
      "vessel": {
        "name": "Blue Horizon",
        "capacity": 50,
        "amenities": ["WiFi", "Bar", "Restrooms"]
      },
      "upcoming_schedules": [
        {
          "id": "uuid",
          "start_time": "2026-02-15T18:00:00Z",
          "available_seats": 32,
          "price_tiers": [
            { "id": "uuid", "name": "General", "price_kobo": 1500000 },
            { "id": "uuid", "name": "VIP", "price_kobo": 2500000 }
          ]
        }
      ]
    }
  ],
  "meta": { "total": 12, "page": 1, "per_page": 10 }
}
```

**Get trip details with schedules**
```
GET /api/trips/[id]
```

Response includes full trip details, vessel info, and all upcoming schedules.

**Get vessel information**
```
GET /api/vessels/[id]
```

---

## Authenticated Endpoints (Require JWT)

### Bookings

**Create a new booking (hold seats)**
```
POST /api/bookings
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json

{
  "trip_schedule_id": "uuid",
  "price_tier_ids": ["tier-uuid-1", "tier-uuid-2"],
  "passengers": [
    { "name": "John Doe", "phone": "+2348012345678" },
    { "name": "Jane Doe", "phone": "+2348012345679" }
  ]
}
```

Response:
```json
{
  "booking": {
    "id": "uuid",
    "status": "held",
    "total_amount_kobo": 3000000,
    "hold_expires_at": "2026-02-12T10:10:00Z",
    "checkout_url": "https://checkout.metatickets.com/..."
  }
}
```

**Get user's bookings**
```
GET /api/bookings?status=paid
Authorization: Bearer <supabase_jwt_token>
```

**Get booking details**
```
GET /api/bookings/[id]
Authorization: Bearer <supabase_jwt_token>
```

**Cancel booking**
```
POST /api/bookings/[id]/cancel
Authorization: Bearer <supabase_jwt_token>
```

---

## Operator Endpoints (Require Operator Role)

### Trip Management

**Create a new trip**
```
POST /api/operator/trips
Authorization: Bearer <supabase_jwt_token>
X-User-Role: operator
Content-Type: application/json

{
  "title": "Sunset Bay Cruise",
  "description": "Romantic evening cruise through Bayelsa waterways",
  "duration_minutes": 120,
  "vessel_id": "uuid",
  "route": {
    "departure": "Yenagoa Marina",
    "destination": "Otuoke Bay",
    "waypoints": ["Nembe Creek", "Brass Island"]
  },
  "amenities": ["WiFi", "Bar", "Restrooms", "Live Music"]
}
```

**Update trip**
```
PUT /api/operator/trips/[id]
Authorization: Bearer <supabase_jwt_token>
X-User-Role: operator
```

**Create trip schedule**
```
POST /api/operator/trips/[id]/schedules
Authorization: Bearer <supabase_jwt_token>
X-User-Role: operator
Content-Type: application/json

{
  "start_time": "2026-02-15T18:00:00Z",
  "price_tiers": [
    { "name": "General", "price_kobo": 1500000, "max_tickets": 40 },
    { "name": "VIP", "price_kobo": 2500000, "max_tickets": 10 }
  ]
}
```

**Get booking manifest for trip schedule**
```
GET /api/operator/schedules/[id]/manifest
Authorization: Bearer <supabase_jwt_token>
X-User-Role: operator
```

Response: CSV/JSON export of all passengers with ticket status

---

## Webhook Endpoints

These endpoints receive payment and booking lifecycle events from external systems.

### MetaTickets Webhook

```
POST /api/webhooks/metatickets
X-Metatickets-Signature: <hmac_sha256_signature>
Content-Type: application/json

{
  "event": "checkout.completed",
  "booking_id": "uuid",
  "payment_intent": "pi_abc123",
  "amount_paid_kobo": 3000000,
  "payment_method": "card",
  "tickets": [
    { "id": "ticket-uuid-1", "qr_code": "MT-ABC123" },
    { "id": "ticket-uuid-2", "qr_code": "MT-ABC124" }
  ]
}
```

**Events Handled:**
- `checkout.completed` — Payment successful, issue tickets
- `checkout.failed` — Payment failed, release held seats
- `checkout.expired` — Checkout expired, release held seats
- `refund.processed` — Refund issued, void tickets

**Webhook Security:**
```typescript
// Verify HMAC signature before processing
import crypto from 'crypto'

function verifyWebhookSignature(
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
```

### Paystack Webhook (Fallback)

```
POST /api/webhooks/paystack
X-Paystack-Signature: <hmac_sha512_signature>
Content-Type: application/json

{
  "event": "charge.success",
  "data": {
    "reference": "booking-uuid",
    "amount": 30000,
    "currency": "NGN",
    "customer": { "email": "user@example.com" }
  }
}
```

---

## Check-In & Boarding

### Validate Ticket QR Code

```
POST /api/checkin
Authorization: Bearer <supabase_jwt_token>
X-User-Role: operator
Content-Type: application/json

{
  "ticket_id": "uuid",
  "qr_code": "MT-ABC123",
  "trip_schedule_id": "uuid"
}
```

Response:
```json
{
  "valid": true,
  "passenger": {
    "name": "John Doe",
    "phone": "+2348012345678",
    "price_tier": "VIP"
  },
  "already_checked_in": false,
  "checked_in_at": "2026-02-15T17:45:00Z"
}
```

**Validation Rules:**
- ✅ Ticket must exist and belong to the specified schedule
- ✅ QR code must match ticket ID
- ✅ Ticket status must be "paid" (not "held" or "refunded")
- ✅ Ticket must not already be checked in (prevent double-boarding)

### Export Passenger Manifest

```
GET /api/manifests/[tripScheduleId]?format=csv
Authorization: Bearer <supabase_jwt_token>
X-User-Role: operator
```

CSV format:
```csv
booking_id,passenger_name,phone,price_tier,ticket_status,checked_in
uuid,John Doe,+2348012345678,VIP,paid,true
uuid,Jane Doe,+2348012345679,General,paid,false
```

---

## Response Standard

All API responses follow this structure:

**Success Response (2xx)**
```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-11T18:00:00Z",
    "request_id": "req_abc123"
  }
}
```

**Error Response (4xx, 5xx)**
```json
{
  "status": "error",
  "error": {
    "code": "BOOKING_EXPIRED",
    "message": "Booking hold expired. Please create a new booking.",
    "details": {
      "booking_id": "uuid",
      "expired_at": "2026-02-11T18:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2026-02-11T18:00:00Z",
    "request_id": "req_abc123"
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` — Missing or invalid JWT token
- `FORBIDDEN` — User lacks required role (e.g., operator)
- `NOT_FOUND` — Resource does not exist
- `BOOKING_EXPIRED` — Booking hold expired (10 minutes)
- `INSUFFICIENT_SEATS` — Requested seats not available
- `PAYMENT_FAILED` — Payment provider error
- `INVALID_WEBHOOK_SIGNATURE` — Webhook signature verification failed

---

## Rate Limiting

- **Public endpoints**: 100 requests/minute per IP
- **Authenticated endpoints**: 300 requests/minute per user
- **Webhook endpoints**: 1000 requests/minute (high throughput for external systems)

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1707667200
```

---

## JWT Verification Middleware

**Example Implementation:**
```typescript
// src/middleware/auth.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // For server-side verification
)

export async function verifyAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  
  if (error || !user) {
    return null
  }
  
  return user // Return Supabase user object
}

export async function requireRole(req: NextRequest, role: string) {
  const user = await verifyAuth(req)
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check user role from public.users table
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== role) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  return { user, profile }
}
```

---

## Testing

**Local Development:**
```bash
# Start Supabase local instance
npx supabase start

# Run Next.js dev server
npm run dev

# Test public endpoint
curl http://localhost:3000/api/trips

# Test authenticated endpoint
curl -H "Authorization: Bearer <supabase_jwt>" \
     http://localhost:3000/api/bookings
```

**Webhook Testing:**
Use tools like [webhook.site](https://webhook.site) or [ngrok](https://ngrok.com) to expose local endpoints for webhook testing:

```bash
# Expose local server
ngrok http 3000

# Configure MetaTickets webhook URL
https://abc123.ngrok.io/api/webhooks/metatickets
```
