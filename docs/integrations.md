# 🔐 Integrations

## Supabase Auth (Authentication)

Supabase provides managed authentication with zero backend endpoints needed.

### 🎯 Features
- **Email/Password authentication** (email verification)
- **Social login** (Google, Facebook, Twitter, GitHub)
- **Magic links** (passwordless email login)
- **Phone/SMS authentication** (via Twilio)
- **JWT token generation** (automatic refresh)
- **Session management** (client-side SDK)
- **Password reset** (email-based)

### 📦 Frontend Integration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Usage Examples

// 1. Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  options: {
    data: { full_name: 'John Doe', phone: '+2348012345678' }
  }
})

// 2. Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
})

// 3. Sign Out
await supabase.auth.signOut()

// 4. Get Current User
const { data: { user } } = await supabase.auth.getUser()

// 5. Password Reset
await supabase.auth.resetPasswordForEmail('user@example.com')

// 6. OAuth (Social Login)
await supabase.auth.signInWithOAuth({ provider: 'google' })
```

### 🔒 Backend JWT Verification

Next.js API routes verify Supabase JWT tokens for protected endpoints:

```typescript
// src/middleware/auth.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
)

export async function verifyAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) return null
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  
  return error ? null : user
}

// Usage in API route
export async function POST(req: NextRequest) {
  const user = await verifyAuth(req)
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Process authenticated request
  return Response.json({ message: 'Success', userId: user.id })
}
```

### 📡 Database Sync

Supabase `auth.users` table syncs to `public.users` via database trigger:

```sql
-- Trigger runs on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, created_at)
  VALUES (new.id, new.email, new.phone, new.created_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**⚠️ Important**: Never modify `auth.users` directly. Supabase manages this table.

---

## MetaTickets API

MetaTickets provides:
- Checkout session creation
- Multi-payment gateway handling
- Ticket minting (QR/NFT)
- Webhook events (payment success/failure)

### Example Flow

1. `POST /bookings` → create pending booking.  
2. `POST /payments/session` → request MetaTickets checkout.  
3. User completes payment → MetaTickets sends webhook.  
4. Webhook processed → mark booking as `paid` and confirm seats.

### Webhook Event Example

```json
{
  "id": "evt_123",
  "type": "payment.succeeded",
  "data": {
    "booking_metadata": { "booking_id": "uuid" },
    "amount_kobo": 250000,
    "currency": "NGN",
    "status": "succeeded"
  }
}
```

### Local PSP Integration

Fallback providers (Paystack / Flutterwave) maintain local payment resilience.

## API Authentication

**JWT tokens are issued by Supabase** (not custom backend).

### Client-Side (Frontend)
```typescript
// Automatic token management by Supabase SDK
const { data: { session } } = await supabase.auth.getSession()
const accessToken = session?.access_token // Use this for API calls

// Include in API requests
fetch('/api/bookings', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ trip_schedule_id: 'uuid', ... })
})
```

### Server-Side (API Routes)
```typescript
// Verify JWT token from request header
import { verifyAuth } from '@/middleware/auth'

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req) // Supabase JWT verification
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // User is authenticated, proceed with business logic
}
```

### Webhook Signature Verification

Validate incoming webhooks with **HMAC-SHA256** signatures to prevent fraud:

```typescript
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

// Usage in webhook endpoint
export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('x-metatickets-signature')!
  
  if (!verifyWebhookSignature(payload, signature, process.env.METATICKETS_WEBHOOK_SECRET!)) {
    return Response.json({ error: 'Invalid signature' }, { status: 403 })
  }
  
  // Process webhook
}
```

---