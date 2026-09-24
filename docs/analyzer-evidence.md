# Analyzer evidence in CI

The **Analyzer evidence** workflow runs on pushes, pull requests and manual dispatch. It is separate from **Sandbox checks**, which executes the behavioral and installed-host tests. Both workflows must succeed for the reviewed release revision. Repository administrators can make the three analyzer job names required checks in branch protection; adding this workflow does not change repository protection settings.

## What each job examines

| Job | Scope and configuration | Retained evidence |
|---|---|---|
| ESLint evidence | JavaScript in `src`, `test`, `scripts`; recommended rules, Node globals, and unused catch bindings permitted | JSON report, locked dependencies, config, Node/ESLint versions, source manifest |
| Semgrep evidence | Same tracked JavaScript; public `javascript/lang/security`, `javascript/lang/correctness`, `javascript/audit` rules from pinned upstream commit | JSON report including scanned paths and errors, stderr log, exact rule files/commit, Semgrep version, resolved Python dependencies, source manifest |
| CodeQL evidence | JavaScript/TypeScript in `src`, `test`, `scripts`; security-and-quality queries with a pinned CodeQL bundle | SARIF results including rules, tool version and invocation diagnostics, query configuration, source manifest; GitHub code-scanning results |

Tool dependencies live under `.github/analyzers`; they are not runtime dependencies or shipped plugin files. Actions and Semgrep rules are pinned to commit SHAs. ESLint dependencies have a lockfile. Semgrep CE is version-pinned; its transitive Python dependency resolution is recorded, not fully locked. Semgrep uses local downloaded rules, requires no service token, and disables metrics/version checks. CodeQL uploads results through GitHub's built-in token; other jobs need only repository read permission. No `pull_request_target` workflow is used.

These scoped rules are not a claim to reproduce every rule in older one-off scans. This is not a dependency audit, secret scan, runtime assurance proof, or scan of the OpenClaw dependency tree. The source manifest lists intended coverage and SHA-256 hashes; inspect each analyzer's actual coverage and diagnostics too. ESLint and Semgrep enforce an exact match to the tracked JavaScript scope. CodeQL's extraction and analysis diagnostics remain part of review; its source manifest alone is not proof of per-file extraction.

## Find and review the reports

1. Open the repository's **Actions** tab, select **Analyzer evidence**, and select the run for the source revision.
2. Confirm all three jobs completed successfully. On pull requests, the checkout may be GitHub's synthetic merge commit: use the full `commit` in each artifact's `source.json`, not the PR title. Use a successful push/manual run on the final release commit for publication evidence.
3. Download the `eslint-<SHA>-<attempt>`, `semgrep-<SHA>-<attempt>` and `codeql-<SHA>-<attempt>` artifacts. They are retained for 90 days; retain the accepted release evidence separately before expiry.
4. Inspect reports, source hashes, tool versions, configuration and coverage. Verify no blocking finding or scan error remains; record accepted limitations and the reviewer's actual work.
5. Link the run and review disposition from the release record. A successful run establishes automated results, not human acceptance of their scope.

Artifacts are uploaded even after failures when files exist. An artifact's presence is not a passing result. ESLint warnings/findings, Semgrep findings/errors or missing source coverage, and CodeQL findings/failed invocations cause failed checks. Missing reports fail as well. There is no blanket suppression or baseline of existing findings. One line-local `no-stringify-keys` suppression in `test/installed.test.js` documents a false positive: JSON serialization is used for assertion messages, while `content[0]` uses a literal array index, not a serialized object key. Review that exception with the test source. A finding must be investigated; fixes or narrowly justified configuration changes require review.

For local ESLint reproduction:

```sh
npm ci --prefix .github/analyzers --ignore-scripts --no-audit --no-fund
.github/analyzers/node_modules/.bin/eslint --config .github/analyzers/eslint.config.mjs src test scripts --max-warnings 0 --format json --output-file /tmp/dgr-eslint.json
python3 .github/analyzers/evidence.py eslint /tmp/dgr-eslint.json
python3 .github/analyzers/test_evidence.py
```

The workflow contains the exact Semgrep and CodeQL commands, versions and rule references. CI outputs should be reviewed anew after code, rules or analyzer versions change.
