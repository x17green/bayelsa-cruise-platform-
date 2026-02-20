(async function run() {
  try {
    const base = process.env.BASE_URL || 'http://localhost:3000'
    const tripsUrl = `${base}/api/trips?includeSchedules=true&limit=50&startDate=2026-02-19T00%3A00%3A00.000Z&endDate=2026-02-25T00%3A00%3A00.000Z`
    const schedulesUrl = `${base}/api/trips/98ba7403-e177-4742-a465-8a698a0c213a/schedules?startDate=2026-02-19T00%3A00%3A00.000Z&endDate=2026-02-20T00%3A00%3A00.000Z`

    async function checkUrl(url: string) {
      const r1 = await fetch(url)
      if (r1.status !== 200) throw new Error(`${url} initial status !== 200 (${r1.status})`)
      const etag = r1.headers.get('etag')
      const xcache1 = r1.headers.get('x-cache') || 'NONE'
      console.log(url, '→ first:', r1.status, 'X-Cache:', xcache1, 'ETag:', etag)
      if (!etag) throw new Error(`${url} did not return ETag on first request`)

      // conditional GET
      const r2 = await fetch(url, { headers: { 'If-None-Match': etag } })
      console.log(url, '→ conditional:', r2.status, 'X-Cache:', r2.headers.get('x-cache'))
      if (r2.status !== 304) throw new Error(`${url} conditional GET did not return 304 (got ${r2.status})`)
      if (r2.headers.get('x-cache') !== 'HIT') throw new Error(`${url} conditional GET did not return X-Cache: HIT`) 
      return true
    }

    await checkUrl(tripsUrl)
    await checkUrl(schedulesUrl)

    console.log('\n✅ ETag short-circuit integration test passed')
    process.exit(0)
  } catch (err) {
    console.error('\n❌ ETag short-circuit integration test failed')
    console.error(err)
    process.exit(2)
  }
})()
