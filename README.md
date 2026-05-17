# My App — Getting Started Guide

A clean starting point for building web apps with Next.js and Supabase.

---

## What you need before you start

- A computer (macOS, Windows, or Linux)
- [Node.js](https://nodejs.org) — download the **LTS** version (labeled "Recommended For Most Users")
- A free [Supabase](https://supabase.com) account

**Check if Node.js is installed:**
Open your Terminal (Mac: press `Cmd+Space`, type "Terminal", press Enter) and run:
```
node --version
```
You should see something like `v20.x.x`. If you get an error, install Node.js first.

---

## Step 1 — Get the project files

If you received this as a folder, skip to Step 2.

Otherwise, open your Terminal and run:
```
git clone <repository-url>
cd claude-boilerplate
```

---

## Step 2 — Install dependencies

In your Terminal, inside the project folder, run:
```
npm install
```
This downloads all the code libraries the app needs. It may take 1–2 minutes.

---

## Step 3 — Set up Supabase

### 3a. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Give it a name, choose a region close to you, set a database password (save it somewhere), and click **Create new project**
4. Wait about a minute for it to be ready

### 3b. Get your project keys

1. In your Supabase project, click the **gear icon** (Settings) in the left sidebar
2. Click **API**
3. You need two values:
   - **Project URL** — looks like `https://abcdefg.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`

### 3c. Create your environment file

In the project folder, find the file `.env.example`. Make a copy of it named `.env.local`.

On Mac/Linux:
```
cp .env.example .env.local
```
On Windows:
```
copy .env.example .env.local
```

Now open `.env.local` in any text editor (e.g. Notepad, TextEdit, VS Code) and replace the placeholder values with your real values from Step 3b:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-actual-key
```

**Important:** Never share `.env.local` with anyone. It is already in `.gitignore` so it will not be uploaded to GitHub.

---

## Step 4 — Enable email authentication in Supabase

1. In your Supabase project, click **Authentication** in the left sidebar
2. Click **Providers**
3. Make sure **Email** is enabled (it is on by default — no action needed unless it was turned off)

---

## Step 5 — Start the app

In your Terminal, run:
```
npm run dev
```

You should see output ending with something like:
```
▲ Next.js 15.x.x
- Local: http://localhost:3000
```

Open your browser and go to **http://localhost:3000**

To stop the app, press `Ctrl+C` in the Terminal.

---

## Step 6 — Create an account and sign in

1. Click **Create account** on the home page
2. Enter your email and a password (at least 6 characters)
3. Check your email for a confirmation link and click it
4. You will be redirected to the dashboard

---

## Building your app

This project uses **Claude Code** as your AI coding assistant. To start:

1. Open Claude Code in this project folder
2. Describe what you want to build in plain English
3. Claude Code will read `CLAUDE.md` automatically and know how to work with Supabase

Example prompts to try:
- *"Create a page that shows a list of my todos from a Supabase table called todos"*
- *"Add a form on the dashboard to create a new post and save it to Supabase"*
- *"Make a settings page where I can update my display name"*

---

## Deploy your app to the web (optional)

The easiest way to share your app publicly:

1. Push your code to [GitHub](https://github.com)
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** and choose your repository
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
5. Click **Deploy**

After deploying, do one more step in Supabase:
1. Go to **Authentication → URL Configuration**
2. Under **Redirect URLs**, add your Vercel URL followed by `/**`
   - Example: `https://my-app.vercel.app/**`
3. Click **Save**

This step is required so that email confirmation links work correctly in production.

---

## Project structure (for reference)

```
app/                    Pages of your app
  (auth)/login          Sign in page
  (auth)/signup         Create account page
  dashboard/            Your main page after login — start building here
  page.tsx              Public home page
components/ui/          Ready-made UI components (Button, Card, Input, etc.)
lib/supabase/           Supabase connection code — do not edit
middleware.ts           Handles auth on every page — do not edit
.env.local              Your secret keys — never share or commit this file
CLAUDE.md               Instructions for Claude Code — read this when building
```

---

## Troubleshooting

**The app won't start**
- Make sure you ran `npm install` first
- Make sure `.env.local` exists and has the correct values

**Sign up / login doesn't work**
- Check that your `.env.local` values match what's in Supabase → Settings → API
- Make sure Email provider is enabled in Supabase → Authentication → Providers

**I created a Supabase table but queries return empty**
- You need to add Row Level Security policies — see `CLAUDE.md` for instructions, or ask Claude Code: *"Help me set up RLS policies for my [table name] table"*

**Email confirmation link doesn't work after deploying**
- Add your production URL to Supabase → Authentication → URL Configuration → Redirect URLs
# claude-boilerplate
# corporate-health
