import { describe, expect, it } from "vitest";
import { testDatabaseUrl } from "./test-database-url.mjs";

describe("disposable migration database boundary", () => {
  it.each(["localhost", "127.0.0.1"])(
    "accepts a local fixture on %s",
    (host) => {
      const url = `postgresql://fluidframe_ci:fluidframe_ci@${host}:5432/fluidframe_ci`;
      expect(testDatabaseUrl(url)).toBe(url);
    },
  );

  it.each([
    undefined,
    "invalid",
    "postgresql://fluidframe_ci:fluidframe_ci@production.example/fluidframe_ci",
    "postgresql://production:secret@localhost/production",
    "postgresql://fluidframe_ci:secret@localhost/fluidframe_ci",
    "postgresql://fluidframe_ci:fluidframe_ci@localhost/production",
    "https://fluidframe_ci:fluidframe_ci@localhost/fluidframe_ci",
    "postgresql://fluidframe_ci:fluidframe_ci@localhost/fluidframe_ci?host=production.example",
    "postgresql://fluidframe_ci:fluidframe_ci@localhost/fluidframe_ci#fragment",
  ])("rejects non-fixture configuration without echoing credentials", (url) => {
    expect(() => testDatabaseUrl(url)).toThrow(/disposable/);
    try {
      testDatabaseUrl(url);
    } catch (error) {
      expect(String(error)).not.toContain("secret");
      expect(String(error)).not.toContain("production.example");
    }
  });
});
