"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { ListIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { MobileNotice } from "./mobile-notice";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Features", href: "/#features" },
  { name: "FAQ", href: "/#faq" },
  { name: "Support", href: "/#support" },
  { name: "Policy", href: "/privacy" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = lastScrollY.current;
    const diff = current - prev;

    // Only hide after scrolling past 80px and moving downwards by more than 5px
    if (current > 80 && diff > 5) {
      setIsHidden(true);
    } else if (diff < -5 || current <= 80) {
      setIsHidden(false);
    }

    lastScrollY.current = current;
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{
        opacity: isHidden ? 0 : 1,
        y: isHidden ? -80 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex flex-col items-center pointer-events-none"
    >
      <MobileNotice />

      <div className="w-full flex justify-center px-4 pt-3 md:pt-4 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-5xl flex items-center justify-between px-3 sm:px-5 py-2 rounded-lg border border-border/70 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/25 transition-colors">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 font-bold text-lg tracking-tight uppercase text-foreground hover:opacity-85 transition-opacity pl-1"
          >
            <span>
              Fluid<span className="text-primary font-extrabold">frame</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 text-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3.5 text-sm font-medium font-manrope transition-all duration-200",
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions & CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center justify-center">
              <ThemeToggle classname="" />
            </div>

            <a
              href="https://github.com/Digvijay-x1"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button
                size="sm"
                variant="outline"
                className="relative overflow-hidden group gap-1.5 rounded-lg px-3 h-8 text-xs font-semibold font-manrope border-border/80 hover:border-foreground/30 dark:hover:border-white/30 hover:bg-muted text-foreground shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <GithubLogoIcon className="size-3.5 shrink-0 text-foreground relative z-10" />
                <span className="relative z-10">GitHub</span>
                <div
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-foreground/15 dark:via-white/35 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-button-shimmer transition-opacity duration-300" />
                </div>
              </Button>
            </a>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg hover:bg-muted cursor-pointer"
                    aria-label="Toggle navigation menu"
                  >
                    <ListIcon className="size-4" weight="bold" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="top"
                  className="mx-auto mt-4 w-[92%] max-w-md rounded-2xl border border-border bg-background/95 backdrop-blur-2xl p-5 shadow-2xl [&>button]:top-5.5 [&>button]:right-5"
                >
                  <SheetHeader className="p-0 text-left pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="font-bold text-lg uppercase tracking-tight font-geist text-foreground leading-none">
                        Fluid
                        <span className="text-primary font-extrabold">
                          frame
                        </span>
                      </SheetTitle>
                    </div>
                    <SheetDescription className="text-xs text-muted-foreground font-manrope">
                      Visual Mockups & WebGL Shader Studio
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-row">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center px-3.5 py-2.5 rounded-lg text-sm font-semibold font-manrope transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Link
                      href="/editor"
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      <Button className="w-full rounded-lg h-10 text-xs font-semibold font-manrope bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-1.5 cursor-pointer">
                        <span>Editor</span>
                      </Button>
                    </Link>
                    <a
                      href="https://github.com/Digvijay-x1/fluidframe"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="relative overflow-hidden group w-full rounded-lg h-10 text-xs font-semibold font-manrope border-border hover:border-foreground/30 dark:hover:border-white/30 gap-1.5 hover:bg-muted cursor-pointer"
                      >
                        <GithubLogoIcon className="size-3.5 shrink-0 text-foreground relative z-10" />
                        <span className="relative z-10">GitHub</span>
                        <div
                          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                          aria-hidden="true"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-foreground/15 dark:via-white/35 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-button-shimmer transition-opacity duration-300" />
                        </div>
                      </Button>
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
