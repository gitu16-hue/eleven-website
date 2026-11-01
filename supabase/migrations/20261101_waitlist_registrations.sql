-- ==============================================================================
-- ELEVEN v3 — Supabase Postgres Waitlist Schema & Security Migration
-- Migration: 20261101_waitlist_registrations.sql
-- Description: Idempotent production schema for sovereign waitlist persistence.
-- Security: RLS enabled, public access revoked, service_role access restricted.
-- ==============================================================================

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
-- Guarantees a single entry per email while handling re-submissions deterministically
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_registrations_email_idx 
    ON public.waitlist_registrations (lower(trim(email)));

-- 4. Query Performance Indexes
CREATE INDEX IF NOT EXISTS waitlist_registrations_tier_idx 
    ON public.waitlist_registrations (tier);

CREATE INDEX IF NOT EXISTS waitlist_registrations_created_at_idx 
    ON public.waitlist_registrations (created_at DESC);

-- 5. Row Level Security (RLS) Configuration
-- Enforce zero unauthorized database reads or writes
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

-- 7. Data Retention & Deletion Procedure (GDPR / Right-to-be-Forgotten Compliance)
-- Allows programmatic deletion of user records upon verified request
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
-- In PostgreSQL, functions in public are executable by PUBLIC by default.
-- Revoke execution from client roles and restrict strictly to service_role to prevent PostgREST RPC abuse.
REVOKE EXECUTE ON FUNCTION public.handle_waitlist_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_waitlist_updated_at() TO service_role;

REVOKE EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_waitlist_registration(TEXT) TO service_role;

