# Codrithm Events — Implementation Status & Remaining Work

## Current Status

**Backend:** Live at `https://codrithm.pythonanywhere.com` (FastAPI + SQLite)
**Frontend:** Live at `https://codrithm-event-ms.vercel.app` (Next.js)

---

## Fixed Bugs (Deployed)

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

## Remaining Implementation Work

### Priority 1 — Core Functionality (Must Have)

#### 1. Email Service (Currently Disabled)
- [ ] Set up free email service (Resend free tier: 100 emails/day, or Brevo free tier: 300/day)
- [ ] Implement `backend/app/core/email.py` — send verification emails
- [ ] Implement password reset emails
- [ ] Implement registration confirmation emails
- [ ] Implement waitlist promotion emails
- [ ] Add email templates (HTML or plain text)
- [ ] Add `EMAIL_ENABLED` env var to toggle emails on/off

#### 2. Email Verification Flow
- [ ] Send verification email on user registration
- [ ] Verify email actually works end-to-end (currently broken because emails aren't sent)
- [ ] Add `is_verified` check for certain actions (e.g., registering for events)
- [ ] Add "Resend verification email" option on profile page

#### 3. Organizer Dashboard — Proper Summary Endpoint
- [ ] Add `GET /organizer/dashboard/summary` endpoint that returns:
  - `total_events`, `total_registrations`, `pending_approvals`, `checkin_rate`
  - `recent_events` (last 5)
- [ ] Current endpoint returns flat array — dashboard computes stats client-side but check-in rate is missing

#### 4. Organizer Event Management
- [ ] Organizer can see which events they own (currently works via `GET /events/my`)
- [ ] Event edit/delete only works for event owner (verified via `organizer_id` check)
- [ ] Add "duplicate event" feature
- [ ] Show registration count on event cards in organizer events list

### Priority 2 — User Experience (Should Have)

#### 5. Notifications Page (Backend Ready, Frontend Missing)
- [ ] Create `frontend/src/app/notifications/page.tsx`
- [ ] Display user's notifications from `GET /notifications`
- [ ] Mark as read functionality (need backend endpoint)
- [ ] Notification badge/count in Navbar
- [ ] Notification types: registration confirmed, waitlist promoted, event update, event reminder

#### 6. User Profile Enhancements
- [ ] Add `bio`, `linkedin_url`, `github_url`, `portfolio_url` fields to User model
- [ ] Update `PUT /users/me` to accept these fields
- [ ] Show profile links on user's public profile
- [ ] Avatar upload (use Cloudinary free tier or local storage)

#### 7. Event Features
- [ ] Event search with filters (category, date range, event type) — backend supports it, frontend needs UI
- [ ] Event categories page
- [ ] "My favorites" / bookmark events feature
- [ ] Event sharing (social media share buttons)
- [ ] Event banner image upload (backend has field, no upload implementation)

#### 8. Ticket & QR Code
- [ ] Generate QR code for tickets (endpoint exists: `POST /tickets/{id}/generate-qr`)
- [ ] Display QR code on ticket page (currently shows placeholder)
- [ ] QR code scanning for check-in (mobile camera integration)
- [ ] Download ticket as PDF

### Priority 3 — Admin & Analytics (Nice to Have)

#### 9. Admin User Management
- [ ] Paginated user list (frontend currently only shows page 1)
- [ ] User search
- [ ] Ban/disable user accounts
- [ ] View user's registrations and events

#### 10. Export Functionality
- [ ] Backend ignores `format` and `fields` query params — always exports all fields as CSV
- [ ] Add Excel export support
- [ ] Add field selection in backend export
- [ ] Export from admin analytics page

#### 11. Platform Analytics Enhancements
- [ ] Registration trends chart (data exists in `registrations_over_time`)
- [ ] Event category breakdown chart
- [ ] Monthly/weekly comparison
- [ ] Top organizers leaderboard

#### 12. Waitlist Management
- [ ] Show waitlist position to users
- [ ] Auto-promote from waitlist when a registration is cancelled (implemented)
- [ ] Notify waitlisted users when spots open (email needed)
- [ ] Organizer can manually promote from waitlist

### Priority 4 — Security & Production (Must Have Before Launch)

#### 13. Security Hardening
- [ ] Add rate limiting to auth endpoints (prevent brute force)
- [ ] Add CSRF protection
- [ ] Validate JWT tokens on PythonAnywhere (currently works)
- [ ] Add `SameSite` cookie attributes for refresh tokens
- [ ] Input sanitization on all forms
- [ ] SQL injection protection (SQLAlchemy handles this, but verify)

#### 14. Error Handling
- [ ] Global error handler for unhandled exceptions (return proper CORS headers)
- [ ] Custom error pages (404, 500) in frontend
- [ ] Error logging service (use PythonAnywhere logs or Sentry free tier)

#### 15. Environment Variables & Configuration
- [ ] Document all required env vars in `.env.example`
- [ ] Backend: `SECRET_KEY`, `DATABASE_URL`, `FRONTEND_URL`, `CORS_EXTRA_ORIGINS`
- [ ] Frontend: `NEXT_PUBLIC_API_URL`
- [ ] PythonAnywhere: Pin `bcrypt==3.2.2` in `requirements.txt`

### Priority 5 — Deployment & DevOps

#### 16. PythonAnywhere Production Setup
- [ ] Pin all dependencies in `requirements.txt`
- [ ] Set up proper logging
- [ ] Configure static file serving (if needed)
- [ ] Database backup strategy (download SQLite file periodically)
- [ ] Monitor PythonAnywhere resource limits (500MB storage on free tier)

#### 17. Frontend Production
- [x] Deploy to Vercel
- [ ] Add proper meta tags / SEO
- [ ] Add Open Graph tags for social sharing
- [ ] Add favicon and app icons
- [ ] Lighthouse performance optimization

#### 18. Testing
- [ ] Unit tests for backend services
- [ ] API integration tests
- [ ] Frontend component tests (Vitest)
- [ ] E2E tests for critical flows (Playwright)
- [ ] Test registration flow end-to-end
- [ ] Test event creation → registration → ticket → check-in

---

## Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Database | SQLite (free tier) | No external DB needed, works on PythonAnywhere |
| Auth | JWT (access + refresh) | Stateless, no session storage needed |
| Email | Not implemented yet | Need free email service (Resend/Brevo) |
| File Storage | Not implemented | Use Cloudinary free tier for avatars/banners |
| QR Codes | Not implemented | Can use `qrcode` Python library |
| Hosting (backend) | PythonAnywhere free tier | Free, supports Python/FastAPI |
| Hosting (frontend) | Vercel free tier | Free, fast Next.js deployment |

---

## Known Limitations (Free Tier)

- **PythonAnywhere**: 512MB RAM, limited CPU, no WebSocket, no background tasks
- **Vercel**: 100GB bandwidth/month, serverless function timeout 10s
- **SQLite**: No concurrent writes, max 1TB (not a concern), single-file database
- **Email**: Need free service — Resend (100/day) or Brevo (300/day)

---

## File Structure Reference

```
EventMS/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # Route handlers
│   │   ├── core/           # Security, email, exceptions, middleware
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic
│   │   ├── config.py       # Settings
│   │   ├── database.py     # DB engine/session
│   │   ├── dependencies.py # Auth dependencies
│   │   └── main.py         # FastAPI app
│   └── wsgi.py             # PythonAnywhere WSGI adapter
├── frontend/
│   └── src/
│       ├── app/            # Next.js pages (App Router)
│       ├── components/     # Reusable UI components
│       ├── lib/            # API client, auth helpers
│       └── types/          # TypeScript interfaces
└── IMPLEMENTATIONS.md      # This file
```
