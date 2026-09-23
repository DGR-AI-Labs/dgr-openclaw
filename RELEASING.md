# Releasing DGR Sandbox

## Current release facts and listing sync

The beta is published. Its [release record](https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.1) retains human acceptance and registry-installation evidence for 4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7. This checkout adds a later constants refactor and documentation; the published artifact does not contain those changes.

README.md is authoritative for public scope and copy; package.json and openclaw.plugin.json define identity, compatibility and declared contracts. docs/clawhub-listing.md is the field map derived from that README, not a second description to upload.

1. Update README and package description together. Run `npm run check:listing -- --write`, inspect the generated table, then run `npm run check:listing`. README and listing must ship in the same commit. Keep the operator-bypass and own-tools limits in the full README that ClawHub renders.
2. The existing version 0.1.0-beta.1 cannot be replaced with changed bytes. The founder must choose a new version and separately authorize edits to both manifests; that is outside this bundle. Update README metadata, badges and listing in the same release commit.
3. Complete required review and checks, select a clean commit available in the source repository, and inspect the package allowlist. Preserve `private: true`; no npm publication is intended.
4. In an already-authorized session, preview the exact checkout with `clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags beta --dry-run`. Check the resolved commit, version and files. No authentication or publication is performed by this documentation task.
5. Founder publication order: source commit containing README and listing, successful preview, explicit publication of that same candidate, completed registry review, fresh pinned installation, then announcement. Keep beta tags explicit. Retain reports and archive digests with the release.
6. Inspect both version and package-level scan statuses. Do not strengthen the scan claim while their discrepancy remains. Record actual provenance fields rather than treating source linkage as an attestation.

The historical text below is moved verbatim from the old README except for deleting its stale sentence claiming no registry installation. It describes earlier checks, not the current availability of the beta. Commands below are historical instructions, not authorization for this agent to authenticate or publish.

## Historical checklist and validation log

## ClawHub publication checklist

Founder approval for the sandbox release was given on 2026-09-23. This does not assert that independent review, publisher authorization or registry installation is complete. See the [release review record](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/release-review.md) and [release notes](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/CHANGELOG.md).

1. Complete and record the remaining independent review and analyzer-evidence acceptance. Name the release maintainer and verify authorization for the ClawHub publisher `dgr-ai-labs`.
2. Select the final reviewed source commit, rerun required checks and inspect the packed file list. The repository is public. Retain `private: true` to prevent accidental npm publication: ClawHub CLI 0.23.3 accepted it in local validation and publish preview; authenticated registry acceptance remains to be checked.
3. Authenticate with the official ClawHub CLI, check identity, then validate and preview the exact release checkout:

```sh
clawhub login
clawhub whoami
git rev-parse HEAD
clawhub package validate .
clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags beta --dry-run
```

4. Confirm the preview's source commit, package name, version and files match the reviewed candidate. Then publish that same checkout, with the remaining release checks complete:

```sh
clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags beta
```

5. Wait for registry review and availability. Inspect the published version, then test a fresh registry installation in a disposable profile before announcing availability. Add the verified registry install command here afterward.

The no-upload audit preview resolved `@dgr-ai-labs/openclaw-sandbox` version `0.1.0-beta.1` from commit `6f36499e25365c58612ad0899bc7a3c8bcbcf3e0`. It did not verify authenticated publisher ownership. Any later documentation or code changes require a new preview bound to their final commit. Local installation is not evidence of registry installation.

References: [ClawHub publishing](https://docs.openclaw.ai/clawhub/publishing), [OpenClaw plugin installation](https://docs.openclaw.ai/plugins).

## Candidate validation status

Observed locally in the pinned Node/OpenClaw Docker environment: 44 unit and real-SQLite tests passed; six isolated deliberate-bug controls were caught; package allowlist validation passed; and packed-plugin installation plus seven real Gateway tool invocations passed. The installed checks include allowed/denied actions, replay refusal, real database record failure and the unavailable-state latch.

Earlier Semgrep, CodeQL and ESLint scans were run separately. The **Analyzer evidence** CI workflow now retains source-bound reports for all three tools; see [scope and review instructions](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/analyzer-evidence.md). Accepted release evidence and final dispositions belong to the review packet. These checks do not replace independent human review. Founder release approval is recorded; outstanding independent review and publication checks are listed in the release review record. Host dependencies were resolved during image construction; the tested image is bound in retained evidence, and rebuilding can require fresh dependency review.

