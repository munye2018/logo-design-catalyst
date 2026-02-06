
# Subscription Flow Testing & Enhancement Plan

## Overview

This plan covers:
1. Testing the subscription flow end-to-end
2. Adding a "Manage Subscription" button for active subscribers
3. Updating the trial banner to show hours instead of days
4. Changing the trial period from 30 days to 24 hours

---

## Part 1: Test Subscription Flow

### Manual Testing Steps

Before making changes, verify the existing implementation works:

1. **Open the app and sign in** (or create an account)
2. **Navigate to the Index page** - The TrialBanner should appear
3. **Click "Upgrade"** on the banner or open the UpgradeModal
4. **Click "Subscribe Now"** - Should redirect to Stripe Checkout in a new tab
5. **Complete a test payment** using Stripe test card `4242 4242 4242 4242`
6. **Verify redirect** to `/subscription-success` page
7. **Confirm subscription status** updates and trial banner disappears

---

## Part 2: Add Manage Subscription Button

### Location Strategy

The "Manage Subscription" button will be added:
- In the **Index.tsx** header area for active subscribers
- Calls the existing `customer-portal` edge function
- Opens Stripe Customer Portal in a new tab

### Files to Modify

**`src/pages/Index.tsx`**
- Add a "Manage Subscription" button next to the user info
- Only show when `trialStatus.status === 'active'`
- Add loading state and error handling for portal creation

```text
Header Layout (for subscribers):
[Aurora Logo] [user@email.com] [Manage Subscription] [Sign Out] [View Program]
```

---

## Part 3: Update Trial Banner for Hours

### Current Behavior
- Shows "X days remaining"
- Uses `daysRemaining` from TrialStatus

### New Behavior
- Show "X hours remaining" when under 24 hours
- Show "Less than 1 hour remaining" when very close to expiration
- Update the banner styling for urgency

### Files to Modify

**`src/components/TrialBanner.tsx`**
- Add `hoursRemaining` calculation from TrialStatus
- Update display logic:
  - If hoursRemaining < 24: show hours
  - If hoursRemaining < 1: show "Less than 1 hour"
  - Show amber/warning styling when low

---

## Part 4: Change Trial Period to 24 Hours

### Current Implementation
- Trial period is 30 days (hardcoded)
- Calculated in `calculateTrialStatus()` function
- Uses `diffDays` for calculation

### New Implementation
- Change trial period to 24 hours
- Update TrialStatus interface to include `hoursRemaining`
- Calculate time difference in hours instead of days
- Update UI to reflect hours-based trial

### Files to Modify

**`src/contexts/AuthContext.tsx`**

```text
Changes to TrialStatus interface:
- Add hoursRemaining: number
- Keep daysRemaining for backward compatibility (can be 0 or 1)

Changes to calculateTrialStatus():
- Calculate diffHours instead of diffDays
- Trial expires after 24 hours (not 30 days)
- Return hoursRemaining for display
```

**Constants update:**
```text
TRIAL_DURATION_HOURS = 24
```

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/Index.tsx` | Modify | Add Manage Subscription button |
| `src/components/TrialBanner.tsx` | Modify | Show hours instead of days, update messaging |
| `src/contexts/AuthContext.tsx` | Modify | Change trial to 24 hours, add hoursRemaining |

---

## Technical Details

### Updated TrialStatus Interface

```typescript
interface TrialStatus {
  status: 'trial' | 'active' | 'expired';
  daysRemaining: number;      // Keep for compatibility
  hoursRemaining: number;     // New - for hours-based display
  trialStartDate: Date | null;
  subscriptionEnd: Date | null;
}
```

### Updated calculateTrialStatus Function

```typescript
function calculateTrialStatus(trialStartDate: string | null): TrialStatus {
  const TRIAL_DURATION_HOURS = 24;
  
  if (!trialStartDate) {
    return { 
      status: 'trial', 
      daysRemaining: 1, 
      hoursRemaining: TRIAL_DURATION_HOURS,
      trialStartDate: null, 
      subscriptionEnd: null 
    };
  }

  const startDate = new Date(trialStartDate);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const hoursRemaining = Math.max(0, TRIAL_DURATION_HOURS - diffHours);
  const daysRemaining = Math.ceil(hoursRemaining / 24);

  return {
    status: hoursRemaining > 0 ? 'trial' : 'expired',
    daysRemaining,
    hoursRemaining,
    trialStartDate: startDate,
    subscriptionEnd: null,
  };
}
```

### Manage Subscription Handler

```typescript
const handleManageSubscription = async () => {
  setIsManaging(true);
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (error) throw error;
    if (data?.url) window.open(data.url, '_blank');
  } catch (err) {
    console.error('Failed to open portal:', err);
  } finally {
    setIsManaging(false);
  }
};
```

---

## User Experience Flow

```text
New User Signs Up:
+------------------+     +-------------------+     +------------------+
|  Create Account  | --> |  24-Hour Trial    | --> |  Trial Expires   |
|                  |     |  "23 hours left"  |     |  Must Subscribe  |
+------------------+     +-------------------+     +------------------+

Active Subscriber:
+------------------+     +-------------------+
|  User Dashboard  | --> |  Manage Button    | --> Stripe Portal
|  No trial banner |     |  (in header)      |
+------------------+     +-------------------+
```

---

## Testing Checklist

After implementation:
- [ ] Subscribe Now button redirects to Stripe Checkout
- [ ] Successful payment shows success page and updates status
- [ ] Trial banner shows hours remaining (not days)
- [ ] Trial expires after 24 hours for new users
- [ ] Manage Subscription button appears for active subscribers
- [ ] Manage Subscription opens Stripe Customer Portal
- [ ] Trial banner disappears for active subscribers
