You are to build a full **Boat Booking** product from the attached documentation. Before coding, apply a System-2 meta-cognitive approach:

1. **Read & summarize** the attached docs — produce a one-page summary capturing goals, actors, constraints, missing info, and non-functional requirements.
    
2. **List assumptions** the system will make (e.g., timezones, currencies, capacity rules).
    
3. **Produce an architecture proposal** (diagram + short justification) that covers frontend, backend, database, auth, file storage, CI/CD, and deployment.
    
4. **Plan iteration**: break into milestones (MVP, Payments & Admin, PWA+Offline, Tests & CI).
    
5. **Implement** iteratively, run tests, and update docs.
    

## Functional requirements (high level)

- Multi-user bookings: Customers, Admins.
    
- Boat listings: geo location, calendar availability, pricing rules, images.
    
- Booking engine: prevents double-booking, supports time slots / day-based bookings.
    
- Authentication: email/password + social (if Supabase enabled).
    
- Admin features: create/update/delete boat, manage availability & pricing, view bookings.
    
- Search & filter: location radius, date availability, guest count, price range, boat type.
    
- Reviews & ratings (optional initial MVP can seed).
    
- Notifications: booking confirmation via UI. (Email optional: document if implemented.)
    

## Non-functional requirements

- Responsive and accessible (WCAG basics).
    
- PWA installable, offline-first UX for critical pages (home, boat list, my bookings read-only).
    
- Secure: avoid exposing Supabase keys client-side; use environment variables and serverless endpoints for sensitive actions if needed.
    
- Fallback mode: when no Supabase config, app uses encrypted localStorage/IndexedDB to store user, boats, and bookings for development/demo. Provide clear UX indication when in fallback mode.
    
- Configurable: use `.env` variables for Supabase URL/KEY toggles.
    

## Recommended architecture (example)

- Frontend: React + TypeScript (Vite). Use React Router or file-based routing if using Next or Remix.
    
- UI: HeroUI v3 (component library & theme tokens).
    
- Backend: Supabase (primary). Use Supabase Functions / Edge Functions or serverless endpoints for payment webhooks and server-side business logic where required.
    
- Offline: Service worker + Cache API for static assets and an IndexedDB wrapper for data in fallback mode.
    
- Authentication: Supabase Auth. If fallback mode, implement local auth with hashed passwords stored locally (only for demo).
    
- Payment: mock/placeholder interface (document how to integrate Stripe).
    
- CI/CD: GitHub Actions with tests, build, and deploy.
    

## Data model (simplified)

Provide `/prisma/schema.prisma` or SQL DDL for Supabase:

- `users` (id, email, name, role, created_at)
    
- `boats` (id, owner_id, title, description, location{lat,lon,address}, capacity, price_per_hour, price_per_day, images[], amenities[], created_at)
    
- `boat_availability` (boat_id, date, start_time, end_time, is_blocked)
    
- `bookings` (id, boat_id, user_id, start_datetime, end_datetime, status [pending/confirmed/cancelled], total_price, created_at)
    
- `reviews` (id, boat_id, user_id, rating, comment, created_at)
    

(Include indices on `boat_id`, `start_datetime` for performance.)

## Supabase integration & local fallback

- Provide a `supabaseClient.ts` that:
    
    - Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
        
    - If both present, init `createClient(...)` and export `isSupabaseEnabled = true`.
        
    - If not present, export `isSupabaseEnabled = false` and initialize a `LocalStore` abstraction implementing the same interface methods used in the app (e.g., `getBoats()`, `createBooking()`, `authSignIn()`).
        
- `LocalStore` must persist to IndexedDB or localStorage and be encrypted using a passphrase from `.env` (or simple obfuscation with clear warning this is for demo only).
    
- Feature flags and toggles: show a banner in the UI when running in fallback mode, with a link to docs on how to enable Supabase.
    

## UI & UX

- Use HeroUI v3 components and theme tokens. Build a global theme file for colors, spacing, typography.
    
- Responsive layout: grid/list views for boat listings; mobile-first.
    
- Key pages:
    
    - Home / Browse
        
    - Search results / Filters (toolbar)
        
    - Boat detail (gallery, specs, availability calendar)
        
    - Booking flow (checkout steps)
        
    - User auth (sign up, sign in, forgot password)
        
    - Dashboard (my bookings)
        
    - Admin (boats list, edit/create boat, bookings management)
        
    - Offline and Fallback pages (clear messaging)
        

## PWA requirements

- `manifest.json` with icons and metadata.
    
- Service worker: precache shell + runtime caching for API requests; fallback page for offline.
    
- Make sure `display`, `start_url`, and scope` are set correctly for installability.
    

## Testing & CI

- Unit tests: Jest + React Testing Library for components.
    
- Integration tests: Playwright or Cypress for the booking flow (basic).
    
- Linting: ESLint + Prettier.
    
- GitHub Actions: lint → test → build → (optional) deploy.
    

## Deployment & docs

- Provide deployment instructions for:
    
    - Static hosting (Netlify / Vercel / Cloudflare Pages).
        
    - Supabase setup steps (migrations, env vars).
        
- Document how to run the app in fallback mode.
    
- Provide `docs/architecture.md`, `docs/api.md` with endpoint examples, and `docs/deployment.md`.
    
- Provide `docs/acceptance-tests.md` describing manual test checklist.
    

## Acceptance tests (explicit)

1. Clone repo, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` empty → `npm run dev`: app runs and uses fallback mode; create a demo booking; booking appears in local dashboard.
    
2. Set valid Supabase env vars → `npm run dev`: app connects to Supabase; login via Supabase; create booking; booking saved to Supabase; admin sees booking.
    
3. Booking conflict: attempt to book overlapping times → application prevents double-booking and shows an explanatory message.
    
4. PWA: open in Chrome mobile emulation → shows install prompt; when offline, previously-viewed boat list and details still viewable.
    
5. Responsiveness: UI is usable at 320px width and 1440px width.
    
6. CI passes for build and tests.

---

## Route caching & API guideline (see also `.github/instructions/07-route-caching.instructions.md`)
- All route-level cache decisions must follow the `07-route-caching.instructions.md` checklist and ETag short-circuit pattern.
- Before adding caches to a route, add a unit/integration test that asserts `X-Cache` behavior and NO-DB on conditional GET.
- Any deviation from the pattern requires explicit approval in PR description.