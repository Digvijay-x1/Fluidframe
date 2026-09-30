import nextEnv from "@next/env";

// Match Next.js's environment file precedence for the command being run.
// An awaited import propagates validation failures to a nonzero exit code,
// including on Next.js versions whose typegen swallows config rejections.
nextEnv.loadEnvConfig(process.cwd(), process.argv[2] !== "production");
await import("../lib/env.ts");
console.log("Environment configuration is valid.");
