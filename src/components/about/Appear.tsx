"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";

/**
 * Springs its children into place from an offset when they scroll into view.
 * `once={false}` hides them again whenever they leave the screen.
 * `amount` is how much must be visible before it plays (0 = any part).
 * `watch` lets another, unmoving element decide when that is. Use it when the
 * starting offset would push the children out of a clipped parent.
 */
export function Appear({
  children,
  className,
  x = 0,
  y = 0,
  duration = 3,
  once = true,
  amount = 0,
  watch,
}: {
  children: ReactNode;
  className?: string;
  x?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  watch?: RefObject<Element | null>;
}) {
  const own = useRef<HTMLDivElement>(null);
  const inView = useInView(watch ?? own, { once, amount: amount > 0 ? amount : "some" });

  return (
    <motion.div
      ref={own}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ type: "spring", bounce: 0.2, duration }}
    >
      {children}
    </motion.div>
  );
}
