import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const keys = [
  "DATABASE_ENABLED",
  "DATABASE_URL",
  "IMAGEKIT_ENABLED",
  "IMAGEKIT_PRIVATE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
  "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
  "SKIP_ENV_VALIDATION",
] as const;

beforeEach(() => {
  vi.resetModules();
  for (const key of keys) vi.stubEnv(key, undefined);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("environment validation", () => {
  it("allows the standalone editor without credentials or a database", async () => {
    const { env } = await import("./env");
    expect(env.IMAGEKIT_ENABLED).toBe("false");
    expect(env.DATABASE_ENABLED).toBe("false");
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it("treats empty optional credentials as missing", async () => {
    for (const key of keys) vi.stubEnv(key, "");
    const { env } = await import("./env");
    expect(env.DATABASE_URL).toBeUndefined();
    expect(env.IMAGEKIT_ENABLED).toBe("false");
  });

  it.each([undefined, "false", "0", "1"])(
    "does not bypass validation for SKIP_ENV_VALIDATION=%s",
    async (value) => {
      vi.stubEnv("SKIP_ENV_VALIDATION", value);
      vi.stubEnv("NEXT_PUBLIC_APP_URL", "invalid");
      await expect(import("./env")).rejects.toThrow(
        "Invalid environment variables",
      );
    },
  );

  it("bypasses validation only when explicitly requested", async () => {
    vi.stubEnv("SKIP_ENV_VALIDATION", "true");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "invalid");
    const { env } = await import("./env");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("invalid");
  });

  it.each([
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
  ])("requires %s when ImageKit is enabled", async (missing) => {
    vi.stubEnv("IMAGEKIT_ENABLED", "true");
    vi.stubEnv("IMAGEKIT_PRIVATE_KEY", "fixture-private-key");
    vi.stubEnv("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY", "fixture-public-key");
    vi.stubEnv(
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
      "https://ik.imagekit.io/fixture",
    );
    vi.stubEnv(missing, undefined);
    await expect(import("./env")).rejects.toThrow(
      "Invalid environment variables",
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.objectContaining({ path: [missing] })]),
    );
  });

  it("accepts a complete enabled ImageKit configuration", async () => {
    vi.stubEnv("IMAGEKIT_ENABLED", "true");
    vi.stubEnv("IMAGEKIT_PRIVATE_KEY", "fixture-private-key");
    vi.stubEnv("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY", "fixture-public-key");
    vi.stubEnv(
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
      "https://ik.imagekit.io/fixture",
    );
    const { env } = await import("./env");
    expect(env.IMAGEKIT_ENABLED).toBe("true");
  });

  it("requires a PostgreSQL URL when database integration is enabled", async () => {
    vi.stubEnv("DATABASE_ENABLED", "true");
    await expect(import("./env")).rejects.toThrow(
      "Invalid environment variables",
    );
    vi.resetModules();
    vi.stubEnv("DATABASE_URL", "https://example.com");
    await expect(import("./env")).rejects.toThrow(
      "Invalid environment variables",
    );
    vi.resetModules();
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://fixture:fixture@127.0.0.1:5432/fixture",
    );
    const { env } = await import("./env");
    expect(env.DATABASE_ENABLED).toBe("true");
  });

  it.each(["invalid", "https://example.com", "postgresql://"])(
    "reports invalid DATABASE_URL=%s without throwing a URL parser error",
    async (value) => {
      vi.stubEnv("DATABASE_URL", value);
      await expect(import("./env")).rejects.toThrow(
        "Invalid environment variables",
      );
    },
  );

  it.each(["IMAGEKIT_ENABLED", "DATABASE_ENABLED"])(
    "rejects an invalid flag value for %s",
    async (key) => {
      vi.stubEnv(key, "yes");
      await expect(import("./env")).rejects.toThrow(
        "Invalid environment variables",
      );
    },
  );
});
