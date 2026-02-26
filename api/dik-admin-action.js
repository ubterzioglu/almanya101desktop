// =========================================================
// FILE: /api/dik-admin-action.js
// PURPOSE: Admin actions on feedback (delete, mark read, etc.)
// AUTH: DIK_ADMIN_KEY environment variable
// =========================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ADMIN_KEY = process.env.DIK_ADMIN_KEY;

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const providedKey = req.headers['x-admin-key'] || body.key;

  if (!ADMIN_KEY || providedKey !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: "Service not configured" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { action, id } = body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    if (action === 'delete') {
      const { error } = await supabase
        .from('feedback_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: "Delete failed", details: error.message });
      }

      return res.status(200).json({ ok: true, action: 'deleted', id });
    }

    if (action === 'mark_read' || action === 'read') {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: "Update failed", details: error.message });
      }

      return res.status(200).json({ ok: true, action: 'marked_read', id });
    }

    if (action === 'mark_pending' || action === 'pending') {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({ status: 'pending' })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: "Update failed", details: error.message });
      }

      return res.status(200).json({ ok: true, action: 'marked_pending', id });
    }

    return res.status(400).json({ error: "Invalid action. Use: delete, mark_read, mark_pending" });
  } catch (e) {
    console.error('Action failed:', e);
    return res.status(500).json({ error: "Action failed" });
  }
}
