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
      <div className="h-[650px] w-full animate-pulse motion-reduce:animate-none rounded-sm border border-el-border bg-el-bg-raised/40" />
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
      <div className="h-[600px] w-full animate-pulse motion-reduce:animate-none rounded-sm border border-el-border bg-el-bg-raised/40" />
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
import {
  GenesisHeroIntro,
  GenesisSectionIntro,
  GenesisShowcaseFrame,
} from "@/components/motion/GenesisMotionEngine";

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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 el-aurora"
          />
          <div
            aria-hidden="true"
            className="bg-grid-scifi pointer-events-none absolute inset-0 opacity-35 [mask-image:radial-gradient(65%_55%_at_50%_0%,#000_40%,transparent_100%)]"
          />

          <Container className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-el-border/60">
              <Breadcrumbs
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                ]}
              />

              <div className="flex items-center gap-3">
                <span className="text-xs text-el-fg-faint">
                  Terminology depth:
                </span>
                <ClarityTogglePill />
              </div>
            </div>

            <GenesisHeroIntro className="mt-10 max-w-4xl space-y-6">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83] animate-pulse motion-reduce:animate-none shadow-[0_0_8px_#10bc83]" />
                <CipherText text="GSAP Kinematics · Curved SVG Voyage Stepper" />
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
              <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38ffbd]" />
                  <span>Dual SVG Path Arc-Length Reveal</span>
                </span>
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>Tangent-Aligned Damped Banking</span>
                </span>
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00b38c]" />
                  <span>Animated Cubic Spline Chart</span>
                </span>
                <span className="gfx-bubble !h-9 !px-3.5 !text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <span>Fluid GSAP Value Tweening</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <WaitlistActionButton
                  tier="technical"
                  arrow
                  variant="primary"
                >
                  Request Dashboard Integration
                </WaitlistActionButton>

                <Button
                  href="/tools/dag-visualizer"
                  variant="secondary"
                  arrow
                >
                  System 2 DAG Visualizer
                </Button>

                <Button
                  href="/tools/vault-calculator"
                  variant="ghost"
                  arrow
                >
                  Vault Storage Estimator
                </Button>
              </div>
            </GenesisHeroIntro>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* INTERACTIVE ELEVEN V3 CONTROL SHOWCASE (ZERO-PROMPT TRIAD & L5 HYPERVISOR) */}
        <Section className="py-12 lg:py-20 bg-el-bg">
          <Container>
            <GenesisSectionIntro className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="gfx-badge mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <CipherText text="01 · Flagship Interactive Showcase" />
                </div>
                <h2 className="el-h2 mt-1">
                  <WordReveal text="Zero-Prompt Cognitive Triad and L5 Zero-Trust Hypervisor" />
                </h2>
              </div>
              <span className="gfx-bubble !h-8 !px-3 !text-xs">
                Jev + CDM + F.R.I.D.A.Y.
              </span>
            </GenesisSectionIntro>

            <GenesisShowcaseFrame>
              <ElevenControlShowcase />
            </GenesisShowcaseFrame>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* ACTUARIAL APPLICATION USE CASE: CAPITAL ALLOCATION & UNDERWRITING */}
        <Section className="py-12 lg:py-20">
          <Container>
            <GenesisSectionIntro className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="gfx-badge mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <CipherText text="02 · Commercial Workflow Demo" />
                </div>
                <h2 className="el-h2 mt-1">
                  <WordReveal text="Sovereign Underwriting Engine with Dynamic Premium Tweening" />
                </h2>
              </div>
            </GenesisSectionIntro>

            <GenesisShowcaseFrame>
              <AnimatedDashboard />
            </GenesisShowcaseFrame>
          </Container>
        </Section>

        <SignalBeamDivider />

        {/* ARCHITECTURAL DEEP DIVE: 3 KINEMATIC PRINCIPLES */}
        <Section className="py-16 lg:py-24">
          <Container>
            <GenesisSectionIntro className="max-w-3xl space-y-4">
              <div className="gfx-badge">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                <CipherText text="03 · Mathematical and Animation Mechanics" />
              </div>
              <h2 className="el-h2">
                <WordReveal text="The Mathematics of Curved Route Kinematics" />
              </h2>
              <ParagraphReveal
                className="el-body"
                text="Standard UI steppers use one-dimensional linear percentages. The VoyageStepper maps milestones along arbitrary cubic-bezier space curves with precise tangent tracking."
              />
            </GenesisSectionIntro>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Tilt3DCard className="p-6 space-y-4 h-full">
                <div className="pointer-events-none absolute top-3 right-3">
                  <code className="text-[#10bc83]/60 font-mono text-xs">01</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#10bc83] font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Dual-path arc mapping</span>
                </div>
                <h3 className="text-xl font-normal heading-gradient">
                  Dynamic Stroke-Dasharray Revelation
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  Two overlaid SVG paths share the identical cubic-bezier path definition. The background path renders a muted guide, while the foreground path dynamically modulates its stroke-dasharray to exactly match the current animated arc length:
                </p>
                <div className="rounded-lg border border-el-border bg-black/50 p-3 text-xs text-[#10bc83] font-mono text-[11px]">
                  {"done.setAttribute('stroke-dasharray', `${l} ${total}`);"}
                </div>
              </Tilt3DCard>

              {/* Feature 2 */}
              <Tilt3DCard className="p-6 space-y-4 h-full">
                <div className="pointer-events-none absolute top-3 right-3">
                  <code className="text-[#10bc83]/60 font-mono text-xs">02</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#10bc83] font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Tangent-aligned banking</span>
                </div>
                <h3 className="text-xl font-normal heading-gradient">
                  Damped Differential Heading
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  To calculate the traveler’s orientation without high-frequency vibration, the engine samples a point 2 pixels ahead on the curve and computes the arctangent with a 0.4 damping factor:
                </p>
                <div className="rounded-lg border border-el-border bg-black/50 p-3 text-xs text-[#10bc83] font-mono text-[11px]">
                  ang = (atan2(q.y - p.y, q.x - p.x) * 180 / π) * 0.4;
                </div>
              </Tilt3DCard>

              {/* Feature 3 */}
              <Tilt3DCard className="p-6 space-y-4 h-full">
                <div className="pointer-events-none absolute top-3 right-3">
                  <code className="text-[#10bc83]/60 font-mono text-xs">03</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#10bc83] font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#10bc83]" />
                  <span>Fluid numerical tweening</span>
                </div>
                <h3 className="text-xl font-normal heading-gradient">
                  Sub-Millisecond Parameter Rolling
                </h3>
                <p className="text-xs text-el-fg-muted leading-relaxed">
                  Dragging interactive range sliders updates GSAP proxy values that smoothly tween the formatted currency totals on screen, avoiding abrupt jumps and delivering tactile feedback.
                </p>
                <div className="rounded-lg border border-el-border bg-black/50 p-3 text-xs text-[#10bc83] font-mono text-[11px]">
                  {"gsap.to(proxy, { val: target, ease: 'power2.out' });"}
                </div>
              </Tilt3DCard>
            </div>
          </Container>
        </Section>

        {/* BOTTOM CTA ACCESS FUNNEL */}
        <Section className="py-16 lg:py-24">
          <Container>
            <div className="relative overflow-hidden rounded-[1.65rem] border border-white/[0.18] bg-[#05070d] p-8 sm:p-14 text-center shadow-el-lg">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[32rem] rounded-full bg-[#00b38c]/20 blur-[90px]"
              />
              <div className="relative mx-auto max-w-3xl space-y-6">
                <div className="gfx-badge mx-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10bc83]" />
                  <CipherText text="04 · Production Animation Suite" />
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
                  <WaitlistActionButton
                    tier="technical"
                    arrow
                    variant="primary"
                  >
                    Request Component Source Access
                  </WaitlistActionButton>

                  <Button
                    href="/solutions/enterprise"
                    variant="secondary"
                    arrow
                  >
                    Enterprise Fleet Governance
                  </Button>
                </div>

                {/* Cross Links to Other Deep Architecture Pages */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-xs text-el-fg-faint">
                  <Link href="/tools/dag-visualizer" className="hover:text-[#10bc83] hover:underline">
                    System 2 DAG Orchestrator
                  </Link>
                  <Link href="/hardware" className="hover:text-[#10bc83] hover:underline">
                    Hardware Benchmarks
                  </Link>
                  <Link href="/tools/vault-calculator" className="hover:text-[#10bc83] hover:underline">
                    Vault Storage Estimator
                  </Link>
                  <Link href="/compare/cloud-vs-local" className="hover:text-[#10bc83] hover:underline">
                    Cloud vs Local Audit
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
