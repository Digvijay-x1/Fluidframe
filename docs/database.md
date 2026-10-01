# Database validation and release safety

## Current persistence decision

As of 2026-10-01, no application route, server action, or library imports the generated Prisma client or queries PostgreSQL. Draft recovery uses browser IndexedDB. `DATABASE_ENABLED=true` only validates a URL; it does not enable a persistence feature. Keep it unset/false on current deployments. Installation, ordinary tests, typechecking, and production builds generate the client without connecting to a database and never run migrations.

The three historical migrations create legacy `user`, `session`, `account`, and `verification` tables. They are not required by the live editor. Preserve them for existing databases rather than deleting history or dropping tables. The Prisma schema now describes their final structure; restoring these model declarations does not activate auth or persistence. No production database, credentials, or provider settings were accessed or changed for this work.

## Credential-free checks

`npm run db:validate` validates the schema and generates Prisma without a database. The **Database validation** workflow runs this on every PR/main push, merge group, and manual run, with a read-only token and no secrets. There are no workflow path filters that can leave the aggregate pending.

A separate job provisions ephemeral PostgreSQL 17 only when the schema, migrations, Prisma configs, package manifest/lock, runtime/npm configuration (`.nvmrc`, `.node-version`, `.npmrc`), database validation helpers, setup action, or database workflow change. Manual runs and missing/unknown base commits conservatively run it too. Other changes do not provision PostgreSQL. The service is discarded after the job.

`npm run db:check` applies every committed migration with `migrate deploy`, checks status, and compares the resulting database to the committed schema with `migrate diff --exit-code`. It fails on SQL errors, unfinished migrations, or schema drift. CI invokes the installed lockfile-pinned Prisma CLI directly so changing npm aliases cannot bypass schema or migration validation. CI repeats the migration commands to verify deployment is idempotent. [Prisma documents these migration commands](https://www.prisma.io/docs/cli/v7/migrate).

The dedicated `prisma.ci.config.ts` never reads dotenv or `DATABASE_URL`. It requires `FLUIDFRAME_TEST_DATABASE_URL` with a loopback host, explicit port 5432, fixture username/password, and the `fluidframe_ci` database; query parameters are rejected to prevent connection overrides. This protects against accidentally inheriting a real URL or pointing at a different local port. It is not a sandbox for arbitrary PR code: the workflow, config, and installed dependencies still require review, and credential isolation comes from providing no production secrets to the workflow.

Local reproduction (requires Docker and the pinned Node/npm toolchain):

```bash
docker run --rm -d --name fluidframe-db-check \
  -e POSTGRES_USER=fluidframe_ci -e POSTGRES_PASSWORD=fluidframe_ci \
  -e POSTGRES_DB=fluidframe_ci -p 127.0.0.1:5432:5432 postgres:17-alpine
# Wait until this reports "accepting connections".
docker exec fluidframe-db-check pg_isready -U fluidframe_ci -d fluidframe_ci
FLUIDFRAME_TEST_DATABASE_URL=postgresql://fluidframe_ci:fluidframe_ci@127.0.0.1:5432/fluidframe_ci npm run db:check
docker stop fluidframe-db-check
```

**Database required** succeeds only when schema validation passes and migrations pass, or migrations are explicitly unnecessary and skipped. Failed/canceled/unexpectedly skipped jobs and missing decisions fail it. Failure migration logs have seven-day retention and contain only fixture configuration. Maintainers should add this exact check from GitHub Actions to the main ruleset after a successful hosted baseline. The workflow cannot itself enforce repository protection; coordinate that setting with #4 without disrupting its active PR.

## Requirements before enabling production persistence

Production migration execution is intentionally absent while persistence is unused. This workflow receives no production secret, and installation/build hooks contain no migration command. A trusted serialized production migration job, representative previous-schema/data upgrade test, and real backup/restore drill are inapplicable to the current database-free app. They become release prerequisites when #7 establishes the trusted deployment path and a feature actually uses PostgreSQL; setting the environment flag alone is insufficient.

Before that activation, the release owner (@Digvijay-x1) must:

1. Identify the production database/provider, direct migration endpoint, previous release schema, and authorized migration owner. Keep preview/test databases and credentials separate. Use a dedicated least-privilege migration role with only the schema DDL/DML permissions needed; the app runtime role must not own migration privileges. Store the migration credential only in the protected production environment, never browser/public variables, PR jobs, artifacts, or logs. Use a direct endpoint for migrations when the provider uses transaction pooling.
2. Test the exact committed migration chain on a disposable copy of the previous schema with sanitized representative data. Preserve sensitive data boundaries. The historical token migration adds a non-null column without a default and cannot upgrade a populated session table; the earlier account migration drops `expiresAt`. Do not apply this history blindly to an existing auth database. Reconcile its migration ledger and plan explicit backfills/baselines with the owner instead of rewriting applied SQL.
3. Document and verify a recent backup/PITR restore point, retention, restore permissions, target recovery time, and a restore into an isolated database. Record the drill and data-loss window. A backup existing is insufficient evidence that it can be restored. Restore/cutover of production requires the incident owner's authorization.
4. Gate the exact immutable release SHA on validation and approval. In the production release workflow, use one shared concurrency group for migrations, deployment, and rollback, with `cancel-in-progress: false`. Reject stale candidates before mutation. Do not run migrations in a separate independently racing workflow or allow Vercel builds to migrate. Bind migration success and deployment to the same candidate; a failure must stop promotion.
5. Run only the locally installed pinned `prisma migrate deploy` against the reviewed migration history in the trusted job. Never use `migrate dev`, `migrate reset`, or `db push` against production. On failure, stop and inspect migration status with the owner; do not automatically reset, resolve, retry indefinitely, or reverse migrations. Record the SHA, migration names, job/deployment IDs, actor, and sanitized outcome.

## Compatibility and rollback

Use expand/contract changes: first add compatible optional columns/tables/indexes; deploy code that tolerates both representations; backfill with bounded, resumable operations; verify data and compatibility with both previous and next app releases. Only remove old structures in a later separately reviewed release after the rollback window closes. Document locks, runtime impact, validation queries, and who approves each stage.

App rollback routes traffic to a previously validated compatible release and leaves successful database migrations in place. Never attempt an automatic reverse migration. A destructive or incompatible change requires a forward repair or separately approved restore/cutover plan; restoring a database can lose writes since the recovery point. Coordinate this with #9's rollback runbook before persistence activation.

## Implementation evidence

Local checks on 2026-10-01 with the pinned Node/npm versions:

- `npm run check` passed lint (63 existing warnings, no errors), formatting, strict TypeScript, all 67 tests, and the production build.
- `db:validate` passed without connecting to PostgreSQL. All three migrations applied to a fresh disposable PostgreSQL 17 instance; status and schema comparison passed. A repeat deployment reported no pending migrations and no schema difference.
- An intentionally invalid temporary migration failed `db:check` with exit 1/P3018. Comparing the applied database to the original empty schema returned exit 2, proving drift is blocking. Both probes were removed and a new disposable instance passed the final checks.
- Supplying only an inherited production-style `DATABASE_URL` failed the test configuration with exit 1 before a database operation. Fixture-boundary tests reject remote endpoints, wrong database/credentials, and URL overrides. Gate tests reject failed/canceled/unexpected skips and invalid decisions.
- Actionlint 1.7.12 and `git diff --check` passed. Hosted run evidence belongs in the implementation PR; repository protection for the new check should be enabled after merge and a green baseline.

Review follow-up: reproduced the no-op npm-alias bypass and acceptance of non-fixture local ports before fixing them. The exact updated workflow shell applied and repeated all migrations even with `db:check` replaced by a no-op; adding invalid SQL still failed with exit 1/P3018, and port 5433 was rejected before connection. Change-detection tests use real Git diffs to verify runtime/npm configuration triggers migration checks. All 79 tests, lint, formatting, strict TypeScript, and actionlint passed after these changes.
