# Database Migration Guide

## Overview

This project uses **Prisma** as the primary database migration tool, integrated with **Supabase PostgreSQL**. The schema supports advanced features like seat selection, price tiers, and recurring trip schedules.

## Architecture

- **Authentication**: Supabase Auth (in `auth` schema)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma (manages `public` schema)
- **Migration Tool**: Prisma Migrate

## Setup Instructions

### 1. Get Supabase Database Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → Database**
4. Copy the **Connection string** (URI format)
5. Note: Use **Connection pooling** URL for `DATABASE_URL` and **Direct connection** for `DIRECT_URL`

### 2. Configure Environment Variables

Create `.env.local` file in the project root:

```bash
# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection (Pooled - for app queries)
DATABASE_URL="postgresql://postgres.your-project-ref:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Database Connection (Direct - for migrations)
DIRECT_URL="postgresql://postgres.your-project-ref:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**Important Notes:**
- `DATABASE_URL` uses port **6543** (pooled connection)
- `DIRECT_URL` uses port **5432** (direct connection)
- Replace `[password]`, `[region]`, and `your-project-ref` with your actual values

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

This creates TypeScript types in `prisma/generated/prisma/`

### 5. Run Initial Migration

```bash
npx prisma migrate dev --name init_advanced_booking_system
```

This will:
- Create all tables in your Supabase database
- Generate migration files in `prisma/migrations/`
- Apply the migration to your database

### 6. Integrate Supabase Auth with Prisma Users

After migration, run this SQL in your Supabase SQL Editor:

```sql
-- Create function to sync Supabase auth users to Prisma users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    "fullName",
    role,
    "isActive",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'customer',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 7. Add Row Level Security (Optional but Recommended)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON "Booking"
  FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can create bookings" ON "Booking"
  FOR INSERT
  WITH CHECK (auth.uid() = "userId");

-- Policy: Public can view trips and schedules
CREATE POLICY "Anyone can view trips" ON "Trip"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view schedules" ON "TripSchedule"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view vessels" ON "Vessel"
  FOR SELECT  
  TO authenticated
  USING (true);
```

### 8. Verify Setup

Check that all tables were created:

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

## Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | User profiles (synced with Supabase auth) |
| `Operator` | Boat operators/companies |
| `Vessel` | Individual boats |
| `Trip` | Trip templates (reusable) |
| `TripSchedule` | Scheduled trip instances |
| `PriceTier` | Dynamic pricing (Economy, Premium, VIP) |
| `TripSeat` | Individual seat assignments |
| `Booking` | Customer bookings with hold/expiry |
| `BookingItem` | Individual tickets per seat |
| `Payment` | Payment transactions |
| `Checkin` | Passenger check-ins |
| `SeatLock` | Temporary seat reservations |

### Key Features

✅ **Seat-level management** - Assign specific seats to passengers  
✅ **Price tiers** - Multiple pricing levels per trip  
✅ **Booking holds** - Reserve seats temporarily before payment  
✅ **Recurring schedules** - Reusable trip templates  
✅ **Payment webhooks** - Integration with payment providers  
✅ **QR check-ins** - Digital boarding passes  

## Migration Workflow

### Making Schema Changes

1. **Edit** `prisma/schema.prisma`
2. **Create migration**:
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```
3. **Review** generated SQL in `prisma/migrations/`
4. **Test** locally with `npx prisma studio`
5. **Deploy** to production:
   ```bash
   npx prisma migrate deploy
   ```

### Resetting Database (Development Only)

```bash
npx prisma migrate reset
```

⚠️ **WARNING**: This drops all data!

### Viewing Current Schema

```bash
npx prisma db pull
```

Syncs Prisma schema with database state.

## Troubleshooting

### Error: `Can't reach database server`

- Check your `DATABASE_URL` and `DIRECT_URL`
- Verify Supabase project is active
- Ensure your IP is whitelisted (Supabase → Settings → Database → Allow all)

### Error: `Migration failed`

- Check if tables already exist from old SQL migration
- Run `DROP TABLE IF EXISTS ...` for conflicting tables
- Or use fresh database

### Error: `PrismaClient not found`

```bash
npx prisma generate
```

### Error: `Environment variable not found`

- Ensure `.env.local` exists in project root
- Restart your dev server after changing `.env.local`

## Production Deployment

1. Set environment variables in your hosting platform
2. Run migrations: `npx prisma migrate deploy`
3. Generate client: `npx prisma generate`
4. Build application: `npm run build`

## Next Steps

- [ ] Create seed data script (`prisma/seed.ts`)
- [ ] Set up API routes for CRUD operations
- [ ] Implement booking flow with seat selection
- [ ] Add payment integration
- [ ] Create operator dashboard

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/database/prisma)
