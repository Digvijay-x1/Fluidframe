import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/database.yml", "utf8");
const requiredJob = workflow.split("\n  required:\n")[1];
const command = requiredJob
  .split("        run: |\n")[1]
  .split("\n")
  .map((line) => line.replace(/^ {10}/, ""))
  .join("\n");

function gate(schema: string, decision: string, migrations: string) {
  return spawnSync("bash", ["--noprofile", "--norc", "-c", command], {
    env: {
      NODE_ENV: "test",
      SCHEMA_RESULT: schema,
      NEEDS_MIGRATIONS: decision,
      MIGRATIONS_RESULT: migrations,
    },
  }).status;
}

describe("database required check", () => {
  it("runs without checking out or executing PR scripts", () => {
    expect(requiredJob).not.toContain("uses:");
    expect(command).not.toContain("scripts/");
  });

  it("accepts completed migrations", () => {
    expect(gate("success", "true", "success")).toBe(0);
  });

  it("accepts a skip only when PostgreSQL is explicitly unnecessary", () => {
    expect(gate("success", "false", "skipped")).toBe(0);
    expect(gate("success", "false", "success")).toBe(1);
  });

  it.each(["failure", "cancelled", "skipped", "neutral", ""])(
    "rejects required migrations with result %j",
    (result) => {
      expect(gate("success", "true", result)).toBe(1);
    },
  );

  it.each(["failure", "cancelled", "skipped", "neutral", ""])(
    "rejects schema validation with result %j",
    (result) => {
      expect(gate(result, "false", "skipped")).toBe(1);
    },
  );

  it.each(["", "TRUE", "unexpected", "$(exit 0)"])(
    "rejects an invalid change decision %j",
    (decision) => {
      expect(gate("success", decision, "skipped")).toBe(1);
    },
  );
});
