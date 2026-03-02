# Fuel Wise v2 (Advanced)

This build includes:
- Supabase Auth (Email/Password + Google)
- Supabase Postgres storage for entries (per-user via RLS)
- Advanced dashboard metrics
- Recharts analytics
- Protected routes (must be logged in)

## 1) Install + run
```bash
npm install
npm run dev
```

## 2) Supabase setup (required)

### Environment variables
1. Copy `.env.example` to `.env`
2. Fill in:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Database table + security (RLS)
In Supabase SQL Editor, run the SQL in:
`supabase/schema.sql`

### Google Login
In Supabase:
- Authentication → Providers → Google → Enable
- Add Google Client ID + Secret
- Set Redirect URLs:
  - Local: `http://localhost:5173`
  - Netlify (later): `https://YOUR-SITE.netlify.app`

## 3) Deploy (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Netlify Site settings (same as `.env`)

> Notes: Google login will only work on deployed domains that are added to your Google OAuth Authorized domains + redirect URLs.

---

## App behavior
- Entries are stored in `fuel_entries`
- Each entry is tied to the authenticated user (`user_id`)
- Dashboard stats and charts are computed from your entries, sorted by date.
