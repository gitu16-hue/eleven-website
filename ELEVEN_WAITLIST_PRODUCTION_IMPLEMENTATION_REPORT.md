# ELEVEN — Production Waitlist Persistence Implementation Report

**Date:** November 1, 2026  
**Auditor / Engineer:** Antigravity Pairing Agent  
**Repository:** `F:\eleven-web\eleven-web`  
**Production URL:** [https://eleven-website-self.vercel.app/](https://eleven-website-self.vercel.app/)  
**Database Technology:** Supabase PostgreSQL with Row Level Security (RLS)  
**Implementation Status:** **Implemented and Verified Locally (Ready for Operator Configuration)**

---

## 1. Executive Summary

This report documents the local implementation, schema migration, server-side hardening, frontend integration, and automated verification of ELEVEN's sovereign waitlist persistence.

All local deliverables are complete, verified by 13 automated tests (100% pass rate), verified by TypeScript typecheck (`tsc --noEmit` code 0), and confirmed via full production compilation (`npm run build` code 0). No production credentials were hardcoded, no Git commits or pushes were executed, and no live database records were modified, strictly adhering to the operator execution boundary.

### Status Separation Matrix

| Phase / Scope | Domain | Status |
| :--- | :--- | :--- |
| **Implemented Locally** | Database migration, API route, frontend UI, `.env.example`, package script | **COMPLETE** |
| **Tested Locally** | 13 automated tests, TypeScript compiler, Turbopack production build | **COMPLETE (All Passed)** |
| **Requires Operator Supabase Config** | Execute SQL migration in Supabase, configure Vercel Environment Variables | **PENDING OPERATOR** |
| **Requires Production Verification** | End-to-end registration & duplicate check on `https://eleven-website-self.vercel.app/` | **PENDING OPERATOR** |

---

## 2. Implemented Locally

### 2.1. Idempotent Database Schema & SQL Migration
Created repository migration file:
[`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql) (and synchronized with [`supabase/schema.sql`](file:///F:/eleven-web/eleven-web/supabase/schema.sql)).

#### Schema Architecture
```sql
CREATE TABLE IF NOT EXISTS public.waitlist_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT NULL,
    intended_use TEXT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('general', 'technical')) DEFAULT 'general',
    consent BOOLEAN NOT NULL DEFAULT TRUE,
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

#### Security & Policy Invariants
1. **Case-Insensitive Unique Index:**
   `CREATE UNIQUE INDEX IF NOT EXISTS waitlist_registrations_email_idx ON public.waitlist_registrations (lower(trim(email)));`
   Guarantees zero duplicate email entries at the PostgreSQL engine level.
2. **Strict Row Level Security (RLS):**
   `ALTER TABLE public.waitlist_registrations ENABLE ROW LEVEL SECURITY;`
3. **Zero Public Access:**
   `REVOKE ALL ON public.waitlist_registrations FROM anon, authenticated, public;`
   Blocks any client-side JavaScript from querying, inserting, or modifying registrations directly.
4. **Restricted Administrative Access:**
   `GRANT ALL ON public.waitlist_registrations TO service_role;`
   Allows only the server-side Next.js route using `SUPABASE_SERVICE_ROLE_KEY` to access the table.
5. **Hardened Trigger & Functions with Privilege Revocation:**
   Trigger function `public.handle_waitlist_updated_at()` and GDPR purge function `public.purge_waitlist_registration()` are defined with `SECURITY DEFINER` and explicit `SET search_path = public` to eliminate search_path hijacking vulnerabilities. Furthermore, default `EXECUTE` privileges are revoked from `PUBLIC`, `anon`, and `authenticated` roles and granted strictly to `service_role`, blocking unauthorized remote invocation via PostgREST RPC endpoints (`/rpc/purge_waitlist_registration`).

---

### 2.2. Hardened Server-Side API (`app/api/waitlist/route.ts`)
Updated: [`app/api/waitlist/route.ts`](file:///F:/eleven-web/eleven-web/app/api/waitlist/route.ts)

#### 9-Case Exhaustive Request Handling

1. **Valid New Registration:**
   Queries existing registrations. If not found, inserts new record with hashed client IP and timestamps. Returns HTTP 200:
   ```json
   {
     "success": true,
     "status": "persisted",
     "isDuplicate": false,
     "id": "uuid-here",
     "tier": "technical",
     "message": "Your technical access request has been recorded..."
   }
   ```
2. **Existing Email (Friendly Duplicate Handling):**
   If an existing registration is detected, updates the user's name, intended use, and tier preferences without creating another row. Returns HTTP 200:
   ```json
   {
     "success": true,
     "status": "already_registered",
     "isDuplicate": true,
     "id": "existing-uuid",
     "tier": "technical",
     "message": "You are already registered on the ELEVEN waitlist! We have refreshed your access profile."
   }
   ```
   *Concurrency Edge Case:* If two identical registrations race concurrently, the unique index triggers PostgreSQL error `23505`, safely trapped to return the friendly duplicate response.
3. **Invalid Email:**
   Trims and lowercases input. Validates against RFC 5322 regex and length cap (255 characters). Returns HTTP 400:
   ```json
   { "success": false, "error": "Please enter a valid email address." }
   ```
4. **Invalid Category / Tier:**
   Strictly validates that `tier` is either `"general"` or `"technical"`. Returns HTTP 400 if invalid:
   ```json
   { "success": false, "error": "Invalid registration category." }
   ```
5. **Honeypot Protection:**
   Hidden field `hp_company` silently catches automated bot crawlers. Returns HTTP 400:
   ```json
   { "success": false, "error": "Spam submission rejected." }
   ```
6. **Rate Limiting:**
   Bounded sliding window tracks requests per SHA-256 IP hash (max 5 submissions per 10 minutes). When exceeded, returns HTTP 429 with `Retry-After: 600`:
   ```json
   { "success": false, "error": "Too many submission attempts. Please wait 10 minutes before trying again." }
   ```
7. **Missing Configuration:**
   If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` are unset, returns honest HTTP 503 without claiming false success:
   ```json
   {
     "success": false,
     "status": "pending_backend",
     "error": "Persistent cloud database is currently unconfigured. Early access registration will open upon production backend deployment."
   }
   ```
8. **Database Unavailable / Query Failure:**
   Traps PostgreSQL or network exceptions, logs sanitized error codes server-side without exposing PII or credentials, and returns HTTP 502:
   ```json
   { "success": false, "error": "Database service temporarily unreachable. Please try again later." }
   ```
9. **Unexpected Error:**
   Global exception catch returns sanitized HTTP 500 without leaking stack traces or internal diagnostics.

---

### 2.3. Frontend State & User Feedback (`components/v3/WaitlistModal.tsx`)
Updated: [`components/v3/WaitlistModal.tsx`](file:///F:/eleven-web/eleven-web/components/v3/WaitlistModal.tsx)

1. **State Differentiation:**
   - **New Registration (`isDuplicate === false`):** Displays emerald badge `✓ Registration confirmed & persisted` with confirmation colophon.
   - **Duplicate Registration (`isDuplicate === true`):** Displays amber badge `ℹ Existing registration confirmed` with friendly profile refresh message.
2. **Error Recovery & Retry:**
   When an error occurs (validation error, network timeout, or rate limiting), the error banner is rendered clearly, and the form remains populated so the user can immediately correct their input and retry without friction.
3. **Accessibility & Hydration:**
   - Focus trapping, Escape key listener, and body scroll lock cleanup preserved.
   - `useSyncExternalStore` hydration safety maintained.
   - Zero layout shift or modal stacking issues.

---

### 2.4. Environment Variable Template (`.env.example`)
Updated: [`.env.example`](file:///F:/eleven-web/eleven-web/.env.example)
Documents required variable names with descriptive operator guidance and placeholder values only (no real secrets).

---

## 3. Tested Locally

### 3.1. Automated Test Suite (`tests/waitlist_persistence.test.mjs`)
Implemented: [`tests/waitlist_persistence.test.mjs`](file:///F:/eleven-web/eleven-web/tests/waitlist_persistence.test.mjs)  
Execution command: `npm run test:waitlist`

```text
> eleven-web@0.1.0 test:waitlist
> node --test --experimental-strip-types tests/waitlist_persistence.test.mjs

✔ GET /api/waitlist reports readiness based on environment variables (10.3ms)
✔ POST /api/waitlist returns honest 503 when Supabase credentials are missing (5.2ms)
✔ POST /api/waitlist successfully persists a valid new registration (4.7ms)
✔ POST /api/waitlist handles duplicate email with friendly message and no duplicate row (3.5ms)
✔ POST /api/waitlist handles race condition duplicate via Postgres unique constraint 23505 (3.4ms)
✔ POST /api/waitlist rejects invalid email formats (6.3ms)
✔ POST /api/waitlist rejects invalid category/tier (1.7ms)
✔ POST /api/waitlist rejects missing consent (1.4ms)
✔ POST /api/waitlist rejects honeypot bot submissions (1.3ms)
✔ POST /api/waitlist enforces sliding window rate limiting (5 req/10 min) (5.2ms)
✔ POST /api/waitlist handles Supabase database storage failure gracefully (2.9ms)
✔ POST /api/waitlist handles network/connection exception gracefully (1.9ms)
✔ Frontend response contracts match WaitlistModal UI expectations (6.7ms)

ℹ tests 13
ℹ suites 0
ℹ pass 13
ℹ fail 0
ℹ cancelled 0
ℹ duration_ms 709.2ms
```
**Exit Code:** `0` (13 Passed, 0 Failed).

---

### 3.2. TypeScript Compilation Check
Execution command: `npx tsc --noEmit`  
**Exit Code:** `0` (Zero compiler errors across entire codebase).

---

### 3.3. Next.js Production Build
Execution command: `npm run build` (`next build` with Turbopack)  
**Exit Code:** `0`  
- All 25 routes compiled and optimized.
- `/api/waitlist` recognized as dynamic server route (`ƒ (Dynamic) server-rendered on demand`).

---

## 4. Rate Limiting Analysis & Distributed Scalability

### 4.1. Existing In-Memory Implementation
- **Mechanism:** In-memory `Map<string, number[]>` using sliding-window rate tracking.
- **Eviction:** Active pruning on every request for timestamps older than 10 minutes; hard cap eviction at 5,000 entries.
- **Privacy:** Client IP is hashed using SHA-256 with salt (`crypto.createHash('sha256')`). No raw IP or PII is held in memory.

### 4.2. Serverless Limitations
In serverless environments like Vercel Lambda:
- Lambdas are stateless and execute in isolated micro-containers.
- Concurrent requests across different edge nodes or cold-started lambdas do not share memory.
- Therefore, in-memory rate limiting functions as **per-instance burst protection** rather than global rate enforcement.

### 4.3. Recommended Distributed Roadmap (Upstash Redis)
If global coordination is required under high traffic:
- **Smallest Safe Solution:** Use `@upstash/ratelimit` with Upstash Redis over REST (HTTP-based).
- **Why Upstash:** Zero TCP connection pool issues on serverless edge; simple HTTP token-bucket or sliding-window primitives.
- **Required Infrastructure:**
  - Upstash Redis database (free tier supports 10,000 commands/day).
  - Vercel Environment Variables: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- *Decision:* Kept the lightweight in-memory limiter active to avoid imposing mandatory third-party infrastructure on the operator, while providing clean hooks for distributed rate limiting when needed.

---

## 5. Requires Operator Supabase Configuration

The operator must perform the following actions using the dedicated [ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md](file:///F:/eleven-web/eleven-web/ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md):

1. **Create/Open Supabase Project:**
   Provision `eleven-production` in the Supabase Dashboard.
2. **Execute Migration:**
   Paste and run [`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql) in the Supabase SQL Editor.
3. **Retrieve Credentials:**
   Obtain **Project URL** and the **`service_role` secret key** from Supabase **Project Settings > API**.
4. **Configure Vercel Production Settings:**
   Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and optional `WAITLIST_SALT` to Vercel Environment Variables for the **Production** environment only.
5. **Redeploy / Promote:**
   Trigger a production deployment or promote commit `ac35786` on Vercel so the environment variables take effect.

---

## 6. Requires Production Verification

Once the operator configures Vercel and deploys, perform the following verification:

1. **Probe Readiness Endpoint:**
   ```bash
   curl -s https://eleven-website-self.vercel.app/api/waitlist
   ```
   Confirm output: `{"status":"ready","persistenceConfigured":true,...}`.
2. **Test Live Registration:**
   Submit an early access request via the modal on the live site. Verify green confirmation banner appears.
3. **Test Duplicate Registration:**
   Submit the same email again. Verify amber duplicate notice appears.
4. **Inspect Supabase Table Editor:**
   Confirm row exists in `public.waitlist_registrations` with correct `tier`, hashed `ip_hash`, and timestamps.

---

## 7. Deliverables Summary

- **SQL Migration:** [`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql)
- **Schema Reference:** [`supabase/schema.sql`](file:///F:/eleven-web/eleven-web/supabase/schema.sql)
- **API Handler:** [`app/api/waitlist/route.ts`](file:///F:/eleven-web/eleven-web/app/api/waitlist/route.ts)
- **Modal Component:** [`components/v3/WaitlistModal.tsx`](file:///F:/eleven-web/eleven-web/components/v3/WaitlistModal.tsx)
- **Automated Test Suite:** [`tests/waitlist_persistence.test.mjs`](file:///F:/eleven-web/eleven-web/tests/waitlist_persistence.test.mjs)
- **Environment Template:** [`.env.example`](file:///F:/eleven-web/eleven-web/.env.example)
- **Setup Guide:** [`ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md`](file:///F:/eleven-web/eleven-web/ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md)

*Antigravity Pairing Agent has halted all actions and is waiting for operator review and authorization.*
