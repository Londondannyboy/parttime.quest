# 🚀 DEPLOYMENT GUIDE - Trinity Option B

## Issue: Deploy Failures

**Problem**: Vercel deployment is failing because of:
1. **DATABASE_URL missing** - Only available at runtime, not build time
2. **API keys missing** - Claude, Zep, Stripe not configured
3. **Build-time rendering issue** - Current code tries to query database during build

**Solution**: Configure environment variables BEFORE deploying

---

## Step 1: Clean Up Build Files (Remove Old Job Board Code)

```bash
# Remove job board pages (they cause build issues)
rm -rf app/fractionaljobsuk
rm -rf app/job
rm -rf app/articles
rm -f app/robots.ts
rm -f app/sitemap.ts
rm -f components/JobBrief.tsx
rm -f components/VideoPlayer.tsx

# Commit cleanup
git add -A
git commit -m "chore: Remove job board code (pivoting to Trinity Option B)"
git push origin main
```

---

## Step 2: Vercel Environment Variables Setup

**Access**: Vercel Dashboard → Project Settings → Environment Variables

### Production Variables (Required for Deploy)

```
# Database (REQUIRED)
DATABASE_URL = postgresql://neondb_owner:npg_LjBNF17HSTix@ep-green-smoke-ab3vtnw9-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

# Claude API (REQUIRED for Trinity chat)
ANTHROPIC_API_KEY = sk-ant-... (get from https://console.anthropic.com/keys)

# Stripe (REQUIRED for subscriptions)
STRIPE_SECRET_KEY = sk_live_... (get from https://dashboard.stripe.com/apikeys)
STRIPE_PUBLISHABLE_KEY = pk_live_...

# Stripe Webhook Secret (REQUIRED for subscription webhooks)
STRIPE_WEBHOOK_SECRET = whsec_... (create webhook at https://dashboard.stripe.com/webhooks)

# Stack Auth (REQUIRED for user login)
NEXT_PUBLIC_STACK_PROJECT_ID = ... (get from Stack Auth dashboard)
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY = ...
STACK_SECRET_SERVER_KEY = ...

# Optional: Zep Vector DB (for Phase 3)
ZEP_API_KEY = (leave blank for now, add in Phase 3)

# Optional: Analytics
MIXPANEL_TOKEN = (leave blank for now)
SEGMENT_WRITE_KEY = (leave blank for now)
```

### Add Variables to Vercel:

1. Go to https://vercel.com/dashboard
2. Select project: `fractional-quest-fresh`
3. Click "Settings" → "Environment Variables"
4. Click "Add New" for each variable above
5. Set Environment to "Production"
6. Click "Save"

---

## Step 3: Fix Build Configuration

**Edit `next.config.ts`**:

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Don't try to fetch data at build time
  // All data fetching happens at request time

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Allow Node.js APIs in app directory
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },

  // Prevent build-time database queries
  // All queries must be in server components or API routes
  staticPageGenerationTimeout: 60,
}

export default nextConfig
```

---

## Step 4: Verify No Build-Time Database Queries

**Check**: No files should fetch data in `generateStaticParams()` or `generateMetadata()` that runs at build time.

```bash
# Search for problematic patterns
grep -r "generateStaticParams" app/
grep -r "generateMetadata.*dbQuery" app/

# Should return: nothing or only safe patterns
```

**Safe Patterns** (allowed):
```typescript
// ✅ SAFE: API routes (run at request time)
export async function POST(request: Request) {
  const data = await dbQuery("SELECT ...")
  return Response.json(data)
}

// ✅ SAFE: Server components (run at request time)
async function MyComponent() {
  const data = await dbQuery("SELECT ...")
  return <div>{data}</div>
}

// ✅ SAFE: generateMetadata without database
export async function generateMetadata() {
  return { title: "Static title" }
}

// ❌ DANGER: Trying to query database at build time
export async function generateStaticParams() {
  const jobs = await dbQuery("SELECT id FROM jobs")  // FAILS
  return jobs.map(job => ({ slug: job.id }))
}
```

---

## Step 5: Vercel Redeployment

### Option A: Via Git Push (Recommended)
```bash
# Make sure all changes are committed
git status

# If changes exist:
git add .
git commit -m "chore: Fix build configuration for Trinity MVP"
git push origin main

# Vercel auto-deploys on push to main
# Wait 2-3 minutes for deployment
# Check: https://vercel.com/dashboard → fractional-quest-fresh → Deployments
```

### Option B: Manual Redeploy
```bash
# Install Vercel CLI if needed
npm install -g vercel

# Redeploy with new environment variables
vercel deploy --prod --force

# Will ask for confirmation
```

### Option C: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select `fractional-quest-fresh`
3. Click "Deployments" tab
4. Click "..." menu on latest failed deployment
5. Click "Redeploy" (will use new env vars)

---

## Step 6: Test Deployment

**After deployment completes:**

```bash
# Get deployment URL
# From Vercel Dashboard → Deployments → Latest → Copy URL

# Test homepage
curl https://your-deployment-url.vercel.app

# Test API health check
curl https://your-deployment-url.vercel.app/api/health

# Should return: { "status": "ok" }
```

---

## Step 7: Debug if Still Failing

**Check build logs:**
1. Vercel Dashboard → `fractional-quest-fresh` → Deployments
2. Click on failed deployment
3. Click "Build Logs" tab
4. Scroll to find error message

**Common Errors & Fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `DATABASE_URL is not defined` | Env var not set | Add to Vercel Settings → Environment Variables |
| `ANTHROPIC_API_KEY is required` | Claude key missing | Add API key from https://console.anthropic.com |
| `Module not found: @neondatabase/serverless` | Missing dependency | Run `npm install` locally, commit package-lock.json |
| `Cannot read property 'neon' of undefined` | Database client issue | Ensure `lib/db.ts` uses `process.env.DATABASE_URL` at runtime only |
| `Build failed: Internal error` | Generic error | Check that no build-time database queries exist |

---

## Current Project Structure (Option B)

```
fractional-quest-fresh/
├── app/
│   ├── api/                        # API routes (safe to use database)
│   │   ├── chat/route.ts          # Claude API (to be created)
│   │   ├── match/route.ts         # Job matching (to be created)
│   │   └── health/route.ts        # Health check
│   ├── discover/                  # Trinity conversation (to be created)
│   │   └── page.tsx               # Main conversation UI
│   ├── profile/                   # User dashboard (to be created)
│   ├── pricing/                   # Premium pricing (to be created)
│   ├── employers/                 # Employer dashboard (to be created)
│   ├── privacy/                   # Legal pages
│   ├── terms/
│   ├── contact/                   # Keep contact forms (optional)
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage (update for Trinity)
│   ├── globals.css                # Tailwind + theme
│
├── components/                    # Reusable UI
│   ├── TrinityChat.tsx           # Main conversation component (to be created)
│   ├── TrinityScore.tsx          # Match visualization (to be created)
│   ├── Button.tsx                 # ✅ Keep
│   ├── Card.tsx                   # ✅ Keep
│   ├── Input.tsx                  # ✅ Keep
│   ├── Navigation.tsx             # ✅ Keep (update copy)
│   ├── Footer.tsx                 # ✅ Keep
│
├── lib/
│   ├── db.ts                      # Neon connection ✅ Keep
│   ├── types.ts                   # ✅ Keep (add Trinity types)
│   ├── claude-client.ts           # Claude API client (to be created)
│   ├── trinity-matching.ts        # Matching algorithm (to be created)
│   ├── trinity-storage.ts         # Profile persistence (to be created)
│   ├── zep-client.ts              # Zep graph (to be created, Phase 3)
│
├── prompts/
│   └── trinity-extraction.md      # Claude system prompt (to be created)
│
├── public/                        # Static assets
├── DEPLOYMENT_GUIDE.md            # This file
├── PRD_OPTION_B_TRINITY_FOCUS.md # Product requirements (Option B)
├── STRATEGIC_ASSESSMENT.md        # Strategic analysis
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind theme
└── next.config.ts                 # Next.js config
```

---

## Environment Variable Acquisition Guide

### 1. Database (Neon) - ALREADY SET UP ✅
```
Uses: postgresql://neondb_owner:npg_LjBNF17HSTix@...
Already connected in Phase 1
Just add to Vercel Environment Variables
```

### 2. Claude API (Anthropic)
```
Go to: https://console.anthropic.com
1. Sign up or log in
2. Click "API Keys" in sidebar
3. Click "Create Key"
4. Copy the key (starts with sk-ant-)
5. Add to Vercel as ANTHROPIC_API_KEY
```

### 3. Stripe (Payments)
```
Go to: https://dashboard.stripe.com
1. Sign up or log in
2. Dashboard → API Keys (sidebar)
3. Copy "Secret Key" (starts with sk_live_)
4. Copy "Publishable Key" (starts with pk_live_)
5. Go to Webhooks → Create endpoint
6. Endpoint URL: https://your-domain.vercel.app/api/webhooks/stripe
7. Select events: customer.subscription.*, charge.succeeded
8. Copy "Signing Secret" (starts with whsec_)
9. Add all three to Vercel
```

### 4. Stack Auth (Authentication)
```
Go to: Stack Auth dashboard (from your onboarding email)
1. Create or select your project
2. Copy Project ID, Client Key, Server Key
3. Add to Vercel:
   - NEXT_PUBLIC_STACK_PROJECT_ID
   - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
   - STACK_SECRET_SERVER_KEY
```

### 5. Zep Vector DB (Phase 3 - Leave Blank For Now)
```
Go to: https://app.getzep.com
Setup later when building graph intelligence
```

---

## Troubleshooting Checklist

Before contacting support, verify:

- [ ] DATABASE_URL is set in Vercel → Settings → Environment Variables
- [ ] ANTHROPIC_API_KEY is set
- [ ] STRIPE keys are set (3 total)
- [ ] STACK_AUTH keys are set (3 total)
- [ ] No old job board code in app/ directory
- [ ] All git commits pushed (`git push origin main`)
- [ ] Build logs checked for specific error message
- [ ] Local build works: `npm run build` locally

---

## Success Indicators

**After successful deployment**, verify:

✅ Homepage loads: https://your-deployment.vercel.app/
✅ Can navigate to /discover (chat page - not yet functional)
✅ Can navigate to /pricing (pricing page - not yet functional)
✅ Can navigate to /profile (user dashboard - not yet functional)
✅ No 500 errors in console
✅ Environment variables accessible to code

---

## Next Steps After Deployment

Once deployment succeeds:

1. **Phase 2 Day 6**: Start building Trinity chat component
2. **Phase 2 Day 7**: Integrate Claude API
3. **Phase 2 Day 10**: Basic job matching working
4. **Phase 3**: Zep graph integration
5. **Phase 4**: Monetization (subscriptions, placements)

The deployment infrastructure is ready. This removes the blocker and lets us focus on building the Trinity features.

