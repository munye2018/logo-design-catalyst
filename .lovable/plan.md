
# Stripe Subscription Integration Plan

## Overview

This plan adds real Stripe payment processing to the UpgradeModal, allowing users to subscribe to Aurora Premium ($9.99/month) after their 30-day trial ends.

---

## Part 1: Create Stripe Product & Price

Create a new Stripe product specifically for Aurora:

**Product:** Aurora Premium  
**Price:** $9.99/month (recurring)  
**Features:** Unlimited workouts, AI form analysis, personalized programs, progress tracking

---

## Part 2: Edge Functions

### New Function: `create-checkout`

Creates a Stripe Checkout session for the subscription:

```text
Flow:
1. Authenticate user via JWT
2. Check if Stripe customer exists (by email)
3. Create checkout session with:
   - mode: "subscription"
   - price: Aurora Premium price ID
   - success_url: /subscription-success
   - cancel_url: / (home)
4. Return session URL
```

### New Function: `check-subscription`

Verifies if a user has an active Stripe subscription:

```text
Flow:
1. Authenticate user via JWT
2. Find Stripe customer by email
3. Check for active subscriptions
4. Return { subscribed, subscription_end }
```

### New Function: `customer-portal`

Opens Stripe Customer Portal for subscription management:

```text
Flow:
1. Authenticate user
2. Find Stripe customer
3. Create portal session
4. Return portal URL
```

---

## Part 3: Frontend Integration

### Modify: `src/components/UpgradeModal.tsx`

Update the Subscribe button to:
1. Show loading state during checkout creation
2. Call `create-checkout` edge function
3. Redirect to Stripe Checkout URL
4. Handle errors gracefully

### Modify: `src/contexts/AuthContext.tsx`

Add subscription checking:
1. Call `check-subscription` on login and page load
2. Add `checkSubscription()` function to context
3. If user has active subscription, set trial status to 'active'
4. Refresh subscription status periodically (every 60 seconds)

### New Page: `src/pages/SubscriptionSuccess.tsx`

Success page after checkout:
1. Show success message
2. Trigger subscription check
3. Redirect to home after 3 seconds

### Modify: `src/App.tsx`

- Add `/subscription-success` route

---

## Part 4: Config Updates

### Modify: `supabase/config.toml`

Add new edge functions:

```toml
[functions.create-checkout]
verify_jwt = false

[functions.check-subscription]
verify_jwt = false

[functions.customer-portal]
verify_jwt = false
```

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| Stripe Product & Price | Create | Aurora Premium $9.99/mo |
| `supabase/functions/create-checkout/index.ts` | Create | Checkout session creation |
| `supabase/functions/check-subscription/index.ts` | Create | Subscription verification |
| `supabase/functions/customer-portal/index.ts` | Create | Manage subscription |
| `src/components/UpgradeModal.tsx` | Modify | Real Stripe checkout |
| `src/contexts/AuthContext.tsx` | Modify | Subscription state |
| `src/pages/SubscriptionSuccess.tsx` | Create | Post-checkout page |
| `src/App.tsx` | Modify | Add success route |
| `supabase/config.toml` | Modify | Edge function config |

---

## User Flow

```text
+------------------+     +-------------------+     +------------------+
|   Trial Expires  | --> |   Upgrade Modal   | --> |  Stripe Checkout |
|   or User Clicks |     |   Subscribe Now   |     |   (hosted page)  |
+------------------+     +-------------------+     +------------------+
                                                           |
                                                           v
+------------------+     +-------------------+     +------------------+
|    Full Access   | <-- |   check-sub runs  | <-- |  Success Page    |
|    Unlocked      |     |   status: active  |     |  Redirect home   |
+------------------+     +-------------------+     +------------------+
```

---

## Subscription Management

After subscribing, users can manage their subscription via Stripe Customer Portal:

- View subscription details
- Update payment method
- Cancel subscription
- View billing history

A "Manage Subscription" button will be added to the user profile section.

---

## Testing Checklist

After implementation:
- [ ] Click "Subscribe Now" redirects to Stripe Checkout
- [ ] Completing payment shows success page
- [ ] User gains full access after payment
- [ ] Trial banner disappears for active subscribers
- [ ] Manage Subscription opens Stripe portal
- [ ] Subscription status persists across page refreshes
