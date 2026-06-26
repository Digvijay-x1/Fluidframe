"use client";
import Link from "next/link";
import { HouseIcon, ImageBrokenIcon } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <ImageBrokenIcon
            size={80}
            weight="thin"
            className="text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">
            There might be some issue with the page you are looking for.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <HouseIcon size={20} weight="regular" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
