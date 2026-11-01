import { NextResponse } from "next/server.js";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Rate limiting: Bounded in-memory sliding window per IP hash
// Max 5 requests per 10 minutes per IP, bounded to 5,000 tracked entries
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TRACKED_IPS = 5000;
const MAX_BODY_BYTES = 4096;
const ipRequestTimestamps = new Map<string, number[]>();

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

// Internal client factory type for mocking in unit tests without production overhead
export type SupabaseFactory = (
  url: string,
  serviceRoleKey: string
) => ReturnType<typeof createClient>;

let customClientFactory: SupabaseFactory | null = null;

export function setSupabaseClientFactoryForTesting(factory: SupabaseFactory | null): void {
  customClientFactory = factory;
}

export function resetRateLimitsForTesting(): void {
  ipRequestTimestamps.clear();
}

function pruneRateLimitMap(now: number): void {
  if (ipRequestTimestamps.size < MAX_TRACKED_IPS) return;
  for (const [key, list] of ipRequestTimestamps.entries()) {
    const fresh = list.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) {
      ipRequestTimestamps.delete(key);
    } else {
      ipRequestTimestamps.set(key, fresh);
    }
  }
  // Hard cap eviction (oldest inserted keys first) if still full
  while (ipRequestTimestamps.size >= MAX_TRACKED_IPS) {
    const oldestKey = ipRequestTimestamps.keys().next().value;
    if (!oldestKey) break;
    ipRequestTimestamps.delete(oldestKey);
  }
}

function checkRateLimit(ipHash: string): boolean {
  const now = Date.now();
  pruneRateLimitMap(now);

  const timestamps = ipRequestTimestamps.get(ipHash) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestTimestamps.set(ipHash, validTimestamps);
    return false;
  }

  validTimestamps.push(now);
  ipRequestTimestamps.set(ipHash, validTimestamps);
  return true;
}

// RFC 5322 compliant email regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Safe one-way hash for client IP to avoid storing raw PII
function hashClientIp(rawIp: string): string {
  const salt = process.env.WAITLIST_SALT || "eleven_default_salt_2026";
  return crypto.createHash("sha256").update(rawIp + salt).digest("hex");
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isConfigured = Boolean(supabaseUrl && supabaseKey);

  return NextResponse.json(
    {
      status: isConfigured ? "ready" : "pending_backend",
      endpoint: "/api/waitlist",
      persistenceConfigured: isConfigured,
      provider: "supabase_postgres",
      table: "waitlist_registrations",
    },
    { headers: NO_STORE_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    // 0. Guard against oversized request payloads before parsing JSON
    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader && Number(contentLengthHeader) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "Request payload too large." },
        { status: 413, headers: NO_STORE_HEADERS }
      );
    }

    // 1. Client IP identification & privacy-preserving hash
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const rawClientIp = (forwardedFor ? forwardedFor.split(",")[0] : realIp || "127.0.0.1").trim();
    const clientIpHash = hashClientIp(rawClientIp);

    // 2. Enforce IP rate limiting
    if (!checkRateLimit(clientIpHash)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submission attempts. Please wait 10 minutes before trying again.",
        },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            "Retry-After": "600",
          },
        }
      );
    }

    // 3. Parse and validate JSON payload with strict byte cap
    let body: Record<string, unknown>;
    try {
      const rawText = await request.text();
      if (rawText.length > MAX_BODY_BYTES) {
        return NextResponse.json(
          { success: false, error: "Request payload too large." },
          { status: 413, headers: NO_STORE_HEADERS }
        );
      }
      const parsed = JSON.parse(rawText);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Expected JSON object");
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const {
      email,
      name,
      intendedUse,
      tier = "general",
      consent,
      hp_company, // Honeypot field for bot detection
    } = body;

    // 4. Honeypot check (Silent rejection of automated spam bots)
    if (typeof hp_company === "string" && hp_company.trim().length > 0) {
      return NextResponse.json(
        { success: false, error: "Spam submission rejected." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 5. Validate email
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 255 || !EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 6. Validate explicit consent
    if (consent !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "You must accept the communication consent to proceed.",
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 7. Validate registration tier/category
    if (tier !== "general" && tier !== "technical") {
      return NextResponse.json(
        { success: false, error: "Invalid registration category." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }
    const validTier: "general" | "technical" = tier;

    // 8. Sanitize optional name and intendedUse (strip HTML tags & control chars, cap length)
    const cleanName =
      typeof name === "string"
        ? name.trim().slice(0, 100).replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim()
        : null;

    const cleanIntendedUse =
      typeof intendedUse === "string"
        ? intendedUse.trim().slice(0, 300).replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim()
        : null;

    // 9. Inspect Supabase credentials
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // CRITICAL: If credentials are missing, do not claim success.
    // Strictly follow rule: "Make successful responses mean the registration was actually persisted."
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          status: "pending_backend",
          error:
            "Persistent cloud database is currently unconfigured. Early access registration will open upon production backend deployment.",
        },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    // 10. Execute parameterized persistence via Supabase client
    try {
      const supabase = customClientFactory
        ? customClientFactory(supabaseUrl, supabaseServiceKey)
        : createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          });

      // Check if registration already exists for this email
      const { data: existing, error: selectError } = await supabase
        .from("waitlist_registrations")
        .select("id, tier, created_at")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (selectError) {
        console.error("Waitlist DB select error:", selectError.code || "UNKNOWN");
        return NextResponse.json(
          {
            success: false,
            error: "Persistent storage service encountered an error. Please try again later.",
          },
          { status: 502, headers: NO_STORE_HEADERS }
        );
      }

      if (existing) {
        // Friendly duplicate response without creating another row; refresh profile
        const { error: updateError } = await supabase
          .from("waitlist_registrations")
          .update({
            name: cleanName || undefined,
            intended_use: cleanIntendedUse || undefined,
            tier: validTier,
            ip_hash: clientIpHash,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Waitlist DB update error:", updateError.code || "UNKNOWN");
          return NextResponse.json(
            {
              success: false,
              error: "Persistent storage service encountered an error. Please try again later.",
            },
            { status: 502, headers: NO_STORE_HEADERS }
          );
        }

        return NextResponse.json(
          {
            success: true,
            status: "already_registered",
            isDuplicate: true,
            id: existing.id,
            tier: validTier,
            message:
              "You are already registered on the ELEVEN waitlist! We have refreshed your access profile.",
          },
          { headers: NO_STORE_HEADERS }
        );
      }

      // Fresh new registration
      const { data: inserted, error: insertError } = await supabase
        .from("waitlist_registrations")
        .insert({
          email: cleanEmail,
          name: cleanName,
          intended_use: cleanIntendedUse,
          tier: validTier,
          consent: true,
          ip_hash: clientIpHash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id, tier, created_at")
        .single();

      if (insertError) {
        // Concurrency edge case: Unique constraint violation (Postgres 23505)
        if (insertError.code === "23505") {
          return NextResponse.json(
            {
              success: true,
              status: "already_registered",
              isDuplicate: true,
              tier: validTier,
              message:
                "You are already registered on the ELEVEN waitlist! We have refreshed your access profile.",
            },
            { headers: NO_STORE_HEADERS }
          );
        }

        console.error("Waitlist DB insert error:", insertError.code || "UNKNOWN");
        return NextResponse.json(
          {
            success: false,
            error: "Persistent storage service encountered an error. Please try again later.",
          },
          { status: 502, headers: NO_STORE_HEADERS }
        );
      }

      // Success guarantees actual database persistence
      return NextResponse.json(
        {
          success: true,
          status: "persisted",
          isDuplicate: false,
          id: inserted?.id,
          tier: validTier,
          message:
            validTier === "technical"
              ? "Your technical access request has been recorded. Our engineering team will review your specifications."
              : "Thank you for joining the ELEVEN early access list. You will receive an invitation when the preview opens.",
        },
        { headers: NO_STORE_HEADERS }
      );
    } catch {
      console.error("Database connection exception occurred during waitlist persistence.");
      return NextResponse.json(
        {
          success: false,
          error: "Database service temporarily unreachable. Please try again later.",
        },
        { status: 502, headers: NO_STORE_HEADERS }
      );
    }
  } catch {
    console.error("Waitlist API unexpected exception occurred.");
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
