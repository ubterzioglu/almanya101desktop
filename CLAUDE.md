# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a **hybrid Next.js project** that combines modern Next.js App Router with static HTML content.

### Hybrid Structure

**Static Content**: Root-level directories serve static HTML/CSS/JS files:
- `devuser/`, `banka/`, `maas/`, `vatandas/`, `sigorta/`, `paratransfer/`, `rehber/`, etc.
- Each directory typically contains HTML pages, CSS files, and associated assets

**Next.js Routes**:
- `/app/[...slug]/route.ts` - Serves static files with path resolution and security checks
- `/app/api/[...slug]/route.ts` - Compatibility layer for legacy API handlers in `/api/`

**API Handlers** (`/api/`):
- JavaScript modules that handle backend operations (Supabase queries, auth, form submissions)
- Legacy Express-style `function(req, res)` signature wrapped by Next.js compatibility layer
- Examples: `devuser-list.js`, `devuser-update.js`, `newsletter-subscribe.js`, `bookmarks-*.js`

### Key Files

- **[next.config.ts](next.config.ts)**: Maps static directories via `STATIC_TRACE_GLOBS` for file serving
- **[shared-cards.js](shared-cards.js)**: Client-side JS that renders shared components (footer, contact card, slide-out menu) across all pages
- **[app/[...slug]/route.ts](app/[...slug]/route.ts)**: Static file server with path security
- **[app/api/[...slug]/route.ts](app/api/[...slug]/route.ts)**: Legacy API compatibility layer
- **[api/*.js](api/)**: API handlers (use `module.exports` or default export for request handling)

### Database

**Supabase** is used for:
- User authentication (Supabase Auth)
- Data storage with RLS (Row Level Security) policies
- Tables: `devuser`, `bookmarks`, `community_support`, etc.

Configuration: Supabase URL and keys are in `.env` (never commit this file).

### DevUser System

A developer community platform (`devuser/` directory):
- Registration form with 25 questions for Turkish developers in Germany
- Member search and filtering by role, city, tech stack, etc.
- Profile management with visibility controls

Key API: `/api/devuser-list.js` (list/lookup), `/api/devuser-update.js` (profile updates)

## Commands

```bash
# Development
npm run dev              # Start Next.js dev server (localhost:3000)

# Production
npm run build           # Build for production
npm start                # Start production server

# Type checking
npm run typecheck       # TypeScript type checking without emit
```

For local static file testing, you can also use:
```bash
npx http-server -p 8080 --cors
```

## Deployment

Project uses **Vercel**. Security headers and CORS configuration are in [vercel.json](vercel.json).

## Working with Static Files

When modifying static HTML pages (e.g., in `devuser/`, `banka/`, etc.):
- Files are served directly - no build step required for these files
- Asset references use relative paths (handled by `shared-cards.js` path resolution)
- For new directories, add to `STATIC_TRACE_GLOBS` in [next.config.ts](next.config.ts)

## Working with API Handlers

API handlers in `/api/` use legacy Express-style signatures:
```javascript
// Example pattern
export default function(req, res) {
  const { method, query, body } = req;
  // ... handle request
  res.json({ data: result });
}
```

The compatibility layer in `/app/api/[...slug]/route.ts` transforms Next.js Request objects into this format.

## Shared Components

The [shared-cards.js](shared-cards.js) module dynamically renders:
- Footer with navigation buttons (Home, Up, Menu)
- Contact card with social links
- Slide-out menu drawer

To include shared components in a page, add placeholders:
```html
<div data-shared-card="contact"></div>
<div data-shared-card="footer"></div>
```

## Security Notes

- RLS policies control data access in Supabase
- Static file serving includes path traversal protection (blocked dirs in `BLOCKED_TOP_LEVEL`)
- CSP headers configured in [vercel.json](vercel.json)
- API routes validate inputs and handle errors

## DevUser Database Schema

The `devuser` table includes extensive fields for:
- Identity: `ad_soyad`, `sehir`, `rol`, `deneyim_seviye`
- Tech stack: `programlama_dilleri`, `framework_platformlar`, `devops_cloud`
- Visibility: `aratilabilir`, `iletisim_izni`, `linkedin_gorunur`, `whatsapp_gorunur`
- Collaboration: `freelance_aciklik`, `profesyonel_destek_verebilir`, `isbirligi_turu`

See migrations in `/supabase/migrations/` for full schema.
