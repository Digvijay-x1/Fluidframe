import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-2 border-neutral-300 dark:border-neutral-700/95 placeholder:text-muted-foreground focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 min-h-8 w-full max-w-full min-w-0 box-border rounded-md bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm whitespace-pre-wrap break-words [overflow-wrap:anywhere] [field-sizing:fixed]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
