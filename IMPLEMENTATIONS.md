# Codrithm Events — Implementation Status & Remaining Work

## Current Status

**Backend:** Live at `https://codrithm.pythonanywhere.com` (FastAPI + SQLite)
**Frontend:** Live at `https://codrithm-event-ms.vercel.app` (Next.js)
**Last updated:** July 5, 2026

---

## All Fixed Bugs (Deployed)

| Bug | Fix |
|-----|-----|
| Register page expects tokens but backend returns user | Register → auto-login → store tokens |
| Verify-email sends token in body | Send token as query param `?token=...` |
| Edit event 404 (uses ID, backend expects slug) | Added `GET /events/id/{event_id}` endpoint |
| Approve/reject 422 (missing event_id) | Added `?event_id=` query param |
| Organizer dashboard shows 0 stats | Frontend now handles array response, computes stats locally |
| Export CSV broken (hardcoded localhost) | Use `NEXT_PUBLIC_API_URL` env var |
| Registration form LinkedIn/GitHub/Portfolio fields uneditable | Fixed input `id` to match state keys (`linkedin_url`, etc.) |
| Registration 500 error (timezone comparison) | Use naive datetime for SQLite compatibility |
| Analytics 500 error (timezone comparison) | Same fix + added `events_by_category` to response |
| Status badge casing mismatch | Accept both lowercase and capitalized status strings |
| CORS not allowing Vercel domain | Configurable via `CORS_EXTRA_ORIGINS` env var |
| JWT missing role field | Added `role` to access token payload |

---

## Implemented Features (Deployed)

### ✅ Priority 1 — Core Functionality

#### 1. Email Service — DONE
- [x] Resend integration (`backend/app/core/email.py`)
- [x] 6 email templates: verification, registration confirmation, approved, rejected, waitlist promoted, event reminder, password reset
- [x] Password reset emails now sent via Resend
- [x] `RESEND_API_KEY` env var on PythonAnywhere
- [x] Graceful fallback when no API key (prints to console)

#### 2. Email Verification Flow — DONE
- [x] Verification email sent on registration
- [x] `POST /auth/verify-email?token=...` works end-to-end
- [x] In-memory token storage (works for single-process)

#### 3. Organizer Dashboard — DONE (client-side)
- [x] Frontend computes stats from array response (total events, registrations, published, drafts)
- [x] Events table with status, date, registered count
- [x] Quick "Create event" button

#### 4. Organizer Event Management — DONE
- [x] `GET /events/my` — list organizer's events
- [x] `GET /events/id/{event_id}` — fetch event by ID for editing
- [x] `PUT /events/{event_id}` — update event
- [x] `DELETE /events/{event_id}` — delete event
- [x] `PATCH /events/{event_id}/status` — publish/unpublish
- [x] Owner-only access enforced via `organizer_id` check

### ✅ Priority 2 — User Experience

#### 5. Notifications Page — DONE
- [x] `frontend/src/app/notifications/page.tsx` — full notifications page
- [x] `GET /notifications` — paginated list with `unread_count`
- [x] `GET /notifications/unread-count` — badge count
- [x] `PATCH /notifications/{id}/read` — mark single as read
- [x] `POST /notifications/read-all` — mark all as read
- [x] Notification bell in Navbar with unread badge
- [x] Mobile menu notification link with count

#### 6. User Profile Enhancements — DONE
- [x] Added `bio`, `linkedin_url`, `github_url`, `portfolio_url` to User model
- [x] Updated `UserResponse` and `UserUpdate` schemas
- [x] `PUT /users/me` handles all new fields
- [x] Profile page with all fields editable
- [x] SQLite migration for new columns
- [ ] Avatar upload (not yet — needs Cloudinary)

#### 7. Event Features — PARTIAL
- [x] Event search with `?search=` param (backend)
- [x] Category filter with `?category=` param (backend)
- [x] Event type filter with `?event_type=` param (backend)
- [ ] Frontend search/filter UI (not yet)
- [ ] Event categories page (not yet)
- [ ] "My favorites" / bookmark events (not yet)
- [ ] Event sharing / social buttons (not yet)
- [ ] Event banner image upload (not yet — needs Cloudinary)

#### 8. Ticket & QR Code — PARTIAL
- [x] `GET /tickets/{registration_id}` — ticket endpoint works
- [x] `POST /tickets/{registration_id}/generate-qr` — QR generation works
- [x] `POST /tickets/checkin` — check-in works
- [x] `GET /tickets/checkin/{event_id}/stats` — check-in stats work
- [x] QR code generation via `qrcode` library
- [x] Ticket page shows QR code (if uploaded to Cloudinary)
- [ ] QR code scanning with camera (not yet)
- [ ] Download ticket as PDF (not yet)

### ✅ Priority 3 — Admin & Analytics

#### 9. Admin User Management — PARTIAL
- [x] `GET /admin/users` — paginated user list
- [x] `PUT /admin/users/{user_id}/role` — update user role
- [x] Frontend displays users with role badges
- [ ] Frontend pagination (only page 1 shown)
- [ ] User search (not yet)
- [ ] Ban/disable users (not yet)
- [ ] View user's registrations (not yet)

#### 10. Export Functionality — DONE
- [x] `GET /admin/dashboard/export/{event_id}` — CSV export
- [x] `?fields=full_name,email,status` — field selection works
- [x] Frontend uses `NEXT_PUBLIC_API_URL` (no more hardcoded localhost)
- [ ] Excel export (not yet)
- [ ] Frontend field selection UI (not yet — backend ready)

#### 11. Platform Analytics — DONE
- [x] `GET /analytics/platform` — total users, events, registrations, approval rate, etc.
- [x] `events_by_category` in response
- [x] `GET /analytics/events/{event_id}` — per-event analytics
- [x] Admin dashboard shows all metrics
- [ ] Charts / visualizations (not yet)

#### 12. Waitlist Management — DONE
- [x] Auto-promote from waitlist on cancellation
- [x] Waitlist position tracking
- [x] `GET /registrations/events/{event_id}/queue` — approval queue
- [x] Email notification on waitlist promotion

### ✅ Priority 4 — Security & Production

#### 13. Security Hardening — PARTIAL
- [x] Rate limiting on auth endpoints (login: 10/min, register: 5/min, forgot-pw: 3/5min)
- [x] In-memory sliding window rate limiter
- [x] SQL injection protection (SQLAlchemy ORM)
- [x] Input validation via Pydantic schemas
- [ ] CSRF protection (not yet)
- [ ] SameSite cookie attributes (not yet)

#### 14. Error Handling — PARTIAL
- [x] Custom exception classes (NotFound, Unauthorized, Forbidden, Conflict, etc.)
- [x] CORS middleware configured for Vercel domain
- [x] Graceful email fallback when no API key
- [ ] Global exception handler with CORS headers on crash
- [ ] Custom 404/500 pages in frontend
- [ ] Error logging service

#### 15. Environment Variables — DONE
- [x] `.env` file for backend config
- [x] `NEXT_PUBLIC_API_URL` for frontend
- [x] `RESEND_API_KEY` on PythonAnywhere
- [x] `CORS_EXTRA_ORIGINS` for multiple domains
- [ ] `.env.example` file (not yet)
- [ ] Pin `bcrypt==3.2.2` in requirements.txt (not yet)

---

## Remaining Work (Not Yet Started)

### Priority 5 — Enhancements

| # | Feature | Status | Effort |
|---|---------|--------|--------|
| 1 | Avatar upload (Cloudinary) | Not started | Medium |
| 2 | Event banner image upload | Not started | Medium |
| 3 | Frontend event search/filter UI | Not started | Medium |
| 4 | Event categories page | Not started | Small |
| 5 | Favorite/bookmark events | Not started | Medium |
| 6 | Event sharing (social buttons) | Not started | Small |
| 7 | QR code camera scanning | Not started | Large |
| 8 | Download ticket as PDF | Not started | Medium |
| 9 | Admin user pagination | Not started | Small |
| 10 | Admin user search | Not started | Small |
| 11 | Ban/disable users | Not started | Medium |
| 12 | Analytics charts (Chart.js/Recharts) | Not started | Large |
| 13 | Custom 404/500 pages | Not started | Small |
| 14 | Global error handler with CORS | Not started | Small |
| 15 | CSRF protection | Not started | Medium |
| 16 | `.env.example` documentation | Not started | Small |
| 17 | Pin dependencies in requirements.txt | Not started | Small |
| 18 | SEO / meta tags / Open Graph | Not started | Medium |
| 19 | Unit tests | Not started | Large |
| 20 | E2E tests | Not started | Large |

---

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Database | SQLite (free tier) | No external DB needed, works on PythonAnywhere |
| Auth | JWT (access + refresh) | Stateless, no session storage needed |
| Email | Resend (free tier) | 100 emails/day, simple API |
| File Storage | Cloudinary (free tier) | For avatars, banners, QR codes |
| QR Codes | `qrcode` Python lib | Generates PNG images |
| Hosting (backend) | PythonAnywhere free tier | Free, supports Python/FastAPI |
| Hosting (frontend) | Vercel free tier | Free, fast Next.js deployment |

---

## Environment Variables

### Backend (PythonAnywhere)
```
SECRET_KEY=your-secret-key
FRONTEND_URL=https://codrithm-event-ms.vercel.app
CORS_EXTRA_ORIGINS=https://codrithm-event-ms.vercel.app
RESEND_API_KEY=re_your_key
RESEND_FROM_EMAIL=noreply@coderithm.com
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://codrithm.pythonanywhere.com/api/v1
```

---

## Database Schema (SQLite)

**Tables:** users, events, registrations, notifications, waitlists, attendance

**New columns added (July 5, 2026):**
- `users`: bio, linkedin_url, github_url, portfolio_url
- `notifications`: is_read

Run migration on PythonAnywhere:
```bash
python3 -c "
import sqlite3
conn = sqlite3.connect('coderithm_events.db')
c = conn.cursor()
try: c.execute('ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT 0')
except: pass
try:
    c.execute('ALTER TABLE users ADD COLUMN bio VARCHAR(500)')
    c.execute('ALTER TABLE users ADD COLUMN linkedin_url VARCHAR(500)')
    c.execute('ALTER TABLE users ADD COLUMN github_url VARCHAR(500)')
    c.execute('ALTER TABLE users ADD COLUMN portfolio_url VARCHAR(500)')
except: pass
conn.commit()
conn.close()
"
```

---

## File Structure

```
EventMS/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py          # Register, login, refresh, verify, reset
│   │   │   ├── users.py         # Profile CRUD
│   │   │   ├── events.py        # Event CRUD + organizer endpoints
│   │   │   ├── registrations.py # Register, cancel, approve, reject
│   │   │   ├── tickets.py       # Ticket, QR, check-in
│   │   │   ├── notifications.py # List, mark read, unread count
│   │   │   ├── analytics.py     # Platform + event analytics
│   │   │   ├── admin.py         # User management, export, dashboard
│   │   │   └── router.py        # Route registration
│   │   ├── core/
│   │   │   ├── security.py      # JWT, password hashing
│   │   │   ├── email.py         # Resend integration + templates
│   │   │   ├── qr.py            # QR code generation
│   │   │   ├── middleware.py     # CORS setup
│   │   │   ├── exceptions.py    # Custom exception classes
│   │   │   └── rate_limit.py    # In-memory rate limiter
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   └── config.py            # Settings
│   ├── wsgi.py                  # PythonAnywhere adapter
│   └── migrate.sql              # DB migration script
├── frontend/
│   └── src/
│       ├── app/                 # Next.js pages (App Router)
│       │   ├── notifications/   # Notifications page
│       │   ├── profile/         # Profile settings
│       │   ├── organizer/       # Organizer pages
│       │   ├── admin/           # Admin pages
│       │   └── ...
│       ├── components/
│       │   ├── Navbar.tsx       # With notification bell
│       │   ├── RegistrationStatusBadge.tsx
│       │   └── EventStatusBadge.tsx
│       ├── lib/
│       │   ├── api.ts           # API client with auth
│       │   └── auth.ts          # Token + user storage
│       └── types/index.ts       # TypeScript interfaces
└── IMPLEMENTATIONS.md           # This file
```

---

## PythonAnywhere Deployment Checklist

When deploying changes:
1. `cd ~/ems/backend && git checkout -- . && git pull origin main`
2. Run any DB migrations (see above)
3. Set env vars if new: `export VAR_NAME=value`
4. Web tab → Reload

---

## Testing Checklist

- [ ] Register new user → receives verification email
- [ ] Verify email → can log in
- [ ] Login → dashboard shows user info
- [ ] Create event → appears in organizer list
- [ ] Publish event → appears on homepage
- [ ] Register for event → notification + email
- [ ] Approve registration → notification + email
- [ ] Check in attendee → stats update
- [ ] Cancel registration → waitlist promotion
- [ ] Profile update → bio/links saved
- [ ] Notifications page → mark as read works
- [ ] Admin dashboard → correct totals
- [ ] Export CSV → downloads with selected fields
