import { Hono } from 'hono';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const app = new Hono();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limit configuration per endpoint
const RATE_LIMITS: Record<string, { requests: number; windowMs: number }> = {
  'sync-profile': { requests: 10, windowMs: 60000 },
  'sync-workout': { requests: 30, windowMs: 60000 },
  'sync-program': { requests: 10, windowMs: 60000 },
  'pull-data': { requests: 20, windowMs: 60000 },
  'default': { requests: 100, windowMs: 60000 },
};

interface RateLimitRecord {
  user_id: string;
  endpoint: string;
  request_count: number;
  window_start: string;
}

async function checkRateLimit(
  supabaseAdmin: SupabaseClient<any, any, any>,
  userId: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const limits = RATE_LIMITS[endpoint] || RATE_LIMITS['default'];
  const now = Date.now();

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .single() as { data: RateLimitRecord | null; error: any };

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching rate limit:', fetchError);
    return { allowed: true, remaining: limits.requests, resetAt: now + limits.windowMs };
  }

  if (!existing) {
    await supabaseAdmin.from('rate_limits').insert({
      user_id: userId,
      endpoint,
      request_count: 1,
      window_start: new Date().toISOString(),
    } as any);

    return { allowed: true, remaining: limits.requests - 1, resetAt: now + limits.windowMs };
  }

  const windowStart = new Date(existing.window_start).getTime();
  const windowEnd = windowStart + limits.windowMs;

  if (now > windowEnd) {
    await supabaseAdmin
      .from('rate_limits')
      .update({ request_count: 1, window_start: new Date().toISOString() } as any)
      .eq('user_id', userId)
      .eq('endpoint', endpoint);

    return { allowed: true, remaining: limits.requests - 1, resetAt: now + limits.windowMs };
  }

  if (existing.request_count >= limits.requests) {
    return { allowed: false, remaining: 0, resetAt: windowEnd };
  }

  await supabaseAdmin
    .from('rate_limits')
    .update({ request_count: existing.request_count + 1 } as any)
    .eq('user_id', userId)
    .eq('endpoint', endpoint);

  return { allowed: true, remaining: limits.requests - existing.request_count - 1, resetAt: windowEnd };
}

// Handle CORS preflight
app.options('/*', (c) => {
  return new Response('ok', { headers: corsHeaders });
});

// Health check
app.get('/api-gateway/health', (c) => c.json({ status: 'ok' }, 200, corsHeaders));
app.get('/health', (c) => c.json({ status: 'ok' }, 200, corsHeaders));
app.get('/', (c) => c.json({ status: 'ok', service: 'api-gateway' }, 200, corsHeaders));

// Rate limit check handler
async function handleRateLimitCheck(c: any) {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseUser.auth.getUser(token);
    
    if (authError || !claimsData?.user) {
      return c.json({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    const userId = claimsData.user.id;
    const body = await c.req.json();
    const endpoint = body.endpoint || 'default';

    console.log(`Rate limit check for user ${userId} on endpoint ${endpoint}`);

    const result = await checkRateLimit(supabaseAdmin, userId, endpoint);

    if (!result.allowed) {
      console.log(`Rate limit exceeded for user ${userId} on endpoint ${endpoint}`);
      return c.json(
        { error: 'Too many requests', remaining: result.remaining, resetAt: result.resetAt }, 
        429, 
        { ...corsHeaders, 'X-RateLimit-Remaining': result.remaining.toString(), 'X-RateLimit-Reset': result.resetAt.toString() }
      );
    }

    return c.json(
      { allowed: true, remaining: result.remaining, resetAt: result.resetAt }, 
      200, 
      { ...corsHeaders, 'X-RateLimit-Remaining': result.remaining.toString(), 'X-RateLimit-Reset': result.resetAt.toString() }
    );
  } catch (error) {
    console.error('Rate limit check error:', error);
    return c.json({ error: 'Internal server error' }, 500, corsHeaders);
  }
}

// Multiple routes for rate limit check
app.post('/api-gateway/check', handleRateLimitCheck);
app.post('/check', handleRateLimitCheck);
app.post('/', handleRateLimitCheck);

Deno.serve(app.fetch);
