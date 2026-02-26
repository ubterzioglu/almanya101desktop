// =========================================================
// FILE: /api/bookmarks-admin-update.js
// POST /api/bookmarks-admin-update
// body: { action: "approve"|"reject"|"restore", id: "uuid", admin_notes?: "..." }
// Requires: x-bookmarks-admin-key
// =========================================================

import { createClient } from '@supabase/supabase-js';

const ADMIN_KEY = process.env.BOOKMARKS_ADMIN_KEY || "";

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function mustEnv(res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    send(res, 503, { error: "Supabase env missing" });
    return false;
  }
  if (!ADMIN_KEY) {
    send(res, 500, { error: "BOOKMARKS_ADMIN_KEY missing on server" });
    return false;
  }
  return true;
}

function auth(req, res) {
  const provided = String(req.headers["x-bookmarks-admin-key"] || "");
  if (provided !== ADMIN_KEY) {
    send(res, 401, { error: "Unauthorized" });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!mustEnv(res)) return;
  if (!auth(req, res)) return;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return send(res, 400, { error: "Invalid JSON" });
  }

  const action = String(body.action || "").trim();
  const id = String(body.id || "").trim();
  const adminNotes = body.admin_notes ? String(body.admin_notes).trim() : null;

  if (!id) return send(res, 400, { error: "Missing id" });
  if (!action) return send(res, 400, { error: "Missing action" });

  // Create Supabase client with service role key (admin access)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    let newStatus;
    
    if (action === "approve") {
      newStatus = "approved";
    } else if (action === "reject") {
      newStatus = "rejected";
    } else if (action === "restore") {
      newStatus = "pending";
    } else {
      return send(res, 400, { error: "Invalid action. Use: approve, reject, or restore" });
    }

    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('bookmark_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return send(res, 500, { error: "Failed to update bookmark", details: error.message });
    }

    if (!data) {
      return send(res, 404, { error: "Bookmark not found" });
    }

    return send(res, 200, { ok: true, item: data });
  } catch (e) {
    console.error('Update failed:', e);
    return send(res, 500, { error: e.message || "Update failed" });
  }
}
