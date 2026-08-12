"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheckIcon, FileTextIcon, EnvelopeSimpleIcon, UserIcon, GithubLogoIcon, XLogoIcon } from "@phosphor-icons/react";
import { FooterPattern } from "./patterns";

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background overflow-hidden py-16 transition-colors duration-300">
      {/* Original 3D Perspective Grid Background */}
      <FooterPattern />

      <div className="w-[92%] max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-12 md:mb-16">
          {/* Brand Col (Col 2) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link
              href="/"
              className="font-bold text-2xl tracking-tight uppercase text-foreground inline-flex items-center gap-1.5 mb-4"
            >
              <span>
                Fluid<span className="text-primary font-extrabold">frame</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-xs sm:text-sm leading-relaxed">
              The modern web-first visual studio for creators. Design device mockups, real-time WebGL fluid mesh shaders, and export images & animations with zero setup.
            </p>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="font-bold text-foreground mb-3 md:mb-4 uppercase text-xs tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5 text-muted-foreground text-xs sm:text-sm">
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  FAQ & Docs
                </Link>
              </li>
              <li>
                <Link href="/#support" className="hover:text-foreground transition-colors">
                  Support & Backing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Resources */}
          <div>
            <h4 className="font-bold text-foreground mb-3 md:mb-4 uppercase text-xs tracking-wider">
              Legal & Info
            </h4>
            <ul className="space-y-2.5 text-muted-foreground *hover:text-foreground *transition-colors text-xs sm:text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <ShieldCheckIcon className="size-4 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:-translate-y-0.5" weight="duotone" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <FileTextIcon className="size-4 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:-translate-y-0.5" weight="duotone" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/DIGVIJAY__RAWAT"
                  target="_blank"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5 group"
                >
                  <EnvelopeSimpleIcon className="size-4 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:-translate-y-0.5" weight="duotone" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div>
            <h4 className="font-bold text-foreground mb-3 md:mb-4 uppercase text-xs tracking-wider">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <a
                href="https://x.com/DIGVIJAY__RAWAT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <XLogoIcon className="size-4 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:-translate-y-0.5" />
                <span>X (Twitter)</span>
              </a>
              <a
                href="https://github.com/Digvijay-x1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <GithubLogoIcon className="size-4 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:-translate-y-0.5" weight="duotone" />
                <span>GitHub</span>
              </a>
              <a
                href="https://github.com/Digvijay-x1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <UserIcon className="size-4 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:-translate-y-0.5" weight="duotone" />
                <span>Dev Portfolio</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-muted-foreground text-xs">
          <span>© {new Date().getFullYear()} Fluidframe. All rights reserved.</span>
          <div className="flex items-center gap-2 text-xs">
            <span>Crafted with ❤️ for creators worldwide by</span>
            <a
              href="https://x.com/DIGVIJAY__RAWAT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-semibold hover:underline"
            >
              Digvijay Rawat
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};