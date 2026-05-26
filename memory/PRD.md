# Individual Stake — Agency Landing Page

## Original Problem Statement
> Build a landing page: I provide website creation design and hosting services, workflow automation and linguistic services. I want a ready website for people to contact me, have an about page and everything of that sort for an agency like me.

## User Choices (final)
- Agency name & tagline: **Individual Stake — Design. Automate. Translate.**
- Visual style: Modern minimalist tech (dark obsidian theme, Outfit + Manrope, Tiro Devanagari Hindi for हिन्दी)
- Pages: Home + About + Services + Work + Process + Testimonials + Contact (single-page scroll) and `/admin`
- Contact form: stores in DB + sends transactional email via Resend
- Languages: Hindi (highlighted), English, Spanish, French, German, Portuguese, Arabic, Mandarin, Japanese
- Admin: shared-password protected dashboard

## Architecture
- **Backend**: FastAPI + Motor (MongoDB) + Resend (`resend>=2.0.0`)
  - Public: `GET /api/health`, `/api/services`, `/api/languages`, `POST /api/contact`
  - Admin (bearer): `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`, `GET /api/admin/contact`, `DELETE /api/admin/contact/{id}`
  - On new submission: `asyncio.create_task(_send_notification_email(...))` (non-blocking)
- **Frontend**: React + Tailwind + Shadcn UI + Lenis + framer-motion + react-fast-marquee + sonner + axios
- **Sections**: Navbar, Hero, Services, Languages Marquee, Work (case study), About, Process, Testimonials, Contact, Footer
- **Admin**: `/admin` — login + token in localStorage + dashboard with list/detail/delete/logout

## Env Vars (backend/.env)
- `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL=uk@individualstake.com`, `RESEND_TO_EMAIL=uk@individualstake.com`
- `ADMIN_PASSWORD=stake-admin-2025` (rotate in prod; documented in `/app/memory/test_credentials.md`)

## Implemented (2026-05-26)
- v1: Hero, Services, Languages marquee, About, Process, Contact, Footer + DB persistence.
- v2: Rebranded to Individual Stake; Hindi highlighted in marquee; Resend email on new submissions; **Work** section with case study (HR Ops → PM, 90% KRA automation, CRM in 2 months, ATS recovery, recruiter program); **Testimonials** (3 cards); **`/admin`** route with password login and submissions dashboard (list, detail, delete, logout).
- Backend tests: 17/17 pass. Frontend e2e: pass.

## Backlog / Next
- **P1** Verify `individualstake.com` sender domain in Resend (if not done) to ensure delivery.
- **P1** Add at least one more real case study + actual client testimonials when available.
- **P2** Replace `window.confirm` in admin delete with Shadcn `AlertDialog`.
- **P2** Persist admin sessions (Mongo or signed JWT) — current in-memory dict loses tokens on restart.
- **P2** Hold a reference to background Resend tasks (and/or use a queue) to avoid pending-task warnings and silent drops under burst load.
- **P3** Add OG image, sitemap.xml, robots.txt for SEO.
- **P3** Hindi UI toggle for the public site (currently English copy only, Hindi only in marquee).
- **P3** Calendar integration (Cal.com / Calendly) inside Contact for self-service booking.
- **P3** Multi-case-study listing page once portfolio grows.

## Notes
- Lenis smooth scroll is mounted inside the Landing route only; `/admin` uses native scroll.
- `data-testid` coverage across nav, hero, services, work (incl. case-highlight-0..3), testimonials (0..2), languages (lang-highlight-*), contact form fields and admin (login form/input/submit, dashboard list/detail/delete/logout/back-home).
