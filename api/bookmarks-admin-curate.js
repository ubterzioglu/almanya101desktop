// =========================================================
// FILE: /api/bookmarks-admin-curate.js
// POST /api/bookmarks-admin-curate
// body: { item: {...} }
// Requires: x-bookmarks-admin-key
// Returns: { ok:true, curated:{...} }
// =========================================================

const ADMIN_KEY = process.env.BOOKMARKS_ADMIN_KEY || "";

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function auth(req, res) {
  if (!ADMIN_KEY) {
    send(res, 500, { error: "BOOKMARKS_ADMIN_KEY missing on server" });
    return false;
  }
  const provided = String(req.headers["x-bookmarks-admin-key"] || "");
  if (provided !== ADMIN_KEY) {
    send(res, 401, { error: "Unauthorized" });
    return false;
  }
  return true;
}

function slugify(s) {
  return (
    String(s || "")
      .toLowerCase()
      .trim()
      .replace(/https?:\/\//g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}

// (optional) keep categories consistent with your MENU keys
function normalizeCategory(c) {
  const x = String(c || "").trim().toLowerCase();
  if (!x) return "tools";
  return x;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!auth(req, res)) return;

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return send(res, 400, { error: "Invalid JSON" });
  }

  const item = body.item;
  if (!item || typeof item !== "object") return send(res, 400, { error: "Missing item" });

  const curated = {
    id: slugify(item.title || item.url || item.id),
    title: item.title || "",
    img: item.img || "./img/bookmarks/z0bookmark0010.png",
    href: item.url || item.href || "",
    note: item.description || item.note || "",
    category: normalizeCategory(item.category)
  };

  return send(res, 200, { ok: true, curated });
}
