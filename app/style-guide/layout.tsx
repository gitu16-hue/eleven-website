import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Style Guide — ELEVEN v3",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
