import { createClient } from '@supabase/supabase-js';

const MARKER = '[DEVUSER_DIS_V1]';
const APPROVED_RAW_STATUSES = ['read', 'reviewed', 'resolved', 'approved'];

function repairText(input) {
  const value = String(input || '').normalize('NFC');
  const looksMojibake = /Ã.|Ä.|Å.|â.|ð.|Ð.|Þ.|�/u.test(value);
  if (!looksMojibake) return value;

  try {
    const repaired = Buffer.from(value, 'latin1').toString('utf8').normalize('NFC');
    const stillBroken = /Ã.|Ä.|Å.|â.|ð.|Ð.|Þ.|�/u.test(repaired);
    return stillBroken ? value : repaired;
  } catch {
    return value;
  }
}

function getAdminKey(req) {
  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'] || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  return headerKey || bearer || '';
}

function getExpectedKey() {
  return process.env.DIK_ADMIN_KEY || process.env.ADMIN_PANEL_KEY || process.env.BOOKMARKS_ADMIN_KEY || '';
}

function parseLimit(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 200;
  return Math.min(Math.max(parsed, 1), 1000);
}

function normalizeStatusFilter(value) {
  const raw = String(value || 'all').trim().toLowerCase();
  if (raw === 'approved') return 'approved';
  if (raw === 'pending') return 'pending';
  return 'all';
}

function normalizeStatus(status) {
  const safe = String(status || '').toLowerCase();
  if (APPROVED_RAW_STATUSES.includes(safe)) return 'approved';
  return 'pending';
}

function parseMessage(rawMessage) {
  const message = String(rawMessage || '');
  if (!message.startsWith(`${MARKER}\n`)) return null;

  const lines = message.split('\n');
  if (lines.length < 5) return null;

  const anonymousLine = lines[1] || '';
  const fullNameLine = lines[2] || '';
  const topicLabelLine = lines[3] || '';

  if (!anonymousLine.startsWith('anonim:')) return null;
  if (!fullNameLine.startsWith('ad_soyad:')) return null;
  if (topicLabelLine.trim() !== 'konu:') return null;

  const anonymous = anonymousLine.slice('anonim:'.length).trim() === '1';
  const fullName = repairText(fullNameLine.slice('ad_soyad:'.length).trim());
  const topic = repairText(lines.slice(4).join('\n').trim());

  if (!topic) return null;

  return {
    anonymous,
    full_name: anonymous ? null : fullName,
    topic: topic.slice(0, 250),
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const expectedKey = getExpectedKey();
  if (!expectedKey) return res.status(500).json({ error: 'Admin key not configured' });

  const providedKey = getAdminKey(req);
  if (providedKey !== expectedKey) return res.status(401).json({ error: 'Unauthorized' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const limit = parseLimit(req.query?.limit);
  const status = normalizeStatusFilter(req.query?.status);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    let query = supabase
      .from('feedback_submissions')
      .select('id, message, status, created_at')
      .like('message', `${MARKER}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status === 'approved') {
      query = query.in('status', APPROVED_RAW_STATUSES);
    } else if (status === 'pending') {
      query = query.eq('status', 'pending');
    }

    const { data, error } = await query;
    if (error) {
      console.error('devuser-dis-admin-list query failed:', error);
      return res.status(500).json({ error: 'Failed to fetch records' });
    }

    const items = [];
    let pendingCount = 0;
    let approvedCount = 0;

    for (const row of data || []) {
      const parsed = parseMessage(row.message);
      if (!parsed) continue;

      const normalizedStatus = normalizeStatus(row.status);
      if (normalizedStatus === 'approved') approvedCount += 1;
      else pendingCount += 1;

      items.push({
        id: row.id,
        topic: parsed.topic,
        anonymous: parsed.anonymous,
        full_name: parsed.full_name,
        created_at: row.created_at,
        status: normalizedStatus,
        raw_status: row.status,
      });
    }

    return res.status(200).json({
      ok: true,
      items,
      stats: {
        total: items.length,
        pending: pendingCount,
        approved: approvedCount,
      },
    });
  } catch (error) {
    console.error('devuser-dis-admin-list failed:', error);
    return res.status(500).json({ error: 'List failed' });
  }
}
