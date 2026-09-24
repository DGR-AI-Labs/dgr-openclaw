# Releasing DGR Gate

## Current release facts and listing sync

`@dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2` is published from `866e3c77d100c1fe5b10f97546adee627662eae3`, with [release evidence](https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.2). The old `@dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1` remains a separate published package. Its [release record](https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.1) retains evidence for `4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7`.

Beta.2 contains the README, but the default ClawHub page currently asks for an unversioned README while `latestVersion` is null. A version-pinned README request succeeds. This is a catalog version-selection problem, not proof of a missing artifact or ingestion delay. See [the diagnosis](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/clawhub-listing-diagnosis.md). The founder has selected a new non-prerelease `0.1.0` with `latest` as the local remedy. This is a deliberate default-install channel change, not a claim of broader runtime protection. This preparation does not publish it.

README.md is authoritative for public scope and copy; package.json and openclaw.plugin.json define identity, compatibility and declared contracts. docs/clawhub-listing.md is the field map derived from that README, not a second description to upload.

1. Update README and package description together. Run `npm run check:listing -- --write`, inspect the generated table, then run `npm run check:listing`. README and listing must ship in the same commit. Keep the operator-bypass and own-tools limits in the full README that ClawHub renders.
2. For the next changed artifact, select a new version in both manifests and the lockfile; beta.2 is already published and must not be overwritten. Keep version badges and listing in the same release commit. A published README must also pass the catalog rendering check below; artifact inclusion alone does not establish display.
3. Complete required review and checks, select a clean commit available in the source repository, and inspect the package allowlist. Preserve `private: true`; no npm publication is intended.
4. In an already-authorized session, preview the exact checkout with `clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags latest --topics agent-safety,policy-enforcement,fail-closed,audit-trail,tool-gating --source-ref "$release_tag" --dry-run`. Check the resolved commit, version and files. No authentication or publication is performed by this documentation task.
5. Founder publication order: source commit containing README and listing, successful preview, explicit publication of that same candidate with the same owner, family, latest tag and five topics, completed registry review, fresh pinned installation, then announcement. Keep historical beta tags on their existing releases. Retain reports and archive digests with the release.
6. Inspect both version and package-level scan statuses. Do not strengthen the scan claim while their discrepancy remains. Record actual provenance fields rather than treating source linkage as an attestation.

Before publishing, confirm access to the existing `dgr-ai-labs` namespace and that version `0.1.0` is available under the existing package identity. No new account or namespace is needed or created by this task. Stop the Gateway, preserve `dgr-sandbox/sandbox.sqlite`, remove the old plugin and migrate the config/allowlist ID to `dgr-gate` when upgrading; never load both identities together. Tool names and database format/path remain unchanged. Test fresh installation and existing-state migration before announcing. Set the approved GitHub About line only after integration.

## README remediation checks before the next release

The published `0.1.0` tag resolves to `9c46d5a8c3711da6d1909a7c565329fedc750217`. This content-only remediation keeps that version unchanged for review; do not overwrite its published artifact. Select a new version and update the version-specific commands below in a separate release step.

- Run `wc -l README.md`: at most 130 lines. This is an editorial budget, not a verified ClawHub pixel/collapse threshold; inspect the actual listing after publication.
- Run `npm run check:listing`: the reviewed hook/description pairing must agree, and the package description must not occur verbatim in README.md. Keep the two-tool scope explicit in both surfaces.
- Registry copy must cite this package's exact published version. Re-run package and version `clawhub package inspect` and distinguish `package.scanStatus` from `version.verification.scanStatus`; no predecessor's scan establishes this package's result.
- Rebuild the icon twice and compare hashes. `npm pack --dry-run` must include both README.md and assets/icon.png.
- HTTP GET every README URL against main before tagging, including migration, reasons and local-demo guides. New main-branch links will not resolve until these docs are merged. Check all four credit logins without rewriting founder-supplied entries.
- Verify the heading order and unchanged limitations. Review credit wording as acknowledgement, never certification. Preserve the admission-deadline qualification and uncertain-result warning.

## Required source, artifact and catalog checks

Before tagging 0.1.0, finish review and merge the icon, README and listing changes into main. The existing docs/release-review.md is historical beta.1 evidence, not acceptance of this new release. Obtain review and analyzer evidence for the final source. Source/runtime behavior is unchanged, but the new artifact and default channel still need release acceptance.

Run this pre-tag checklist from a clean checkout of the final main commit:

```sh
set -eu
git fetch origin main
test -z "$(git status --porcelain)"
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"
icon_before=$(sha256sum assets/icon.png | cut -d ' ' -f 1)
npm run build-icon
icon_after=$(sha256sum assets/icon.png | cut -d ' ' -f 1)
test "$icon_before" = "$icon_after"
node --input-type=module -e 'import fs from "node:fs"; import assert from "node:assert/strict"; const p=JSON.parse(fs.readFileSync("package.json")); const m=JSON.parse(fs.readFileSync("openclaw.plugin.json")); assert.equal(p.version,"0.1.0"); assert.equal(m.version,p.version); assert.equal(p.private,true);'
npm run check:listing
npm run package:check
npm pack --dry-run
test -z "$(git status --porcelain)"
```

The pack output must contain both README.md and assets/icon.png. Resolve every absolute README documentation link on main, including RELEASING.md and docs/policies.md, before publication. The unchanged limits must remain prominent. Record all test/analyzer reports against this final commit, including the installed-host run.

Only after those checks and founder release authorization, run these tag and preview commands. They are documentation here, not actions taken by release preparation:

```sh
release_version=0.1.0
release_tag=v0.1.0
git tag -a "$release_tag" -m 'DGR Gate 0.1.0'
test "$(git rev-parse HEAD)" = "$(git rev-parse "$release_tag^{commit}")"
test "$(git rev-parse HEAD:README.md)" = "$(git rev-parse "$release_tag:README.md")"
git show "$release_tag:README.md" | head -7
git push origin "$release_tag"
clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags latest --topics agent-safety,policy-enforcement,fail-closed,audit-trail,tool-gating --source-ref "$release_tag" --dry-run
```

Confirm the remote tag resolves to the reviewed commit and the preview agrees on source, name, version and 13 packed files. The README must already be final at the tag. Publishing from this local directory is supported: the tag pins source metadata; it was not the cause of beta.2's missing listing README. Do not retag a changed candidate.

Exact founder publication command, after approval of the preview:

```sh
clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags latest --topics agent-safety,policy-enforcement,fail-closed,audit-trail,tool-gating --source-ref v0.1.0 --wait --wait-timeout 120
```

After publishing, verify both plain and version-pinned installation in disposable profiles. Inspect the exact version and compare every returned file hash to the release checkout. Check both package and version verification fields. Then compare the default README endpoint with the pinned endpoint (substitute the released version):

```sh
clawhub package inspect @dgr-ai-labs/openclaw-dgr-gate --version "$release_version" --json
curl --fail --get 'https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/file' --data-urlencode 'path=README.md' --data-urlencode 'preview=1'
curl --fail --get 'https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/file' --data-urlencode 'path=README.md' --data-urlencode 'preview=1' --data-urlencode "version=$release_version"
```

Inspect the public page as well. A successful pinned request plus `Version not found` on the default request indicates version-selection failure: report it separately from publication success and do not claim the listing is complete. Waiting or republishing identical content under another beta is not an established remedy. An upstream renderer fallback to a published beta would preserve beta-only distribution; the selected 0.1.0 release explicitly authorizes latest as its target channel, but successful default resolution must still be observed after publication.

All five stored topics may be correct even when the detail header shows four. The 0.1.0 archive must include the generated assets/icon.png; verify its icon actually renders after publication. The registry PNG size limit is 512 KiB; registry dimension limits remain NOT ESTABLISHED. Do not treat the absence of an unconfirmed dedicated license field as missing package metadata.

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

