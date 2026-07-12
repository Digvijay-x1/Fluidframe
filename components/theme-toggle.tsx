"use client";

import { SunIcon, MoonStarsIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ classname }: { classname?: string }) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "text-muted-foreground hover:text-foreground p-1 cursor-pointer",
        "transition-all duration-300 ease-in-out",
        resolvedTheme === "dark" ? "rotate-180" : "rotate-0",
        classname
      )}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <SunIcon size={17} weight="bold" /> : <MoonStarsIcon size={17} weight="bold" />}
    </button>
  );
}
