import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
const requiredJob = workflow.split("\n  required:\n")[1];
// Exercise the exact inline shell used by Actions, without a separate gate script.
const command = requiredJob
  .split("        run: |\n")[1]
  .split("\n")
  .map((line) => line.replace(/^ {10}/, ""))
  .join("\n");
const checks = ["LINT", "FORMAT", "TYPECHECK", "TEST", "BUILD"];
const successful = Object.fromEntries(
  checks.map((name) => [`${name}_RESULT`, "success"]),
);
const gate = (results: Record<string, string>) =>
  spawnSync(
    "bash",
    ["--noprofile", "--norc", "-e", "-o", "pipefail", "-c", command],
    {
      env: { NODE_ENV: "test", ...results },
      encoding: "utf8",
    },
  );

describe("required CI gate", () => {
  it("evaluates all five needs results without checking out or executing PR code", () => {
    expect(requiredJob).not.toContain("uses:");
    expect(command).not.toContain("scripts/");
    for (const check of checks) {
      expect(requiredJob).toContain(
        `${check}_RESULT: ` + "${{ needs." + check.toLowerCase() + ".result }}",
      );
    }
  });

  it("accepts all five successful prerequisites", () => {
    expect(gate(successful).status).toBe(0);
  });

  for (const check of checks) {
    for (const result of ["failure", "skipped", "cancelled", "neutral", ""]) {
      it(`rejects ${check} with result ${result || "empty"}`, () => {
        const run = gate({ ...successful, [`${check}_RESULT`]: result });
        expect(run.status).toBe(1);
        expect(run.stdout).toContain(check);
      });
    }
    it(`rejects a missing ${check}`, () => {
      const results = { ...successful };
      delete results[`${check}_RESULT`];
      expect(gate(results).status).toBe(1);
    });
  }

  it.each(["success failure", "success\n", "$(exit 0)", "SUCCESS"])(
    "rejects unexpected result %j without shell evaluation",
    (result) => {
      expect(gate({ ...successful, LINT_RESULT: result }).status).toBe(1);
    },
  );
});
