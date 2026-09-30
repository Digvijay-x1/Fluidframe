import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // The editor's existing shader/DOM adapters use dynamic values. Typecheck
      // still runs in strict mode; replacing these anys is separate cleanup.
      "@typescript-eslint/no-explicit-any": "off",
      // React Compiler is not enabled in this app. Report its migration
      // diagnostics while retaining blocking framework/rules-of-hooks checks.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/purity": "warn",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      // React test harnesses intentionally expose hook results to assertions.
      "react-hooks/globals": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "src/prisma/client/**",
    "public/ffmpeg/**",
    ".agents/**",
    ".codex/**",
  ]),
]);
