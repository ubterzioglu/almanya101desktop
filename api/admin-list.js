// =====================================================
// API/ADMIN-LIST.JS
// Returns full lists for admin edit panel
// =====================================================

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_TABLES = new Set(['providers', 'gastronomy_providers']);

function getAdminKey(req) {
  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'] || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  return headerKey || bearer || '';
}

function getExpectedKey() {
  return (
    process.env.ADMIN_PANEL_KEY ||
    process.env.DIK_ADMIN_KEY ||
    process.env.BOOKMARKS_ADMIN_KEY ||
    ''
  );
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expectedKey = getExpectedKey();
  if (!expectedKey) {
    return res.status(500).json({ error: 'Admin key not configured' });
  }

  const providedKey = getAdminKey(req);
  if (providedKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const table = req.query.table;
  if (!ALLOWED_TABLES.has(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
