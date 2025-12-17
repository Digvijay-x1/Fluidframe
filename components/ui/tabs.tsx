"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
  uniqueId: string;
} | null>(null);

function Tabs({
  className,
  value,
  onValueChange,
  defaultValue,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const uniqueId = React.useId();

  const [activeTab, setActiveTab] = React.useState<string>(
    value || defaultValue || ""
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        uniqueId,
      }}
    >
      <TabsPrimitive.Root
        data-slot="tabs"
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => {
          setActiveTab(val);
          onValueChange?.(val);
        }}
        className={cn("flex flex-col", className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative bg-muted dark:bg-neutral-800 text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-0.75",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isActive = context.activeTab === value;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative z-10 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        isActive
          ? "text-foreground dark:text-foreground"
          : "text-foreground/70 dark:text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId={`${context.uniqueId}-active-tab`}
          className="absolute inset-0 bg-background dark:bg-neutral-700 rounded-md shadow-sm -z-10"
          transition={{
            type: "spring",
            bounce: 0.3,
            duration: 0.5,
          }}
        />
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };