// =========================================================
// FILE: /api/_supabase-user.js
// PURPOSE: Verify Supabase access tokens on server-side
// =========================================================

function readBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim();
}

function getSupabaseAuthConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const projectApiKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';

  if (!supabaseUrl || !projectApiKey) return null;
  return { supabaseUrl, projectApiKey };
}

export async function getSupabaseUserFromRequest(req) {
  const token = readBearerToken(req);
  if (!token) return null;

  const cfg = getSupabaseAuthConfig();
  if (!cfg) return null;

  try {
    const response = await fetch(`${cfg.supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        apikey: cfg.projectApiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;
    const user = await response.json().catch(() => null);
    if (!user || !user.id || !user.email) return null;
    return { token, user };
  } catch {
    return null;
  }
}
