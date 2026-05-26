# Lumen Works — Agency Landing Page

## Original Problem Statement
> Build a landing page: I provide website creation design and hosting services, workflow automation and linguistic services. I want a ready website for people to contact me, have an about page and everything of that sort for an agency like me.

## User Choices
- Agency name & tagline: placeholder used — **Lumen Works · Design. Automate. Translate.** (user did not type custom values)
- Visual style: **Modern minimalist tech** (dark obsidian theme, Outfit + Manrope fonts)
- Pages: Home + About + Services + Contact (single-page scroll)
- Contact form: **DB-only** (Resend email integration deferred)
- Languages (linguistic services): English, Spanish, French, German, Portuguese, Arabic, Mandarin, Japanese (defaults — user did not type custom list)

## Architecture
- **Backend**: FastAPI + Motor (MongoDB). Routes under `/api`:
  - `GET /api/health`, `GET /api/services`, `GET /api/languages`
  - `POST /api/contact`, `GET /api/contact`
- **Frontend**: React (CRA + Craco), Tailwind, Shadcn UI primitives (Input, Textarea, Select, Button, Label), Lenis (smooth scroll), framer-motion, react-fast-marquee, sonner (toasts), lucide-react (icons), axios.
- **Sections**: Navbar, Hero, Services (bento), Languages Marquee, About, Process, Contact, Footer.

## User Personas
- **Founder / SMB owner** wanting a website + automations.
- **Marketing lead** at a multinational needing localized content.
- **Agency partner** looking for a white-label studio.

## Implemented (2026-05-26)
- End-to-end functional landing page at `/`.
- Smooth anchor navigation (Lenis) for Services / About / Process / Contact.
- Contact form validates client-side, posts to `/api/contact`, persists submission, toasts success.
- Design follows `/app/design_guidelines.json` (Swiss + Luxury Dark, Outfit + Manrope).
- data-testids on every interactive/CTA element for testing.
- Backend regression suite at `/app/backend/tests/backend_test.py` (7 cases — all pass).
- Frontend smoke/integration via testing agent — all pass.

## Backlog / Next
- **P1** Replace placeholder agency name/tagline once the user provides them; same for languages list.
- **P1** Resend email notifications on new contact submissions (needs Resend API key + verified sender + receiving email).
- **P2** Admin route to review contact submissions (table + auth).
- **P2** Portfolio/case-study section (real client work).
- **P2** Testimonials slider.
- **P2** Multi-language site UI (currently EN copy only).
- **P3** Blog / writing section for SEO.
- **P3** OG image + sitemap.xml + robots.txt for SEO.

## Notes / Tech Debt
- `server.py`: `logger` is defined below the routes — works at request-time but should be moved above for clarity.
- Contact submissions store `created_at` as ISO string; could be native BSON datetime.
- Lenis anchor handler should `try/catch` querySelector to be defensive against odd hrefs.
