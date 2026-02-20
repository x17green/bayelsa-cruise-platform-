---
name: Route Caching Guidelines
applyTo: "src/app/api/**"
---

# Route & CRUD Caching — Copilot instructions (required)

When implementing or modifying server routes or CRUD handlers, follow these mandatory rules for caching and invalidation. These will be enforced in PR reviews and by automated checks when possible.

## High-level rule
Always prefer the project's standard read-through Redis + ETag short-circuit pattern for read-heavy endpoints. Do not implement custom ad-hoc caches without explicit approval.

## Mandatory checklist (implementer must follow)
- Use `buildRedisKey()` from `src/lib/redis.ts` for every cache key.
- Store response payload under `cacheKey` and its ETag under `cacheKey:etag`.
- Perform the ETag check (read `cacheKey:etag`) before any DB operation for conditional GETs. If incoming `If-None-Match` matches → return 304 **without** touching Prisma.
- Add `X-Cache: HIT|MISS` response header to communicate cache result.
- Use TTL constants from `src/lib/redis.ts` (`REDIS_TTL.*`) — do not hardcode TTLs.
- Invalidate (delete) all related cache keys in write paths (POST/PUT/PATCH/DELETE/locks/releases). Prefer targeted invalidation over broad flushes.
- Add or update integration tests mirroring `scripts/test-etag-shortcircuit.ts` and `scripts/test-etag-no-db.ts` to assert ETag behavior and zero-DB on cache-hit.
- Never cache PII in shared cache keys. If caching user-scoped data, include the user id in the key.

## Implementation pattern (required)
1. compute cacheKey with `buildRedisKey('api', '<route>', params)`
2. if `If-None-Match` header present -> check `await redis.get(`${cacheKey}:etag`)`
   - if equal -> return 304 with `X-Cache: HIT` (no DB)
3. try `await redis.get(cacheKey)`
   - if found -> return 200 with cached payload, `X-Cache: HIT`, and `ETag`
4. otherwise -> fetch from DB, `redis.set(cacheKey, payload, { ex: TTL })`, `redis.set(`${cacheKey}:etag`, etag, { ex: TTL })`, return 200 with `X-Cache: MISS`

## CRUD & invalidation rules (examples)
- Booking created → invalidate availability snapshot keys and trip-level cache for affected trips.
- Trip updated (route/ports) → invalidate trip detail key and any list pages where the trip is included.
- Schedule price or capacity change → invalidate schedules cache + trip-level cache.

## Testing requirements (PR must include)
- Unit tests for helper logic (if added).
- Integration tests that validate:
  - ETag short-circuit returns 304 and sets `X-Cache: HIT`.
  - Conditional GET on cached resource produces *zero* Prisma queries (use `PRISMA_CAPTURE_QUERIES_FOR_TEST=true`).
  - Write operations invalidate keys (assert subsequent GET is MISS or returns updated payload).

## Telemetry & observability (recommended)
- Emit `cache.hit`, `cache.miss`, `cache.invalidate` events (route + key + TTL). Add a unit test that ensures the event is emitted (or the metric call is invoked).
- Record `redis_latency_ms` and `payload_size_bytes` for high-volume endpoints.

## Security & performance guardrails
- Short TTLs for price/availability (default: 15s for availability; 300s for trip metadata).
- Rate-limit endpoints separately from cache TTLs; do not rely on caching alone to prevent abuse.

## PR review rubric (what reviewers must check)
- Is the ETag check implemented pre-DB? (critical)
- Are keys constructed via `buildRedisKey()`? (yes)
- Are TTLs from `REDIS_TTL` used? (yes)
- Are invalidations present for writes? (yes)
- Are tests present for ETag + NO-DB behavior? (yes)

---

Follow these rules strictly — they are part of the codebase contract for all API routes.
