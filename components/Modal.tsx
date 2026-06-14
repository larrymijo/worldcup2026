"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Accessible overlay rendered into <body> via a portal (so it escapes any
 * `transform`ed ancestor). Bottom-sheet on phones, centered dialog on larger
 * screens. Closes on backdrop click and Escape, and locks body scroll.
 */
export function Modal({ open, onClose, children }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-night/80 backdrop-blur-sm"
      />
      <div className="animate-in relative z-10 max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-card/95 shadow-2xl sm:max-w-lg sm:rounded-3xl">
        {children}
      </div>
    </div>,
    document.body,
  );
}
