# ELEVEN — Waitlist Persistence Security & Integration Acceptance Audit

**Date:** November 1, 2026  
**Auditor:** Antigravity Senior Security & Reliability Pairing Agent  
**Repository:** `F:\eleven-web\eleven-web`  
**Production URL:** [https://eleven-website-self.vercel.app/](https://eleven-website-self.vercel.app/)  
**Baseline Git Commit:** `ac3578631f27f5d24fc1ebdf95bf8969aff4b55a`  
**Audit Scope:** Independent, read-only audit of uncommitted waitlist persistence implementation  
**Final Recommendation:** **APPROVED WITH CONDITIONS**

---

## 1. Executive Summary & Verdict

An independent, rigorous security and integration audit of the newly implemented Supabase PostgreSQL waitlist integration has been performed across the database schema, API route handlers, frontend dialog behavior, and automated verification suites.

### Audit Verdict Breakdown

| Audit Domain | Scope / Invariant | Status | Classification |
| :--- | :--- | :--- | :--- |
| **Git Baseline & Scope** | 5 files modified, 2 new directories (`supabase/migrations`, `tests`) | **Clean & Isolated** | **PASS** |
| **Database RLS & Grants** | Table access restricted solely to `service_role` | **Hardened** | **PASS** |
| **Function Execution Grants** | `purge_waitlist_registration` lacks explicit `REVOKE EXECUTE FROM PUBLIC` | **Defect Identified** | **WARNING / REQUIRES OPERATOR ACTION** |
| **Data Integrity & Duplicates** | Case-insensitive unique index + concurrency collision handling | **Protected** | **PASS** |
| **Consent & Immutability** | Re-submissions update tier/context but never overwrite consent | **Preserved** | **PASS** |
| **Abuse & Spam Defense** | Bounded IP sliding window, SHA-256 IP salt, honeypot bot trap | **Hardened** | **PASS** |
| **Serverless Rate Limiter** | In-memory limiter is per-instance burst protection, not global | **Documented** | **PASS** |
| **Frontend State Flow** | Emerald new vs Amber duplicate; form data preserved for retry | **Verified** | **PASS** |
| **Automated Tests** | 13/13 tests passing (`npm run test:waitlist`) | **100% Pass** | **PASS** |
| **TypeScript Compiler** | `npx tsc --noEmit` | **Exit Code 0** | **PASS** |
| **Production Build** | `npm run build` (Turbopack, 25 static + 1 dynamic route) | **Exit Code 0** | **PASS** |
| **Linter Compliance** | `npm run lint` failed on `route.ts:19:28` (`no-explicit-any`) | **Exit Code 1** | **WARNING / CODE FIX IDENTIFIED** |

---

## 2. Review of Implementation Changes

Inspection of the working tree against commit `ac3578631f27f5d24fc1ebdf95bf8969aff4b55a` reveals exactly 5 modified tracked files and 2 new directories. No unrelated Phase 2 files or design tokens have been altered.

### 2.1. Modified Tracked Files
1. [`.env.example`](file:///F:/eleven-web/eleven-web/.env.example) (+8 lines): Added explicit setup comments and placeholder keys for `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `WAITLIST_SALT`.
2. [`app/api/waitlist/route.ts`](file:///F:/eleven-web/eleven-web/app/api/waitlist/route.ts) (+145 / -30 lines): Upgraded to handle duplicate submissions without extra rows, strict tier validation, HTML tag stripping, testing injection hooks, and safe database error handling.
3. [`components/v3/WaitlistModal.tsx`](file:///F:/eleven-web/eleven-web/components/v3/WaitlistModal.tsx) (+24 / -5 lines): Added amber feedback state for existing registration confirmation, preserving input on failure for retry.
4. [`package.json`](file:///F:/eleven-web/eleven-web/package.json) (+2 / -1 lines): Added `"test:waitlist": "node --test --experimental-strip-types tests/waitlist_persistence.test.mjs"`.
5. [`supabase/schema.sql`](file:///F:/eleven-web/eleven-web/supabase/schema.sql) (+22 / -7 lines): Synchronized schema with updated RLS grants and `SET search_path = public` on triggers.

### 2.2. New Files & Directories
1. [`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql): Standalone idempotent migration file for the Supabase SQL Editor.
2. [`tests/waitlist_persistence.test.mjs`](file:///F:/eleven-web/eleven-web/tests/waitlist_persistence.test.mjs): 13 automated test cases validating API cases, edge conditions, and frontend contracts.
3. [`ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md`](file:///F:/eleven-web/eleven-web/ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md): Human-readable operator deployment guide.
4. [`ELEVEN_WAITLIST_PRODUCTION_IMPLEMENTATION_REPORT.md`](file:///F:/eleven-web/eleven-web/ELEVEN_WAITLIST_PRODUCTION_IMPLEMENTATION_REPORT.md): Comprehensive implementation report.

---

## 3. Database Security Audit

### 3.1. Row Level Security & Table Privileges
* **RLS Enforcement:** `ALTER TABLE public.waitlist_registrations ENABLE ROW LEVEL SECURITY;` is present and active.
* **Public Privilege Revocation:** `REVOKE ALL ON public.waitlist_registrations FROM anon, authenticated, public;` successfully prevents unauthorized reads, inserts, updates, or deletes through the public Data API.
* **Service Role Grant:** `GRANT ALL ON public.waitlist_registrations TO service_role;` and policy `"Service role managed access"` correctly limit database operations to the Next.js server runtime using `SUPABASE_SERVICE_ROLE_KEY`.
* **Classification:** **`PASS`**

### 3.2. Email Index & Normalization Parity
* **Index Expression:** `CREATE UNIQUE INDEX IF NOT EXISTS waitlist_registrations_email_idx ON public.waitlist_registrations (lower(trim(email)));`
* **API Normalization:** `const cleanEmail = email.trim().toLowerCase();` in `app/api/waitlist/route.ts`.
* **Parity:** The index expression strictly matches the API normalization logic. Case variations (e.g. `User@domain.com` vs `user@domain.com`) map to the identical index entry.
* **Classification:** **`PASS`**

### 3.3. Duplicate Submission & Concurrency Policy
* **Single Request Duplicate:** The API queries `waitlist_registrations` by email first. If found, it updates the record's tier, name, intended use, and `updated_at`, returning HTTP 200 with `status: "already_registered"`.
* **Concurrent Submission Race Condition:** If two simultaneous requests for the same email bypass the initial SELECT query in parallel, the unique index on PostgreSQL enforces database-level uniqueness and triggers error code `23505`. The API explicitly catches `23505` and returns the friendly duplicate response without throwing a 500 error.
* **Classification:** **`PASS`**

### 3.4. Field Immutability on Duplicate Updates
* **Protected Invariants:** When an existing user re-submits:
  * `id`: Never modified.
  * `email`: Never modified.
  * `created_at`: Never modified (preserves user queue position).
  * `consent`: Never modified or downgraded (remains `true`).
* **Updatable Invariants:** `name` (if provided), `intended_use` (if provided), `tier`, `ip_hash`, and `updated_at`.
* **Classification:** **`PASS`**

### 3.5. Trigger Functions & `search_path` Security
* **Trigger:** `handle_waitlist_updated_at()` is defined as `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`.
* **Defense:** Explicit `SET search_path = public` prevents malicious search path overrides when executed with elevated privileges.
* **Classification:** **`PASS`**

### 3.6. Security Finding: Function Execution Privileges on `purge_waitlist_registration`

> [!WARNING]
> **FINDING: SECURITY DEFINER Function Lacks Explicit Privilege Revocation**  
> **Severity:** High (Potential Privilege Escalation / Unauthorized Data Purge)  
> **Description:** In PostgreSQL, newly created functions in the `public` schema grant `EXECUTE` privilege to `PUBLIC` by default. Because `purge_waitlist_registration(target_email TEXT)` is defined with `SECURITY DEFINER`, any unauthenticated client could invoke `rpc/purge_waitlist_registration` via Supabase PostgREST Data API to delete another user's registration without authorization.  
> **Required Hardening:** The migration script and schema must revoke public execute access and grant execute only to `service_role`:
> ```sql
> REVOKE EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) FROM PUBLIC, anon, authenticated;
> GRANT EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) TO service_role;
> 
> REVOKE EXECUTE ON FUNCTION public.handle_waitlist_updated_at() FROM PUBLIC, anon, authenticated;
> GRANT EXECUTE ON FUNCTION public.handle_waitlist_updated_at() TO service_role;
> ```
> **Classification:** **`REQUIRES OPERATOR ACTION`**

---

## 4. API & Abuse-Protection Audit

### 4.1. Input Validation & Sanitization
* **Email:** Trimmed, lowercased, length <= 255, validated against RFC 5322 regex.
* **Category / Tier:** Enforces `'general' | 'technical'`. Unrecognized categories return HTTP 400 (`"Invalid registration category."`).
* **Consent:** Requires boolean `consent === true`. Missing consent returns HTTP 400.
* **XSS Defense:** `name` and `intendedUse` strip HTML tags via `.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim()` and enforce strict character caps (100 and 300 characters, respectively).
* **Payload Cap:** Enforces 4,096-byte body limit (`MAX_BODY_BYTES`) before JSON parsing to protect against memory exhaustion.
* **Classification:** **`PASS`**

### 4.2. Honeypot Spam Protection
* Hidden field `hp_company` is invisible to human users but filled by automated spam bots.
* Submissions containing a non-empty `hp_company` string are immediately rejected with HTTP 400 (`"Spam submission rejected."`) without querying or touching the database.
* **Classification:** **`PASS`**

### 4.3. Rate Limiting Architecture & Serverless Limitations
* **Mechanism:** Sliding-window limiter bounded to 5,000 tracked IP hashes. Allows max 5 requests per 10 minutes per IP.
* **Response:** Returns HTTP 429 with header `Retry-After: 600` and `Cache-Control: no-store`.
* **Privacy:** Raw IP is never stored. Hashed via SHA-256 with salt: `crypto.createHash("sha256").update(rawIp + salt).digest("hex")`.
* **Serverless Limitation:**
  > [!IMPORTANT]
  > Because Vercel serverless functions are stateless and spin up in isolated containers, the in-memory `Map` provides **per-container burst protection**, not global rate limiting. Cold starts and concurrent requests routed to different edge containers will maintain independent rate limit counters.
  > If global distributed rate limiting is required under heavy load, an external store such as Upstash Redis (`@upstash/ratelimit`) must be integrated.
* **Classification:** **`PASS`**

### 4.4. Error Handling & Information Leakage
* Missing credentials return honest HTTP 503 (`pending_backend`) without claiming registration succeeded.
* Database failures return HTTP 502 (`"Persistent storage service encountered an error. Please try again later."`).
* Server-side console logs output only error codes (e.g. `insertError.code || "UNKNOWN"`). No passwords, connection strings, emails, or PII are logged or returned to the browser.
* **Classification:** **`PASS`**

---

## 5. Frontend Behavior Audit

### 5.1. Truthful Feedback & State Transitions
* **Success Gate:** The success screen is displayed **only** when `res.ok && data.success` is true. If the database returns 502/503, the modal remains on the form and displays the error banner.
* **Duplicate State:** If `data.isDuplicate` is true, the modal renders an amber notification (`ℹ Existing registration confirmed`) with the friendly refresh message.
* **Form Preservation & Retry:** In the event of a validation error or network failure, form fields (`email`, `name`, `intendedUse`, `tier`, `consent`) remain populated, allowing the user to correct input and retry immediately.
* **Accidental Double-Submission:** `loading` state immediately disables the submit button (`disabled={loading}`) and inputs, and updates button text to `"Validating…"`.
* **Classification:** **`PASS`**

### 5.2. Modal Accessibility & Design Integrity
* Focus trapping, `Escape` key listener, and `document.body` scroll-lock cleanup are fully maintained.
* Hydration safety guaranteed via `useSyncExternalStore`.
* Quiet Authority design tokens (`bg-el-sec-graphite`, `text-el-sec-lime`, `border-white/10`, warm porcelain typography) are strictly preserved.
* **Classification:** **`PASS`**

---

## 6. Automated Verification Results

All four automated verification suites were executed directly in the repository. Actual results and exit codes:

### 6.1. Waitlist Automated Tests
```bash
$ npm run test:waitlist
> eleven-web@0.1.0 test:waitlist
> node --test --experimental-strip-types tests/waitlist_persistence.test.mjs

✔ GET /api/waitlist reports readiness based on environment variables (11.4ms)
✔ POST /api/waitlist returns honest 503 when Supabase credentials are missing (5.0ms)
✔ POST /api/waitlist successfully persists a valid new registration (4.4ms)
✔ POST /api/waitlist handles duplicate email with friendly message and no duplicate row (3.1ms)
✔ POST /api/waitlist handles race condition duplicate via Postgres unique constraint 23505 (2.6ms)
✔ POST /api/waitlist rejects invalid email formats (4.8ms)
✔ POST /api/waitlist rejects invalid category/tier (1.3ms)
✔ POST /api/waitlist rejects missing consent (1.0ms)
✔ POST /api/waitlist rejects honeypot bot submissions (1.1ms)
✔ POST /api/waitlist enforces sliding window rate limiting (5 req/10 min) (4.1ms)
✔ POST /api/waitlist handles Supabase database storage failure gracefully (2.3ms)
✔ POST /api/waitlist handles network/connection exception gracefully (1.8ms)
✔ Frontend response contracts match WaitlistModal UI expectations (4.2ms)

ℹ tests 13 | pass 13 | fail 0 | cancelled 0
```
* **Exit Code:** `0`
* **Status:** **`PASS`**

---

### 6.2. TypeScript Compiler Check
```bash
$ npx tsc --noEmit
```
* **Exit Code:** `0` (Zero compiler errors across the entire codebase).
* **Status:** **`PASS`**

---

### 6.3. Production Turbopack Build
```bash
$ npm run build
> eleven-web@0.1.0 build
> next build

▲ Next.js 16.4.3 (Turbopack)
✓ Running next.config.ts took 3.9s
✓ Compiled successfully in 94s
✓ Generating static pages using 3 workers (25/25) in 6.5s
Finalizing page optimization ...

Route (app)
├ ƒ /api/waitlist
└ ○ (25 static routes prerendered)
```
* **Exit Code:** `0` (Zero build errors; `/api/waitlist` correctly identified as dynamic server-rendered route).
* **Status:** **`PASS`**

---

### 6.4. ESLint Compliance Check
```bash
$ npm run lint
> eleven-web@0.1.0 lint
> eslint

F:\eleven-web\eleven-web\app\api\waitlist\route.ts
  19:28  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 28 problems (1 error, 27 warnings)
```
* **Exit Code:** `1`
* **Defect Location:** `app/api/waitlist/route.ts` line 19.
* **Finding:** In `route.ts`, `SupabaseFactory` was declared as:
  ```typescript
  export type SupabaseFactory = (url: string, serviceRoleKey: string) => {
    from: (table: string) => any;
  };
  ```
* **Recommended Fix:** Replace `any` with `ReturnType<typeof createClient>` or an explicit interface:
  ```typescript
  export type SupabaseFactory = (url: string, serviceRoleKey: string) => ReturnType<typeof createClient>;
  ```
  This immediately eliminates the ESLint error and brings `npm run lint` to exit code 0.
* **Status:** **`WARNING / DEFECT IDENTIFIED`**

---

## 7. Supabase Operator Readiness & Setup Audit

Review of [`ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md`](file:///F:/eleven-web/eleven-web/ELEVEN_WAITLIST_SUPABASE_SETUP_GUIDE.md) confirms:
1. **Migration Path:** Explicit path to [`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql) provided with complete SQL text.
2. **Environment Variable Names:** Accurately specifies `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `WAITLIST_SALT`.
3. **Environment Isolation:** Clear guidelines to keep Production credentials separate from Preview/Development.
4. **Credential Safety:** Explicit instructions that secrets must never be pasted in chat, committed to Git, or named with `NEXT_PUBLIC_`.

### Operator Deployment Checklist

1. [ ] **Apply RPC Revoke Hardening:** In `supabase/migrations/20261101_waitlist_registrations.sql`, append the function execution revoke statements:
   ```sql
   REVOKE EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) FROM PUBLIC, anon, authenticated;
   GRANT EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) TO service_role;
   ```
2. [ ] **Execute Migration:** Run the migration script in the [Supabase SQL Editor](https://supabase.com/dashboard).
3. [ ] **Copy Service Role Key:** From Supabase **Project Settings > API**, copy the `service_role` secret key.
4. [ ] **Set Vercel Environment Variables:** Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a generated 32-character `WAITLIST_SALT` to Vercel **Settings > Environment Variables** (Production).
5. [ ] **Fix Linter Typing:** Apply the suggested fix for line 19 in `app/api/waitlist/route.ts` so `npm run lint` returns 0.
6. [ ] **Redeploy & Verify:** Trigger a production redeployment in Vercel and verify `/api/waitlist` returns `{"status":"ready","persistenceConfigured":true}`.

---

## 8. Final Conclusion & Recommendation

The Supabase waitlist persistence implementation is architecturally sound, thoroughly tested, and resilient.

**Final Recommendation:** **`APPROVED WITH CONDITIONS`**

*All audit criteria are met subject to the operator applying the RPC execution revoke in Supabase and resolving the TypeScript `no-explicit-any` linter finding in `app/api/waitlist/route.ts`.*
