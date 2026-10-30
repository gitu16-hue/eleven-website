# ELEVEN — Advanced Security Visualization Experience Report

**Repository:** `f:\eleven-web\eleven-web`  
**Framework:** Next.js `16.4.3` (App Router, Turbopack) · React `19.2.8` · Three.js `0.186.1` · GSAP `3.15.0` · Tailwind CSS `v4`  
**Git Status:** Local working tree only (`HEAD` remains `3403f01` — no commits, pushes, deployments, or DNS changes executed)  
**New Dependencies Added:** `0`

---

## 1. Visual System & Palette Tokens

Added dedicated security surface tokens in [globals.css](file:///f:/eleven-web/eleven-web/app/globals.css#L67-L76) and `@theme inline` ([globals.css](file:///f:/eleven-web/eleven-web/app/globals.css#L136-L143)), plus unlayered surface polarity bindings ([globals.css](file:///f:/eleven-web/eleven-web/app/globals.css#L380-L391)) so headings preserve `>14.8:1` WCAG AAA contrast across dark and Cold-Room cards:

| Token | Hex | Surface Role |
| :--- | :--- | :--- |
| `--el-sec-graphite` | `#171A18` | Primary computational inspection shell |
| `--el-sec-porcelain` | `#F5F5F0` | High-contrast Cold-Room permission & active boundary cards |
| `--el-sec-lime` | `#B8F36B` | Verified gate progression, active layer focus, curved SVG trail |
| `--el-sec-sage` | `#647A6A` | Hairline structural borders, unvisited path segments, secondary labels |

---

## 2. Implemented Components & Integrations

### Component A — Interactive Threat Interception Bento Grid
- **Source:** [ThreatInterceptionBento.tsx](file:///f:/eleven-web/eleven-web/components/security/ThreatInterceptionBento.tsx)
- **Mounted at:** [app/security/page.tsx](file:///f:/eleven-web/eleven-web/app/security/page.tsx#L121-L135) (`#threat-simulation`)
- **Capabilities:**
  - Prominent **`Interactive security simulation`** disclosure pill (`Deterministic policy specification model · No live OS daemon or attack telemetry connected`).
  - 4 interactive scenarios (`Indirect Prompt Injection`, `External Git Branch Push`, `Sandbox Path Traversal Attempt`, `Read-Only Local Workspace Search`) navigable via click or `ArrowLeft` / `ArrowRight` / `Home` / `End` (`role="tablist"`).
  - 5 coordinated inspection cells: **01 · Task & Input Inspection** (live `Inspect Raw Input` / `Show Sanitized` secret-redaction toggle), **02 · Policy Evaluation**, **03 · Permission Boundary** (Warm Porcelain `#F5F5F0` Cold-Room card with stateful `Authorize 30s Nonce` / `Deny & Quarantine` / `Reset Hold` actions), **04 · Sandbox Boundary**, and **05 · Result & Audit** (interactive `Inspect JSON` simulated receipt + `Copy JSON`, plus `Step Gate` / `Reset` controls).
  - Synchronizes terminology depth with `useClarityMode()` (`Simple View` vs. `Engineer Spec`).

### Component B — Scroll-Scrubbed 3D Exploded Layer Stack
- **Source:** [ExplodedLayerStack3D.tsx](file:///f:/eleven-web/eleven-web/components/security/ExplodedLayerStack3D.tsx) + [useSecurityEnv.ts](file:///f:/eleven-web/eleven-web/components/security/useSecurityEnv.ts)
- **Mounted at:** [app/security/page.tsx](file:///f:/eleven-web/eleven-web/app/security/page.tsx#L139-L154) (`#exploded-security-stack`) and [app/architecture/page.tsx](file:///f:/eleven-web/eleven-web/app/architecture/page.tsx#L211-L234) (`#exploded-layer-stack`)
- **Capabilities:**
  - Maps the 7 documented ELEVEN layers (`L07` Operator HUD → `L06` Duplex Voice → `L05` Dual-Mind Bus → `L04` 5-Stage Control Plane → `L03` Swarm Evidence Gate → `L02` Sandboxed Worker Runtime → `L01` Loopback Memory Vault).
  - Deterministic scroll choreography (`Unified Stack` → `Separating` → `L07..L01` active sweep → `Reconnected`) with manual separation slider (`0%–100%`) and `Sync Scroll` restore control.
  - **On-Demand Frame Scheduler (`0` Idle FPS):** Uses frame-rate-independent exponential damping that halts `requestAnimationFrame` (`data-render-state="idle"`) immediately upon settling; `touch-action: pan-y` preserves native page scroll responsiveness.
  - **Accessible Fallbacks:** Automatically renders `StaticExplodedDiagramSVG` when `prefers-reduced-motion: reduce` is active or when WebGL is unavailable (`?webgl=0` or failed context initialization).

### Component C — Curved SVG Route Stepper
- **Source:** [CurvedGovernanceRouteStepper.tsx](file:///f:/eleven-web/eleven-web/components/security/CurvedGovernanceRouteStepper.tsx)
- **Mounted at:** [app/security/page.tsx](file:///f:/eleven-web/eleven-web/app/security/page.tsx#L158-L173) (`#governance-route`)
- **Capabilities:**
  - Connects **`Understand → Plan → Authorize → Execute → Verify`** along a $C^1$-continuous cubic-bezier wave path on desktop (`>= 768px`) with GSAP `getTotalLength()` / `getPointAtLength()` trail reveal and tangent-tilted vector glider, switching cleanly to a vertical curved S-wave SVG rail + stacked tablist on narrow screens (`< 768px`).
  - **Graduated Autonomy Profiles (`role="radiogroup"`):** Lets visitors switch between `Tier 0 · Read-Only Local Lookup` (`0 Prompts`), `Tier 1 · Reversible Workspace Draft` (`0 Prompts`), and `Tier 2 / 3 · External or Destructive Action` (`Cold-Room 30s Nonce Required`), accurately demonstrating that routine local work does **not** trigger manual approval popups.
  - Supports scroll-driven progression by default, manual click/keyboard step selection (`ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown` / `Home` / `End`), `Resume Scroll Sync`, and instant non-animated updates under `prefers-reduced-motion: reduce`.

---

## 3. Build, Layout, Accessibility & Browser Verification

| Gate | Scope & Method | Result |
| :--- | :--- | :--- |
| **TypeScript** | `npx tsc --noEmit` | **PASS** (`0` errors) |
| **ESLint** | `npm run lint` | **PASS** (`0` errors; `0` warnings in all security/modified files) |
| **Production Build** | `npm run build` (Next.js `16.4.3` Turbopack) | **PASS** (`24/24` static & dynamic routes compiled) |
| **Security Headers** | Live HTTP check against `next start` | **PASS** (`CSP` without `unsafe-eval`, `HSTS`, `COOP: same-origin`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`) |
| **Preserved Infrastructure** | `/api/waitlist`, `/robots.txt`, `/sitemap.xml`, JSON-LD (`3` schemas on `/security`), `Nav`, `Breadcrumbs`, `Footer` | **PASS** (`400` honeypot, `413` `>4KB` payload, `503` fail-closed when Supabase env unset, GEO crawler rules intact) |
| **Responsive Layout Sweep** | `6` routes × `6` viewports (`390px`, `768px`, `1024px`, `1280px`, `1366px`, `1440px` = `36` checks) | **PASS** (`0px` horizontal overflow, `navClipped=false` across all `36/36` checks) |
| **On-Demand 3D Rendering** | Headless Chromium scroll scrub to `48%` & `98%` | **PASS** (`framesAfterSettle1 = 7`, `framesAfterSettle2 = 7` → **`0` idle FPS**; `RECONNECTED` at `98%`) |
| **Keyboard & Fallbacks** | `ArrowRight` tab focus, `prefers-reduced-motion: reduce`, and `?webgl=0` | **PASS** (`StaticExplodedDiagramSVG` rendered cleanly in both fallback modes) |
| **Console & Hydration** | Chromium `Runtime.exceptionThrown` + `Runtime.consoleAPICalled` on `/` and `/security` | **PASS** (`0` hydration mismatches, `0` console errors) |

---

## 4. Truthfulness Audit: Verified Controls vs. Unverified Target OS Specifications

Per project safety and truthfulness requirements, no live telemetry was invented, and all controls were audited against actual source code in `f:\eleven-web\eleven-web`:

### A. Controls Verified Directly in Repository Source & Live HTTP Tests
1. **HTTP Security Headers ([next.config.ts](file:///f:/eleven-web/eleven-web/next.config.ts#L5-L64)):** Enforces strict production `Content-Security-Policy` (no `unsafe-eval`), `Strict-Transport-Security`, `Cross-Origin-Opener-Policy: same-origin`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and zero-device `Permissions-Policy`.
2. **Waitlist API Hardening ([app/api/waitlist/route.ts](file:///f:/eleven-web/eleven-web/app/api/waitlist/route.ts)):** Enforces `4,096`-byte request body cap (`413`), salted SHA-256 IP rate limiting (`5` requests / `10` min / IP, bounded to `5,000` keys), honeypot bot rejection (`hp_company` → `400`), RFC 5322 email validation, HTML tag stripping, `Cache-Control: no-store, max-age=0`, and fail-closed `503` behavior in production when Supabase credentials are unconfigured. *(Caveat: rate limiting uses an in-memory `Map`, which resets across serverless cold starts unless backed by shared KV/Redis).*
3. **Supply Chain & Secret Hygiene:** `0` npm audit vulnerabilities (`npm audit` clean) and no leaked credentials in client bundles.

### B. Unsupported Architecture Assumptions / Unverified Desktop OS Behaviors (Simulated Only)
Because `f:\eleven-web\eleven-web` is the public marketing and documentation web application—not the native ELEVEN desktop runtime repository—the following subsystems have **no executable daemon, kernel policy engine, or test suite in this repository**:
1. **OS Process Fault Domains (`eleven_supervisor`, `eleven_voice`, `eleven_deep`, `eleven_hud`) & Ring-0 `<50ms` Watchdog:** Represented strictly as architectural layers (`L01`–`L07`) and target specifications.
2. **5-Stage Runtime Binaries (`TaskCompiler`, `DataMinimizer`, `ModelRouter`, `PolicyGate`, `ExecutionController`) & `INV-01`–`INV-15` Enforcement:** Modeled deterministically in browser state inside [ThreatInterceptionBento.tsx](file:///f:/eleven-web/eleven-web/components/security/ThreatInterceptionBento.tsx) and [InvariantRuleExplorer.tsx](file:///f:/eleven-web/eleven-web/components/v3/InvariantRuleExplorer.tsx) (`INVARIANT_SPEC_REGISTRY · 15 TARGET INVARIANTS`), explicitly badged **`Interactive security simulation`**.
3. **Local Encrypted Vault (`127.0.0.1` Redis / Neo4j / Qdrant AES-256-GCM) & Ed25519 Signed Hash-Chained Audit Ledger:** Sample SHA-256 / Ed25519 receipt digests in Component A include `"simulation": true` and `"runtime_connection": "offline_specification_model"` in their inspectable JSON payload so visitors and auditors never mistake simulated examples for live host telemetry.

---

## 5. Hydration & Runtime Diagnostics Audit

### A. React Hydration Mismatch on `prefers-reduced-motion: reduce` (RESOLVED)
- **Root Cause:** In [`PremiumMotion.tsx`](file:///f:/eleven-web/eleven-web/components/motion/PremiumMotion.tsx), typography components (`DualCopy`, `WordReveal`, `SpecularWordReveal`) and layout components evaluated Framer Motion's `useReducedMotion()` synchronously during render. On the server (SSR), media queries do not exist, so `reduced` evaluated to `null`/`false`. On client devices with OS Reduced Motion enabled, `useReducedMotion()` evaluated to `true` during the initial hydration render pass. This caused `active = Boolean(reduced || inView)` to evaluate to `true` on the client, setting `animate={{ opacity: 1, filter: "none", transform: "none" }}` while the server HTML had rendered `initial={{ opacity: 0, filter: "blur(5.5px)", transform: "translateY(0.42em)" }}`.
- **Fix:** Implemented [`useMountedReducedMotion()`](file:///f:/eleven-web/eleven-web/components/motion/PremiumMotion.tsx#L104-L121) which returns `false` during SSR and initial hydration pass, updating to `true` strictly post-mount via `useEffect`. The initial client render tree now matches the server HTML bit-for-bit, achieving 100% hydration parity across all routes, while reduced-motion users instantly see the text reveal in 0ms without animation lag.

### B. Three.js Deprecation Warning `THREE.Clock` (RESOLVED)
- **Root Cause:** In [`ElevenHolographicOrb3D.tsx`](file:///f:/eleven-web/eleven-web/components/three/ElevenHolographicOrb3D.tsx) and [`ControlPlaneGyro3D.tsx`](file:///f:/eleven-web/eleven-web/components/three/ControlPlaneGyro3D.tsx), `new THREE.Clock()` triggered Three.js deprecation logs in the browser console.
- **Fix:** Migrated to high-precision `performance.now()` delta-accumulator timing with automatic tab-visibility resumption, eliminating console deprecation warnings without changing 3D geometry or visual aesthetics.

