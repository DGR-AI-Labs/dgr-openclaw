# Release review: 0.1.0-beta.1

## Scope and approvals

This release covers only synthetic invoice attachment and simulated USD payment on OpenClaw 2026.9.5 and Node 24. It does not cover the proposed refund tool, real funds, unrelated host tools or production assurance.

- Founder release approval: given explicitly by the repository owner in the Codex project conversation on 2026-09-23 ("i approve release"). Recorded here by Codex under that instruction. The remaining reviews and publication checks are not waived.
- Human PR review: `mtykhenko` approved [PR #1](https://github.com/DGR-AI-Labs/dgr-openclaw/pull/1), which merged on 2026-09-23.
- Implementation audit baseline: `6f36499e25365c58612ad0899bc7a3c8bcbcf3e0`.
- Final release source: to be recorded after review of the documentation cleanup. A review of the baseline alone does not cover later changes.
- Release maintainer and publisher operator: to be named before publication.
- Release review policy: the founder removed the separate non-author cross-model review requirement on 2026-09-23. Independent human review, required analyses, adversarial evidence and authorship disclosure remain required.
- Explicit analyzer-evidence acceptance: not yet recorded here. Identify the reviewer, reviewed revision, reports inspected, evidence links and accepted limitations.

## Observed readiness evidence

The baseline's [merged-commit CI](https://github.com/DGR-AI-Labs/dgr-openclaw/actions/runs/35903047401) passed. A separate Codex audit reran the merged source in an existing isolated OpenClaw 2026.9.5 Docker image, with network disabled: 44 unit/SQLite tests passed, all six deliberate-bug controls were caught, package allowlist validation passed, and the installed-host test passed seven real Gateway tool invocations. This is author-side validation, not an independent human rerun.

ClawHub CLI 0.23.3 reported Plugin Inspector PASS with zero breakages or warnings. Its no-upload preview resolved `@dgr-ai-labs/openclaw-sandbox`, version `0.1.0-beta.1`, 12 files and 12,644 archive bytes at the baseline commit. Later documentation changes change the archive and require a new preview. `private: true` did not block those local checks; retain it as an npm-publication guard unless a verified registry requirement requires changing it.

The original PR describes one-off Semgrep, ESLint and CodeQL results. The [Analyzer evidence workflow](analyzer-evidence.md) now provides reports bound to each scanned revision; a successful run on the final release commit should be used for the release review. The release reviewer must inspect the underlying reports, source bindings, scanned scope and limitations before accepting them; the PR summary alone is not that acceptance. The readiness audit did not rerun these analyzers.

GitHub Discussions and private vulnerability reporting were confirmed enabled. No ClawHub identity was logged in during the audit, so publisher ownership remains unverified. Registry lookup did not establish a visible published package. No registry installation or model-driven conversation was tested.

## Remaining publication steps

1. Record the completed independent reviews, analyzer-evidence acceptance and any finding resolutions against the final source revision.
2. Name the maintainer/operator and verify the authenticated account may publish as `dgr-ai-labs`.
3. Check out the final reviewed revision. Run required checks, inspect the package, and repeat ClawHub validation and the publish dry run with the `beta` tag. Record the exact source commit and preview. A Git tag and GitHub prerelease are recommended release references, not substitutes for evidence.
4. Publish only that candidate under the recorded founder approval; wait for registry verification and availability.
5. Verify a fresh install of the actual published version in a disposable profile. Record the result and verified installation command before announcing availability.

Documentation prepared by OpenAI Codex under repository-owner direction. This file records release status; it is not an independent review.
