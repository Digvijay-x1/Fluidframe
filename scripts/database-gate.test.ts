import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/database.yml", "utf8");
function stepCommand(name: string) {
  return workflow
    .split(`      - name: ${name}\n`)[1]
    .split("        run: |\n")[1]
    .split(/\n      - /)[0]
    .split("\n")
    .map((line) => line.replace(/^ {10}/, ""))
    .join("\n");
}
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

describe("migration commands", () => {
  const command = stepCommand(
    "Apply committed migrations and reject schema drift",
  );

  function run(failure = "") {
    const cwd = mkdtempSync(join(tmpdir(), "fluidframe-migration-commands-"));
    try {
      mkdirSync(join(cwd, "node_modules/.bin"), { recursive: true });
      // Changing the npm alias to a no-op must not change the workflow command.
      writeFileSync(
        join(cwd, "package.json"),
        JSON.stringify({ scripts: { "db:check": "exit 0" } }),
      );
      writeFileSync(
        join(cwd, "node_modules/.bin/prisma"),
        '#!/bin/bash\nprintf "%s\\n" "$*" >> calls.log\nif [[ "$2" == "$FAIL_COMMAND" ]]; then exit 23; fi\n',
        { mode: 0o755 },
      );
      const result = spawnSync(
        "bash",
        ["--noprofile", "--norc", "-c", command],
        {
          cwd,
          env: { ...process.env, FAIL_COMMAND: failure },
        },
      );
      return {
        status: result.status,
        calls: readFileSync(join(cwd, "calls.log"), "utf8").trim().split("\n"),
      };
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  }

  it("runs deploy, status and drift checks twice despite a no-op npm alias", () => {
    const result = run();
    expect(result.status).toBe(0);
    expect(result.calls).toEqual([
      "migrate deploy --config prisma.ci.config.ts",
      "migrate status --config prisma.ci.config.ts",
      "migrate diff --config prisma.ci.config.ts --from-config-datasource --to-schema prisma/schema.prisma --exit-code",
      "migrate deploy --config prisma.ci.config.ts",
      "migrate status --config prisma.ci.config.ts",
      "migrate diff --config prisma.ci.config.ts --from-config-datasource --to-schema prisma/schema.prisma --exit-code",
    ]);
  });

  it.each(["deploy", "status", "diff"])(
    "fails immediately when %s fails despite log piping and a no-op npm alias",
    (failure) => {
      const result = run(failure);
      expect(result.status).toBe(23);
      expect(result.calls).toHaveLength(
        ["deploy", "status", "diff"].indexOf(failure) + 1,
      );
    },
  );
});

describe("migration change detection", () => {
  const command = stepCommand(
    "Determine whether database checks need PostgreSQL",
  );

  it.each([
    [".nvmrc", "true"],
    [".node-version", "true"],
    [".npmrc", "true"],
    ["prisma/migrations/new/migration.sql", "true"],
    ["README.md", "false"],
  ])("decides whether %s needs PostgreSQL", (file, expected) => {
    const cwd = mkdtempSync(join(tmpdir(), "fluidframe-database-changes-"));
    try {
      const git = (args: string[]) => {
        const result = spawnSync("git", args, {
          cwd,
          encoding: "utf8",
          env: {
            ...process.env,
            GIT_CONFIG_NOSYSTEM: "1",
            GIT_CONFIG_GLOBAL: "/dev/null",
          },
        });
        expect(result.status, result.stderr).toBe(0);
        return result.stdout.trim();
      };
      const commit = [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.test",
        "commit",
        "--no-gpg-sign",
        "-m",
        "fixture",
      ];
      git(["init"]);
      git([...commit, "--allow-empty"]);
      const base = git(["rev-parse", "HEAD"]);
      mkdirSync(join(cwd, file, ".."), { recursive: true });
      writeFileSync(join(cwd, file), "fixture\n");
      git(["add", "."]);
      git(commit);
      const output = join(cwd, "output");
      const result = spawnSync(
        "bash",
        ["--noprofile", "--norc", "-c", command],
        {
          cwd,
          env: {
            ...process.env,
            EVENT: "pull_request",
            BASE_SHA: base,
            GITHUB_OUTPUT: output,
          },
        },
      );
      expect(result.status).toBe(0);
      expect(readFileSync(output, "utf8").trim()).toBe(
        `migrations=${expected}`,
      );
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
