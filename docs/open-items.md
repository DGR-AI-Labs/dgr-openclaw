# Founder decisions before stronger publication claims

## 15. Reconcile package and version scan states

Observed through `clawhub package inspect @dgr-ai-labs/openclaw-sandbox --version 0.1.0-beta.1 --json` on 2026-09-23. These are literal values from the response paths, not an inferred single verdict:

```text
package.scanStatus = "pending"
package.verification.scanStatus = "pending"
package.latestVersion = null
version.verification.scanStatus = "clean"
version.staticScan.status = "clean"
version.llmAnalysis.status = "clean"
version.llmAnalysis.verdict = "benign"
```

[Package API](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox) and [version API](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox/versions/0.1.0-beta.1) are separate sources. The reason for the aggregate mismatch is NOT ESTABLISHED. The founder must decide whether to request registry support or wait for aggregation, and record the response without changing this package to manufacture a cleaner display.

Resolve item 15 before strengthening the README scan citation. Keep the exact qualified statement until fresh evidence supports a change. The unqualified catalog install command is not established as usable with latestVersion null; the explicit beta version is the documented fallback. Do not relabel a beta as latest merely to hide this discrepancy.

## 16. Source linkage is not provenance

The inspected version reports:

```text
version.verification.hasProvenance = false
version.verification.tier = "source-linked"
version.verification.scope = "artifact-only"
version.verification.sourceRepo = "DGR-AI-Labs/dgr-openclaw"
version.verification.sourceCommit = "4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7"
```

The founder must choose whether to pursue authenticated build attestations. The [official publishing documentation](https://docs.openclaw.ai/clawhub/publishing) describes trusted-publisher configuration and GitHub Actions OIDC. Evaluate required repository/workflow/environment identity, reproducible build inputs, and retained artifact digests in a separate proposal. Whether that alone upgrades this package's hasProvenance/tier is NOT ESTABLISHED; require the actual returned verification fields before making such a claim. No workflow or publisher setting was changed here.

## Release boundary and unresolved review mechanics

The prerequisite constants refactor is local commit 9a6ba64faf7bb400cea5b8b721c5e094fd1b4dac; this documentation branch is stacked on it. Local main still points to 6f36499e25365c58612ad0899bc7a3c8bcbcf3e0. A literal main...docs/publication-accuracy diff therefore includes earlier source/CI commits. Do not claim it is a documentation-only diff; compare the amended docs to rename commit `184e59c` (after constants commit `9a6ba64`) and integrate those prerequisites separately before reviewing against an updated main.

The founder approved identity `dgr-gate`; the amended bundle selects `0.1.0-beta.2` in both manifests and the lockfile. New identity availability, publisher authorization, new-artifact scan status and fresh registry installation remain release blockers. The old package scan/provenance values above do not apply to the renamed candidate. Links to newly added files under GitHub /blob/main will not resolve until the founder integrates them. No push, PR, About edit or publication was performed. The bypass suite is deferred by scope; the constants precondition is now satisfied, so it has no remaining constants blocker.

## Workflow display name (founder item)

The workflow name remains `Sandbox checks` (`.github/workflows/ci.yml:1`). Renaming it is outside this remediation. A workflow name change changes its badge URL; update the README badge in the same commit.
