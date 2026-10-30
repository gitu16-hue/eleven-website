import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import dynamic from "next/dynamic";
import { WaitlistActionButton } from "@/components/v3/WaitlistActionButton";

const ElevenControlShowcase = dynamic(
  () =>
    import("@/components/v3/ElevenControlShowcase").then(
      (mod) => mod.ElevenControlShowcase
    ),
  {
    loading: () => (
      <div className="h-[650px] w-full animate-pulse rounded-sm border border-emerald-500/20 bg-el-bg-raised/40" />
    ),
  }
);

const AnimatedDashboard = dynamic(
  () =>
    import("@/components/v3/AnimatedDashboard").then(
      (mod) => mod.AnimatedDashboard
    ),
  {
    loading: () => (
      <div className="h-[600px] w-full animate-pulse rounded-sm border border-el-border bg-el-bg-raised/40" />
    ),
  }
);
import {
  CipherText,
  ClarityTogglePill,
  DualCopy,
  ParagraphReveal,
  SignalBeamDivider,
  Tilt3DCard,
  WordReveal,
} from "@/components/motion/PremiumMotion";

export const metadata: Metadata = {
  title: "Sovereign Voyage Dashboard & Curved SVG Stepper | ELEVEN",
  description:
    "Experience high-craft interactive dashboard animations featuring a curved SVG milestone stepper with tangent-aligned travel, animated cubic-bezier spline charts, and ambient aurora glows.",
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    title: "Sovereign Voyage Dashboard & Curved SVG Stepper | ELEVEN",
    description:
      "Interactive SVG milestone stepper with GSAP tangent banking, animated cubic-bezier spline charts, and live actuarial value tweening.",
    url: "https://eleven-website-self.vercel.app/dashboard",
    siteName: "ELEVEN OS",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://eleven-website-self.vercel.app/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Dashboard",
      item: "https://eleven-website-self.vercel.app/dashboard",
    },
  ],
};

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Sovereign Voyage Dashboard & Curved SVG Stepper",
  description:
    "Mathematical and kinematic implementation guide for curved SVG route steppers with GSAP progress proxies, tangent alignment, cubic-bezier spline charts, and choreographed dashboard transitions.",
  author: {
    "@type": "Organization",
    name: "GISHH Labs",
    url: "https://eleven-website-self.vercel.app",
  },
  publisher: {
    "@type": "Organization",
    name: "GISHH Labs",
    logo: "https://eleven-website-self.vercel.app/gishh-logo.png",
  },
  url: "https://eleven-website-self.vercel.app/dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <Nav />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(techArticleJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        {/* HERO SECTION */}
        <Section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent opacity-60" />

          <Container className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Sovereign Voyage Dashboard", href: "/dashboard" },
                ]}
              />

              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-el-fg-faint">
                  TERMINOLOGY DEPTH:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <div className="mt-10 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-xs border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-emerald-400 shadow-el-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <CipherText text="GSAP KINEMATICS // CURVED SVG VOYAGE STEPPER & CHOREOGRAPHY" />
              </div>

              <h1 className="el-h1">
                <WordReveal text="High-Craft Dashboard Kinematics & Curved Route Stepper" />
              </h1>

              <DualCopy
                className="el-lead max-w-3xl"
                plain="Instead of rigid, boring progress bars, explore a curved route tracker that sails along a natural wavy path, updates live pricing smoothly as you slide controls, and seamlessly transitions between portfolio views."
                technical="Interactive dashboard animation system implementing dual SVG paths with dynamic stroke-dasharray revelation, tangent-aligned traveler banking via requestAnimationFrame, cubic-bezier spline charts, and GSAP numerical state interpolation."
              />

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
                <span className="rounded-xs border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-emerald-400">
                  ✓ DUAL SVG PATH ARC-LENGTH REVEAL
                </span>
                <span className="rounded-xs border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-cyan-400">
                  ✓ TANGENT-ALIGNED DAMPED BANKING
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ ANIMATED CUBIC SPLINE CHART
                </span>
                <span className="rounded-xs border border-el-border bg-el-bg-raised/70 px-2.5 py-1 text-el-fg-muted">
                  ✓ FLUID GSAP VALUE TWEENING
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Request Dashboard Integration
                </WaitlistActionButton>

                <Button href="/tools/dag-visualizer" variant="secondary">
                  System 2 DAG Visualizer →
                </Button>

                <Button href="/tools/vault-calculator" variant="ghost">
                  Vault Storage Estimator →
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* INTERACTIVE ELEVEN V3 CONTROL SHOWCASE (ZERO-PROMPT TRIAD & L5 HYPERVISOR) */}
        <Section className="py-12 lg:py-20 bg-[#020407]">
          <Container>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                  FLAGSHIP INTERACTIVE SHOWCASE // ZERO-PROMPT CONTROL PLANE
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                  Zero-Prompt Cognitive Triad &amp; L5 Zero-Trust Hypervisor
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xs">
                Jev + CDM + F.R.I.D.A.Y.
              </span>
            </div>

            <ElevenControlShowcase />
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* ACTUARIAL APPLICATION USE CASE: CAPITAL ALLOCATION & UNDERWRITING */}
        <Section className="py-12 lg:py-20 bg-[#040609]">
          <Container>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                  COMMERCIAL WORKFLOW DEMO // CAPITAL ALLOCATION &amp; UNDERWRITING
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-white">
                  Sovereign Underwriting Engine with Dynamic Premium Tweening
                </h3>
              </div>
            </div>

            <AnimatedDashboard />
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* ARCHITECTURAL DEEP DIVE: 3 KINEMATIC PRINCIPLES */}
        <Section className="py-16 lg:py-24">
          <Container>
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400">
                <CipherText text="// 01 MATHEMATICAL & ANIMATION MECHANICS" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="The Mathematics of Curved Route Kinematics" />
              </h2>
              <ParagraphReveal
                className="el-body"
                text="Standard UI steppers use one-dimensional linear percentages. The VoyageStepper maps milestones along arbitrary cubic-bezier space curves with precise tangent tracking."
              />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-el-border bg-el-bg-raised/30 p-6 space-y-4">
                <div className="pointer-events-none absolute top-3 right-3 font-mono text-xs text-emerald-400/40">
                  ⌜ 01 ⌟
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>DUAL-PATH ARC MAPPING</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  Dynamic Stroke-Dasharray Revelation
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  Two overlaid SVG paths share the identical cubic-bezier path definition. The background path renders a muted guide, while the foreground path dynamically modulates its stroke-dasharray to exactly match the current animated arc length:
                </p>
                <div className="rounded-xs border border-el-border bg-[#020408] p-3 font-mono text-[11px] text-emerald-300">
                  {"done.setAttribute('stroke-dasharray', `${l} ${total}`);"}
                </div>
              </Tilt3DCard>

              {/* Feature 2 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-cyan-500/40 bg-el-bg-raised/30 p-6 space-y-4 shadow-el-sm">
                <div className="pointer-events-none absolute top-3 right-3 font-mono text-xs text-cyan-400/50">
                  ⌜ 02 ⌟
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>TANGENT-ALIGNED BANKING</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  Damped Differential Heading
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  To calculate the traveler’s orientation without high-frequency vibration, the engine samples a point 2 pixels ahead on the curve and computes the arctangent with a 0.4 damping factor:
                </p>
                <div className="rounded-xs border border-cyan-500/30 bg-[#020408] p-3 font-mono text-[11px] text-cyan-300">
                  ang = (atan2(q.y - p.y, q.x - p.x) * 180 / π) * 0.4;
                </div>
              </Tilt3DCard>

              {/* Feature 3 */}
              <Tilt3DCard className="relative overflow-hidden rounded-sm border border-purple-400/40 bg-el-bg-raised/30 p-6 space-y-4">
                <div className="pointer-events-none absolute top-3 right-3 font-mono text-xs text-purple-400/40">
                  ⌜ 03 ⌟
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-purple-400">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  <span>FLUID NUMERICAL TWEENING</span>
                </div>
                <h3 className="text-xl font-bold text-el-fg">
                  Sub-Millisecond Parameter Rolling
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  Dragging interactive range sliders updates GSAP proxy values that smoothly tween the formatted currency totals on screen, avoiding abrupt jumps and delivering tactile feedback.
                </p>
                <div className="rounded-xs border border-el-border bg-[#020408] p-3 font-mono text-[11px] text-purple-300">
                  {"gsap.to(proxy, { val: target, ease: 'power2.out' });"}
                </div>
              </Tilt3DCard>
            </div>
          </Container>
        </Section>

        {/* BOTTOM CTA ACCESS FUNNEL */}
        <Section className="py-16 lg:py-24 border-t border-el-border bg-gradient-to-b from-[#030508] to-[#010204]">
          <Container>
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <div className="el-badge">
                <CipherText text="// PRODUCTION ANIMATION SUITE · VERIFIED RUNTIME" />
              </div>

              <h2 className="el-h2">
                <WordReveal text="Deploy high-craft animations across your applications" />
              </h2>

              <DualCopy
                className="mx-auto max-w-2xl el-body"
                plain="Connect with our design systems team to incorporate custom SVG journey steppers, live actuarial calculators, and fluid dashboards into your products."
                technical="Access the VoyageStepper component source code, GSAP animation hooks, and SVG bezier path utilities for React 19 and Next.js."
              />

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <WaitlistActionButton tier="technical" arrow variant="primary">
                  Request Component Source Access
                </WaitlistActionButton>

                <Button href="/solutions/enterprise" variant="secondary">
                  Enterprise Fleet Governance →
                </Button>
              </div>

              {/* Cross Links to Other Deep Architecture Pages */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 font-mono text-xs text-el-fg-faint">
                <Link href="/tools/dag-visualizer" className="hover:text-emerald-400 hover:underline">
                  → System 2 DAG Orchestrator
                </Link>
                <Link href="/hardware" className="hover:text-emerald-400 hover:underline">
                  → Hardware Benchmarks
                </Link>
                <Link href="/tools/vault-calculator" className="hover:text-emerald-400 hover:underline">
                  → Vault Storage Estimator
                </Link>
                <Link href="/compare/cloud-vs-local" className="hover:text-emerald-400 hover:underline">
                  → Cloud vs Local Audit
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}