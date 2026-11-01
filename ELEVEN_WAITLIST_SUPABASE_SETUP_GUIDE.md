# ELEVEN — Supabase PostgreSQL Waitlist Setup Guide

**Target Application:** ELEVEN v3.1 Web Platform  
**Production Domain:** [https://eleven-website-self.vercel.app/](https://eleven-website-self.vercel.app/)  
**Target Repository:** `F:\eleven-web\eleven-web`  
**Audience:** Human Operations & DevOps Lead  
**Security Classification:** Strict Operator Confidential (Zero Secrets in Chat or Git)

---

## 1. Overview & Security Principles

This guide details the procedure for provisioning, configuring, and verifying the Supabase PostgreSQL database backend for ELEVEN's sovereign waitlist.

> [!CAUTION]
> **NEVER PASTE PRODUCTION SECRETS INTO CHAT OR COMMIT THEM TO GIT.**  
> The `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row Level Security policies and possesses administrative database authority. It must only be input directly into Vercel's encrypted Environment Variables console.

---

## 2. Step 1: Create or Select Supabase Project

1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project** (or select your existing ELEVEN production organization).
3. Configure project details:
   - **Name:** `eleven-production` (or preferred naming convention).
   - **Database Password:** Generate and store securely in your enterprise password manager.
   - **Region:** Choose the region closest to your primary user base or Vercel edge deployment (e.g., `East US (North Virginia)` or `West Europe (Frankfurt)`).
   - **Pricing Plan:** Free tier or Pro depending on anticipated traffic.
4. Wait approximately 2 minutes for the database cluster to finish provisioning.

---

## 3. Step 2: Execute SQL Migration

The migration is idempotent, non-destructive, and enforces strict Row Level Security (RLS) with zero public access.

1. In your Supabase Project Dashboard, navigate to the **SQL Editor** from the left navigation bar (icon `>_`).
2. Click **New query** (or open a blank editor tab).
3. Open the repository migration file located at:
   [`supabase/migrations/20261101_waitlist_registrations.sql`](file:///F:/eleven-web/eleven-web/supabase/migrations/20261101_waitlist_registrations.sql)
4. Copy the complete SQL text and paste it into the Supabase SQL Editor:

```sql
-- 1. Ensure required cryptographic extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Waitlist Table
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

-- 3. Case-Insensitive Unique Index on Email
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_registrations_email_idx 
    ON public.waitlist_registrations (lower(trim(email)));

-- 4. Query Performance Indexes
CREATE INDEX IF NOT EXISTS waitlist_registrations_tier_idx 
    ON public.waitlist_registrations (tier);

CREATE INDEX IF NOT EXISTS waitlist_registrations_created_at_idx 
    ON public.waitlist_registrations (created_at DESC);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.waitlist_registrations ENABLE ROW LEVEL SECURITY;

-- Revoke all public execution/access by default from client roles
REVOKE ALL ON public.waitlist_registrations FROM anon, authenticated, public;

-- Explicitly allow service_role internal access (used solely by server-side Next.js route)
GRANT ALL ON public.waitlist_registrations TO service_role;

DROP POLICY IF EXISTS "Service role managed access" ON public.waitlist_registrations;
CREATE POLICY "Service role managed access" 
    ON public.waitlist_registrations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. Updated Timestamp Trigger Function (with hardened search_path)
CREATE OR REPLACE FUNCTION public.handle_waitlist_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_waitlist_update ON public.waitlist_registrations;
CREATE TRIGGER on_waitlist_update
    BEFORE UPDATE ON public.waitlist_registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_waitlist_updated_at();

-- 7. Data Retention & Deletion Procedure (GDPR Compliance)
CREATE OR REPLACE FUNCTION public.purge_waitlist_registration(target_email TEXT)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM public.waitlist_registrations
    WHERE lower(trim(email)) = lower(trim(target_email));
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$;

-- 8. Hardened Function Execution Privileges
-- Revoke default public execution rights from client roles (anon, authenticated, public)
-- to prevent invocation via PostgREST RPC. Restrict strictly to service_role.
REVOKE EXECUTE ON FUNCTION public.handle_waitlist_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_waitlist_updated_at() TO service_role;

REVOKE EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) TO service_role;
```

5. Click **Run** (or press `Cmd/Ctrl + Enter`).
6. Confirm the console displays: `Success. No rows returned`.
7. Navigate to **Table Editor** > `waitlist_registrations` to confirm the table and schema are created.

---

## 4. Step 3: Obtain API Credentials

1. In the Supabase Dashboard, click the gear icon (⚙️) at the bottom left for **Project Settings**.
2. Select **API** under Configuration.
3. Locate the **Project URL**:
   - Copy the URL (format: `https://[project-ref].supabase.co`).
4. Locate the **Project API Keys**:
   - Locate the key labeled `service_role` (Secret).
   - Click **Reveal** and copy the secret key.
   > [!WARNING]
   > Do NOT copy the `anon` / `public` key. The server route requires the `service_role` key to write records into the table protected by RLS. Never publish this key or name it `NEXT_PUBLIC_...`.

---

## 5. Step 4: Configure Vercel Production Environment Variables

1. Navigate to your [Vercel Dashboard](https://vercel.com/) and select the `eleven-website` (or `eleven-website-self`) project.
2. Go to **Settings** > **Environment Variables**.
3. Add the following three environment variables:

| Variable Name | Environment Scope | Value / Source | Description |
| :--- | :--- | :--- | :--- |
| `SUPABASE_URL` | **Production** (Optional: Preview) | `https://[ref].supabase.co` | Project REST endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | **Production** | `eyJhbGciOi...` (Secret) | Server-side administrative key |
| `WAITLIST_SALT` | **Production** | `[Random 32-char Hex]` | Optional salt for IP privacy hash |

> [!TIP]
> Generate a cryptographically strong 32-byte salt in PowerShell or Bash:
> ```bash
> # PowerShell:
> -join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
> 
> # Bash:
> openssl rand -hex 32
> ```

4. Click **Save** on each variable.

---

## 6. Step 5: Environment Isolation (Production vs Preview)

To prevent testing and CI preview pull-requests from cluttering production waitlist entries:

- **Production Environment:** Contains the live `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- **Preview / Development Environments:** 
  - Either leave unconfigured (in which case `/api/waitlist` safely returns `pending_backend` with HTTP 503, as intended during offline development); OR
  - Configure with a separate, isolated Supabase staging project (`eleven-staging`).

---

## 7. Step 6: Trigger Production Deployment & Verification

1. In Vercel, go to the **Deployments** tab.
2. Trigger a redeploy of commit `ac35786` (or promote the latest release) so that the newly configured environment variables are injected into the runtime container.
3. Once the deployment status turns **Ready**:
   - Run a GET probe in your terminal to verify backend readiness:
     ```bash
     curl -s https://eleven-website-self.vercel.app/api/waitlist
     ```
   - Confirm the JSON output reports:
     ```json
     {
       "status": "ready",
       "endpoint": "/api/waitlist",
       "persistenceConfigured": true,
       "provider": "supabase_postgres",
       "table": "waitlist_registrations"
     }
     ```

---

## 8. Step 7: Verify a Live Waitlist Registration

1. Visit [https://eleven-website-self.vercel.app/](https://eleven-website-self.vercel.app/).
2. Click **Join Early Access** (or **Request Technical Access**).
3. Enter your test email (e.g., `operator-test@eleven.io`), select the checkbox, and click submit.
4. Verify the modal displays:
   - `✓ Registration confirmed & persisted`
   - `Thank you for joining the ELEVEN early access list...`
5. Test duplicate registration:
   - Re-open the modal and submit the same email again.
   - Verify the modal displays the friendly amber notice:
     - `ℹ Existing registration confirmed`
     - `You are already registered on the ELEVEN waitlist! We have refreshed your access profile.`
6. In the Supabase Dashboard:
   - Go to **Table Editor** > `waitlist_registrations`.
   - Confirm exactly **one** row exists for `operator-test@eleven.io`, showing `tier`, hashed `ip_hash`, and updated timestamp.

---

## 9. Step 8: Safe Credential Rotation

If the `SUPABASE_SERVICE_ROLE_KEY` is ever compromised or scheduled for periodic rotation:

1. In the Supabase Dashboard, go to **Project Settings** > **API**.
2. Click **JWT Settings** > **Generate new secret** (or regenerate the service role API key).
3. Immediately update `SUPABASE_SERVICE_ROLE_KEY` in Vercel **Settings** > **Environment Variables**.
4. Trigger an immediate redeployment on Vercel to load the new key.
5. Probe `/api/waitlist` to confirm continuous operation.
