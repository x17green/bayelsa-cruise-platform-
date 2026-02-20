import { NextRequest } from 'next/server'

// Test-only endpoints to inspect/reset Prisma query counter
// These handlers are no-ops in production (do not throw at module load)

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'disabled in production' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }

  const count = (globalThis as any).__prismaTestQueryCount || 0
  return new Response(JSON.stringify({ count }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'disabled in production' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }

  const body = await request.json().catch(() => ({}))
  const action = body.action || 'reset'
  if (action === 'reset') {
    ;(globalThis as any).__prismaTestQueryCount = 0
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ ok: false, message: 'unknown action' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
}
