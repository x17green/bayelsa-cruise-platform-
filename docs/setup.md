# 🧰 Developer Setup

## Prerequisites
- Node.js >= 18  
- npm or pnpm  
- **Supabase account** (for auth + database) - [supabase.com](https://supabase.com)  
- **Vercel account** (for deployment, optional) - [vercel.com](https://vercel.com)  
- MetaTickets API Key  
- Paystack/Flutterwave sandbox keys  
- Git

**✅ No local PostgreSQL or Redis installation required!**  
Supabase provides managed PostgreSQL, Upstash provides serverless Redis.

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/bayelsa-boat-booking.git
cd bayelsa-boat-booking

# 2. Install dependencies
npm install

# 3. Create environment variables file
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (see below)

# 4. Generate Prisma Client
npx prisma generate

# 5. Run database migrations (if using Supabase cloud)
npx prisma migrate deploy

# 6. (Optional) Seed test data
npm run db:seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create `.env.local` file in project root:

```bash
# ============================================
# SUPABASE (Authentication + Database)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # For server-side operations

# Database Connection (via Supabase PgBouncer pooler)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres" # For migrations

# ============================================
# REDIS CACHE (Upstash Serverless)
# ============================================
UPSTASH_REDIS_REST_URL=https://abc123.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYQgASQgYWJjMTIz...

# ============================================
# PAYMENT INTEGRATIONS
# ============================================
# MetaTickets (Primary Payment Provider)
METATICKETS_API_KEY=mt_test_abc123  # Use mt_live_* for production
METATICKETS_WEBHOOK_SECRET=whsec_abc123

# Paystack (Fallback/Local Payments)
PAYSTACK_SECRET_KEY=sk_test_abc123  # Use sk_live_* for production
PAYSTACK_PUBLIC_KEY=pk_test_abc123

# ============================================
# NOTIFICATIONS
# ============================================
# Email (SendGrid or Resend)
SENDGRID_API_KEY=SG.abc123
RESEND_API_KEY=re_abc123

# SMS (Twilio or Termii for Nigeria)
TWILIO_ACCOUNT_SID=ACabc123
TWILIO_AUTH_TOKEN=abc123
TWILIO_PHONE_NUMBER=+1234567890
TERMII_API_KEY=TL_abc123
TERMII_SENDER_ID=Bayelsa

# ============================================
# MONITORING & ERROR TRACKING
# ============================================
SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456

# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 🔑 How to Get Supabase Credentials

1. **Create Project**: Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. **Navigate to Settings → API**
3. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!
4. **Navigate to Settings → Database → Connection string → URI**
5. Select **Connection pooling** mode
6. Copy connection string and add `?pgbouncer=true` → `DATABASE_URL`
7. Select **Direct connection** mode
8. Copy direct connection string → `DIRECT_URL` (used for migrations)

### 🔑 How to Get Upstash Redis Credentials

1. **Create Database**: Go to [upstash.com](https://upstash.com) and create a Redis database
2. Choose **Global** or nearest region (e.g., AWS eu-central-1)
3. Copy **REST URL** → `UPSTASH_REDIS_REST_URL`
4. Copy **REST TOKEN** → `UPSTASH_REDIS_REST_TOKEN`

---

## Database Setup

### Option 1: Supabase Cloud (Recommended for Production)

```bash
# 1. Create Supabase project at https://supabase.com

# 2. Install Supabase CLI (optional, for migrations)
npm install -g supabase

# 3. Login to Supabase
supabase login

# 4. Link your project
supabase link --project-ref your-project-ref

# 5. Push migrations using Supabase CLI
supabase db push

# OR use Prisma migrations (recommended)
npx prisma migrate deploy

# 6. Generate Prisma Client
npx prisma generate

# 7. (Optional) Seed test data
npm run db:seed
```

### Option 2: Local Development with Supabase CLI (Docker)

Run Supabase locally for offline development:

```bash
# 1. Install Docker Desktop
# https://www.docker.com/products/docker-desktop

# 2. Start local Supabase (pulls Docker containers)
supabase start

# Output will show local credentials:
# API URL: http://localhost:54321
# anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Database URL: postgresql://postgres:postgres@localhost:54322/postgres

# 3. Update .env.local with local credentials
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key_from_output>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_from_output>
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# 4. Run migrations
npx prisma migrate dev

# 5. Generate Prisma Client
npx prisma generate

# 6. Seed test data
npm run db:seed

# Stop local Supabase when done
supabase stop
```

### Pulling Existing Schema from Supabase

If the database already has tables:

```bash
# Pull schema from Supabase to Prisma
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

---

## Development Workflow

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Start production server locally
npm start
```

---

## Database Migrations

### Creating New Migrations

```bash
# 1. Update prisma/schema.prisma
# Add/modify models

# 2. Create migration
npx prisma migrate dev --name add_user_preferences

# 3. This automatically:
#    - Creates SQL migration file in prisma/migrations/
#    - Applies migration to development database
#    - Regenerates Prisma Client
```

### Applying Migrations

```bash
# Development (runs migrations + generates client)
npx prisma migrate dev

# Production (only runs pending migrations)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

### Resetting Database (⚠️ Development Only)

```bash
# Drop all data and rerun migrations
npx prisma migrate reset

# This will:
# 1. Drop database
# 2. Create database
# 3. Apply all migrations
# 4. Run seed script
```

---

## Testing Webhooks Locally

Webhooks require a public URL. Use **ngrok** or **localtunnel**:

### Option 1: ngrok

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the generated URL for webhooks
https://abc123.ngrok.io/api/webhooks/metatickets
```

### Option 2: localtunnel

```bash
# Install localtunnel
npm install -g localtunnel

# Expose local server
lt --port 3000 --subdomain bayelsa-boat

# Use URL for webhooks
https://bayelsa-boat.loca.lt/api/webhooks/metatickets
```

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

**Or use Vercel Dashboard**:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repository
3. Add environment variables from `.env.local`
4. Deploy

### Environment Variables on Vercel

Add all environment variables from `.env.local` to Vercel:
- **Dashboard**: Settings → Environment Variables
- **CLI**: `vercel env add <VAR_NAME>`

⚠️ **Never commit `.env.local` to version control!**

---

## Troubleshooting

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Can't reach database server"
- Check `DATABASE_URL` is correct
- Verify Supabase project is running
- Check firewall/network settings

### "Supabase CLI not working"
```bash
# Reinstall CLI
npm uninstall -g supabase
npm install -g supabase

# Check version
supabase --version
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```