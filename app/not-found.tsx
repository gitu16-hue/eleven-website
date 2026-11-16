"use client";

import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import {
  GenesisHeroIntro,
  GenesisSubpageHeroBackdrop,
} from "@/components/motion/GenesisMotionEngine";

export default function NotFound() {
  return (
    <div className="bg-el-bg text-el-fg min-h-[100dvh] flex flex-col justify-between relative overflow-hidden">
      <GenesisSubpageHeroBackdrop />
      <Nav />

      <main id="main-content" className="relative z-10">
        <Section className="py-24 text-center">
          <GenesisHeroIntro className="mx-auto max-w-xl space-y-6">
            <div className="gfx-badge mx-auto">
              <span className="h-2 w-2 rounded-full bg-[#10bc83] shadow-[0_0_8px_#10bc83] animate-ping" />
              <span>404 · Route Not Found</span>
            </div>

            <h1 className="el-h1">
              Uncharted Boundary.
            </h1>

            <p className="el-lead">
              The requested resource or system coordinate is beyond current authority parameters.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Button href="/" variant="primary" arrow>
                Return to Base
              </Button>
              <Button href="/eleven" variant="secondary">
                Explore System
              </Button>
            </div>
          </GenesisHeroIntro>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
