"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCodeIcon,
  CopyIcon,
  SparkleIcon,
  StarIcon,
  ShieldCheckIcon,
  PersonIcon,
  CheckIcon,
  ArrowRightIcon,
  GitPullRequestIcon,
  BugIcon,
  CurrencyDollarIcon,
  GithubLogoIcon,
  type Icon,
} from "@phosphor-icons/react";
import TechStackIcon from "tech-stack-icons";
import Image from "next/image";
import { toast } from "sonner";

interface ContributionChannel {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: Icon;
  iconColor: string;
  href: string;
  borderClass: string;
  bgHover: string;
}

interface TelemetryCapability {
  icon: Icon;
  iconColor: string;
  title: string;
  sub: string;
  borderClass: string;
  bgHover: string;
  hoverWeight?: "fill" | "bold";
}

export const Support: React.FC = () => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = "hackerearthx1-1@oksbi";

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toast.success("UPI ID copied to clipboard!", {
      description: upiId,
    });
  };

  const contributionChannels: ContributionChannel[] = [
    {
      id: "star",
      title: "Star & Share",
      badge: "Community",
      desc: "Help more creators discover Fluidframe",
      icon: StarIcon,
      iconColor: "text-orange-400",
      href: "https://github.com/Digvijay-x1/fluidframe",
      borderClass: "hover:border-orange-400/50",
      bgHover: "hover:bg-orange-400/5",
    },
    {
      id: "prs",
      title: "Pull Requests",
      badge: "GLSL & Code",
      desc: "Contribute via new features and tools",
      icon: GitPullRequestIcon,
      iconColor: "text-purple-600",
      href: "https://github.com/Digvijay-x1/fluidframe/pulls",
      borderClass: "hover:border-purple-500/50",
      bgHover: "hover:bg-purple-500/5",
    },
    {
      id: "issues",
      title: "Issues & Feedback",
      badge: "RFCs",
      desc: "Report bugs or suggest solutions",
      icon: BugIcon,
      iconColor: "text-red-500",
      href: "https://github.com/Digvijay-x1/fluidframe/issues",
      borderClass: "hover:border-red-500/50",
      bgHover: "hover:bg-red-500/5",
    },
  ];

  const telemetryCapabilities: TelemetryCapability[] = [
    {
      icon: CurrencyDollarIcon,
      iconColor: "text-indigo-700",
      title: "100% Free Forever",
      sub: "No subscriptions or paywalls",
      borderClass: "hover:border-indigo-500/50",
      bgHover: "hover:bg-indigo-500/5",
      hoverWeight: "bold",
    },
    {
      icon: SparkleIcon,
      iconColor: "text-amber-500",
      title: "High Quality Export",
      sub: "Broadcast-ready rendering",
      borderClass: "hover:border-amber-500/50",
      bgHover: "hover:bg-amber-500/5",
    },
    {
      icon: ShieldCheckIcon,
      iconColor: "text-emerald-500",
      title: "Zero-Knowledge Privacy",
      sub: "100% Client-side browser execution",
      borderClass: "hover:border-emerald-500/50",
      bgHover: "hover:bg-emerald-500/5",
    },
    {
      icon: PersonIcon,
      iconColor: "text-blue-500",
      title: "Free for Commercial Use",
      sub: "Use for any client or personal work",
      borderClass: "hover:border-blue-500/50",
      bgHover: "hover:bg-blue-500/5",
    },
  ];

  return (
    <section
      id="support"
      className="w-full min-h-screen py-16 mb-4 md:py-24 relative overflow-hidden flex flex-col justify-center items-center"
    >
      <div className="w-[92%] max-w-6xl mx-auto relative z-10 my-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
          >
            Free for everyone
            <br />
            <span className="font-instrument font-normal text-primary">
              Empowered by you
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed"
          >
            Fluidframe has no paywalls, zero telemetry trackers, and no venture
            capitalists. It is built independently with love which accelerates
            your creative workflow.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-10 items-center px-4 sm:px-8 lg:px-12 xl:px-24 gap-8 lg:gap-6">
            <div className="lg:col-span-3 flex flex-col justify-between space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Uncompromised studio capabilities for all.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No features are held hostage behind tier upgrades. Every
                  creator gets the complete toolkit.
                </p>
              </div>

              {/* Holographic Capability Pills */}
              <div className="space-y-2">
                {telemetryCapabilities.map((cap, i) => {
                  const CapIcon = cap.icon;
                  return (
                    <div
                      key={i}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl border border-border/70 dark:border-neutral-800 bg-background/50 dark:bg-neutral-900/50 backdrop-blur-md transition-all ${cap.borderClass} ${cap.bgHover}`}
                    >
                      <div className="size-8 rounded-xl bg-muted/30 dark:bg-neutral-800/90 flex flex-col items-center justify-center shrink-0 mt-0.5 border border-border/50 dark:border-neutral-800">
                        <div className="transition-transform duration-200 ease-out group-hover:scale-[1.2] flex items-center justify-center">
                          <CapIcon
                            weight="regular"
                            className={`size-4 ${cap.iconColor} block group-hover:hidden`}
                          />
                          <CapIcon
                            weight={cap.hoverWeight ?? "fill"}
                            className={`size-4 ${cap.iconColor} hidden group-hover:block`}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                          {cap.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {cap.sub}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center relative my-2 lg:my-0">
              <div className="relative w-full max-w-70 sm:max-w-75 aspect-square rounded-full flex items-center justify-center p-6 border border-primary/20 dark:border-primary/30 bg-linear-to-b from-primary/10 via-background to-background/80 shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)]">
                <div className="absolute inset-0 rounded-full border border-dashed border-primary/40 animate-[spin_40s_linear_infinite] pointer-events-none" />
                <div className="absolute inset-3 rounded-full border border-border/60 dark:border-neutral-800 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center w-full">
                  <AnimatePresence mode="wait">
                    {showQR ? (
                      <motion.div
                        key="qr-hologram"
                        initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col items-center"
                      >
                        <div className="relative p-2.5 bg-white rounded-2xl shadow-2xl border-2 border-primary/50 mb-2.5 group">
                          <div className="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-primary" />
                          <div className="absolute -top-1 -right-1 size-3 border-t-2 border-r-2 border-primary" />
                          <div className="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-primary" />
                          <div className="absolute -bottom-1 -right-1 size-3 border-b-2 border-r-2 border-primary" />

                          <Image
                            src="/qr.png"
                            alt="Fluidframe Creator UPI QR Code"
                            width={125}
                            height={125}
                            className="rounded-lg object-contain"
                          />
                        </div>

                        <span className="text-[11px] font-inter text-muted-foreground mb-1.5">
                          GPay · PhonePe · Paytm · UPI
                        </span>

                        <button
                          type="button"
                          onClick={() => setShowQR(false)}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Back to Direct Copy</span>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upi-core"
                        initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col items-center w-full"
                      >
                        <div className="relative mb-2.5 group">
                          <div className="size-20 rounded-2xl bg-linear-to-tr from-primary via-purple-500 to-amber-400 p-0.5 shadow-lg">
                            <div className="size-full bg-background rounded-[14px] overflow-hidden relative">
                              <Image
                                src="/author.jpeg"
                                alt="Digvijay Rawat"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-foreground">
                          Digvijay Rawat
                        </h4>
                        <p className="text-[11px] text-muted-foreground mb-2.5">
                          Indie Developer & Creator
                        </p>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCopyUPI()}
                          className="w-full max-w-50 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-background/80 dark:bg-neutral-900 border border-border/80 dark:border-neutral-800 hover:border-primary text-xs font-inter transition-all cursor-pointer shadow-xs group"
                        >
                          <span className="truncate text-foreground font-semibold">
                            {upiId}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-primary shrink-0">
                            {copied ? (
                              <>
                                <CheckIcon className="size-3 text-emerald-500" />
                                <span className="text-emerald-500 font-semibold">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <CopyIcon className="size-3" />
                                <span className="font-semibold">Copy</span>
                              </>
                            )}
                          </div>
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => setShowQR(true)}
                          className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer"
                        >
                          <QrCodeIcon className="size-3.5 text-primary" />
                          <span>Show QR Code</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Build Fluidframe with us on GitHub.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join the open-source community. Contribute custom shaders,
                  submit bug fixes, or star the project.
                </p>
              </div>

              <div className="space-y-2">
                {contributionChannels.map((channel) => {
                  const ChannelIcon = channel.icon;
                  return (
                    <a
                      key={channel.id}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer border-border/70 dark:border-neutral-800 bg-background/50 dark:bg-neutral-900/50 ${channel.borderClass} ${channel.bgHover} group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-muted/30 dark:bg-neutral-800/90 flex items-center justify-center shrink-0 border border-border/50 dark:border-neutral-800">
                          <div className="transition-transform duration-200 ease-out group-hover:scale-[1.2] flex items-center justify-center">
                            <ChannelIcon
                              weight="regular"
                              className={`size-4 ${channel.iconColor} block group-hover:hidden`}
                            />
                            <ChannelIcon
                              weight="fill"
                              className={`size-4 ${channel.iconColor} hidden group-hover:block`}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-foreground transition-colors">
                              {channel.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {channel.desc}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}

                <a
                  href="https://github.com/Digvijay-x1/fluidframe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden w-full flex items-center justify-between p-2.5 rounded-xl border border-border/70 dark:border-neutral-800 bg-muted/30 dark:bg-neutral-900/50 hover:bg-muted/70 hover:border-foreground/30 dark:hover:border-white/30 text-xs font-semibold text-foreground transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="size-8 rounded-xl bg-muted/30 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-900 flex items-center justify-center">
                      <div className="transition-transform duration-200 ease-out group-hover:scale-[1.2] flex items-center justify-center">
                        <GithubLogoIcon
                          weight="regular"
                          className="size-4 text-black dark:text-neutral-300 block group-hover:hidden"
                        />
                        <GithubLogoIcon
                          weight="fill"
                          className="size-4 text-black dark:text-neutral-300 hidden group-hover:block"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">Digvijay-x1/fluidframe</span>
                      <span className="text-[11px] text-muted-foreground font-light">
                        Public repository{" "}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-foreground relative z-10">
                    <span>Repo</span>
                    <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:-rotate-45" />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-foreground/15 dark:via-white/35 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-button-shimmer transition-opacity duration-300" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
