import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDiagonal, ArrowUpRight } from "./icons";
import styles from "./PillLink.module.css";

type Props = {
  href: string;
  children: ReactNode;
  /** primary = black, secondary = light grey */
  variant?: "primary" | "secondary";
  /** small = 16px arrow, large = 24px arrow */
  icon?: "small" | "large" | "none";
  newTab?: boolean;
  className?: string;
  /** Extra class for the arrow, for a caller that changes how it looks or moves. */
  iconClassName?: string;
};

export function PillLink({
  href,
  children,
  variant = "secondary",
  icon = "small",
  newTab,
  className,
  iconClassName,
}: Props) {
  const cls = [styles.pill, styles[variant], className].filter(Boolean).join(" ");
  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {icon === "small" && (
        <span className={[styles.iconSmall, iconClassName].filter(Boolean).join(" ")}>
          <ArrowUpRight />
        </span>
      )}
      {icon === "large" && (
        <span className={[styles.iconLarge, iconClassName].filter(Boolean).join(" ")}>
          <ArrowDiagonal />
        </span>
      )}
    </>
  );
  const internal = href.startsWith("/");
  if (internal) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}
