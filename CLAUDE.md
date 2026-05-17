# Project Guide for Claude Code

This is a Next.js + Supabase app. Read this file before making any changes.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Database + Auth | Supabase |
| Supabase client | `@supabase/ssr` |

---

## Project Structure

```
app/
  (auth)/login/page.tsx     Login page
  (auth)/signup/page.tsx    Signup page
  auth/callback/route.ts    Email confirmation handler — do not modify
  auth/logout/route.ts      Logout handler — do not modify
  dashboard/page.tsx        Protected page (requires login)
  layout.tsx                Root layout
  page.tsx                  Public home page
lib/supabase/
  client.ts                 Browser Supabase client (Client Components)
  server.ts                 Server Supabase client (Server Components)
  middleware.ts             Auth session refresh logic — do not modify
middleware.ts               Route protection — do not modify
components/ui/              shadcn components — do not modify these files
```

---

## Who You Are Talking To

The user has **zero development experience**. They are not a developer. They are building something they care about and relying on you completely for all technical decisions.

### Rules for interacting with the user

1. **Make all technical decisions yourself.** Never ask the user to choose between technologies, patterns, file structures, data types, or approaches. Pick the best option and implement it.
2. **Only ask non-technical questions** — things only the user can answer, like:
   - "What do you want to call this?" / "What should this page be named?"
   - "What information do you want to collect here?"
   - "What should happen after the user clicks this button?"
   - "Who should be able to see this — anyone, or only logged-in users?"
3. **Never ask the user** things like: "Should I use a Server Component or Client Component?", "Which database column type should I use?", "Do you want to use RLS?", "Should I add an index?". These are your job.
4. **Keep explanations short and plain.** When you explain something, write as if the user has never written code. Avoid jargon. Use analogies when helpful.
5. **When something requires a manual step in Supabase**, give them a clear, numbered checklist (see the section below).

---

## Supabase Manual Steps — How to Communicate Them

Whenever the user needs to do something in the Supabase dashboard (create a table, run SQL, configure auth), you MUST present it in this exact format. Never just mention it in passing — always make it a clear, copy-paste-ready instruction block.

### Format for SQL the user needs to run

> **Action required in Supabase — takes about 1 minute**
>
> 1. Go to [https://supabase.com](https://supabase.com) and open your project
> 2. Click **SQL Editor** in the left sidebar
> 3. Click **New query**
> 4. Copy and paste the SQL below into the editor, then click **Run**
>
> ```sql
> -- paste the exact SQL here
> ```
>
> 5. You should see "Success. No rows returned." — that means it worked.
> 6. Come back here and tell me when it's done.

### Format for table creation (UI-based)

> **Action required in Supabase — takes about 2 minutes**
>
> 1. Go to [https://supabase.com](https://supabase.com) and open your project
> 2. Click **Table Editor** in the left sidebar
> 3. Click **New table**
> 4. Set the name to: `your_table_name`
> 5. Add these columns (click **Add column** for each):
>    - `column_name` — type: `text` — uncheck "Is Nullable" if required
> 6. Make sure **Enable Row Level Security (RLS)** is checked
> 7. Click **Save**
> 8. Come back here and tell me when it's done, then I'll set up the access rules.

### Always tell the user to come back when done

Never write code that depends on a Supabase change without first confirming the user completed it. Always end manual-step instructions with: **"Come back here and tell me when it's done."**

---

## Golden Rules

1. **Never hardcode Supabase keys** — always use `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Always use `getUser()`, never `getSession()`** in server-side code — `getSession()` reads cookies only and can be spoofed; `getUser()` validates with Supabase's servers
3. **New pages default to Server Components** — only add `'use client'` when you need event handlers, state (`useState`), or browser APIs
4. **Every new Supabase table needs Row Level Security** — without RLS policies, all queries return empty results silently

---

## Which Supabase Client to Use

| Situation | Client to use | Import |
|---|---|---|
| Server Component (no `'use client'`) | `server.ts` | `import { createClient } from '@/lib/supabase/server'` |
| Client Component (has `'use client'`) | `client.ts` | `import { createClient } from '@/lib/supabase/client'` |
| Route Handler (`route.ts`) | `server.ts` | `import { createClient } from '@/lib/supabase/server'` |

---

## Code Patterns

### Read data in a Server Component (preferred)

```tsx
// app/posts/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase.from('posts').select('*')

  if (error) return <p>Error: {error.message}</p>

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Read data in a Client Component (when you need interactivity)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PostsClient() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('posts')
      .select('*')
      .then(({ data }) => setPosts(data ?? []))
  }, [])

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Insert a row

```tsx
const supabase = createClient() // or await createClient() on server
const { error } = await supabase.from('posts').insert({
  title: 'Hello world',
  content: 'My first post',
})
```

### Update a row

```tsx
const { error } = await supabase
  .from('posts')
  .update({ title: 'Updated title' })
  .eq('id', 42)
```

### Delete a row

```tsx
const { error } = await supabase.from('posts').delete().eq('id', 42)
```

### Get the current logged-in user (Server Component)

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login') // Redirect if not logged in

  // Use user.id to scope queries to the current user
  const { data: myPosts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id) // Only fetch this user's posts
}
```

### Get the current user (Client Component)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  if (!user) return <p>Loading...</p>
  return <p>Logged in as {user.email}</p>
}
```

---

## How to Add a New Protected Page

1. Create the file, e.g. `app/settings/page.tsx`
2. Fetch the user at the top and redirect if not logged in:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="container mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      {/* Build your page here */}
    </main>
  )
}
```

3. To make the middleware automatically redirect unauthenticated users before the page loads, add the route to `protectedRoutes` in `lib/supabase/middleware.ts`:

```ts
const protectedRoutes = ['/dashboard', '/settings'] // add your route here
```

---

## How to Add a New Supabase Table

1. Go to your Supabase dashboard → Table Editor → New table
2. Name the table and add your columns
3. **Keep Row Level Security enabled** (it is on by default — do not disable it)
4. Go to Authentication → Policies → click your table → New Policy
5. Common policies:
   - **Anyone can read:** operation `SELECT`, expression `true`
   - **Only owner can read their rows:** operation `SELECT`, expression `auth.uid() = user_id`
   - **Only owner can insert:** operation `INSERT`, expression `auth.uid() = user_id`
   - **Only owner can update:** operation `UPDATE`, expression `auth.uid() = user_id`
   - **Only owner can delete:** operation `DELETE`, expression `auth.uid() = user_id`

If your table has a `user_id` column, run this SQL in Supabase → SQL Editor to set up all policies at once (replace `posts` with your table name):

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own posts"
  ON posts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE USING (auth.uid() = user_id);
```

---

## UI Components (shadcn/ui)

Import from `@/components/ui/`. Available out of the box:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
```

Add more components with:
```bash
npx shadcn@latest add <component-name>
# Examples:
#   npx shadcn@latest add dialog
#   npx shadcn@latest add select
#   npx shadcn@latest add table
#   npx shadcn@latest add toast
```

Find the full component list at https://ui.shadcn.com/docs/components

---

## Deployment (Vercel)

1. Push the code to GitHub
2. Import the repository at vercel.com
3. Add environment variables in Vercel → Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. After deploy, go to Supabase → Authentication → URL Configuration and add your Vercel URL to **Redirect URLs** (e.g. `https://your-app.vercel.app/**`)

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| Query returns empty but no error | Row Level Security has no policy | Add a SELECT policy in Supabase → Authentication → Policies |
| `Invalid API key` | `.env.local` values are wrong or missing | Check values against Supabase → Settings → API |
| Redirect loop on login | `getUser()` failing silently | Check that `NEXT_PUBLIC_SUPABASE_URL` is correct |
| Email confirmation link broken in production | Supabase redirect URL not configured | Add production URL to Supabase → Auth → URL Configuration |
| `Cannot read properties of null` on user | Accessing `user.email` before checking if user exists | Always check `if (!user) redirect('/login')` first |
