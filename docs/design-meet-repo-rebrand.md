# Design Phase: "Meet Repo" Rebrand

## Overview

Transform the brand experience around "Repo" - the friendly AI career companion. Move from abstract platform to personified assistant that users build a relationship with.

---

## Brand Personality: Repo

**Who is Repo?**
- Your best job search buddy
- Warm, curious, remembers everything about your career
- Always building your personal career repository
- Speaks naturally, asks good questions, genuinely cares

**Tone:**
- Friendly but professional
- British understated humor (not cheesy American enthusiasm)
- Competent without being robotic
- Remembers past conversations and builds on them

---

## Homepage Changes

### Hero Section

**Current:** Generic platform messaging
**New:** "Meet Repo" introduction

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      Meet Repo                                  │
│           Your fractional career companion                      │
│                                                                 │
│     [Repo character/avatar - friendly, approachable]            │
│                                                                 │
│     "Tell me about your career and I'll find roles             │
│      that actually fit. No endless scrolling required."         │
│                                                                 │
│              [Talk to Repo]  [Browse Jobs]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Value Props (with Repo framing)

1. **"Repo remembers"** - Your preferences, skills, and goals in one place
2. **"Repo searches"** - Live database of UK fractional roles
3. **"Repo learns"** - Gets smarter about what you want over time

### Social Proof Section

```
"Repo found me a CFO role in fintech within a week.
It remembered I wanted 2 days remote." - Sarah, Fractional CFO
```

---

## Repo Character Design

### Options to Consider

**Option A: Abstract Symbol**
- Simple, geometric mark
- Could be animated (pulsing, responding)
- Examples: ChatGPT dot, Notion's sparkle

**Option B: Friendly Avatar**
- Character face/figure
- Not too cartoonish, professional-ish
- Could show expressions (listening, thinking, excited)

**Option C: Word Mark + Motion**
- "Repo" text that animates
- Sound wave effect when speaking
- Typing indicator when thinking

**Recommendation:** Start with Option A (abstract) with Option C elements (motion when speaking). Can evolve to avatar later if it fits.

---

## Page-by-Page Updates

### Homepage (`/`)
- [ ] "Meet Repo" hero section
- [ ] Repo character/logo
- [ ] Updated value props with Repo framing
- [ ] "Talk to Repo" primary CTA
- [ ] Testimonials mentioning Repo

### Your Repo Page (`/repo`)
- [ ] "Hi [Name], let's build your Repo" intro
- [ ] Repo speaking/listening state visuals
- [ ] "Repo is thinking..." indicator
- [ ] Preference cards showing what Repo learned
- [ ] "Repo found X jobs matching your Repo" panel

### Jobs Page (`/fractionaljobsuk`)
- [ ] "Repo recommends" section based on preferences
- [ ] "Tell Repo what you're looking for" CTA
- [ ] Personalized job cards if logged in

### Chat Page (`/chat`)
- [ ] Repo avatar in chat bubbles
- [ ] "Repo" label instead of "Assistant"
- [ ] Typing indicator: "Repo is typing..."

---

## Copy Updates

### Navigation
- "My Repo" instead of "Profile" or "Dashboard"
- "Talk to Repo" instead of "Voice" or "Assistant"

### CTAs
- "Build your Repo" (sign up)
- "Talk to Repo" (start conversation)
- "Let Repo search" (job search)
- "Add to your Repo" (save preference)

### Status Messages
- "Repo is listening..."
- "Repo is searching..."
- "Repo found 5 roles"
- "Added to your Repo"

### Empty States
- "Your Repo is empty. Tell Repo about yourself to get started."
- "Repo hasn't found any matches yet. Try being more specific."

---

## Animation/Motion Ideas

### Repo Speaking State
- Subtle sound wave animation
- Pulsing circle
- Color shift (purple → warmer)

### Repo Listening State
- Steady glow
- Microphone icon with activity
- "Repo is listening..." text

### Repo Thinking State
- Three dots animation
- Spinning/searching motion
- "Repo is searching..." text

### Validation Cards
- Slide in from bottom
- Fade as they auto-save
- Check mark animation on confirm

---

## Color Associations

**Repo Speaking:** Purple (#7C3AED) - the brand color
**Repo Listening:** Softer purple with glow
**Validation Pending:** Green-ish (#10B981)
**Validated/Confirmed:** Solid green with check
**Soft/Unvalidated:** Amber/yellow tint

---

## Mobile Considerations

- Repo character should work at small sizes
- Voice button is primary interaction
- Validation cards should be thumb-reachable
- Minimal text, more visual feedback
- "Tap to talk to Repo" for accessibility

---

## Implementation Phases

### Phase 1: Core Rebrand (1-2 days)
- [ ] Update all "Quest" → "Repo" references
- [ ] Homepage hero section
- [ ] /repo page updates
- [ ] Basic status message copy

### Phase 2: Character Design (3-5 days)
- [ ] Design Repo mark/avatar
- [ ] Create speaking/listening animations
- [ ] Implement across pages
- [ ] Favicon update

### Phase 3: Full Experience (1 week)
- [ ] Testimonials with Repo mentions
- [ ] Empty states
- [ ] Onboarding flow with Repo intro
- [ ] Email templates featuring Repo

---

## Open Questions

1. **Voice:** Should Repo have a specific voice setting in Hume? (currently using default)

2. **Gender:** Is Repo gendered? Probably keep neutral.

3. **Fallback:** What happens when voice doesn't work? Text chat with Repo?

4. **Character evolution:** Should Repo "level up" as it learns more about you?

---

## Success Metrics

- **Engagement:** Do users talk to Repo more?
- **Retention:** Do users come back to "check on Repo"?
- **Completion:** Do users build fuller Repos?
- **NPS:** Do users like/recommend Repo?

---

## References

- **Duolingo:** Duo character creates emotional connection
- **Notion AI:** Subtle sparkle, professional but friendly
- **Perplexity:** Clean, competent, no character but personality in copy
- **Woebot:** Mental health chatbot with character (too cute for us)

Target: Somewhere between Notion AI and Perplexity - professional but personable.
