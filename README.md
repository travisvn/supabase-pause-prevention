# Supabase Pause Prevention

The aim of this project is to prevent Supabase projects from pausing due to inactivity. 

On the free-tier plan, projects that are inactive for more than 7 days are paused. 


## How it works

- Creating a _cron job_ (scheduled task) that makes a simple database call
  - _(This keeps your Supabase project active)_
- Fetching `keep-alive.ts` API endpoints for the other projects, as Vercel limits free-tier users to one cron job.

## Getting Started

The main files to pay attention to in this project:

- [`/app/api/keep-alive/route.ts`](app/api/keep-alive/route.ts) - Contains all the logic
- [`/config/keep-alive-config.ts`](app/api/keep-alive/route.ts) - Contains configurations easily modifiable for your situation
- [`/vercel.json`](app/api/keep-alive/route.ts) - Directs Vercel to periodically run the `keep-alive` endpoint

`utils/supabase` folder contains files provided in the Supabase docs for the [Next.js Web App demo — Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

The rest is boilerplate from Next.js `create-next-app`

___

### Configuring your other Supabase projects

<details>

<summary>Example of a setup using Prisma as an ORM</summary>

`/pages/api/keep-alive.ts` 

```typescript
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from 'src/server/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const dbResponse = await prisma.tag.findMany()
    const successMessage = (dbResponse != null && dbResponse?.length > 0) ? "Success" : "Fail"
    res.status(200).json(successMessage)
  } catch (e) {
    res.status(401).send("There was an error")
  }
}
```
</details>
___

### Sample response

Visiting `https://your-project-domain.vercel.app/api/keep-alive` 

```
Results for retrieving
'mzmgylpviofc' from 'keep-alive' at column 'name': []

Other Endpoint Results:
https://your-other-vercel-project-urls.vercel.app/api/keep-alive - Passed
https://your-other-supabase-app.com/api/keep-alive - Passed

```

___

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
