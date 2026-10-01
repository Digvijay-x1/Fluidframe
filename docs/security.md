# Workflow and dependency security

These source controls implement the automation for [issue #6](https://github.com/Digvijay-x1/Fluidframe/issues/6).
Repository settings listed below must be activated after the first successful
scan. A successful CodeQL job means analysis completed; findings are enforced by
the code scanning ruleset, not by the analysis job exit status.

## Checks and blocking policy

| Control              | Execution                                           | Blocking policy                                                                                                    |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| actionlint 1.7.12    | Every CI event                                      | Any workflow syntax, expression, or shell lint error fails CI required                                             |
| Gitleaks 8.30.1      | Every CI event, full available git history          | Any detected secret fails CI required; output is fully redacted                                                    |
| Dependency review v5 | Every PR to main                                    | Newly introduced high/critical vulnerabilities fail CI required, including development dependencies                |
| CodeQL v4            | PRs, main pushes, merge groups, manual runs, weekly | Require completed CodeQL scans; block high/critical security findings and error-level findings through the ruleset |
| Dependabot           | Weekly npm and Actions update PRs                   | Normal review and all required checks; no automatic merging                                                        |

Dependency review uses GitHub's dependency graph comparison, with no PR code
execution, install scripts, checkout, secrets, or PR comment writes. Non-PR
events explicitly require this job to be skipped; every PR requires success.
GitHub's dependency graph must be enabled. It detects new vulnerabilities rather
than certifying that all existing dependencies are safe. Enable Dependabot alerts
and security updates for existing and newly disclosed advisories. Review moderate
and low findings before the next release; raise the priority when exposure makes
the issue exploitable. High/critical findings block release even if inherited
from the baseline.

CodeQL analyzes `javascript-typescript` and `actions` using `security-extended`
queries with no build or dependency installation. Only the analysis job has
`security-events: write`, to upload results. Public fork PR analysis uses GitHub's
supported read-only token behavior. No job has repository content writes or
deployment credentials. See [CodeQL workflow configuration](https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options).

External Actions are pinned to full commit SHAs. Dependabot proposes updates to
these pins, including the setup composite action. Review the upstream release,
commit, permissions, and executed code before approval. Go tools are installed
at explicit versions and verified through Go's module checksum database; their
version updates are manual, owned by @Digvijay-x1. Do not disable module checksum
verification. Go download caches are disabled in security validation.

## Trust boundaries

The CI and database workflows default to `contents: read`, persist no checkout
credentials, and use no repository/environment secrets. Untrusted PRs may execute
application tests with this limited token. Never grant validation jobs production
credentials or reuse PR-controlled artifacts/caches for deployment. Workflow
changes, scanner configurations, exceptions, lockfiles, and tool pins need owner
review; checks running from a PR revision cannot protect themselves against an
approved malicious workflow edit.

Do not execute PR code under `pull_request_target`, privileged `workflow_run`, or
comment triggers. Pass untrusted event values into environment variables and
quote them in shell commands; never interpolate PR titles, branch names, or
comments into executable shell. Treat downloaded artifacts as untrusted data.
Security checks upload no artifacts, and Gitleaks uses `--redact=100`. Never attach
raw secret reports to a public PR or Actions artifact.

## Repository activation

After the implementation PR has green CI and both CodeQL language scans:

1. Keep **CI required** required from the GitHub Actions app on main; it now
   includes workflow lint, secret scanning, and PR dependency review.
2. Add a **Require code scanning results** rule for **CodeQL**, with security
   threshold **High or higher** and alert threshold **Errors**. Verify both
   language categories are reported and an unfinished or failing scan blocks
   merging. Require an up-to-date branch to retain the reviewed dependency base.
3. Enable dependency graph, Dependabot alerts/security updates, private
   vulnerability reporting, secret scanning, and push protection where available.
4. Keep fork workflows read-only with no secrets and require approval for new
   contributors. Set the default Actions token to read-only and prohibit Actions
   from creating/approving PRs. Review collaborator access.
5. Retain the owner review requests in CODEOWNERS. Add a second human owner before
   requiring code-owner approval, as documented in [CI controls](ci.md).

These settings are outside source control. This change does not activate them or
change deployment authority. Record activation and controlled failure run links
in #6 before closing it. Deployment isolation and provider identity integration
remain in #7; no privileged release workflow currently exists.

## Exceptions and credential handling

An exception requires a reviewed PR naming the advisory/finding ID, affected
paths and environments, exploitability analysis, compensating controls, owner,
tracking issue, and expiry date (at most 30 days). @Digvijay-x1 owns triage and
expiry review. Never globally lower thresholds, enable warn-only, blanket-ignore
files, or force dependency upgrades. Prefer a compatible patched version and
verify the affected behavior. Expired exceptions block release. CodeQL alert
dismissals need the same recorded justification and expiry. Emergency bypasses
follow the incident record and PR-only rules in [CI controls](ci.md).

Use provider OIDC or another short-lived identity where supported by the release
path. Otherwise scope tokens to one project and environment, store production
tokens only in a protected GitHub environment, and separate preview tokens/data.
Inventory each token with its owner, scope, location, creation and rotation dates.
Rotate at least every 90 days and immediately after suspected disclosure or owner
departure: create replacement, update the protected environment/provider, validate
access, revoke the old token, and record the operation without the token value.

Never print environment dumps, enable shell tracing around credentials, or put
private values in `NEXT_PUBLIC_*` variables. Those variables enter public browser
bundles at build time. On a leak, revoke first, assess access/provider logs, and
then remove the value from code/history with a coordinated owner-led cleanup.
Deleting the latest line alone does not clear the full-history secret gate.

## Verification

Run `actionlint`, `gitleaks git --redact=100 --no-banner --log-opts="--all"`, and
`npm test -- scripts/ci-gate.test.ts` with the versions in CI. The gate tests cover
each failed, skipped, canceled, empty, and missing prerequisite and enforce the
dependency review's event-specific applicability.

Use temporary, unmerged test branches for hosted failure probes: introduce a
known high-severity vulnerable dependency and confirm dependency review and CI
required fail; add an invalid workflow expression and confirm actionlint and CI
required fail. For secret detection, generate a synthetic key in a disposable
local directory and scan it with `gitleaks dir --redact=100`; do not commit real
credentials or publish scanner reports. Restore the probe changes before opening
the implementation for merge. Confirm fork runs receive no production credentials.
