import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_ENABLED: z.enum(["true", "false"]).default("false"),
    IMAGEKIT_ENABLED: z.enum(["true", "false"]).default("false"),
    DATABASE_URL: z
      .url({
        protocol: /^postgres(?:ql)?$/,
        hostname: /^.+$/,
        error: "DATABASE_URL must be a PostgreSQL URL",
      })
      .optional(),
    IMAGEKIT_PRIVATE_KEY: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url({ protocol: /^https?$/ }).optional(),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z
      .url({ protocol: /^https?$/ })
      .optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_ENABLED: process.env.DATABASE_ENABLED,
    IMAGEKIT_ENABLED: process.env.IMAGEKIT_ENABLED,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  },
  // Only this exact value bypasses validation; "false" and "0" do not.
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  emptyStringAsUndefined: true,
  createFinalSchema: (shape, isServer) =>
    z.object(shape).superRefine((values, context) => {
      if (!isServer) return;
      if (values.DATABASE_ENABLED === "true" && !values.DATABASE_URL) {
        context.addIssue({
          code: "custom",
          path: ["DATABASE_URL"],
          message: "DATABASE_URL is required when DATABASE_ENABLED=true",
        });
      }
      if (values.IMAGEKIT_ENABLED === "true") {
        for (const key of [
          "IMAGEKIT_PRIVATE_KEY",
          "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
          "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
        ] as const) {
          if (!values[key])
            context.addIssue({
              code: "custom",
              path: [key],
              message: `${key} is required when IMAGEKIT_ENABLED=true`,
            });
        }
      }
    }),
});
