"use client";

import { useState, useEffect } from "react";
import { DesktopIcon, XIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

export function MobileNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(
      "fluidframe_mobile_notice_dismissed",
    );
    if (isDismissed) return;

    const checkMobile = () => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("fluidframe_mobile_notice_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          aria-label="Desktop recommendation notice"
          className="pointer-events-auto w-full bg-background/95 dark:bg-neutral-950/95 border-b border-primary/20 backdrop-blur-xl text-xs font-manrope shadow-xs md:hidden overflow-hidden shrink-0 z-50"
        >
          <div className="w-full px-3.5 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-4.5 rounded bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <DesktopIcon className="size-3" weight="bold" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight truncate sm:whitespace-normal">
                <strong className="text-foreground font-semibold">
                  Works best on desktop:
                </strong>{" "}
                Please use on a bigger screen.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss desktop notice"
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
            >
              <XIcon className="size-3.5" weight="bold" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
