"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/** App-wide settings: animations step aside for visitors who ask their device to reduce motion. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
