# Releasing DGR Gate

## Current release facts and listing sync

`@dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2` is published from `866e3c77d100c1fe5b10f97546adee627662eae3`, with [release evidence](https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.2). The old `@dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1` remains a separate published package. Its [release record](https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.1) retains evidence for `4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7`.

Beta.2 contains the README, but the default ClawHub page currently asks for an unversioned README while `latestVersion` is null. A version-pinned README request succeeds. This is a catalog version-selection problem, not proof of a missing artifact or ingestion delay. See [the diagnosis](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/clawhub-listing-diagnosis.md). Do not relabel the beta as `latest` merely to repair its display.

README.md is authoritative for public scope and copy; package.json and openclaw.plugin.json define identity, compatibility and declared contracts. docs/clawhub-listing.md is the field map derived from that README, not a second description to upload.

1. Update README and package description together. Run `npm run check:listing -- --write`, inspect the generated table, then run `npm run check:listing`. README and listing must ship in the same commit. Keep the operator-bypass and own-tools limits in the full README that ClawHub renders.
2. For the next changed artifact, select a new version in both manifests and the lockfile; beta.2 is already published and must not be overwritten. Keep version badges and listing in the same release commit. A published README must also pass the catalog rendering check below; artifact inclusion alone does not establish display.
3. Complete required review and checks, select a clean commit available in the source repository, and inspect the package allowlist. Preserve `private: true`; no npm publication is intended.
4. In an already-authorized session, preview the exact checkout with `clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags beta --topics agent-safety,policy-enforcement,fail-closed,audit-trail,tool-gating --source-ref "$release_tag" --dry-run`. Check the resolved commit, version and files. No authentication or publication is performed by this documentation task.
5. Founder publication order: source commit containing README and listing, successful preview, explicit publication of that same candidate with the same owner, family, beta tag and five topics, completed registry review, fresh pinned installation, then announcement. Keep beta tags explicit. Retain reports and archive digests with the release.
6. Inspect both version and package-level scan statuses. Do not strengthen the scan claim while their discrepancy remains. Record actual provenance fields rather than treating source linkage as an attestation.

Before publishing, confirm access to the existing `dgr-ai-labs` namespace and availability of the new package identity. No new account or namespace is needed or created by this task. Stop the Gateway, preserve `dgr-sandbox/sandbox.sqlite`, remove the old plugin and migrate the config/allowlist ID to `dgr-gate` when upgrading; never load both identities together. Tool names and database format/path remain unchanged. Test fresh installation and existing-state migration before announcing. Set the approved GitHub About line only after integration.

## Required source, artifact and catalog checks

Before each new publication, finish and merge the README/listing changes. Use a clean checkout of the intended release commit. Create and push an immutable release tag at that reviewed commit through the authorized release process, then verify it before the publish preview. Publishing from a local directory is supported; a tag is a source-integrity checkpoint, not a requirement that ClawHub fetch files from that tag.

```sh
set -eu
release_version=$(node -p "JSON.parse(require('node:fs').readFileSync('package.json','utf8')).version")
release_tag="v$release_version"
test -z "$(git status --porcelain)"
test "$(git rev-parse HEAD)" = "$(git rev-parse "$release_tag^{commit}")"
test "$(git rev-parse HEAD:README.md)" = "$(git rev-parse "$release_tag:README.md")"
git show "$release_tag:README.md" | head -7
npm run check:listing
npm pack --dry-run
```

Confirm the remote tag resolves to the same commit, README.md is in the archive, and the preview's source commit matches HEAD. Resolve every absolute README documentation link on main, including RELEASING.md and docs/policies.md, before publication. A link working on a review branch does not establish that the marketplace link works.

After publishing, inspect the exact version and compare every returned file hash to the release checkout. Check both package and version verification fields. Then compare the default README endpoint with the pinned endpoint (substitute the released version):

```sh
clawhub package inspect @dgr-ai-labs/openclaw-dgr-gate --version "$release_version" --json
curl --fail --get 'https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/file' --data-urlencode 'path=README.md' --data-urlencode 'preview=1'
curl --fail --get 'https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/file' --data-urlencode 'path=README.md' --data-urlencode 'preview=1' --data-urlencode "version=$release_version"
```

Inspect the public page as well. A successful pinned request plus `Version not found` on the default request indicates version-selection failure: report it separately from publication success and do not claim the listing is complete. Waiting or republishing identical content under another beta is not an established remedy. An upstream renderer fallback to a published beta would preserve beta-only distribution; assigning `latest` changes default install behavior and requires a separate release-channel decision.

All five stored topics may be correct even when the detail header shows four. No custom icon is expected without an allowlisted assets/icon.png. Do not treat the absence of an unconfirmed dedicated license field as missing package metadata.

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

