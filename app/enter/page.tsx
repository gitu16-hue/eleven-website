import type { Metadata } from "next";
import { EnterHudConsole } from "@/components/v3/EnterHudConsole";

export const metadata: Metadata = {
  title: "ELEVEN v3.1 // Computational Control Plane HUD",
  description:
    "Interactive 3D WebGL Holographic Visualizer, SwarmTournament worker satellite telemetry, <50ms hardware barge-in, and Cold-Room DEC-008 cryptographic nonce console.",
  alternates: {
    canonical: "/enter",
  },
};

export default function EnterPage() {
  return <EnterHudConsole />;
}
