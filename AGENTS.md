<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ELEVEN Public Website — Handoff Brief

You're picking up a real, working codebase mid-build — not a blank slate. Read this fully before touching anything. The design direction has already gone through several rounds of review (a human founder + another AI reviewing screenshots/code together) and is **locked**, not open for reinterpretation.

## What this project is

The public marketing website for ELEVEN (Synexis AGI-OS), an autonomous cognitive system built by GISHH Labs. The brand thesis, agreed and locked:

> **"Quiet Authority."** Institutional on the outside. Computational on the inside.

Two visual modes, one identity:
- **Institutional mode** (default, light) — the public trust layer. Calm, restrained, premium-agency feeling. This is what `/` currently renders.
- **Computational mode** (dark, HUD-style) — the existing GISHH Labs sci-fi visual DNA (dark navy, cyan/purple, monospace telemetry). This is reached only through a deliberate "Enter ELEVEN" transition — it must never be the default or bleed into the institutional pages.

The single most important instruction in this whole brief: **do not add flashy components, gradients, glow effects, 3D scenes, particle systems, or "AI startup template" visual clichés.** Every past review cycle explicitly rejected these. Confidence comes from restraint, precise spacing, and typography — not decoration. If you're ever unsure whether to add a visual flourish, don't.

## Current state (as of handoff)

Real, building, verified code — not a mockup:
- `app/globals.css` — the full design token system. Both mode palettes live here as CSS custom properties (`--el-*`), swapped via a `.mode-dark` class on a subtree. **Do not introduce new colors or spacing values outside this token system.** If something needs a new token, add it here, named consistently, not as a one-off inline value.
- `app/page.tsx` — the real homepage, 7 sections: Hero → Positioning (4 capabilities) → Intelligence Loop → Autonomy → Memory → Architecture preview → Closing CTA.
- `app/style-guide/page.tsx` — internal design-system reference page (token/component preview with a live mode toggle). Not linked from public nav. Keep it, it's useful, keep it updated as the system grows.
- `components/navigation/Nav.tsx` — sticky nav, transparent→solid on scroll, working responsive mobile menu (animated hamburger, slide-down panel).
- `components/navigation/Footer.tsx` — functional but was flagged as needing more brand presence (see backlog).
- `components/ui/Button.tsx` — primary/secondary/ghost variants. Arrow icon is opt-in via `arrow` prop, never default — don't make it default, that was a deliberate decision against the generic "→ on every button" tell.
- `components/ui/Section.tsx` — `Section`/`Container` layout primitives enforcing the 1280px content width and section spacing rhythm. Use these, don't reimplement layout ad hoc per page.
- `components/homepage/IntelligenceLoop.tsx` — the auto-advancing Perceive→Understand→Reason→Plan→Act→Learn indicator, currently a vertical list with a pulse-ring active state and a "↺ back to Perceive" loop closure.

Known-fixed issues (don't reintroduce): the `Button` component's arrow hover animation needs `group` on the parent for `group-hover:` to fire — this was a real bug, already fixed, verify it stays fixed if you touch that file. The architecture diagram on the homepage has a real responsive split (`hidden md:block` ASCII diagram / `md:hidden` stacked node version) — don't replace this with a fixed-width `<pre>` wrapped in `overflow-x-scroll`, that was explicitly rejected as not a real fix.

**Font system note**: the sandbox this was built in could not reach Google Fonts, so `globals.css` currently falls back to close system-font stand-ins (documented in a comment above `--font-geist`/`--font-technical`). You have real network access — this is priority backlog item #3 below, fix it properly with self-hosted font files, don't just re-add the `next/font/google` calls and call it done (see that item for why).

## Backlog, in priority order

Work through these in order. Each one should get an actual look-adjust-look pass (take a screenshot, judge it against the "Quiet Authority" thesis, adjust) — this is exactly the part that benefited from a real dev-loop, which is why this handoff exists.

1. **Autonomy diagram redesign.** Currently a basic vertical flow (`HUMAN → ELEVEN → OUTCOME → ESCALATION`) built from plain bordered boxes in `app/page.tsx`. This section was explicitly flagged as deserving much stronger visual treatment than it currently has, because governance/human-authority-boundaries is ELEVEN's core differentiator, not an incidental feature. Don't just prettify the existing boxes — reconsider the composition. Keep the underlying information architecture (Human defines objectives/authority/boundaries → ELEVEN reasons/plans/executes/learns → Outcome → Escalation when boundaries are reached) exactly as-is; that content is locked, only the visual treatment is open.

2. **Footer brand presence.** Current footer (`components/navigation/Footer.tsx`) is functional but was flagged as feeling like a default SaaS footer, not "the quiet ending of a premium institutional site." Improve composition/typography/spacing, not content — don't add more links or sections than currently exist.

3. **Real font system.** Self-host actual Geist and Share Tech Mono font files (woff2) in `public/fonts/`, load via `next/font/local`, update `--font-geist`/`--font-technical` in `globals.css` accordingly. Do this properly — check licensing for both faces, get real font files (not just re-pointing to Google Fonts, which may not always be reachable and adds an external dependency/privacy consideration anyway).

4. **Institutional → Computational transition.** This is entirely unbuilt — don't confuse it with just "making a dark page." The existing "Enter ELEVEN" button/link should trigger a deliberate, orchestrated transition: white → warm grey → graphite → deep navy → the existing HUD environment fading in (SYSTEM ONLINE, EXECUTIVE CORTEX, WORLD MODEL, MEMORY, etc. — reuse the existing GISHH Labs sci-fi HUD assets/visual language, don't invent a new one). This should be one single, well-crafted orchestrated moment — not a generic page transition. This is the moment that's supposed to communicate "the restrained website wasn't hiding a lack of depth — it was the outer layer of a much deeper system." Where this lands (a `/enter` route, an overlay, etc.) is your call, but the transition sequence itself is the point, not just the destination.

5. **Mobile-specific compositions**, beyond what's already fixed (Nav mobile menu and the architecture diagram are already done). Go through every section on a real small-viewport pass — Autonomy flow, Intelligence Loop, Memory grid — and check each one actually composes well at 390px, not just "doesn't break."

6. **Performance / accessibility / SEO polish.** Reduced-motion handling and `:focus-visible` are already in `globals.css` — verify they still work as you add new interactive elements, don't regress them. Add proper metadata, Open Graph tags, favicon (current one is the Next.js default, needs replacing with real ELEVEN branding), a real 404 page, and a Lighthouse pass.

## Ground rules for the whole session

- Every design decision in this file is the result of an actual review cycle, not a first draft — treat disagreements with existing choices as something to flag and discuss, not silently override.
- Keep visual boldness spent in one place per section — don't add competing focal points.
- Verify `npm run build` passes clean (no type errors) before considering any task done.
- If you add a genuinely new capability the token system doesn't cover, extend `globals.css` consistently with the existing `--el-*` naming, don't hardcode a one-off value into a component.

