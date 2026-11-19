"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * For visitors who ask their device for less motion: everything inside
 * appears in place (fades are kept, slides and springs are skipped).
 */
export function CalmMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
