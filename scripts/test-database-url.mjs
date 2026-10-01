// CI migrations must never inherit DATABASE_URL or dotenv configuration.
export function testDatabaseUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "Set FLUIDFRAME_TEST_DATABASE_URL to the disposable local database.",
    );
  }
  if (
    !["postgresql:", "postgres:"].includes(url.protocol) ||
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    url.port !== "5432" ||
    url.username !== "fluidframe_ci" ||
    url.password !== "fluidframe_ci" ||
    url.pathname !== "/fluidframe_ci" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Migration checks require the local fluidframe_ci disposable database.",
    );
  }
  return url.toString();
}
