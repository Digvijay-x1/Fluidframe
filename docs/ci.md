# Required CI and repository controls

The `CI` workflow implements [issue #4](https://github.com/Digvijay-x1/Fluidframe/issues/4). It validates every pull request targeting `main`, every push to `main`, manual runs, and merge groups. There are no path filters. Documentation-only changes receive the same required check. Manual reruns are available from an existing Actions run; `workflow_dispatch` becomes available after the workflow reaches the default branch.

## Required check

Require the exact check name **CI required**, produced by the GitHub Actions app. Five independent jobs run lint, formatting, strict TypeScript, unit tests, and the production build in separate workspaces. Every job performs the pinned toolchain setup and frozen install. Jobs have 20-minute timeouts; the aggregate has a five-minute timeout. Obsolete PR runs are canceled, while default-branch and manual runs are preserved. Merge queues are not enabled by this change, but their validation event is supported.

The aggregate uses `always()` and checks every prerequisite for the exact `success` result directly in the workflow. It performs no checkout and executes no gate script from the PR revision. Workflow edits still require careful review: an inline gate does not make a PR-modified workflow immutable. Failed, skipped, canceled, missing, or malformed results fail the gate. A canceled aggregate does not satisfy the required check. The gate's regression tests inject each unacceptable result into each of the five prerequisites. GitHub otherwise considers skipped required jobs acceptable; see [GitHub's required-check troubleshooting guide](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).

Failure artifacts contain command logs and, for tests, JUnit results, retained for seven days. Installation failures remain visible in Actions step logs. Build logs include compile and prerender diagnostics; no `.next` output, environment files, or generated browser bundles are uploaded. Artifacts are diagnostics and must never be deployed. An externally canceled run may stop before artifact upload. Successful run logs remain in Actions. Download-cache hits only affect installation speed: `npm ci` still reconstructs dependencies in every job, and no dependency directory, generated client, or build output is reused.

## Untrusted pull requests

Validation uses only `contents: read`, checkout does not persist its token, and the workflow references no repository, environment, database, or deployment secrets. Optional integrations are explicitly disabled. Forks run the same commands without production credentials; GitHub may require maintainer approval before a first-time contributor's run starts. Do not approve a workflow change without reviewing its commands and action references. No `pull_request_target` execution or deployment step is used. The setup action isolates PR download-cache keys from trusted validation. These validation caches must not be reused by privileged release jobs.

## Main protection

After a green baseline, configure an active branch ruleset targeting `refs/heads/main` with:

- Required **CI required** from the GitHub Actions app, with the branch up to date before merging.
- Pull requests with one approval, stale approvals dismissed after new commits, and all review conversations resolved.
- Force pushes and branch deletion prohibited.
- A repository-administrator bypass limited to **pull requests**, for emergency changes reviewed and recorded through a PR. Ordinary changes must satisfy the rules. There is no direct-push bypass.

CODEOWNERS requests owner review for workflows, release/toolchain configuration, and Prisma schema/migrations. Required code-owner approval is not enabled: this repository currently has one human owner, who cannot approve their own PR. One approving review remains required; the configured CodeRabbit approval integration can supply it. Add another qualified human owner and enable required code-owner review when that is operationally possible. Workflow/security checks are extended in #6; browser validation in #5 must join the aggregate before becoming required.

Rulesets, their app binding, bypass actors, Actions fork-run approval policy, and collaborator access are repository settings rather than workflow source. Inspect them with `gh api repos/Digvijay-x1/Fluidframe/rulesets` and the individual ruleset endpoint. Do not assume a green Actions badge alone means branch protection is active. An emergency bypass must include the incident, reason, affected checks, reviewer, and follow-up in the PR; restore normal requirements immediately and rerun validation before any release.

## Verification

Run `npm run check` from a credential-free checkout. The gate regression tests cover each prerequisite failing, being skipped/canceled, returning neutral/empty results, and being absent, plus invalid input. To exercise GitHub's orchestration after changing this workflow, temporarily make each command exit nonzero on a test branch: its job and **CI required** must both fail and the PR must remain blocked. Restore the branch and confirm a green run before merging. Cancel an in-progress run and confirm its canceled gate cannot satisfy protection. Do not merge or deploy deliberately failing test branches.

The [credential-free hosted baseline](https://github.com/Digvijay-x1/Fluidframe/actions/runs/36814663668) passed all five jobs and **CI required**. A [controlled failure probe](https://github.com/Digvijay-x1/Fluidframe/actions/runs/36814843379) failed all five prerequisites and the aggregate, blocked the PR, and uploaded all five diagnostic artifacts with seven-day retention. A [skipped-job probe](https://github.com/Digvijay-x1/Fluidframe/actions/runs/36821872951) skipped lint while the other four jobs passed; **CI required** still failed. The active [main ruleset](https://github.com/Digvijay-x1/Fluidframe/rules/24288331) applies the settings above. Temporary probes are removed from the final workflow; final run evidence is recorded in the implementation PR. Main-push and merge-group runs can only be observed after merging or enabling a queue; this PR does not merge itself.
