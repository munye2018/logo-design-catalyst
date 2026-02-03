

# Add Authentication & Cloud Sync

## Overview

This plan adds user authentication using Supabase with the following features:

1. **User Login/Signup**: Email/password authentication with a dedicated auth page
2. **Cloud Sync**: Store workout data, preferences, and progress in Supabase so it syncs across devices (web + mobile)
3. **Secure User Data**: Proper Row-Level Security (RLS) policies to protect user data

---

## Part 1: Supabase Setup

### Database Schema

Create the following tables to store user data in the cloud:

**Table: `user_profiles`**
Stores user fitness preferences (syncs with onboarding data)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| fitness_goal | text | muscle, weight-loss, strength, general |
| experience_level | text | beginner, intermediate, advanced |
| training_days | integer | 2-6 |
| equipment | text | full-gym, home-gym, minimal |
| created_at | timestamp | Account creation |
| updated_at | timestamp | Last profile update |

**Table: `workout_history`**
Stores completed workout sessions

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users |
| session_name | text | Name of the workout session |
| session_type | text | Type of session (push, pull, legs, etc.) |
| week_number | integer | Which week in the program |
| exercises | jsonb | Array of exercise details |
| total_volume | integer | Total volume (sets x reps x weight) |
| duration | integer | Session duration in minutes |
| completed_at | timestamp | When workout was completed |

**Table: `user_programs`**
Stores the generated training program

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users |
| program_data | jsonb | The full 8-week program |
| current_week | integer | Current week in program |
| completed_sessions | jsonb | Map of completed session keys |
| created_at | timestamp | When program was generated |

---

## Part 2: Authentication Flow

### New File: `src/integrations/supabase/client.ts`

Initialize Supabase client with project credentials.

### New File: `src/contexts/AuthContext.tsx`

Create an authentication context that:
- Manages user session state
- Provides login, signup, logout functions
- Handles auth state changes
- Loads user profile data on login

### New File: `src/pages/Auth.tsx`

A dedicated auth page with:
- Email/password login form
- Email/password signup form
- Toggle between login and signup modes
- Form validation with proper error handling
- Loading states during authentication
- Redirect to home after successful auth

---

## Part 3: Data Sync Layer

### New File: `src/lib/syncService.ts`

A service that syncs local data with Supabase:

```text
SYNC STRATEGY:
1. On login: Pull user data from Supabase, merge with local data
2. On data change: Push updates to Supabase (debounced)
3. On logout: Clear local data, keep cloud data
4. Offline support: Use localStorage as cache, sync when online
```

Key functions:
- `syncUserProfile()`: Sync fitness preferences
- `syncWorkoutHistory()`: Sync completed workouts
- `syncProgram()`: Sync current program and progress
- `pullFromCloud()`: Download all user data on login
- `pushToCloud()`: Upload changes to Supabase

### Modify: `src/context/GlobalContext.tsx`

Update to integrate with sync service:
- Add `user` state from auth context
- After profile changes, trigger cloud sync
- After workout completion, sync to cloud
- Load cloud data on initial auth

---

## Part 4: Protected Routes

### New File: `src/components/ProtectedRoute.tsx`

A wrapper component that:
- Checks if user is authenticated
- Redirects to /auth if not logged in
- Shows loading spinner while checking auth

### Modify: `src/App.tsx`

- Add `/auth` route
- Wrap relevant routes with ProtectedRoute
- Allow `/` to show either welcome or dashboard based on auth

---

## Part 5: UI Updates

### Modify: `src/pages/Index.tsx`

Add user profile section to header:
- Show user email or avatar
- Logout button
- Link to settings/profile

### Modify: `src/pages/Onboarding.tsx`

After completing onboarding:
- Save profile to Supabase if logged in
- Prompt login to sync data across devices

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/create_user_tables.sql` | Create | Database schema |
| `src/integrations/supabase/client.ts` | Create | Supabase client |
| `src/contexts/AuthContext.tsx` | Create | Auth state management |
| `src/pages/Auth.tsx` | Create | Login/signup page |
| `src/lib/syncService.ts` | Create | Cloud sync logic |
| `src/components/ProtectedRoute.tsx` | Create | Route protection |
| `src/context/GlobalContext.tsx` | Modify | Integrate sync |
| `src/App.tsx` | Modify | Add auth route |
| `src/pages/Index.tsx` | Modify | Add user UI |

---

## Security Considerations

1. **Row-Level Security (RLS)**: All tables will have RLS policies so users can only access their own data
2. **Input Validation**: Email and password validation on the auth form
3. **Secure Session Handling**: Using Supabase's built-in session management with proper token refresh
4. **No Sensitive Data in Console**: Production builds won't log auth details

---

## Sync Flow Diagram

```text
+-------------------+      +-------------------+      +-------------------+
|   Mobile App      |      |   Supabase Cloud  |      |   Web App         |
+-------------------+      +-------------------+      +-------------------+
        |                          |                          |
        |  Login (same account)    |                          |
        |------------------------->|                          |
        |                          |                          |
        |  Workout completed       |                          |
        |------------------------->|                          |
        |                          |                          |
        |                          |   Login (same account)   |
        |                          |<-------------------------|
        |                          |                          |
        |                          |   Pull workout history   |
        |                          |<-------------------------|
        |                          |                          |
        |                          |   Return synced data     |
        |                          |------------------------->|
        |                          |                          |
        v                          v                          v
     
User sees same workout history on both devices!
```

---

## Testing Checklist

After implementation:
- [ ] Can sign up with email/password
- [ ] Can login with existing account
- [ ] Profile data syncs to cloud after onboarding
- [ ] Workout history appears on both web and mobile
- [ ] Logging out clears local session
- [ ] Protected routes redirect to login
- [ ] Error messages display for invalid credentials

