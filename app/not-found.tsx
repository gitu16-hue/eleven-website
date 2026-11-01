"use client";

import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="bg-el-bg text-el-fg min-h-[100dvh] flex flex-col justify-between relative overflow-hidden">
      <div aria-hidden="true" className="bg-grid-scifi pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]" />
      <Nav />

      <main id="main-content">
      <Section className="py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-xl"
        >
          <div className="flex items-center justify-center gap-2 el-eyebrow">
            <span className="h-2 w-2 rounded-full bg-el-accent animate-ping" />
            <span>404 // ROUTE NOT FOUND</span>
          </div>

          <h1 className="mt-6 el-h1">
            Uncharted Boundary.
          </h1>

          <p className="mt-4 el-lead">
            The requested resource or system coordinate is beyond current authority parameters.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Button href="/" variant="primary" arrow>
              Return to Base
            </Button>
            <Button href="/eleven" variant="secondary">
              Explore System
            </Button>
          </div>
        </motion.div>
      </Section>
      </main>

      <Footer />
    </div>
  );
}
