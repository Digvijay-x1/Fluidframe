import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const checks = ["lint", "format", "typecheck", "test", "build"];
const successful = Object.fromEntries(
  checks.map((name) => [name, { result: "success" }]),
);
const gate = (results: unknown) =>
  spawnSync(process.execPath, ["scripts/ci-gate.mjs"], {
    env: { ...process.env, CHECK_RESULTS: JSON.stringify(results) },
    encoding: "utf8",
  });

describe("required CI gate", () => {
  it("accepts all five successful prerequisites", () => {
    expect(gate(successful).status).toBe(0);
  });

  for (const check of checks) {
    for (const result of ["failure", "skipped", "cancelled", "neutral", ""]) {
      it(`rejects ${check} with result ${result || "empty"}`, () => {
        const run = gate({ ...successful, [check]: { result } });
        expect(run.status).toBe(1);
        expect(run.stderr).toContain(check);
      });
    }
    it(`rejects a missing ${check}`, () => {
      const results = { ...successful };
      delete results[check];
      expect(gate(results).status).toBe(1);
    });
  }

  it.each([null, [], "success"])("rejects invalid results %j", (results) => {
    expect(gate(results).status).toBe(1);
  });
  it("rejects malformed JSON", () => {
    const run = spawnSync(process.execPath, ["scripts/ci-gate.mjs"], {
      env: { ...process.env, CHECK_RESULTS: "{" },
    });
    expect(run.status).toBe(1);
  });
});
