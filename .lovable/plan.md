
# Stripe Subscription Integration Plan

## Overview

This plan adds real Stripe payment processing to the UpgradeModal, allowing users to subscribe to Aurora Premium ($5/month) after their 30-day trial ends.

---

## Part 1: Create Stripe Product & Price ✅

Created Aurora Premium in Stripe:

**Product ID:** prod_TvT18QEWqzOF5R  
**Price ID:** price_1Sxc52FKBHwNpuXdM8faMa9W  
**Price:** $5/month (recurring)  
**Features:** Unlimited workouts, AI form analysis, personalized programs, progress tracking

---

## Part 2: Edge Functions ✅

### `create-checkout` ✅
Creates a Stripe Checkout session for the subscription.

### `check-subscription` ✅
Verifies if a user has an active Stripe subscription.

### `customer-portal` ✅
Opens Stripe Customer Portal for subscription management.

---

## Part 3: Frontend Integration ✅

### `src/components/UpgradeModal.tsx` ✅
- Shows loading state during checkout creation
- Calls `create-checkout` edge function
- Opens Stripe Checkout in new tab
- Handles errors gracefully
- Updated price to $5/month

### `src/contexts/AuthContext.tsx` ✅
- Added `checkSubscription()` function to context
- Checks subscription on login and page load
- Auto-refreshes every 60 seconds
- If user has active subscription, sets trial status to 'active'

### `src/pages/SubscriptionSuccess.tsx` ✅
- Shows success message
- Triggers subscription check
- Redirects to home after 3 seconds

### `src/App.tsx` ✅
- Added `/subscription-success` route

---

## Part 4: Config Updates ✅

### `supabase/config.toml` ✅
Added new edge functions configuration.

---

## Testing Checklist

After implementation:
- [ ] Click "Subscribe Now" redirects to Stripe Checkout
- [ ] Completing payment shows success page
- [ ] User gains full access after payment
- [ ] Trial banner disappears for active subscribers
- [ ] Manage Subscription opens Stripe portal
- [ ] Subscription status persists across page refreshes
