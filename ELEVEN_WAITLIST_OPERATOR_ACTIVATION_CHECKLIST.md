# ELEVEN — Waitlist Operator Activation Checklist

**Target Application:** ELEVEN v3.1 Web Platform  
**Production URL:** [https://eleven-website-self.vercel.app/](https://eleven-website-self.vercel.app/)  
**Target Repository:** `F:\eleven-web\eleven-web`  
**Security Classification:** Strict Operator Confidential (Zero Secrets in Chat or Git)  
**Execution Mode:** Human Operator Runbook (Controlled, Step-by-Step Activation)

---

## 1. Overview & Operating Rules

This checklist guides the human operator through the final activation of ELEVEN's sovereign waitlist backend on Supabase PostgreSQL and Vercel.

> [!CAUTION]
> **Strict Operational Invariants:**
> 1. **Zero Credential Exposure:** Never paste production keys (`SUPABASE_SERVICE_ROLE_KEY`) into chat, Git commits, PRs, or public channels. Only enter them directly into Vercel's encrypted environment variables console.
> 2. **Controlled Test Data:** Use only the dedicated test address `operator-activation-test@eleven.io` for live probes.
> 3. **Clean Teardown:** Execute the purge procedure immediately after testing to leave the production database with zero test residue.

---

## 2. Phase 1 — Supabase Database Migration & Verification

### [ ] Step 1.1: Open Supabase Project SQL Editor
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (e.g., `eleven-production`).
3. Click the **SQL Editor** icon (`>_`) in the left navigation sidebar.
4. Click **New query** (or open a blank query tab).

### [ ] Step 1.2: Execute Schema Migration
1. Copy the full contents of [`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql).
2. Paste the SQL text into the Supabase SQL Editor.
3. Click **Run** (or press `Cmd/Ctrl + Enter`).
4. **Expected Result:** `Success. No rows returned`.

> [!NOTE]
> The migration is fully repeatable and idempotent. Re-running it will not cause duplicate key errors or destroy existing data.

---

### [ ] Step 1.3: Run Catalog Diagnostic Queries
Paste and execute the following verification block in the Supabase SQL Editor to confirm the schema, indexes, RLS, and permissions:

```sql
-- Diagnostic 1: Verify Table and RLS Status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'waitlist_registrations';
-- Expected: rls_enabled = true

-- Diagnostic 2: Verify RLS Policies
SELECT 
    policyname, 
    roles, 
    cmd 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'waitlist_registrations';
-- Expected: Policy 'Service role managed access' for roles {service_role}

-- Diagnostic 3: Verify Zero Client Table Privileges
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' AND table_name = 'waitlist_registrations';
-- Expected: Only 'service_role' and 'postgres'. Zero entries for 'anon', 'authenticated', or 'PUBLIC'.

-- Diagnostic 4: Verify Indexes
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'waitlist_registrations';
-- Expected: pkey, email_idx (lower(trim(email))), tier_idx, created_at_idx

-- Diagnostic 5: Verify Function Privilege Hardening (RPC Abuse Shield)
SELECT 
    routine_name, 
    grantee, 
    privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_schema = 'public' 
  AND routine_name IN ('purge_waitlist_registration', 'handle_waitlist_updated_at');
-- Expected: Only 'service_role' and 'postgres'. 'anon', 'authenticated', and 'PUBLIC' MUST NOT appear.

-- Diagnostic 6: Verify SECURITY DEFINER & search_path Protection
SELECT 
    proname, 
    prosecdef AS is_security_definer, 
    proconfig AS configuration 
FROM pg_proc 
WHERE proname IN ('purge_waitlist_registration', 'handle_waitlist_updated_at');
-- Expected: is_security_definer = true, configuration = {search_path=public}
```

---

## 3. Phase 2 — Post-Migration Database Trigger Verification

Confirm that `public.handle_waitlist_updated_at()` executes cleanly when an existing row is updated:

### [ ] Step 2.1: Run Trigger Test in SQL Editor
Paste and execute the following isolated test block in the Supabase SQL Editor:

```sql
-- 1. Insert temporary probe row with an older timestamp
INSERT INTO public.waitlist_registrations (
    email, 
    tier, 
    ip_hash, 
    created_at, 
    updated_at
) VALUES (
    'trigger-diagnostic-probe@eleven.io', 
    'general', 
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 
    now() - interval '10 minutes', 
    now() - interval '10 minutes'
);

-- 2. Execute an update on the probe row
UPDATE public.waitlist_registrations 
SET intended_use = 'Diagnostic verification of handle_waitlist_updated_at trigger' 
WHERE email = 'trigger-diagnostic-probe@eleven.io';

-- 3. Verify that the trigger refreshed updated_at
SELECT 
    email, 
    created_at, 
    updated_at, 
    (updated_at > created_at) AS trigger_updated_successfully
FROM public.waitlist_registrations 
WHERE email = 'trigger-diagnostic-probe@eleven.io';
-- Expected: trigger_updated_successfully = true

-- 4. Clean up probe row
DELETE FROM public.waitlist_registrations WHERE email = 'trigger-diagnostic-probe@eleven.io';
```

---

## 4. Phase 3 — Vercel Production Environment Configuration

### [ ] Step 3.1: Retrieve Supabase API Credentials
1. In Supabase Dashboard, click **Project Settings** (⚙️) at bottom left.
2. Navigate to **API** under Configuration.
3. Copy **Project URL**: `https://[project-id].supabase.co`.
4. Under **Project API Keys**, find the row labeled `service_role` (Secret).
5. Click **Reveal** and copy the token.

### [ ] Step 3.2: Configure Vercel Project Settings
1. Log in to [Vercel Dashboard](https://vercel.com/) and open project `eleven-website-self`.
2. Navigate to **Settings** > **Environment Variables**.
3. Add the following three variables:

| Variable Name | Value / Source | Environment Scope |
| :--- | :--- | :---: |
| `SUPABASE_URL` | `https://[project-id].supabase.co` | **Production** |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` (from Step 3.1) | **Production** |
| `WAITLIST_SALT` | Random 32+ char hex string (generate via `openssl rand -hex 32`) | **Production** |

4. Click **Save** for each variable.

---

## 5. Phase 4 — Vercel Production Redeployment & Health Check

### [ ] Step 4.1: Trigger Redeployment
1. In Vercel, navigate to the **Deployments** tab.
2. Locate the active production deployment (`ac35786` or current main).
3. Click the three dots (`...`) menu and select **Redeploy**.
4. Confirm redeployment without build cache if prompted.
5. Wait for deployment status to display: **Ready**.

### [ ] Step 4.2: Probe Public Health Endpoint
In your local command shell, execute:

```bash
curl -s https://eleven-website-self.vercel.app/api/waitlist
```

**Expected JSON Response:**
```json
{
  "status": "ready",
  "endpoint": "/api/waitlist",
  "persistenceConfigured": true,
  "provider": "supabase_postgres",
  "table": "waitlist_registrations"
}
```

> [!WARNING]
> If `"persistenceConfigured"` is `false` or status is `"pending_backend"`, verify that the environment variables were saved under the **Production** environment scope in Vercel and that the redeployment has completed.

---

## 6. Phase 5 — Service-Role API Persistence Verification

Test the live API route end-to-end using the controlled test address `operator-activation-test@eleven.io`.

### [ ] Step 5.1: Test Fresh Registration (Insert)
Execute via terminal:

```bash
curl -s -X POST https://eleven-website-self.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator-activation-test@eleven.io",
    "name": "Operator Activation Lead",
    "intendedUse": "Production verification probe",
    "tier": "technical",
    "consent": true
  }'
```

**Expected Response (HTTP 200):**
```json
{
  "success": true,
  "status": "persisted",
  "isDuplicate": false,
  "id": "<generated-uuid>",
  "tier": "technical",
  "message": "Your technical access request has been recorded. Our engineering team will review your specifications."
}
```

---

### [ ] Step 5.2: Test Duplicate Handling & Profile Refresh
Submit the identical email a second time to verify graceful deduplication:

```bash
curl -s -X POST https://eleven-website-self.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator-activation-test@eleven.io",
    "name": "Operator Activation Lead (Updated)",
    "intendedUse": "Testing duplicate profile refresh",
    "tier": "technical",
    "consent": true
  }'
```

**Expected Response (HTTP 200):**
```json
{
  "success": true,
  "status": "already_registered",
  "isDuplicate": true,
  "id": "<same-uuid>",
  "tier": "technical",
  "message": "You are already registered on the ELEVEN waitlist! We have refreshed your access profile."
}
```

---

### [ ] Step 5.3: Verify in Supabase Table Editor
1. In Supabase Dashboard, go to **Table Editor** > `waitlist_registrations`.
2. Confirm exactly **one** record exists for `operator-activation-test@eleven.io`.
3. Confirm that `name` is `"Operator Activation Lead (Updated)"` and `updated_at > created_at`.

---

## 7. Phase 6 — Safe Test Data Purge & Final Signoff

Clean up the controlled test record using the hardened stored procedure:

### [ ] Step 6.1: Execute Purge in Supabase SQL Editor
In the Supabase SQL Editor, run:

```sql
SELECT public.purge_waitlist_registration('operator-activation-test@eleven.io');
```

**Expected Result:** Returns `true` (indicating exactly 1 row deleted).

### [ ] Step 6.2: Confirm Zero Residue
Run:

```sql
SELECT count(*) AS remaining_test_records 
FROM public.waitlist_registrations 
WHERE email = 'operator-activation-test@eleven.io';
```

**Expected Result:** `remaining_test_records = 0`.

---

## 8. Summary of Completed Local Artifacts & Operator Responsibilities

### Local Artifacts Completed & Verified
* [`app/api/waitlist/route.ts`](file:///F:/eleven-web/eleven-web/app/api/waitlist/route.ts): Hardened server-side handler with typed mock factory and sanitized error handling.
* [`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql): Production schema with RLS, least-privilege RPC execution, and GDPR purge routine.
* [`supabase/schema.sql`](file:///F:/eleven-web/eleven-web/supabase/schema.sql): Canonical repository schema synchronized with migration.
* [`tests/waitlist_persistence.test.mjs`](file:///F:/eleven-web/eleven-web/tests/waitlist_persistence.test.mjs): 13/13 automated tests passing.
* Verification Suite: `npm run lint` (0 errors), `npx tsc --noEmit` (0 errors), `npm run build` (25/25 routes compiled).

### Remaining Operator Actions
1. Execute migration in Supabase SQL Editor (Section 2).
2. Run database trigger test (Section 3).
3. Set environment variables in Vercel (Section 4).
4. Redeploy in Vercel and verify `/api/waitlist` GET probe (Section 5).
5. Run cURL persistence & duplicate check (Section 6).
6. Purge test record (Section 7).
