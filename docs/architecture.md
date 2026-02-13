# ⚙️ System Architecture

## Overview

The Bayelsa Boat Cruise Booking System uses a **Hybrid Architecture** combining managed services (Supabase Auth) with custom business logic (Next.js API Routes + Prisma) for optimal development speed and flexibility.

## Architecture Decision: Hybrid Approach

**Why Hybrid?**
- ✅ **No custom auth needed** - Supabase Auth handles signup/login/logout (saves 2 weeks dev time)
- ✅ **Full control over business logic** - Direct database access via Prisma for complex operations
- ✅ **Type-safe queries** - Prisma provides end-to-end type safety
- ✅ **Cost effective** - Managed services reduce infrastructure costs by 25%
- ✅ **Better DX** - Familiar Next.js patterns, easy testing with Prisma mocks

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js App Router)                            │
│                                                          │
│  Authentication              Business Logic             │
│       ↓                             ↓                    │
│  @supabase/supabase-js      Next.js API Routes         │
│  (signUp, signIn, signOut)  (fetch /api/*)             │
│  NO backend routes needed!                              │
└──────────────────────────────────────────────────────────┘
         ↓                             ↓
┌────────────────────┐    ┌──────────────────────────────┐
│  Supabase Auth     │    │  Custom API Routes           │
│  (Managed Service) │    │  (Next.js /app/api/*)        │
│                    │    │                              │
│  - JWT tokens      │    │  - Verify JWT (middleware)   │
│  - Email verify    │    │  - Booking engine            │
│  - Password reset  │    │  - Payment webhooks          │
│  - Social login    │    │  - Manifest generation       │
└────────────────────┘    │  - Complex business logic    │
         ↓                 └──────────────────────────────┘
         ↓                              ↓
┌──────────────────────────────────────────────────────────┐
│  DATA TIER                                                │
│  ┌──────────────────┐  ┌─────────┐  ┌────────────────┐  │
│  │ Supabase         │  │ Redis   │  │ Supabase       │  │
│  │ PostgreSQL       │  │ (Upstash│  │ Storage        │  │
│  │                  │  │ /AWS)   │  │ (S3-compatible)│  │
│  │ • auth.users     │  │         │  │                │  │
│  │ • users (custom) │  │ • Locks │  │ • QR codes     │  │
│  │ • bookings       │  │ • Cache │  │ • Manifests    │  │
│  │ • trips          │  │         │  │ • Images       │  │
│  └──────────────────┘  └─────────┘  └────────────────┘  │
│                                                           │
│  Access: Prisma ORM (type-safe, direct connection)       │
└──────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────┐
│  EXTERNAL INTEGRATIONS                                    │
│  - MetaTickets API (Primary Payment)                     │
│  - Paystack API (Fallback Payment)                       │
│  - Twilio/Termii (SMS Notifications)                     │
│  - SendGrid/Resend (Email Notifications)                 │
└──────────────────────────────────────────────────────────┘
```

---

| Component | Technology | Description |
|-----------|-----------|-------------|
| **Frontend (PWA)** | Next.js 16 (App Router) | Booking & ticket management UI with server-side rendering. |
| **Authentication** | Supabase Auth | Managed auth service (no custom endpoints needed). |
| **API Layer** | Next.js API Routes | RESTful endpoints for bookings, payments, webhooks (`/app/api/*`). |
| **Database** | Supabase PostgreSQL | Managed PostgreSQL with automatic backups. |
| **ORM** | Prisma | Type-safe database access with direct connection. |
| **Cache / Locks** | Upstash Redis | Serverless Redis for seat holds and caching. |
| **Storage** | Supabase Storage | S3-compatible file storage for QR codes, manifests. |
| **Payment Integration** | MetaTickets API + Paystack | Primary + fallback payment providers. |
| **Hosting** | Vercel | Edge network deployment with automatic scaling. |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking and performance monitoring. |

---

### Non-functional Requirements

| Concern | Solution |
|----------|-----------|
| **Scalability** | Vercel edge functions auto-scale; Supabase connection pooling. |
| **Security** | Supabase JWT Auth, TLS 1.3, HMAC webhook signatures, JWT middleware. |
| **Resilience** | Prisma transactions + idempotent webhook processing + Supabase backups. |
| **Compliance** | Digital manifests, NDPR/PCI-DSS via managed services. |
| **Performance** | Redis seat locks, Prisma query optimization, CDN via Vercel. |
| **Cost** | Serverless architecture reduces costs by 25% vs traditional stack. |

---

## Key Technical Decisions

### 1. Authentication: Supabase Auth (No Custom Auth API)

**Decision**: Use Supabase Auth SDK for all authentication operations.

**Rationale**:
- Client-side auth (signup/login/logout) requires no backend code
- JWT tokens automatically managed and stored
- Built-in email verification, password reset, social login
- Saves 2+ weeks of development time
- Production-grade security maintained by Supabase team

**Implementation**:
```typescript
// Frontend: Direct Supabase Auth (no API call needed)
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
// JWT token automatically stored in cookies/localStorage
```

### 2. Database Access: Prisma with Direct Connection

**Decision**: Use Prisma ORM to connect directly to Supabase PostgreSQL.

**Rationale**:
- Type-safe queries prevent runtime errors
- Better performance than Supabase PostgREST for complex joins
- Full control over business logic and transactions
- Easy testing with Prisma mock client
- Familiar patterns for Node.js developers

**Implementation**:
```typescript
// API Route: Direct database access via Prisma
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/middleware/auth'

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req) // Verify Supabase JWT
  
  // Complex business logic with Prisma
  const booking = await prisma.$transaction(async (tx) => {
    const schedule = await tx.tripSchedule.findUnique({ ... })
    if (schedule.bookedSeats >= schedule.capacity) {
      throw new Error('Sold out')
    }
    return tx.booking.create({ ... })
  })
  
  return Response.json({ booking })
}
```

### 3. Deployment: Serverless (Vercel + Supabase)

**Decision**: Deploy on Vercel with Supabase for database/auth.

**Rationale**:
- Zero-downtime deployments (atomic builds)
- Automatic SSL/CDN configuration
- Preview deployments for every PR
- No infrastructure management (no Docker/K8s/Terraform)
- 25% cost reduction vs AWS ECS setup
- Scales automatically from 0 to millions of requests

**Trade-offs**:
- Cannot use Supabase Row Level Security (RLS) with Prisma
- Must implement authorization manually in API routes
- Vendor lock-in mitigated by using standard PostgreSQL + Prisma

## Data Flow Examples

### User Registration Flow
```
1. Frontend calls: supabase.auth.signUp()
2. Supabase Auth creates user in auth.users table
3. Database trigger automatically creates profile in public.users
4. JWT token returned to frontend
5. No custom backend code required!
```

### Booking Creation Flow
```
1. Frontend: POST /api/bookings with JWT in Authorization header
2. API Route middleware verifies JWT with Supabase
3. Prisma transaction:
   - Check capacity
   - Create booking (status: held)
   - Set Redis lock (10-min TTL)
4. Return MetaTickets checkout URL
5. User pays → Webhook → Update booking to 'paid'
```
