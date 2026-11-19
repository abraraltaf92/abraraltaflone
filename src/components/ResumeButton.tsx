"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "./ResumeButton.module.css";

// The PDF viewer (and the PDF library) only loads when the button is first pressed.
const ResumeViewer = dynamic(() => import("./ResumeViewer").then((m) => m.ResumeViewer), { ssr: false });

export function ResumeButton({ tabIndex }: { tabIndex?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={styles.button} tabIndex={tabIndex} onClick={() => setOpen(true)}>
        Resume
      </button>
      {open && <ResumeViewer onClose={() => setOpen(false)} />}
    </>
  );
}
