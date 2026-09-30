# Reproducible installation and build

This guide implements [issue #3](https://github.com/Digvijay-x1/Fluidframe/issues/3). Use Node 24.18.0 and npm 11.16.0 locally and in Actions. Vercel manages the Node 24.x patch version; `engines.node` prevents a different major. Update `.nvmrc`, `.node-version`, `package.json`, `vercel.json`, and the setup action together when upgrading the toolchain.

## Clean checkout

```bash
nvm install
nvm use
npm install --global npm@11.16.0
npm ci
npm run check
```

No environment file or integration credentials are needed. `npm ci` installs the versions recorded in the sole application lockfile, `package-lock.json`, and fails if the manifest and lockfile disagree. Use `npm install` only when intentionally changing dependencies; review and commit both files. `.npmrc` enforces the supported Node major and exact npm version.

The check command runs lint, Prettier, environment validation, strict TypeScript, Vitest, and a production build. `npm run env:check` loads development env files through Next.js's loader; `npm run env:check -- production` loads production env files. Build/typecheck scripts run this explicit check first because Next.js 16.0.10's `typegen` can report a rejected config import while returning exit code zero. The Prisma CLI, client, and PostgreSQL adapter are pinned to the same version. Prisma generation runs during installation and typechecking. `next typegen` generates route declarations before TypeScript so typechecking does not depend on an old `.next` directory. Run each script separately to parallelize checks in future workflows; type generation and builds must use separate jobs/workspaces to avoid concurrent writes to `.next`.

Next.js's recommended lint presets cover framework, React, accessibility, hooks, and TypeScript checks. Existing dynamic graphics adapters allow explicit `any`; strict TypeScript still checks the full project. Vendored FFmpeg binaries/JavaScript and generated Prisma/Next files are excluded from source lint and formatting. React Compiler is not enabled; its existing effect, memoization, and purity diagnostics are warnings while framework errors and Rules of Hooks violations block validation. Existing unused-variable/image/dependency warnings remain visible for follow-up cleanup. Test harnesses may expose hook values to assertions. Formatting changes establish the initial baseline.

## GitHub Actions setup

After checking out the repository, use the composite action:

```yaml
permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      # Pin checkout to a reviewed full commit SHA in the calling workflow.
      - uses: actions/checkout@<reviewed-full-commit-sha>
      - uses: ./.github/actions/setup
      - run: npm run check
```

The action pins setup-node/cache to full commit SHAs, installs npm 11.16.0, and always runs `npm ci`. It caches only npm's download cache. Cache keys include PR/trusted scope, OS, architecture, Node version, npm version, and lockfile hash, with no fallback keys. PR caches cannot be restored into trusted jobs. Do not cache writable `node_modules`, `.next`, or generated clients across untrusted and privileged workflows. Do not execute PR code through privileged `pull_request_target` jobs or pass deployment/database credentials to ordinary validation.

Required checks, workflow triggers, repository protection, deployment authority, and security automation are tracked separately in #4, #6, and #7. The composite action does not deploy or change GitHub repository settings.

## Vercel alignment

- Set the project's Node.js Version to **24.x** and framework to **Next.js**.
- Keep the root directory at the repository root so `vercel.json` is used.
- Remove dashboard command overrides that conflict with the committed install/build commands.
- The install command is `npx --yes npm@11.16.0 ci`, and the build command is `npm run build`.
- Set `IMAGEKIT_ENABLED=true` and all three ImageKit values only in environments using the asset libraries. Existing credentials alone no longer enable the integration.
- Leave `DATABASE_ENABLED` unset/false for the current app. Set it to true with a PostgreSQL URL only when configuring persistence.
- Omit `SKIP_ENV_VALIDATION` from normal preview/production configuration.

Vercel account/dashboard settings have not been changed by this implementation. Maintainers must confirm the Node major and command overrides before deploying. Preview and production `NEXT_PUBLIC_*` values are build inputs; validate the environment used for the exact candidate being released.

## Environment and database behavior

`lib/env.ts` validates optional URLs and the exact `true`/`false` integration flags. Enabled ImageKit requires the public key, private key, and HTTP(S) endpoint. Enabled database configuration requires a PostgreSQL URL. Disabled ImageKit APIs return a documented 503 and make no provider request. `SKIP_ENV_VALIDATION=true` is the explicit emergency escape hatch; `false`, `0`, and `1` do not bypass validation. Do not use the escape hatch to satisfy CI/release checks.

No application code currently queries Prisma. Drafts use browser IndexedDB. Prisma generation reads the committed schema and writes the ignored `src/prisma/client` directory; it neither connects to a database nor applies migrations. The config reads the optional URL directly instead of calling Prisma's throwing `env()` helper, following [Prisma's optional environment guidance](https://www.prisma.io/docs/orm/reference/prisma-config-reference#handling-optional-environment-variables). No dummy production URL is needed. Database CLI commands still require an explicit real URL; never run reset/development migrations against production. Migration validation/release ordering belong to #8.

## Build network requirements and troubleshooting

Dependency installation requires the npm registry and Prisma engine downloads. The current layout uses `next/font/google`, so production builds also fetch Google Fonts over HTTPS. A network failure fetching fonts is a build failure; this configuration does not replace fonts with placeholders or bypass the build. Self-hosting fonts can be a separate change if offline builds are needed.

- **Engine mismatch:** select the committed Node version and install npm 11.16.0 before `npm ci`.
- **Lockfile mismatch:** make the intended dependency change with pinned npm and commit the updated manifest and lockfile. Do not replace frozen CI installation with `npm install`.
- **Missing generated types:** run `npm run typecheck`; it generates both clients and route types before checking.
- **Invalid integration configuration:** check the named variable and its flag in the build environment. Error messages identify fields without printing credential values.
- **Formatting failure:** run `npm run format` and review the changes.
- **Prisma URL missing during generation:** use this committed `prisma.config.ts`; it intentionally permits URL-free generation.

## Completion evidence

Local baseline on 2026-09-30, using Node 24.18.0 and npm 11.16.0:

- Copied tracked/proposed sources into a fresh directory with no `.env` files, dependency directory, generated client, or Next.js output. `npm ci` installed the locked dependencies and generated Prisma without a database URL. A later frozen reinstall also succeeded using the download cache offline.
- Lint completed with zero errors and 63 existing warnings. Formatting and strict TypeScript passed.
- All 39 tests passed across four files, including 17 environment cases and the existing recovery coverage.
- The production build passed with integrations disabled and no credentials/database. Google font requests required network access and one retry after transient download failures. Font availability remains a build dependency.
- A deliberate manifest/lockfile mismatch failed `npm ci` with exit code 1 and a useful version mismatch message.
- `IMAGEKIT_ENABLED=true` with missing credentials failed the explicit production environment check with exit code 1 and identified all three missing variables. This also exposed and avoided `next typegen`'s incorrect success exit on a config rejection.

The environment suite covers credential-free startup, empty configuration, enabled integrations, malformed URLs/flags, and the explicit validation bypass. Provider credentials and a live database are outside ordinary PR validation. GitHub Actions run evidence and hosted setting confirmation must be supplied when #4/#7 integrate this foundation. Existing dependency audit findings belong to #6; passing this baseline does not establish production release readiness.
