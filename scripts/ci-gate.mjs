// GitHub treats skipped jobs as acceptable required checks. This aggregate
// explicitly accepts only success, including for every matrix/job prerequisite.
const required = ["lint", "format", "typecheck", "test", "build"];
try {
  const results = JSON.parse(process.env.CHECK_RESULTS ?? "null");
  if (!results || typeof results !== "object" || Array.isArray(results)) {
    throw new Error("Missing or invalid prerequisite results");
  }
  const failed = required.filter((name) => results[name]?.result !== "success");
  if (failed.length) {
    throw new Error(
      `Required validation did not succeed: ${failed.join(", ")}`,
    );
  }
  console.log("Every required validation job succeeded.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
