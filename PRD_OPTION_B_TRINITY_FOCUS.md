# 🎯 FRACTIONAL.QUEST - PRODUCT REQUIREMENTS DOCUMENT (OPTION B)
## Pure Trinity-Powered Conversational Job Discovery Platform

**Version**: 2.0 | **Date**: Dec 11, 2025 | **Strategy**: Option B (Pure Trinity Focus)
**Timeline**: 4 weeks | **Status**: MVP-ready architecture | **Team**: 2 developers

---

## I. EXECUTIVE VISION

Fractional.Quest is **not a job board**. It's a **conversational AI platform** that helps professionals discover fractional work aligned with **who they're becoming**, not just what pays well.

### Core Concept: Trinity Framework
```
QUEST (WHY)              SERVICE (HOW)           PLEDGE (WHAT)
"What am I              "What do I              "What commitments
becoming?"              contribute?"            do I make?"

Identity               Value                   Availability
Purpose                Expertise               Constraints
Direction              Impact                  Commitment

Example:
"Tech-enabled         "Build ML systems      "2 days/week"
operations leader"    that scale"
```

### Why This Matters
- **LinkedIn/Indeed**: "Find jobs matching your skills" (commoditized, noisy)
- **Fractional.Quest**: "Find roles matching your purpose" (differentiated, aligned)
- **User Value**: Purpose-driven work reduces burnout, increases satisfaction
- **Business Value**: Placement fees (17.5% × £30k = £5.2k per hire) + subscriptions

---

## II. PRODUCT ARCHITECTURE

### 2.1 User Experience: Conversational First

**Interface Philosophy**:
- Minimal UI (Perplexity/ChatGPT inspired)
- Left sidebar: REPO | TRINITY | AMBITION tabs (3 only)
- Main conversation window: Full-width chat
- No forms, no filters, no search bars
- AI-driven navigation

**Flow**:
```
User arrives at fractional.quest
↓
"Hi! I'm Trinity. Let's find work that fits who you're becoming."
↓
Chat 1: Extract QUEST
"What are you becoming?"
→ User responds
→ Claude digs deeper: "That sounds like [X]. Tell me more..."
→ Stores quest_depth (0-100): How thoroughly explored?
↓
Chat 2: Extract SERVICE
"What do you contribute?"
→ User responds about expertise/impact
→ Claude maps to value delivery (not job titles)
→ Stores service_depth
↓
Chat 3: Extract PLEDGE
"What commitments can you make?"
→ Hours per week, contract length, location constraints
→ Stores pledge_depth
↓
Chat 4: Results
"Perfect. Let me find roles matching this Trinity..."
→ Query Zep graph for semantic similarity
→ Calculate alignment scores per dimension
→ Present top 10 jobs with:
  * Quest alignment (0-100)
  * Service alignment (0-100)
  * Pledge fit (0-100)
  * Overall match (weighted)
↓
User: Click job → Full details + "Apply" CTA
↓
Conversation history saved → Trinity profile in Neon
```

### 2.2 Three Sidebar Tabs (Minimal Navigation)

**Tab 1: REPO**
- Your Trinity profile (editable conversation history)
- Commitment pledge (hours, rate, location)
- Applied jobs + status
- Trinity match history

**Tab 2: TRINITY**
- Visual Trinity graph (Quest/Service/Pledge nodes)
- Network of matched professionals (hidden until premium)
- Similar Trinity patterns (for discovery)
- Refinement tools (adjust quest/service depth)

**Tab 3: AMBITION** (Premium Only)
- Skill growth recommendations based on Trinity
- Learning paths aligned with your quest
- Network expansion opportunities
- Placement success stories

---

## III. TECHNICAL ARCHITECTURE

### 3.1 Tech Stack (Same as Current Build, Extended)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 App Router | Server-side rendering + streaming |
| **UI** | Tailwind CSS (purple theme) | Minimal, clean conversational UI |
| **Database** | Neon PostgreSQL | Trinity profiles, applications, users |
| **AI** | Claude Sonnet 4.5 + Streaming | Conversational extraction + matching |
| **Graph DB** | Zep Vector DB | Trinity atoms + semantic relationships |
| **Authentication** | Stack Auth | User accounts + session management |
| **Payment** | Stripe | Subscriptions + placement tracking |
| **Deployment** | Vercel | Edge serverless deployment |
| **Analytics** | Mixpanel/Segment | Conversation funnel tracking |

### 3.2 Data Model

```sql
-- User accounts (via Stack Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  created_at TIMESTAMP
);

-- Trinity profiles (core entity)
CREATE TABLE trinity_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  quest TEXT,              -- "What am I becoming?"
  quest_depth INT,         -- 0-100 (explored thoroughly?)
  service TEXT,            -- "What do I contribute?"
  service_depth INT,       -- 0-100
  pledge TEXT,             -- "Hours/week, location, rate"
  pledge_depth INT,        -- 0-100
  created_at TIMESTAMP,
  last_updated TIMESTAMP,
  conversation_history JSONB -- Full chat transcript
);

-- Conversation history (for context)
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID,
  stage TEXT,              -- 'quest', 'service', 'pledge', 'results'
  messages JSONB,          -- [{role: 'user'|'assistant', content: '...'}]
  extracted_data JSONB,    -- Partial trinity data from this stage
  created_at TIMESTAMP
);

-- Trinity match results (cache for performance)
CREATE TABLE trinity_matches (
  id UUID PRIMARY KEY,
  user_id UUID,
  job_id UUID,
  quest_score INT,         -- 0-100
  service_score INT,       -- 0-100
  pledge_score INT,        -- 0-100
  overall_score INT,       -- Weighted: 40% quest, 35% service, 25% pledge
  ranked_position INT,     -- Top 10 ranked
  created_at TIMESTAMP
);

-- Job applications
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  user_id UUID,
  job_id UUID,
  trinity_match_score INT,
  status TEXT,             -- 'submitted', 'viewed', 'shortlisted', 'rejected'
  submitted_at TIMESTAMP
);

-- Companies/Jobs (simplified)
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  company_id UUID,
  title TEXT,
  description TEXT,
  quest_keywords TEXT[],   -- Extracted from JD by Claude
  service_keywords TEXT[], -- Skills/impact areas
  pledge_constraints JSONB, -- {hours, location, duration}
  day_rate INT,
  created_at TIMESTAMP
);

-- Zep Graph Integration (external)
-- Stores Trinity atoms + semantic relationships
-- Accessible via ZepClient API
```

### 3.3 Claude API Integration

**System Prompt** (Extracted to `prompts/trinity-extraction.md`):

```
You are Trinity, an AI assistant helping professionals discover work aligned
with their purpose, not just their paycheck.

Your role: Extract the user's Trinity through natural conversation.

QUEST STAGE (Extract "What am I becoming?")
- Look for identity language: "becoming", "evolving towards", "building towards"
- Examples: "tech-enabled ops leader", "founder-friendly operator", "data-driven strategist"
- When clear, confirm: "So you're becoming a [X]. What draws you to that?"
- Dig deeper: "What does that identity mean to you? What impact does it have?"
- Extract when depth feels solid (aim for 2-3 minute conversation)

SERVICE STAGE (Extract "What do I contribute?")
- Reframe from job titles to value delivery
- Examples: "I build ML systems that reduce operational waste"
- Not: "I'm a data scientist at Acme Corp"
- Ask: "What's the real impact? Who benefits? How does it matter?"
- Extract when specific and impact-focused

PLEDGE STAGE (Extract "What commitments do I make?")
- Availability: hours per week, contract length
- Location: remote/hybrid/office, geographic preference
- Rate: day rate or annual equivalent
- Constraints: industry, company size, growth stage
- Example: "2 days/week, fully remote, £600/day, prefer B2B SaaS"

RESPONSE FORMAT:
When stage is complete, respond with:
{
  "stage": "quest|service|pledge",
  "extracted": {
    "quest": "...",
    "service": "...",
    "pledge": "..."
  },
  "depth_scores": {
    "quest": 0-100,
    "service": 0-100,
    "pledge": 0-100
  },
  "next_stage": "service|pledge|results|complete"
}

TONE: Warm, curious, like a mentor who gets fractional work.
```

### 3.4 Matching Algorithm

```typescript
// Trinity Alignment Scoring
interface TrinityScore {
  questScore: number      // 0-100: semantic similarity to job's purpose
  serviceScore: number    // 0-100: skill/impact match
  pledgeScore: number     // 0-100: availability/rate fit
  overallScore: number    // 40% quest + 35% service + 25% pledge
}

function calculateTrinityMatch(
  profile: TrinityProfile,
  job: Job,
  zepGraph: ZepGraphConnection
): TrinityScore {
  // Step 1: Extract job Trinity from description + company context
  const jobTrinity = extractJobTrinity(job.description, job.company_id)

  // Step 2: Semantic similarity for Quest dimension
  // Use Claude embeddings to compare identity language
  const questEmbedding = embed(profile.quest)
  const jobQuestEmbedding = embed(jobTrinity.quest)
  const questScore = cosineSimilarity(questEmbedding, jobQuestEmbedding) * 100

  // Step 3: Service dimension (skills/impact)
  const serviceScore = matchServiceToJobRequirements(
    profile.service,
    job.requirements,
    zepGraph
  )

  // Step 4: Pledge dimension (availability/rate fit)
  const pledgeScore = matchPledgeToJobConstraints(
    profile.pledge,
    job.hours_per_week,
    job.location,
    job.day_rate
  )

  // Step 5: Weight by exploration depth
  // More thoroughly explored Trinity = higher confidence
  const confidenceMultiplier = (
    (profile.quest_depth + profile.service_depth + profile.pledge_depth) / 3
  ) / 100

  const overallScore = Math.round(
    (questScore * 0.4 + serviceScore * 0.35 + pledgeScore * 0.25)
    * confidenceMultiplier
  )

  return {
    questScore: Math.round(questScore),
    serviceScore: Math.round(serviceScore),
    pledgeScore: Math.round(pledgeScore),
    overallScore
  }
}
```

---

## IV. FOUR-WEEK IMPLEMENTATION ROADMAP

### PHASE 1: Foundation (Days 1-5) ✅ COMPLETE

**Current Status**: Done
- [x] Next.js 15 with TypeScript
- [x] Neon database connection
- [x] Tailwind purple theme
- [x] Git repository initialized
- [x] Vercel deployment pipeline

**Handoff from Phase 1**: We have solid architecture to build Trinity on.

---

### PHASE 2: Trinity Conversational Core (Days 6-10) - NEXT

**Goal**: Get Trinity extraction working end-to-end with Claude API

**Day 6: Trinity Chat UI**
```
[ ] Create app/discover/page.tsx
    - Minimal left sidebar (REPO | TRINITY | AMBITION tabs)
    - Main area: Full-width chat conversation
    - Input box: Sticky at bottom with send button
    - Message history scrollable above
[ ] Create components/TrinityChat.tsx
    - Displays messages with role-based styling
    - User messages: right-aligned, purple background
    - Assistant messages: left-aligned, gray background
    - Timestamp + loading state
[ ] Create components/TrinityMessage.tsx
    - Individual message component
    - Support for markdown + code blocks
    - Streaming animation for assistant responses
```

**Day 7: Claude API Integration**
```
[ ] Create app/api/chat/route.ts
    - POST endpoint for chat messages
    - Streaming response (real-time display)
    - Session management (user_id from Stack Auth)
    - Error handling + rate limiting
[ ] Create lib/claude-client.ts
    - Claude Sonnet 4.5 initialization
    - System prompt management
    - Token counting + cost tracking
    - Retry logic for API failures
[ ] Wire up Trinity extraction prompts
    - Quest extraction system prompt
    - Service extraction system prompt
    - Pledge extraction system prompt
    - Results generation prompt
```

**Day 8: Trinity Profile Storage**
```
[ ] Create Neon tables (trinity_profiles, conversations)
[ ] Create lib/trinity-storage.ts
    - Save Trinity profile to Neon
    - Retrieve profile history
    - Update Trinity based on conversation
[ ] Implement conversation history persistence
    - Store every message pair (user + assistant)
    - Index by stage (quest/service/pledge)
    - Support conversation resumption
[ ] Create components/TrinityProfileSidebar.tsx
    - Display current Trinity profile
    - Show depth scores (0-100 per dimension)
    - Edit/refine buttons for each dimension
```

**Day 9: Job Data Integration**
```
[ ] Query existing jobs from Neon (from Phase 1 build)
    - Extract job Trinity from descriptions
    - Cache extracted Trinity (expensive Claude operation)
    - Create job_trinity_cache table
[ ] Create lib/job-trinity-extraction.ts
    - Parse job descriptions for Trinity keywords
    - Map to quest (purpose), service (skills), pledge (constraints)
    - Use Claude to do semantic extraction (one-time batch)
[ ] Test extraction on 50 jobs
    - Manual validation of extracted Trinity
    - Refine extraction prompt
    - Store validated Trinity in database
```

**Day 10: Basic Matching Algorithm**
```
[ ] Create lib/trinity-matching.ts
    - Implement cosineSimilarity function
    - Implement matchServiceToJobRequirements
    - Implement matchPledgeToJobConstraints
[ ] Create app/api/match/route.ts
    - Input: user Trinity profile
    - Output: Top 10 matching jobs with scores
    - Cache results (expensive Zep queries)
[ ] Test matching with 10 sample profiles
    - Manual verification of match quality
    - Adjust scoring weights
    - Iterate on algorithm
```

**End of Phase 2**: Users can chat → Extract Trinity → See matching jobs

---

### PHASE 3: Graph Intelligence & Zep Integration (Days 11-15)

**Goal**: Add semantic matching via Zep graph

**Day 11: Zep Graph Setup**
```
[ ] Initialize Zep Vector DB connection
[ ] Create lib/zep-client.ts
    - Zep client initialization
    - Vector embedding function
    - Graph traversal queries
[ ] Create Trinity atom schema for Zep
    - Quest atoms (purpose nodes)
    - Service atoms (skill/impact nodes)
    - Professional atoms (users in network)
    - Relationship types (has_quest, has_service, matches)
```

**Day 12: Trinity Atom Creation**
```
[ ] Create app/api/trinity/create-atom.ts
    - When user completes Trinity, create atoms in Zep
    - Quest atom: "Tech-enabled ops leader"
    - Service atom: "Build ML systems"
    - Professional atom: links to user
[ ] Create relationships in graph
    - user → has_quest → quest_atom
    - user → has_service → service_atom
    - user → has_pledge → pledge_constraints
    - user → matched_with → job_atoms
```

**Day 13: Semantic Matching via Zep**
```
[ ] Implement Zep vector search
    - Query: user's quest embedding
    - Return: job descriptions with semantic similarity
    - Filter by service keywords
    - Filter by pledge constraints (availability/rate)
[ ] Enhance lib/trinity-matching.ts
    - Use Zep for quest/service dimension
    - Use Neon for pledge dimension
    - Combine scores with 40/35/25 weighting
```

**Day 14: Match Caching & Performance**
```
[ ] Create trinity_matches cache table
[ ] Implement caching strategy
    - Cache matches for 1 hour
    - Cache invalidates on new jobs added
    - Cache invalidates on Trinity refinement
[ ] Optimize database queries
    - Index on (user_id, created_at)
    - Index on job Trinity keywords
    - Query cost analysis
```

**Day 15: Network Effects (Hidden)**
```
[ ] Create TRINITY tab content (sidebar)
    - Visual Trinity graph (3 nodes: quest/service/pledge)
    - Show distribution of users in network (hidden for now)
    - Preview feature: "Premium unlocks network discovery"
[ ] Prepare Zep graph analytics
    - Most common quests in network
    - Strongest service combinations
    - Network growth metrics
```

**End of Phase 3**: Trinity atom network growing, semantic matching working

---

### PHASE 4: Monetization & Polish (Days 16-20)

**Goal**: Revenue-ready platform with subscriptions, placements, job applications

**Day 16: User Authentication & Profiles**
```
[ ] Implement Stack Auth login
    - Create users table
    - Link Trinity profiles to Stack Auth users
    - Store Stack Auth session + JWT
[ ] Create app/profile/page.tsx
    - User dashboard
    - Trinity profile (display + edit)
    - Application history
    - Subscription status
```

**Day 17: Premium Subscriptions**
```
[ ] Integrate Stripe
    - Create Stripe customer on signup
    - Product setup: Premium subscription (£30/month)
[ ] Create app/pricing/page.tsx
    - Free tier: 1 Trinity conversation, email results
    - Premium tier: Unlimited conversations, network visibility, saved searches
[ ] Create app/api/subscription/route.ts
    - Webhook handler for Stripe events
    - Update user subscription status in Neon
    - Premium feature gating
```

**Day 18: Job Applications & Placement Tracking**
```
[ ] Create app/api/apply/route.ts
    - Store application in Neon (applications table)
    - Send email to employer
    - Track application status in REPO tab
[ ] Create components/ApplicationStatus.tsx
    - Show submitted, viewed, shortlisted, rejected
    - Timeline view with employer updates
[ ] Implement placement fee tracking
    - When hired, confirm salary + days worked
    - Calculate 17.5% fee (or whatever % agreed)
    - Track revenue per placement
```

**Day 19: Employer Dashboard**
```
[ ] Create app/employers/dashboard.tsx
    - Employer login (separate from job seekers)
    - View candidates matching their job's Trinity
    - Trinity alignment scores for each candidate
    - Application review interface
    - Placement fee payment
[ ] Create app/api/employer/matches.ts
    - Query for candidates matching job Trinity
    - Rank by overall_score
    - Filter by pledge fit (availability/location)
[ ] Analytics for employers
    - View count per job
    - Application count
    - Placement success rate
```

**Day 20: Performance, Polish & Launch**
```
[ ] Performance optimization
    - Claude API response caching (for common questions)
    - Zep graph query optimization
    - Database query profiling + indexing
[ ] Error handling & edge cases
    - Incomplete Trinity profiles
    - No matching jobs found
    - API rate limiting
    - Network failures
[ ] Analytics setup
    - Mixpanel: Track conversation funnel
    - How many users complete quest/service/pledge?
    - How many convert to premium?
    - Placement fee tracking
[ ] Documentation & deployment
    - API documentation
    - Database schema documentation
    - Deployment checklist
    - Monitoring setup (error tracking, performance)
[ ] Final testing
    - End-to-end user flow
    - Employer flow
    - Payment flow
    - Error scenarios
```

**End of Phase 4**: Revenue-ready platform, ready to scale

---

## V. REVENUE MODEL

### Three Revenue Streams

**Stream 1: Premium Subscriptions** (Highest Margin)
- **Price**: £30/month (basic), £50/month (premium)
- **Features**:
  - Unlimited Trinity conversations
  - Network visibility (see other professionals in your Trinity)
  - Saved matches + alerts
  - Trinity refinement tools
- **Target**: Fractional professionals seeking ongoing engagement
- **Forecast Year 1**: 100-500 subscribers × £30-50 = £36k-300k ARR

**Stream 2: Placement Fees** (Highest Revenue)
- **Fee**: 15-20% of first-year contract value
- **Trigger**: Successful hire through fractional.quest
- **Process**: Employer confirms hire + salary → platform calculates fee
- **Example**: £30k contract × 17.5% = £5.25k revenue per placement
- **Forecast Year 1**: 12-50 placements × £30k × 17.5% = £63k-438k ARR

**Stream 3: Employer Job Listings** (Easy to implement)
- **Price**: £500 for 30-day listing
- **Features**: Trinity-powered candidate matching, analytics, application dashboard
- **Target**: Companies hiring fractional roles
- **Forecast Year 1**: 20-100 listings × £500 = £10k-50k ARR

**Total Projected Year 1 Revenue**: £109k-788k (depending on conversion rates)

**Target Year 2**: £2-5M (with network effects + placement volume)

---

## VI. COMPETITIVE POSITIONING

### Why Trinity Wins

| Competitor | Weakness | Trinity Advantage |
|------------|----------|-------------------|
| **LinkedIn** | Skill-based (commoditized) | Purpose-aligned (differentiated) |
| **Indeed** | Job board mentality | Conversational discovery |
| **Toptal** | Gatekept + expensive (30-40% fee) | Open network + lower fees (17.5%) |
| **Maven/TrueUp** | Form-based applications | AI-driven conversation |
| **ChatGPT** | No fractional expertise | Focused domain + Trinity framework |

### Defensibility
1. **Trinity dataset** grows proprietary with each conversation
2. **Zep graph** gets smarter as network grows
3. **Conversion lock-in** - users invested in Trinity profile
4. **Network effects** - more matches improve for everyone
5. **Brand** - "Trinity" becomes synonymous with purpose-driven work

---

## VII. SUCCESS METRICS (90 Days)

### Awareness
- [ ] 2k+ monthly visitors (organic from Google)
- [ ] 100+ LinkedIn mentions/shares
- [ ] 10+ newsletter subscribers

### Engagement
- [ ] 200+ completed Trinity conversations
- [ ] 50%+ conversation-to-results rate
- [ ] Avg. conversation time: 8-12 minutes
- [ ] 3+ conversations per premium user/month

### Conversion
- [ ] 5% of conversationalists → premium subscription
- [ ] 2+ placements (£30k contracts × 17.5% = £10.5k revenue)
- [ ] 10+ employer listings (£500 × 10 = £5k revenue)

### Business
- [ ] MRR: £1,000-2,000 (subscriptions + listings)
- [ ] CAC: < £50 (organic only)
- [ ] LTV: > £500 (subscriptions + placements)
- [ ] Burn rate: < £3k/month (2 devs + cloud)

---

## VIII. TECHNICAL REQUIREMENTS CHECKLIST

### Must-Have (MVP)
- [x] Next.js 15 + TypeScript
- [ ] Trinity chat UI (minimal sidebar + conversation)
- [ ] Claude Sonnet 4.5 integration with streaming
- [ ] Trinity extraction (quest → service → pledge)
- [x] Neon database (existing jobs + new Trinity tables)
- [ ] Job matching algorithm (simple version)
- [ ] Job application flow
- [ ] Stack Auth login
- [ ] Stripe subscription integration
- [ ] Vercel deployment

### Nice-to-Have (Phase 2+)
- [ ] Zep graph integration (after 500+ profiles)
- [ ] Employer dashboard
- [ ] Network features (premium tier)
- [ ] Email notifications
- [ ] Mobile app

### Not Building (Option B Excludes)
- ❌ Traditional job board (search + filter)
- ❌ SEO-optimized job listing pages
- ❌ Calculator integrations
- ❌ Articles/content pages
- ❌ Admin panel for job curation

---

## IX. GLOSSARY

- **Trinity**: User's professional identity (Quest + Service + Pledge)
- **Quest**: "What am I becoming?" (identity, purpose, direction)
- **Service**: "What do I contribute?" (skills, expertise, impact)
- **Pledge**: "What commitments do I make?" (hours, location, rate)
- **Trinity Atom**: Node in Zep graph representing a Trinity or professional
- **Trinity Alignment Score**: 0-100 score measuring job fit (40% quest, 35% service, 25% pledge)
- **Zep Graph**: Vector database storing Trinity atoms + relationships
- **Claude Sonnet 4.5**: AI model powering Trinity extraction + matching
- **Stack Auth**: User authentication layer
- **Stripe**: Payment processing for subscriptions + placement fees

---

## X. ENVIRONMENT VARIABLES NEEDED

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:...@ep-....aws.neon.tech/neondb

# AI
OPENAI_API_KEY=sk-...  (for Claude Sonnet via Anthropic)
ZEP_API_KEY=...        (for Zep Vector DB)

# Authentication
STACK_PROJECT_ID=...
STACK_CLIENT_KEY=...
STACK_SERVER_KEY=...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics
MIXPANEL_TOKEN=...
SEGMENT_WRITE_KEY=...

# Optional
REVALIDATE_SECRET=... (for ISR revalidation, can remove if no SEO)
```

---

## XI. CURRENT PROJECT STATUS

**Repository**: https://github.com/Londondannyboy/fresh-fractional
**Deployed To**: Vercel (fractional-quest-fresh-[random].vercel.app)
**Current Completion**: Phase 1 complete (Foundation)
**Ready For**: Phase 2 start (Trinity Conversational Core)

### Files to Keep/Leverage
```
✅ Next.js 15 app structure
✅ Tailwind CSS + purple theme (lib/globals.css)
✅ Neon database connection (lib/db.ts)
✅ TypeScript types (lib/types.ts)
✅ Component library (Button, Card, Badge, Input, etc.)
✅ Vercel deployment pipeline
```

### Files to Remove (Not Needed for Option B)
```
❌ app/fractionaljobsuk/page.tsx (traditional job board)
❌ app/articles/* (content pages)
❌ app/job/[slug]/ (individual job detail pages)
❌ components/JobBrief.tsx (AI job analysis)
❌ components/VideoPlayer.tsx (Mux integration)
❌ app/robots.ts (SEO robots)
❌ app/sitemap.ts (SEO sitemap)
❌ PROGRESS.md (old progress tracking)
```

### Files to Create (Trinity-Focused)
```
✨ app/discover/page.tsx (Trinity conversation interface)
✨ app/api/chat/route.ts (Claude API integration)
✨ app/api/match/route.ts (Job matching algorithm)
✨ app/api/subscription/route.ts (Stripe webhook)
✨ app/api/apply/route.ts (Job application tracking)
✨ app/profile/page.tsx (User dashboard)
✨ app/pricing/page.tsx (Premium tier pricing)
✨ app/employers/dashboard.tsx (Employer interface)
✨ components/TrinityChat.tsx (Main conversation UI)
✨ components/TrinityScore.tsx (Match visualization)
✨ components/JobMatch.tsx (Job card with Trinity scores)
✨ lib/trinity-matching.ts (Matching algorithm)
✨ lib/claude-client.ts (Claude API client)
✨ lib/zep-client.ts (Zep graph integration)
✨ lib/trinity-storage.ts (Profile persistence)
✨ prompts/trinity-extraction.md (Claude system prompt)
```

---

## XII. NEXT IMMEDIATE ACTIONS (Days 6-10)

**Priority 1 (Day 6)**
1. Remove job board pages (fractionaljobsuk, job/[slug], articles)
2. Create app/discover/page.tsx with minimal sidebar
3. Create components/TrinityChat.tsx
4. Commit: "feat: Trinity chat foundation"

**Priority 2 (Day 7)**
1. Create app/api/chat/route.ts with Claude Sonnet streaming
2. Create lib/claude-client.ts with Trinity extraction prompt
3. Wire up Trinity extraction for Quest stage
4. Test single conversation with Claude
5. Commit: "feat: Claude API integration + Trinity extraction"

**Priority 3 (Day 8-10)**
1. Add Service + Pledge extraction to Claude prompt
2. Create Neon tables (trinity_profiles, conversations)
3. Implement profile persistence
4. Connect to existing jobs database
5. Build basic matching algorithm
6. Commit: "feat: Trinity profile storage + job matching"

---

## FINAL NOTES

This is Option B: **Pure Trinity Focus**. No job board, no articles, no SEO pages. We're building a **differentiated conversational AI platform** focused on purpose-driven employment.

The architecture is proven (Next.js 15 + Neon + Claude), the team is ready (2 developers), and the timeline is aggressive but realistic (5 days to MVP).

**Core belief**: Purpose-aligned fractional work is better for professionals AND more valuable for employers. Trinity is the framework that unlocks this.

Let's build it.

---

**Document Version**: 2.0 (Option B Final)
**Last Updated**: Dec 11, 2025
**Next Review**: Day 10 (End of Phase 2)
**Approval**: Ready to proceed with Phase 2 implementation

