"use client";

import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="bg-el-bg text-el-fg min-h-screen flex flex-col justify-between">
      <Nav />

      <Section className="py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-xl"
        >
          <div className="flex items-center justify-center gap-2 font-mono text-el-xs text-el-accent">
            <span className="h-2 w-2 rounded-full bg-el-accent animate-ping" />
            <span>404 // ROUTE NOT FOUND</span>
          </div>

          <h1 className="mt-6 text-el-4xl font-semibold tracking-tight text-el-fg">
            Uncharted Boundary.
          </h1>

          <p className="mt-4 text-el-base text-el-fg-muted leading-relaxed">
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

      <Footer />
    </div>
  );
}
