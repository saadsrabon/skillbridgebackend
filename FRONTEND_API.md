# SkillBridge Frontend Integration Guide (API + Build Prompt)

**Backend base URL (dev):** `http://localhost:5000`  
**Auth provider:** Better Auth (session-based; cookie + CSRF handled by Better Auth)  
**Important:** Your frontend must send cookies with requests: `credentials: "include"`.

---

## CORS / cookies setup (required)

- Backend (`src/app.ts`) enables CORS with:
  - `origin: process.env.APP_URL`
  - `credentials: true`
- Frontend must run at the same origin as `APP_URL` (example: `http://localhost:3000`)
- All authenticated fetches must include cookies:
  - **fetch**: `fetch(url, { credentials: "include" })`
  - **axios**: `axios.create({ withCredentials: true })`

---

## Authentication (Better Auth)

Mounted on: **`/api/auth/*`**

### Core endpoints (used by frontend)

- **Sign up (email/password)**: `POST /api/auth/sign-up/email`
- **Sign in (email/password)**: `POST /api/auth/sign-in/email`
- **Get session**: `GET /api/auth/session`
- **Sign out**: `POST /api/auth/sign-out`
- **Verify email**: `POST /api/auth/verify-email`
- **Resend verification email**: `POST /api/auth/resend-verification-email`
- **Forgot password**: `POST /api/auth/forgot-password`
- **Reset password**: `POST /api/auth/reset-password`
- **Change password**: `POST /api/auth/change-password`

### Google OAuth

- **Start OAuth**: `GET /api/auth/signin/google`
- **Callback**: `GET /api/auth/callback/google`

### Authenticated requests

- Prefer **cookie session** (recommended): just send `credentials: "include"`.
- `authChecker` also reads request headers; if you later choose token auth, you can add:
  - `Authorization: Bearer <token>`

---

## Profiles (Student/Tutor)

Mounted on: **`/profiles`**

- **Browse tutors (public)**: `GET /profiles/all-profiles`
  - Returns users that have a `tutorProfile` (includes subjects + unbooked availability slots)
- **Browse tutors (public, filterable)**: `GET /profiles/tutors`
  - Query: `q`, `subjectId`, `categoryId`, `minRate`, `maxRate`, `minRating`, `sort`, `page`, `limit`
- **Create profile (private)**: `POST /profiles/create-profile`
  - Roles allowed: `STUDENT | TUTOR | ADMIN`
- **Get my profile (private)**: `GET /profiles/me`
  - Roles allowed: `STUDENT | TUTOR | ADMIN`
- **Update my profile (private)**: `PATCH /profiles/update-profile`
  - Roles allowed: `STUDENT | TUTOR | ADMIN`

---

## Subjects

Mounted on: **`/subject`**

- **Get all subjects (public)**: `GET /subject`
- **Get subject by id (public)**: `GET /subject/subject/:id`
- **Get tutor’s subjects (public)**: `GET /subject/tutor-subjects/:tutorId`
- **Create subject (private)**: `POST /subject/create-subject` (roles: `ADMIN | TUTOR`)
  - Body supports optional `categoryId`
- **Assign subject to tutor (private)**: `POST /subject/assign-subject` (roles: `ADMIN | TUTOR`)
- **Remove subject from tutor (private)**: `POST /subject/remove-subject` (roles: `ADMIN | TUTOR`)
- **Update subject (private)**: `PATCH /subject/update-subject/:id` (roles: `ADMIN | TUTOR`)
- **Delete subject (private)**: `DELETE /subject/delete-subject/:id` (role: `ADMIN`)

---

## Availability Slots (Tutor schedule)

Mounted on: **`/slots`**

### Public browsing (student-facing)

- **Tutor slots (optionally include booked)**: `GET /slots/tutors/:tutorId/slots?includeBooked=false`
- **Tutor available slots in date range**:  
  `GET /slots/tutors/:tutorId/available?startDate=ISO&endDate=ISO`

**Tutor ID note:** these endpoints accept either:
- `TutorProfile.id` (**preferred**), or
- tutor `userId` (legacy)

### Tutor/Admin management (private)

- **Create slot**: `POST /slots`
  - Roles: `TUTOR | ADMIN`
  - Body (tutor creates for self):
    - `{ "startTime": "...", "endTime": "..." }`
  - Body (admin creates for a tutor):
    - `{ "tutorId": "<TutorProfile.id or tutor userId>", "startTime": "...", "endTime": "..." }`
- **Update slot**: `PATCH /slots/:slotId` (roles: `TUTOR | ADMIN`)
- **Delete slot**: `DELETE /slots/:slotId` (roles: `TUTOR | ADMIN`)

---

## Bookings + Reviews

Mounted on: **`/bookings`**

### Student booking flow

- **Create booking (private)**: `POST /bookings` (roles: `STUDENT | ADMIN`)
  - Student: backend enforces **booking for self** (no “book for another student”)
  - Body:
    - `{ "tutorId": "<TutorProfile.id>", "availableSlotId": "<slotId>", "price": 50 }`
- **Cancel booking (private)**: `DELETE /bookings/:bookingId/cancel` (roles: `STUDENT | ADMIN`)
  - Student can only cancel **their own** booking
- **Leave review (private)**: `POST /bookings/:bookingId/review` (roles: `STUDENT | ADMIN`)
  - Body: `{ "rating": 1..5, "comment": "optional" }`
  - Backend enforces: booking must be `COMPLETED` and owned by student

### Tutor session flow

- **Mark booking completed (private)**: `PATCH /bookings/:bookingId/status` (roles: `TUTOR | ADMIN`)
  - Tutor can only update **their own** booking
  - Tutor is restricted to setting: `{ "status": "COMPLETED" }`

### Read endpoints (private + scoped)

- **Get booking by id**: `GET /bookings/:bookingId` (roles: `STUDENT | TUTOR | ADMIN`)
  - Student/Tutor can only read bookings they belong to
- **My bookings (student)**: `GET /bookings/student/:studentId` (roles: `STUDENT | ADMIN`)
  - Student can only request their own `studentId`
- **My sessions (tutor)**: `GET /bookings/tutor/:tutorId` (roles: `TUTOR | ADMIN`)
  - Tutor can only request their own `tutorId`
- **Admin analytics**: `GET /bookings/range?startDate=ISO&endDate=ISO&status=...&tutorId=...` (role: `ADMIN`)

---

## Frontend generation prompt (copy/paste)

Use this prompt in your preferred code generator:

```text
Build a modern, production-ready Next.js (App Router) frontend for “SkillBridge 🎓”.

Backend:
- Base URL: http://localhost:5000
- Auth: Better Auth mounted at /api/auth/*
- Backend CORS allows credentials; ALL authenticated requests must use cookies with credentials: "include".

Core UX:
- Public pages:
  - / (landing with search + featured tutors)
  - /tutors (browse tutors with filters: subject, price, rating)
  - /tutors/[id] (tutor profile + reviews + availability + booking)
  - /login, /register, /verify-email
- Student dashboard (protected):
  - /dashboard (overview)
  - /dashboard/bookings (upcoming/past, cancel, review after completed)
  - /dashboard/profile (edit profile)
- Tutor dashboard (protected):
  - /tutor/dashboard (sessions list + mark complete)
  - /tutor/availability (CRUD availability slots)
  - /tutor/profile (edit tutor profile)
- Admin dashboard (protected):
  - /admin (stats)
  - /admin/users, /admin/bookings (basic tables)
  - /admin/categories (manage categories)

API integration:
- Implement an API client with baseURL and credentials included by default.
- Implement auth helpers:
  - signUp(email/password/name/role/phone)
  - signIn(email/password)
  - getSession()
  - signOut()
  - verifyEmail(token)
- Use GET /profiles/tutors for browse/search/filter (q/subject/category/rate/rating/sort/pagination).
- (Legacy) GET /profiles/all-profiles returns tutors without filters.
- Availability endpoints:
  - GET /slots/tutors/:tutorId/available?startDate=...&endDate=...
  - POST /slots (tutor creates for self; body: startTime/endTime)
  - PATCH /slots/:slotId, DELETE /slots/:slotId
- Booking endpoints:
  - POST /bookings (body: tutorId=TutorProfile.id, availableSlotId, price)
  - GET /bookings/:bookingId
  - GET /bookings/student/:studentId
  - GET /bookings/tutor/:tutorId
  - DELETE /bookings/:bookingId/cancel
  - PATCH /bookings/:bookingId/status (tutor sets COMPLETED)
  - POST /bookings/:bookingId/review (rating/comment)

Auth/Role routing:
- Fetch session on app load (GET /api/auth/session).
- Enforce role-based route guards (STUDENT, TUTOR, ADMIN).
- Show clear errors for 401/403 and redirect to /login when unauthenticated.

Tech requirements:
- TypeScript, Tailwind, shadcn/ui, React Hook Form + Zod, TanStack Query.
- Clean folder structure, reusable components, loading/error states, empty states.
- No hardcoded IDs; read from session/profile responses.

Deliver:
- Full Next.js app code with pages/components/hooks/services.
- A short README describing env vars and how to run.
```

---

## Categories

Mounted on: **`/categories`**

- **List categories (public)**: `GET /categories?includeSubjects=true|false`
- **Get category by id (public)**: `GET /categories/:id?includeSubjects=true|false`
- **Create category (admin)**: `POST /categories` (role: `ADMIN`)
- **Update category (admin)**: `PATCH /categories/:id` (role: `ADMIN`)
- **Delete category (admin)**: `DELETE /categories/:id` (role: `ADMIN`)

---

## Admin (User Management)

Mounted on: **`/admin`**

- **List users (admin)**: `GET /admin/users?q=&role=&status=&page=&limit=`
- **Get user details (admin)**: `GET /admin/users/:userId`
- **Update user status (admin)**: `PATCH /admin/users/:userId/status`
  - Body: `{ "status": "ACTIVE" | "SUSPENDED" | "BANNED" }`
- **Update user role (admin)**: `PATCH /admin/users/:userId/role`
  - Body: `{ "role": "STUDENT" | "TUTOR" | "ADMIN" }`

**Note:** `BANNED/SUSPENDED` users are blocked by `authChecker` even if they still have a valid session cookie.

