# Cache system — architecture & developer guide

This document describes the full-stack caching system used across the Blue Waters app: server-side read-through Redis cache with ETag short‑circuit, client-side SWR cache-first UX, short-lived availability snapshots for seat/availability, and cache invalidation rules for CRUD/write operations.

## Goals
- Reduce unnecessary database reads (especially on conditional GETs).
- Return 304 responses without touching Prisma when possible (pre‑DB ETag short‑circuit).
- Provide a fast, cache-first UX on Trips pages using SWR.
- Keep cached data correct by clear invalidation rules on writes/locks/releases.
- Provide observability and testability (Prisma query capture, test endpoints).

---

## High-level architecture
- Redis (Upstash) = single-source cache store for API payloads, etags, availability snapshots and locks.
- Keys use `buildRedisKey(...)` helper in `src/lib/redis.ts`.
- Each cached payload has two Redis entries:
  - `<cacheKey>` → serialized payload (JSON)
  - `<cacheKey>:etag` → strong ETag string for short-circuit checks
- API handlers check the etag in Redis *before* hitting Prisma. If `If-None-Match` matches stored etag → return 304 immediately with X-Cache: HIT.
- Writes (create/update/delete/locks/releases) perform best‑effort key deletion / snapshot invalidation.
- Client pages use `swr` (cache-first, background revalidate) to speed UI refresh without stalling UX.

---

## TTLs (current defaults)
- API cache (trips, trip detail): 300s
- Schedules / availability snapshots: 15s
- Seat locks: 600s
- Trip capacity snapshot: 300s

These are declared in `src/lib/redis.ts` as `REDIS_TTL.*`. Tune by traffic and telemetry.

---

## Files that implement / reference the cache today
- `src/app/api/trips/route.ts` — trips list, read-through cache + etag short‑circuit
- `src/app/api/trips/[id]/route.ts` — trip detail cache + etag
- `src/app/api/trips/[id]/schedules/route.ts` — schedules + availability snapshot cache
- `src/lib/seat-lock.ts` — availability snapshot read/write + invalidation on lock/release
- `src/lib/redis.ts` — Redis client, TTL constants, `buildRedisKey`
- `src/app/(public)/trips/page.tsx`, `src/app/(public)/trips/[id]/page.tsx` — SWR cache-first usage
- `src/lib/prisma.client.ts` — test-only Prisma query capture (PRISMA_CAPTURE_QUERIES_FOR_TEST)
- `scripts/test-etag-shortcircuit.ts`, `scripts/test-etag-no-db.ts` — integration tests

---

## Key design patterns / rules (must follow when adding caching to new routes)
1. Use `buildRedisKey()` to compose Redis keys — do not hardcode keys.
2. Store both payload and `<key>:etag`.
3. ETag check MUST run before any DB access for GET/conditional GETs:
   - If etag exists and `If-None-Match` matches → respond 304 + `X-Cache: HIT` (no Prisma calls).
   - If missing or mismatch → continue to read DB and repopulate Redis with payload + etag.
4. Set `Cache-Control` and `ETag` headers on cached responses.
5. Writes MUST invalidate all related cache keys (best-effort delete).
6. Avoid caching PII or user-scoped sensitive data in shared keys; use per-user keyed caches if necessary.
7. For list endpoints with query params, include normalized query params in the cache key (use the `buildRedisKey` helper semantics).
8. TTL choice depends on data criticality — default to short TTL for availability/pricing, longer TTL for static metadata.

---

## Cache keys & naming conventions
- Use the pattern produced by `buildRedisKey('api', routeName, params)`.
- Example keys:
  - `api:trips:list:...`
  - `api:trips:{tripId}:schedules:{startDate}:{endDate}`
  - `api:trips:{tripId}:payload`
- Always store the etag under the appended `:etag` suffix.

---

## Invalidations & CRUD guidance
- POST / PUT / PATCH / DELETE affecting an entity should:
  1. Perform DB write operation
  2. Remove (or update) affected Redis keys (best-effort)
  3. Optionally regenerate the updated payload and re-seed cache (if low latency is required)
- For seat-lock/booking flows:
  - Invalidate availability snapshot on lock, release, and confirmed booking.
  - Invalidate trip-level cache where capacity or availability is affected.

---

## Client (SWR) usage
- Use SWR for pages that can be served quickly from cache and revalidate in the background.
- Keep UI optimistic but show a loading skeleton for data that affects user decisions (e.g., availability count).

---

## Testing & instrumentation
- Prisma query capture is enabled for test runs with: `PRISMA_CAPTURE_QUERIES_FOR_TEST=true`.
  - Use the test endpoints under `/api/test/prisma` (guarded in production) to read/reset the counter.
- Add integration tests similar to `scripts/test-etag-shortcircuit.ts` and `scripts/test-etag-no-db.ts` for any newly cached endpoint.
- Suggested telemetry events to add when possible:
  - `cache.hit`, `cache.miss`, `cache.etag_shortcircuit`, `cache.invalidate` (include key and route)
  - Metrics: `redis_latency_ms`, `payload_size_bytes`, `cache_ttl_seconds`

---

## Security & correctness notes
- Do not cache personally-identifiable information in globally shared keys.
- When caching user-scoped data, include a user id in the key and keep TTL short.
- Be conservative with caching financial/price-critical data — prefer short TTLs and revalidation on checkout.

---

## Example: implementing a cached GET route (pseudo-step)
1. Compute `cacheKey = buildRedisKey('api', 'trips', { queryNormalized })`.
2. Check `etag = await redis.get(`${cacheKey}:etag`)`.
3. If `If-None-Match` header matches `etag` → return 304 with `X-Cache: HIT`.
4. Attempt `payload = await redis.get(cacheKey)`.
   - If payload exists → return 200 with `X-Cache: HIT` and ETag header.
5. Else → read DB, compute payload, store `redis.set(cacheKey, payload, { ex: TTL })` and `redis.set(`${cacheKey}:etag`, generatedEtag, { ex: TTL })`; return 200 with `X-Cache: MISS`.

---

## PR checklist for adding caching to a route
- [ ] Use `buildRedisKey` for keys
- [ ] ETag check occurs before any DB access for conditional GETs
- [ ] X-Cache header included (HIT / MISS)
- [ ] TTL set via `REDIS_TTL.*` constant
- [ ] Write paths invalidate keys they affect
- [ ] Add/instrument tests: unit + integration (ETag + NO-DB behavior)
- [ ] Add telemetry events for cache hit/miss (recommended)
- [ ] Update docs (`docs/cache.md`) and add a short usage note in the endpoint's code comment

---

## Where to look next in the codebase
- Key helpers: `src/lib/redis.ts`, `src/lib/seat-lock.ts`, `src/lib/prisma.client.ts`
- Example routes: `src/app/api/trips/*` (see `route.ts` files)
- Integration tests: `scripts/test-etag-*.ts`

---

If you'd like, I can also add automated telemetry scaffolding (example CloudWatch / Datadog events) or add a template test for a new cached route.
