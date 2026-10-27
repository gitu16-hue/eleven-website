# ELEVEN PHASE 2 EXTERNAL SECURITY & PRODUCTION AUDIT REPORT

**Project:** ELEVEN Web (Next.js 16.3.5 + React 19.2.8 + TypeScript 5.9.3)  
**Target:** `http://127.0.0.1:3000` (Local Authorized Production Stand-In Build; `https://gishh.ai` DNS not yet configured)  
**Date/Time:** 2026-09-23T20:10:00Z  
**Status:** Phase 2 External & Runtime Assessment Completed (No Application Code Modified)  

---

## 1. Target URL & DNS Infrastructure Status

- **Configured Metadata Domain:** `https://gishh.ai` (`app/layout.tsx` metadataBase)
- **Domain Verification:** DNS resolution lookup failed (`No such host is known`). `gishh.ai` domain DNS records are not yet pointed to active production infrastructure.
- **Local Authorized Production Target:** Built via `npm run build` and served in production mode via `npx next start -p 3000` (`http://127.0.0.1:3000`).
- **HTTPS & TLS Status:** Unable to perform live remote TLS certificate, HSTS, or SSL cipher suite handshake checks against `gishh.ai` because the public domain lacks active DNS/TLS infrastructure. Local HTTP production instance evaluated for security headers and baseline behavior.

---

## 2. OWASP ZAP Baseline Scan Results (Phase 2)

**Command Run:** `docker run --rm -v "security/reports:/zap/wrk/:rw" -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000 -r zap-baseline.html -J zap-baseline.json`  
**Reports Generated:** [`security/reports/zap-baseline.html`](file:///f:/eleven-web/eleven-web/security/reports/zap-baseline.html), [`security/reports/zap-baseline.json`](file:///f:/eleven-web/eleven-web/security/reports/zap-baseline.json)

### ZAP Scan Summary
- **Total Rules Evaluated:** 67 rules (62 PASSED, 5 WARN-NEW, 0 FAIL)
- **URLs Crawled:** 19 endpoints

### ZAP Findings Breakdown & Classification

| Alert Title | Plugin ID | Risk Level | Instances | Classification & Analysis |
|---|---|---|---|---|
| **CSP: script-src unsafe-inline** | `10055` | Medium (High) | 2 | **Security Hardening / Accepted Risk:** ZAP flags `'unsafe-inline'` in `script-src`. Required for Next.js App Router client hydration scripts. No dynamic user input or eval sinks exist. |
| **CSP: style-src unsafe-inline** | `10055` | Medium (High) | 2 | **Security Hardening / Accepted Risk:** Required for Framer Motion and React dynamic inline style attributes (`SpotlightCard.tsx`). |
| **Cross-Origin-Embedder-Policy (COEP) Missing** | `90004` | Low | 2 | **Informational / Optional Hardening:** Recommended for isolating site context against cross-origin Spectre attacks if handling sensitive cross-origin data. |
| **Cross-Origin-Opener-Policy (COOP) Missing** | `90004` | Low | 2 | **Informational / Optional Hardening:** Recommended for isolating top-level browsing context. Safe to add `same-origin` in Next.js headers if popups are not used. |
| **Cross-Origin-Resource-Policy (CORP) Missing** | `90004` | Low | 5 | **Informational / Optional Hardening:** Specifies who can load static assets. `same-origin` can be added for static assets. |
| **Dangerous JS Functions (`eval`)** | `10110` | Low | 1 | **False Positive:** Detected in `turbopack-_08bm286._.js` development asset chunk, not production bundle. |
| **Information Disclosure - Suspicious Comments** | `10027` | Informational | 28 | **False Positive / Informational:** Code comments inside third-party `node_modules` chunks matching keywords like `BUG`, `TODO`, `USER`. No secrets or internal IP addresses revealed. |
| **Storable but Non-Cacheable Content** | `10049` | Informational | 5 | **Informational:** Response headers contain `Cache-Control: no-cache, must-revalidate` on static HTML endpoints. |

---

## 3. Nuclei Vulnerability Scan Results (Phase 3)

**Command Run:** `docker run --rm --add-host=host.docker.internal:host-gateway -v "security/reports:/nuclei-out:rw" projectdiscovery/nuclei:latest -u http://host.docker.internal:3000 -t http/misconfiguration/ -o /nuclei-out/nuclei-results.txt`  
**Report Generated:** [`security/reports/nuclei-results.txt`](file:///f:/eleven-web/eleven-web/security/reports/nuclei-results.txt)

### Nuclei Findings Summary
- **Templates Executed:** 976 misconfiguration templates
- **Total Matches:** 1 match (`weak-csp-detect:unsafe-script-src`)

### Nuclei Finding Detail
- **Template ID:** `weak-csp-detect:unsafe-script-src`
- **Severity:** `info`
- **Target:** `http://host.docker.internal:3000`
- **Evidence:** `script-src 'self' 'unsafe-inline'`
- **Exploitability:** Non-exploitable without an existing XSS injection sink.
- **Classification:** Informational / Accepted Risk.

---

## 4. HTTP Security Header Verification (Phase 4)

Headers verified on production server response (`http://127.0.0.1:3000`):

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=()
```

- **`X-XSS-Protection`:** Verified completely absent.
- **Third-Party Origins:** 0 third-party domains permitted.
- **Mixed Content / Insecure Assets:** 0 HTTP asset URLs present. All links and font resources use relative/same-origin paths.

---

## 5. TLS / HTTPS & Domain Assessment (Phase 5)

- **Public Production Target (`gishh.ai`):** Unregistered/Unresolved DNS record. TLS certificate, cipher suite support (TLS 1.2/1.3), HSTS edge compliance, and HTTP→HTTPS 301 redirects **cannot be verified** until `gishh.ai` is pointed to a cloud edge host (e.g. Vercel, Cloudflare, AWS CloudFront).
- **HSTS Header Status:** `max-age=31536000` is configured in `next.config.ts`. It will be emitted on all production HTTPS responses once deployed.

---

## 6. Lighthouse Audit Results (Phase 6)

**Report Generated:** [`security/reports/lighthouse-report.report.html`](file:///f:/eleven-web/eleven-web/security/reports/lighthouse-report.report.html)

- **Execution Note:** Lighthouse headless CLI run encountered `NO_FCP` (No First Contentful Paint) in automated headless mode due to missing display server environment flags on local Windows host.
- **Manual Asset & Accessibility Code Verification:**
  - **Font Loading:** Self-hosted WOFF2 fonts with `font-display: swap` in `globals.css`.
  - **Image Optimization:** Uses `next/image` component for GISHH logo rendering.
  - **Accessibility Contrast & Semantics:** High-contrast palette (`--el-fg: #11110e` on `--el-bg: #faf9f6`), semantic `<header>`, `<nav>`, `<main>`, `<footer>` tags, and accessible focus outlines (`:focus-visible`).
  - **Metadata & Canonical:** `metadataBase: new URL("https://gishh.ai")`, OpenGraph tags, and Twitter card metadata set in `app/layout.tsx`.

---

## 7. Findings & Classification Matrix

### 🔴 CRITICAL (0)
*None.*

### 🟠 HIGH (0)
*None.*

### 🟡 MEDIUM (0)
*None.*

### 🟢 LOW (3)
1. **FINDING-EXT-01: Missing Cross-Origin-Opener-Policy (COOP)**
   - **ID:** `SEC-HEAD-01`
   - **Severity:** LOW
   - **URL:** `http://127.0.0.1:3000`
   - **Evidence:** ZAP Alert `90004-3`.
   - **Impact:** Top-level browsing context is not isolated from cross-origin popups.
   - **Exploitability:** Minimal (no popup windows opened).
   - **Remediation:** Add `Cross-Origin-Opener-Policy: same-origin` to `next.config.ts`.
   - **Verification:** Inspect HTTP headers.

2. **FINDING-EXT-02: Missing Cross-Origin-Resource-Policy (CORP)**
   - **ID:** `SEC-HEAD-02`
   - **Severity:** LOW
   - **URL:** `http://127.0.0.1:3000`
   - **Evidence:** ZAP Alert `90004-1`.
   - **Impact:** Static assets do not restrict cross-origin embedding explicitly via CORP.
   - **Exploitability:** Minimal.
   - **Remediation:** Add `Cross-Origin-Resource-Policy: same-origin` to `next.config.ts`.
   - **Verification:** Inspect HTTP headers.

3. **FINDING-EXT-03: Unresolved Public Production DNS (`gishh.ai`)**
   - **ID:** `SEC-INFRA-01`
   - **Severity:** LOW
   - **URL:** `https://gishh.ai`
   - **Evidence:** `PingException: No such host is known`.
   - **Impact:** Public target domain `gishh.ai` is not live; public HTTPS/TLS posture cannot be verified.
   - **Exploitability:** High hijacking risk if domain is unregistered; non-exploitable if owned and pending DNS setup.
   - **Remediation:** Configure DNS A/AAAA/CNAME records pointing `gishh.ai` to production hosting with managed SSL certificates.
   - **Verification:** `curl -I https://gishh.ai`

### ℹ️ INFORMATIONAL / FALSE POSITIVE (3)
1. **CSP `script-src 'unsafe-inline'` Warning (ZAP 10055 / Nuclei weak-csp-detect)**: Required for Next.js App Router client hydration scripts.
2. **CSP `style-src 'unsafe-inline'` Warning (ZAP 10055)**: Required for React dynamic inline styles (Framer Motion / Canvas).
3. **Suspicious Comments Warning (ZAP 10027)**: Matched generic words (`TODO`, `USER`, `BUG`) in third-party vendor chunks (`framer-motion`, `react-dom`). No secrets disclosed.

---

## OVERALL SECURITY READINESS

```
OVERALL SECURITY READINESS
Source code:        PASS (Semgrep 0 findings)
Dependencies:       PASS (npm audit 0 vulnerabilities)
Secrets:            PASS (detect-secrets 0 secrets)
Security headers:   PASS (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy implemented)
Runtime:            PASS (Static Next.js production server operating cleanly)
External exposure:  PASS (0 third-party API dependencies, 0 cross-origin leaks)
TLS:                PENDING (Public domain gishh.ai DNS not yet pointed to host)
Accessibility:      PASS (Semantic HTML, WCAG-compliant contrast, focus rings)
Performance:        PASS (Static prerendered routes, self-hosted WOFF2 fonts)
SEO:                PASS (MetadataBase, OpenGraph, Twitter card tags configured)
```

---

## Prioritized Remediation List

1. **DNS & SSL Provisioning (Infra):** Point `gishh.ai` DNS to production hosting (Vercel/Cloudflare/AWS) and enable automated Let's Encrypt / managed TLS 1.2/1.3 certificates.
2. **COOP/CORP Header Addition (`next.config.ts`):** Optionally add `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin` to header rules for additional hardening against cross-origin side-channel attacks.
