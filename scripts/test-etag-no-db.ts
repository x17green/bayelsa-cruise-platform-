(async function run() {
  try {
    const base = process.env.BASE_URL || 'http://localhost:3000'
    const tripsUrl = `${base}/api/trips?includeSchedules=true&limit=50&startDate=2026-02-19T00%3A00%3A00.000Z&endDate=2026-02-25T00%3A00%3A00.000Z`
    const schedulesUrl = `${base}/api/trips/98ba7403-e177-4742-a465-8a698a0c213a/schedules?startDate=2026-02-19T00%3A00%3A00.000Z&endDate=2026-02-20T00%3A00%3A00.000Z`
    const prismaTestUrl = `${base}/api/test/prisma`

    async function resetCounter() {
      await fetch(prismaTestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset' }) })
    }

    async function getCounter() {
      const r = await fetch(prismaTestUrl)
      const j = await r.json()
      return j.count || 0
    }

    async function checkNoDbOnConditional(url: string) {
      // warm cache & get ETag
      const first = await fetch(url)
      if (first.status !== 200) throw new Error(`warm request failed ${url} -> ${first.status}`)
      const etag = first.headers.get('etag')
      if (!etag) throw new Error(`no ETag for ${url}`)

      // reset counter then make conditional GET
      await resetCounter()
      const before = await getCounter()
      if (before !== 0) throw new Error('counter not reset')

      const cond = await fetch(url, { headers: { 'If-None-Match': etag } })
      if (cond.status !== 304) throw new Error(`conditional GET did not return 304 for ${url} (got ${cond.status})`)

      const after = await getCounter()
      if (after !== 0) throw new Error(`DB queries executed on cache-hit for ${url} (count=${after})`)
      console.log(`${url} -> conditional 304 produced NO DB queries (counter=${after})`)
      return true
    }

    await checkNoDbOnConditional(tripsUrl)
    await checkNoDbOnConditional(schedulesUrl)

    console.log('\n✅ ETag short-circuit NO-DB integration test passed')
    process.exit(0)
  } catch (err) {
    console.error('\n❌ ETag short-circuit NO-DB integration test failed')
    console.error(err)
    process.exit(2)
  }
})()
