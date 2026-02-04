

# Feature Implementation Plan

## Overview

This plan covers four major features:
1. **Google Sign-In** - Add social login option
2. **Cloud Sync Testing** - Verify data syncs after onboarding  
3. **Rate Limiting** - Protect user endpoints from abuse
4. **30-Day Free Trial** - Implement trial period with paywall

---

## Part 1: Google Sign-In

### What Changes

Add a "Sign in with Google" button alongside the existing email/password form on the Auth page.

### Technical Implementation

**Configure Google OAuth:**
Use the built-in Lovable Cloud managed Google OAuth (no API keys needed from you).

**Modify: `src/contexts/AuthContext.tsx`**
- Add `signInWithGoogle()` function using `lovable.auth.signInWithOAuth("google", ...)`
- The managed Google OAuth handles all the complexity automatically

**Modify: `src/pages/Auth.tsx`**
- Add Google sign-in button with Google icon
- Handle OAuth callback and redirect

**New File: `src/integrations/lovable/index.ts`** (auto-generated)
- Lovable Cloud auth module for social login

```text
UI Design:
+-----------------------------------+
|        Welcome Back               |
|        Sign in to Aurora          |
|                                   |
|  [  G  Continue with Google  ]    |
|                                   |
|  ─────── or ───────               |
|                                   |
|  Email: [________________]        |
|  Password: [________________]     |
|                                   |
|  [      Sign In          ]        |
+-----------------------------------+
```

---

## Part 2: Rate Limiting on User Endpoints

### Why Rate Limiting?

Prevents abuse, protects against:
- Brute force login attempts
- API spam/DoS attacks
- Resource exhaustion

### Technical Implementation

**New Edge Function: `supabase/functions/rate-limiter/index.ts`**

A reusable rate limiting service using in-memory storage (with Redis-like pattern):

```text
Rate Limit Strategy:
- Auth endpoints: 5 attempts per 15 minutes per IP
- Profile sync: 10 requests per minute per user
- Workout sync: 30 requests per minute per user
- General API: 100 requests per minute per user
```

**Implementation Approach:**

Since this is a fitness app with sync endpoints, we'll implement rate limiting directly in the sync service calls:

1. Create a rate-limit edge function that acts as a gateway
2. Track requests by user ID + endpoint
3. Return 429 (Too Many Requests) when limits exceeded

**New File: `supabase/functions/api-gateway/index.ts`**

An edge function that wraps database operations with rate limiting:

```typescript
// Rate limit configuration
const RATE_LIMITS = {
  'sync-profile': { requests: 10, windowMs: 60000 },
  'sync-workout': { requests: 30, windowMs: 60000 },
  'sync-program': { requests: 10, windowMs: 60000 },
};
```

**Database Table: `rate_limits`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User identifier |
| endpoint | text | API endpoint key |
| request_count | integer | Current request count |
| window_start | timestamp | Window start time |

---

## Part 3: 30-Day Free Trial

### How It Works

1. When a user signs up, record their `trial_start_date`
2. Allow full access for 30 days
3. After 30 days, show upgrade prompt and limit features
4. Free tier limitations: Can view program, cannot start new sessions

### Database Changes

**Modify `user_profiles` table:**

Add columns:
- `trial_start_date`: timestamp (set on first login)
- `subscription_status`: text ('trial' | 'active' | 'expired')
- `subscription_expires_at`: timestamp (nullable)

### Technical Implementation

**Modify: `src/contexts/AuthContext.tsx`**

- After successful login, check/set trial start date
- Calculate days remaining
- Expose `trialDaysRemaining` and `isTrialExpired` to context

**New Component: `src/components/TrialBanner.tsx`**

Shows remaining trial days or upgrade prompt:

```text
Trial Active (23 days left):
+-------------------------------------------+
| Free Trial: 23 days remaining             |
| Upgrade now for unlimited access →        |
+-------------------------------------------+

Trial Expired:
+-------------------------------------------+
| Your free trial has ended                 |
| [Upgrade to Premium] to continue training |
+-------------------------------------------+
```

**Modify: `src/pages/Index.tsx` and `src/pages/Session.tsx`**

- Check trial status before allowing session start
- Show upgrade modal if trial expired

**New Component: `src/components/UpgradeModal.tsx`**

Modal explaining premium features and payment options (placeholder for Stripe integration later)

### Trial Status Logic

```typescript
const getTrialStatus = (trialStartDate: Date | null) => {
  if (!trialStartDate) return { status: 'trial', daysRemaining: 30 };
  
  const now = new Date();
  const diffMs = now.getTime() - trialStartDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 30 - diffDays);
  
  return {
    status: daysRemaining > 0 ? 'trial' : 'expired',
    daysRemaining,
  };
};
```

---

## Part 4: Customizable Workout Plans

### Current State

The program generator already creates personalized 8-week plans based on:
- Fitness goal (muscle, weight-loss, strength, general)
- Experience level (beginner, intermediate, advanced)
- Training days (2-6 per week)
- Equipment available (full-gym, home-gym, minimal)

### Enhancements

**1. Exercise Swapping:**

Allow users to swap exercises within a session for alternatives that target the same muscle group.

**New Component: `src/components/ExerciseSwapModal.tsx`**

- Shows alternative exercises for the same muscle
- Filters by user's available equipment
- Persists swap to user's program

**2. Volume Adjustment:**

Allow users to adjust sets/reps per exercise based on preference.

**Modify: `src/pages/Session.tsx`**

- Add edit button on each exercise
- Allow modifying sets and reps
- Save to exerciseLogs with custom values

**3. Rest Day Flexibility:**

Allow users to rearrange which days are rest days.

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/integrations/lovable/index.ts` | Create (auto) | Lovable Cloud auth |
| `src/contexts/AuthContext.tsx` | Modify | Add Google sign-in, trial tracking |
| `src/pages/Auth.tsx` | Modify | Add Google button |
| `supabase/functions/api-gateway/index.ts` | Create | Rate limiting gateway |
| `src/components/TrialBanner.tsx` | Create | Trial status display |
| `src/components/UpgradeModal.tsx` | Create | Upgrade prompt |
| `src/components/ExerciseSwapModal.tsx` | Create | Exercise alternatives |
| `src/pages/Index.tsx` | Modify | Add trial banner, check expiry |
| `src/pages/Session.tsx` | Modify | Block expired trials, add swap |
| `src/lib/syncService.ts` | Modify | Add rate limit headers |
| Database migration | Create | Add trial columns |

---

## Database Migration

```sql
-- Add trial and subscription columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN trial_start_date TIMESTAMPTZ DEFAULT now(),
ADD COLUMN subscription_status TEXT DEFAULT 'trial',
ADD COLUMN subscription_expires_at TIMESTAMPTZ;

-- Create rate_limits table for tracking API usage
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- RLS for rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON rate_limits FOR ALL USING (false);
```

---

## Implementation Order

1. **Google Sign-In** - Configure OAuth, update Auth page
2. **Database Migration** - Add trial columns
3. **Trial System** - Implement trial tracking and banners
4. **Rate Limiting** - Create edge function gateway
5. **Exercise Customization** - Add swap and edit features
6. **Cloud Sync Testing** - Verify end-to-end sync works

---

## Testing Checklist

After implementation:
- [ ] Can sign in with Google
- [ ] New users get 30-day trial countdown
- [ ] Trial banner shows days remaining
- [ ] Expired trial blocks session start
- [ ] Rate limiting returns 429 on excess requests
- [ ] Can swap exercises for alternatives
- [ ] Program syncs to cloud after onboarding
- [ ] Data persists across logout/login

