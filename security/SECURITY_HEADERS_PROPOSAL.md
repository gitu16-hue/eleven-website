# ELEVEN SECURITY HEADERS PROPOSAL

**Project:** ELEVEN Web (Next.js 16.3.5 + React 19.2.8 + TypeScript 5.9.3)  
**Date:** 2026-09-23  
**Status:** Report Only (Proposal Phase - No Code Modified)  

---

## 1. Resource Inventory

A comprehensive inspection of `app/`, `components/`, `public/`, `package.json`, `next.config.ts`, and `app/layout.tsx` yielded the following complete inventory of runtime resources:

| Resource Category | Required at Runtime? | Source / Location | Notes |
|---|---|---|---|
| **JavaScript** | Yes | Same-origin (`'self'`) compiled static bundles emitted by Next.js/Turbopack | No external JS, no third-party analytics (Google Analytics/Mixpanel), no external CDNs |
| **CSS / Styles** | Yes | Same-origin (`'self'`) compiled CSS (`app/globals.css`, Tailwind CSS v4) + inline style attributes emitted by React/Framer Motion | Framer Motion & dynamic inline styles require CSS style attribute support |
| **Fonts** | Yes | Same-origin (`'self'`) self-hosted WOFF2 font files in `/public/fonts/` (`GeistVF.woff2`, `share-tech-mono-v15-latin-regular.woff2`) | No Google Fonts or external font CDNs |
| **Images** | Yes | Same-origin (`'self'`) images in `/public/` (`gishh-logo.png`, `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) + `data:` / `blob:` URIs | No external image domains (e.g. S3, Cloudinary, Unsplash) |
| **SVG** | Yes | Same-origin (`'self'`) files in `/public/` + inline React JSX SVG elements (`Button.tsx`, `Nav.tsx`, etc.) | Rendered directly inside DOM |
| **Audio / Video** | No | None | No `<audio>` or `<video>` elements used |
| **External APIs** | No | None | Static website; no `fetch()` calls or backend API routes |
| **Analytics / Trackers**| No | None | No tracking scripts configured |
| **Third-Party Scripts** | No | None | No external `<script>` tags |
| **Embeds / Iframes** | No | None | No `<iframe>` tags or external embeds |
| **WebSockets** | No | None | No WebSocket connections opened |
| **Workers** | No | None | No Web Workers or Service Workers registered |
| **Manifests / Metadata**| Yes | Same-origin metadata defined in `app/layout.tsx` (`metadataBase: new URL("https://gishh.ai")`) | Icons point to `/gishh-logo.png` |
| **External CDNs** | No | None | All assets served directly from origin |

---

## 2. Current Header Configuration State

### Current `next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 3. Proposed Security Headers & Rationale

### 1. Content-Security-Policy (CSP)

#### Proposed Header Value
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;
```

#### Directive-by-Directive Rationale

- `default-src 'self'`:
  **Rationale:** Restricts all fallback resource fetches to the exact site origin. Anything not explicitly permitted by specialized directives defaults to same-origin only.

- `script-src 'self' 'unsafe-inline'`:
  **Rationale:** Allows scripts to load only from same-origin (`'self'`). Next.js App Router relies on inline scripts for hydration chunks and static site bootstrapping. `'unsafe-inline'` is currently required for Next.js client hydration unless nonces are generated dynamically via middleware. `'unsafe-eval'` is **omitted** because no `eval()` calls exist in the application codebase or dependencies.

- `style-src 'self' 'unsafe-inline'`:
  **Rationale:** Allows CSS to load from same-origin (`'self'`). Framer Motion and React dynamic style props set inline `style="..."` attributes on DOM elements (e.g., `SpotlightCard.tsx` gradient positions and `ScrollProgressBar.tsx` scaleX transform). `'unsafe-inline'` is necessary to prevent style blocking.

- `img-src 'self' data: blob:`:
  **Rationale:** Restricts images to same-origin. `data:` URIs are allowed for small inline graphic fallbacks, and `blob:` is allowed for Canvas/export operations if needed by `CognitiveOrb.tsx`. No third-party image domains are allowed.

- `font-src 'self'`:
  **Rationale:** Restricts web font loading to self-hosted fonts in `/public/fonts/`. No external font hosts (e.g., Google Fonts, Typekit) are allowed.

- `connect-src 'self'`:
  **Rationale:** Limits AJAX, Fetch, and WebSocket connections exclusively to same-origin. Prevents data exfiltration to unauthorized endpoints.

- `media-src 'none'`:
  **Rationale:** Completely blocks loading of audio/video elements since ELEVEN contains no media playback features.

- `object-src 'none'`:
  **Rationale:** Completely blocks legacy plugins like Flash, Java Applets, and PDF embeds.

- `frame-src 'none'`:
  **Rationale:** Prevents embedding of child `<iframe>` elements within the site.

- `worker-src 'none'`:
  **Rationale:** Disallows instantiation of Web Workers or Service Workers, matching the current asset inventory.

- `frame-ancestors 'none'`:
  **Rationale:** Prevents any site from embedding ELEVEN within an `<iframe>`, `frame`, or `<object>` (modern CSP equivalent of `X-Frame-Options: DENY`).

- `base-uri 'self'`:
  **Rationale:** Restricts `<base>` element target URLs to same-origin, preventing base-tag hijacking.

- `form-action 'self'`:
  **Rationale:** Ensures form submissions can only target same-origin endpoints.

- `upgrade-insecure-requests`:
  **Rationale:** Instructs user agents to treat all HTTP requests as HTTPS requests automatically.

---

### 2. Strict-Transport-Security (HSTS)

#### Proposed Header Value
```http
Strict-Transport-Security: max-age=31536000
```

#### Rationale & Requirements Compliance
- **Why max-age=31536000 (1 Year):** Standard 1-year duration enforces HTTPS across user visits while providing robust protection against downgrade attacks.
- **Why `preload` is OMITTED:** Preloading requires submission to Google's HSTS preload list and permanent commitment across all subdomains. Preload will only be proposed after production domain validation.
- **Why `includeSubDomains` is OMITTED:** Per guidelines, `includeSubDomains` is held until verifying that all existing subdomains under `gishh.ai` have active, valid SSL/TLS certificates configured.
- **Production-Only Execution:** HSTS will only be served over HTTPS in production environments.

---

### 3. X-Content-Type-Options

#### Proposed Header Value
```http
X-Content-Type-Options: nosniff
```

#### Rationale
Prevents browsers from MIME-sniffing responses away from the declared `Content-Type`. Crucial for preventing executable code injection via user-uploaded media or corrupted static assets.

---

### 4. Referrer-Policy

#### Proposed Header Value
```http
Referrer-Policy: strict-origin-when-cross-origin
```

#### Rationale
Sends full URL referrer on same-origin requests, only origin on cross-origin HTTPS requests, and no referrer on HTTP downgrades. Protects user privacy while retaining internal analytics utility.

---

### 5. Permissions-Policy

#### Proposed Header Value
```http
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=()
```

#### Rationale
Explicitly disables browser hardware and high-risk API access (camera, microphone, geolocation, payment request, WebUSB, WebBluetooth, WebSerial, sensors) to prevent fingerprinting or malicious hardware access.

---

### 6. X-XSS-Protection (Remediation of Deprecated State)

#### Proposed Header Value
```http
X-XSS-Protection: 0
```

#### Rationale
Changes current `1; mode=block` to `0`. Modern security standards (OWASP, W3C) mandate setting `X-XSS-Protection: 0` because legacy browser auditors have proven vulnerable to side-channel XSS reflection exploits. Defense against XSS is fully provided by our strict CSP.

---

### 7. Clickjacking Protection

#### Proposed Header Values
```http
X-Frame-Options: DENY
```
*(Combined with `frame-ancestors 'none'` inside CSP)*

#### Rationale
Provides dual-layer protection against clickjacking for both modern CSP-compliant browsers (`frame-ancestors 'none'`) and legacy user agents (`X-Frame-Options: DENY`).

---

## 4. Possible Compatibility Risks & Mitigation

| Directive / Header | Potential Risk | Mitigation |
|---|---|---|
| `script-src 'self' 'unsafe-inline'` | Next.js dynamic chunks blocked if inline script hashes change | `'unsafe-inline'` is explicitly included to ensure Next.js App Router hydration operates cleanly |
| `style-src 'self' 'unsafe-inline'` | React dynamic inline styles (e.g. `SpotlightCard.tsx` mouse gradients) blocked | `'unsafe-inline'` is explicitly included for style attributes |
| `connect-src 'self'` | External analytics or telemetry API calls blocked if added in future | Current inventory contains 0 external APIs. If analytics are added later, endpoint domain must be explicitly added to `connect-src` |
| `Strict-Transport-Security` | Access issues if HTTP (non-SSL) is used during local testing | Header will apply via `next.config.ts`, but local dev (`npm run dev`) over HTTP ignores HSTS in localhost per browser spec |

---

## 5. Verification Procedure

Once approved, implementation will be verified using the following precise steps:

1. **Production Build & Execution:**
   ```bash
   npm run build
   npm run start
   ```
2. **HTTP Header Response Inspection:**
   ```bash
   curl -I http://localhost:3000
   ```
3. **Browser Console & Network Verification:**
   - Open Chrome/Edge DevTools → Console tab.
   - Confirm **0 CSP violation warnings** appear during full page navigation (`/`, `/eleven`, `/architecture`, `/autonomy`, `/research`, `/enter`).
   - Verify Canvas 2D reactive particle orb on `/enter` renders without warning.

---

*Report generated for review. Application code and `next.config.ts` remain unmodified.*
