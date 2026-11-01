import test from "node:test";
import assert from "node:assert/strict";

// Import route handlers and test hooks directly
const {
  GET,
  POST,
  setSupabaseClientFactoryForTesting,
  resetRateLimitsForTesting,
} = await import("../app/api/waitlist/route.ts");

test.beforeEach(() => {
  resetRateLimitsForTesting();
  setSupabaseClientFactoryForTesting(null);
  process.env.SUPABASE_URL = "https://mock-project.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-service-role-key";
  process.env.WAITLIST_SALT = "test-salt-secret";
});

test("GET /api/waitlist reports readiness based on environment variables", async () => {
  // Configured state
  const resConfigured = await GET();
  assert.strictEqual(resConfigured.status, 200);
  const dataConfigured = await resConfigured.json();
  assert.strictEqual(dataConfigured.status, "ready");
  assert.strictEqual(dataConfigured.persistenceConfigured, true);

  // Unconfigured state
  delete process.env.SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resUnconfigured = await GET();
  assert.strictEqual(resUnconfigured.status, 200);
  const dataUnconfigured = await resUnconfigured.json();
  assert.strictEqual(dataUnconfigured.status, "pending_backend");
  assert.strictEqual(dataUnconfigured.persistenceConfigured, false);
});

test("POST /api/waitlist returns honest 503 when Supabase credentials are missing", async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "engineer@company.com",
      consent: true,
      tier: "technical",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 503);
  const json = await res.json();
  assert.strictEqual(json.success, false);
  assert.strictEqual(json.status, "pending_backend");
  assert.match(json.error, /unconfigured/i);
});

test("POST /api/waitlist successfully persists a valid new registration", async () => {
  let selectCalled = false;
  let insertPayload = null;

  setSupabaseClientFactoryForTesting(() => ({
    from: (table) => {
      assert.strictEqual(table, "waitlist_registrations");
      return {
        select: () => ({
          eq: (col, val) => ({
            maybeSingle: async () => {
              selectCalled = true;
              assert.strictEqual(col, "email");
              assert.strictEqual(val, "ada@lovelace.dev");
              return { data: null, error: null };
            },
          }),
        }),
        insert: (record) => {
          insertPayload = record;
          return {
            select: () => ({
              single: async () => ({
                data: {
                  id: "11111111-2222-3333-4444-555555555555",
                  tier: record.tier,
                  created_at: new Date().toISOString(),
                },
                error: null,
              }),
            }),
          };
        },
      };
    },
  }));

  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "198.51.100.1",
    },
    body: JSON.stringify({
      email: "Ada@Lovelace.Dev ", // Test trimming and lowercasing
      name: "Ada Lovelace <script>alert('xss')</script>", // Test sanitization
      intendedUse: "Analytical engine algorithms",
      consent: true,
      tier: "technical",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.strictEqual(json.status, "persisted");
  assert.strictEqual(json.isDuplicate, false);
  assert.strictEqual(json.id, "11111111-2222-3333-4444-555555555555");
  assert.strictEqual(json.tier, "technical");
  assert.match(json.message, /technical access request/i);

  assert.strictEqual(selectCalled, true);
  assert.strictEqual(insertPayload.email, "ada@lovelace.dev");
  assert.strictEqual(insertPayload.name, "Ada Lovelace alert('xss')"); // HTML tags stripped
  assert.strictEqual(insertPayload.tier, "technical");
  assert.strictEqual(insertPayload.consent, true);
  assert.ok(insertPayload.ip_hash.length > 20);
});

test("POST /api/waitlist handles duplicate email with friendly message and no duplicate row", async () => {
  let updatePayload = null;

  setSupabaseClientFactoryForTesting(() => ({
    from: (table) => {
      assert.strictEqual(table, "waitlist_registrations");
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: {
                id: "22222222-3333-4444-5555-666666666666",
                email: "existing@eleven.io",
                tier: "general",
                created_at: "2026-10-31T12:00:00Z",
              },
              error: null,
            }),
          }),
        }),
        update: (record) => {
          updatePayload = record;
          return {
            eq: async (col, val) => {
              assert.strictEqual(col, "id");
              assert.strictEqual(val, "22222222-3333-4444-5555-666666666666");
              return { data: null, error: null };
            },
          };
        },
      };
    },
  }));

  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "198.51.100.2",
    },
    body: JSON.stringify({
      email: "existing@eleven.io",
      name: "Existing User",
      consent: true,
      tier: "technical",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.strictEqual(json.status, "already_registered");
  assert.strictEqual(json.isDuplicate, true);
  assert.strictEqual(json.id, "22222222-3333-4444-5555-666666666666");
  assert.match(json.message, /already registered/i);

  assert.ok(updatePayload);
  assert.strictEqual(updatePayload.tier, "technical");
});

test("POST /api/waitlist handles race condition duplicate via Postgres unique constraint 23505", async () => {
  setSupabaseClientFactoryForTesting(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: { code: "23505", message: "duplicate key value violates unique constraint" },
          }),
        }),
      }),
    }),
  }));

  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "concurrent@eleven.io",
      consent: true,
      tier: "general",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.strictEqual(json.status, "already_registered");
  assert.strictEqual(json.isDuplicate, true);
});

test("POST /api/waitlist rejects invalid email formats", async () => {
  const invalidEmails = ["", "invalid", "missing-at.com", "spaces in@email.com", "@missing-user.com"];

  for (const badEmail of invalidEmails) {
    const req = new Request("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: badEmail,
        consent: true,
        tier: "general",
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.match(json.error, /email/i);
  }
});

test("POST /api/waitlist rejects invalid category/tier", async () => {
  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "valid@eleven.io",
      consent: true,
      tier: "enterprise_admin_bypass", // Invalid tier
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 400);
  const json = await res.json();
  assert.strictEqual(json.success, false);
  assert.strictEqual(json.error, "Invalid registration category.");
});

test("POST /api/waitlist rejects missing consent", async () => {
  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "valid@eleven.io",
      consent: false,
      tier: "general",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 400);
  const json = await res.json();
  assert.strictEqual(json.success, false);
  assert.match(json.error, /consent/i);
});

test("POST /api/waitlist rejects honeypot bot submissions", async () => {
  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "spambot@ai-crawler.org",
      consent: true,
      tier: "general",
      hp_company: "Spam Aggregator LLC",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 400);
  const json = await res.json();
  assert.strictEqual(json.success, false);
  assert.strictEqual(json.error, "Spam submission rejected.");
});

test("POST /api/waitlist enforces sliding window rate limiting (5 req/10 min)", async () => {
  setSupabaseClientFactoryForTesting(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: { id: "test-id" }, error: null }),
        }),
      }),
    }),
  }));

  const testIp = "203.0.113.42";

  // Requests 1 through 5 succeed
  for (let i = 1; i <= 5; i++) {
    const req = new Request("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": testIp,
      },
      body: JSON.stringify({
        email: `tester${i}@eleven.io`,
        consent: true,
        tier: "general",
      }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 200, `Request ${i} should have succeeded`);
  }

  // 6th request from the same IP hash is rate limited
  const reqBlocked = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": testIp,
    },
    body: JSON.stringify({
      email: "tester6@eleven.io",
      consent: true,
      tier: "general",
    }),
  });

  const resBlocked = await POST(reqBlocked);
  assert.strictEqual(resBlocked.status, 429);
  assert.strictEqual(resBlocked.headers.get("Retry-After"), "600");
  const jsonBlocked = await resBlocked.json();
  assert.strictEqual(jsonBlocked.success, false);
  assert.match(jsonBlocked.error, /too many submission attempts/i);
});

test("POST /api/waitlist handles Supabase database storage failure gracefully", async () => {
  setSupabaseClientFactoryForTesting(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: null,
            error: { code: "PGRST500", message: "Database connection timeout" },
          }),
        }),
      }),
    }),
  }));

  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "engineer@company.com",
      consent: true,
      tier: "general",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 502);
  const json = await res.json();
  assert.strictEqual(json.success, false);
  assert.match(json.error, /persistent storage service encountered an error/i);
});

test("POST /api/waitlist handles network/connection exception gracefully", async () => {
  setSupabaseClientFactoryForTesting(() => ({
    from: () => {
      throw new Error("DNS resolution failed: connection refused");
    },
  }));

  const req = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "engineer@company.com",
      consent: true,
      tier: "general",
    }),
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 502);
  const json = await res.json();
  assert.strictEqual(json.success, false);
  assert.match(json.error, /database service temporarily unreachable/i);
});

test("Frontend response contracts match WaitlistModal UI expectations", async () => {
  // Test 1: New persisted registration contract
  setSupabaseClientFactoryForTesting(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: { id: "ui-test-uuid", tier: "general", created_at: new Date().toISOString() },
            error: null,
          }),
        }),
      }),
    }),
  }));

  const reqSuccess = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "frontend.user@eleven.io", consent: true, tier: "general" }),
  });
  const resSuccess = await POST(reqSuccess);
  const jsonSuccess = await resSuccess.json();

  // WaitlistModal tests:
  assert.strictEqual(jsonSuccess.success, true);
  assert.strictEqual(jsonSuccess.isDuplicate, false);
  assert.strictEqual(typeof jsonSuccess.message, "string");
  assert.ok(jsonSuccess.message.length > 0);

  // Test 2: Existing duplicate registration contract
  setSupabaseClientFactoryForTesting(() => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: { id: "ui-dup-uuid", tier: "general", created_at: new Date().toISOString() },
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
  }));

  const reqDup = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "frontend.dup@eleven.io", consent: true, tier: "general" }),
  });
  const resDup = await POST(reqDup);
  const jsonDup = await resDup.json();

  // WaitlistModal tests:
  assert.strictEqual(jsonDup.success, true);
  assert.strictEqual(jsonDup.isDuplicate, true);
  assert.strictEqual(typeof jsonDup.message, "string");
  assert.match(jsonDup.message, /already registered/i);

  // Test 3: Actionable error for retry
  const reqError = new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "invalid", consent: true, tier: "general" }),
  });
  const resError = await POST(reqError);
  const jsonError = await resError.json();

  assert.strictEqual(resError.status, 400);
  assert.strictEqual(jsonError.success, false);
  assert.strictEqual(typeof jsonError.error, "string");
  assert.ok(jsonError.error.length > 0);
});
