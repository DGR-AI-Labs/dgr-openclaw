# Release review: 0.1.0-beta.1

## Scope and approvals

This release covers only synthetic invoice attachment and simulated USD payment on OpenClaw 2026.9.5 and Node 24. It does not cover the proposed refund tool, real funds, unrelated host tools or production assurance.

- Founder release approval: given explicitly by the repository owner in the Codex project conversation on 2026-09-23 ("i approve release"). Recorded here by Codex under that instruction. The remaining reviews and publication checks are not waived.
- Human PR review: `mtykhenko` approved [PR #1](https://github.com/DGR-AI-Labs/dgr-openclaw/pull/1), which merged on 2026-09-23.
- Implementation audit baseline: `6f36499e25365c58612ad0899bc7a3c8bcbcf3e0`.
- Final release source: to be recorded after review of the documentation cleanup. A review of the baseline alone does not cover later changes.
- Release maintainer and publisher operator: to be named before publication.
- Proposed reviewer: `satoshi-nakamoto-dgr`. The template below is suggested wording, not evidence of a completed review or an assertion about the account's identity.
- Non-author cross-model review and explicit analyzer-evidence acceptance: not yet recorded here. State reviewer identity, actual model/provider if used, authorship independence, reviewed revision and evidence links. A GitHub handle alone does not establish cross-model review.

## Observed readiness evidence

The baseline's [merged-commit CI](https://github.com/DGR-AI-Labs/dgr-openclaw/actions/runs/35903047401) passed. A separate Codex audit reran the merged source in an existing isolated OpenClaw 2026.9.5 Docker image, with network disabled: 44 unit/SQLite tests passed, all six deliberate-bug controls were caught, package allowlist validation passed, and the installed-host test passed seven real Gateway tool invocations. This is author-side validation, not an independent human or cross-model rerun.

ClawHub CLI 0.23.3 reported Plugin Inspector PASS with zero breakages or warnings. Its no-upload preview resolved `@dgr-ai-labs/openclaw-sandbox`, version `0.1.0-beta.1`, 12 files and 12,644 archive bytes at the baseline commit. Later documentation changes change the archive and require a new preview. `private: true` did not block those local checks; retain it as an npm-publication guard unless a verified registry requirement requires changing it.

The PR describes Semgrep, ESLint and CodeQL results. The release reviewer must inspect the underlying reports, source bindings, scanned scope and limitations before accepting them; the PR summary alone is not that acceptance. The readiness audit did not rerun these analyzers.

GitHub Discussions and private vulnerability reporting were confirmed enabled. No ClawHub identity was logged in during the audit, so publisher ownership remains unverified. Registry lookup did not establish a visible published package. No registry installation or model-driven conversation was tested.

## Suggested review text for satoshi-nakamoto-dgr

Complete the fields using actual work and evidence. Do not post this unchanged, claim tests you did not run, or approve with unresolved blocking findings. If using an agent to help, disclose its actual provider/model and whether it authored any candidate changes. An ordinary human review does not automatically satisfy the separate cross-model requirement.

```text
Release review — DGR Sandbox 0.1.0-beta.1

Reviewer: satoshi-nakamoto-dgr
Reviewed source commit: <full final SHA>
Implementation baseline and documentation delta: <commits or PR links>
Authorship/independence: <my involvement in authoring; actual human/agent roles>
Model/provider, if applicable: <actual model/provider, or none>

Scope: synthetic invoice attachment and simulated USD payment only,
OpenClaw 2026.9.5 / Node 24. This review does not cover refunds, real funds,
other OpenClaw tools or production deployment.

Review performed:
- Source and enforcement paths inspected: <files and findings; include strict
  validation, policy checks, replay, transactional effects/records and failures>.
- Tests I personally ran: <commands, environment and results, or "none">.
- Existing test evidence I inspected: <links and source bindings>.
- Semgrep/ESLint/CodeQL evidence: <report references, matching source,
  accepted scope/limitations, and unresolved concerns>.
- Packaging, compatibility and documentation: <checks and findings>.
- Non-author cross-model requirement: <evidence link, or still outstanding>.

Blocking findings: <none, or list with references>
Non-blocking findings: <none, or list>
Disposition: <approve experimental sandbox release / request changes>

If approving: I consider the reviewed revision suitable for the stated
experimental sandbox scope. This is not certification or approval for real
financial activity. Authenticated publisher verification and a fresh install
from the published registry version remain publication/announcement checks.
```

## Remaining publication steps

1. Record the completed independent reviews, analyzer-evidence acceptance and any finding resolutions against the final source revision.
2. Name the maintainer/operator and verify the authenticated account may publish as `dgr-ai-labs`.
3. Check out the final reviewed revision. Run required checks, inspect the package, and repeat ClawHub validation and the publish dry run with the `beta` tag. Record the exact source commit and preview. A Git tag and GitHub prerelease are recommended release references, not substitutes for evidence.
4. Publish only that candidate under the recorded founder approval; wait for registry verification and availability.
5. Verify a fresh install of the actual published version in a disposable profile. Record the result and verified installation command before announcing availability.

Documentation prepared by OpenAI Codex under repository-owner direction. This file does not constitute Satoshi's review.
