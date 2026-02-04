-- Add trial and subscription columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- Create rate_limits table for tracking API usage
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- RLS for rate_limits (service role only - users cannot access)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role only" ON rate_limits;

-- Create policy that blocks all user access (only service role can access)
CREATE POLICY "Service role only" ON rate_limits 
FOR ALL 
USING (false);