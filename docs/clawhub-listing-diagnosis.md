# ClawHub beta.2 listing diagnosis

Observed 2026-09-23 for `@dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2`. Publication and pinned installation succeeded; the default listing still says “No README available.” No republish or distribution-tag change was made for this diagnosis.

## Evidence and disposition

| Observation | Verified evidence | Disposition |
| --- | --- | --- |
| README allegedly absent | Exact-version inspect lists README.md; downloaded artifact and source hashes agree | Artifact omission ruled out |
| Wrong tag or unmerged docs | Source commit is `866e3c77d100c1fe5b10f97546adee627662eae3`, sourceTag is `main`; Git tag v0.1.0-beta.2 resolves to the same commit | Stale tag and unmerged bundle ruled out |
| Default README | `/file?path=README.md&preview=1` returns HTTP 404, body `Version not found` | Default release selection fails |
| Pinned README | Same request with `version=0.1.0-beta.2` returns HTTP 200 and the new DGR Gate README | README is available now; no extraction wait is needed for this version |
| Missing version | `package.latestVersion = null`, `package.tags.beta = "0.1.0-beta.2"` | Beta-only publication has no latest pointer |
| Scan mismatch | Package scan pending; version verification/static scan clean, LLM verdict benign | Retain both values; no single overall clean verdict |
| Missing fifth topic | API topics contain agent-safety, policy-enforcement, fail-closed, audit-trail, tool-gating | Header displays only the first four; no metadata loss |
| Missing icon | No assets/icon.png was supplied or packed | Expected; no icon was promised |
| Missing license | package.json contains Apache-2.0; LICENSE is in the artifact | Dedicated registry license rendering was NOT ESTABLISHED; no license metadata loss established |
| Missing downloads | Live HTML contains a Downloads label without a displayed value | Display issue observed; cause NOT ESTABLISHED; do not infer missing artifact or zero downloads |
| Allegedly broken docs | RELEASING.md and docs/policies.md on main both return HTTP 200 | Historical recon failures resolved by the merged bundle |

Commands executed:

```sh
clawhub package inspect @dgr-ai-labs/openclaw-dgr-gate --version 0.1.0-beta.2 --json
git show 866e3c77d100c1fe5b10f97546adee627662eae3:README.md
git rev-parse v0.1.0-beta.2
npm pack --dry-run
```

The archive contains 12 files including README.md. README SHA-256 is `2737afc6e684826613e7ce2a6a70bd79b635f859aaf2fa49624988b4c6c91bf6`; archive SHA-256 is `f6a3cf8e5ad6bb28cfad523e6ca39b67169466686d60069d64db3df8151e6bee`.

## Why a beta-only package produces this page

The live endpoint behavior matches upstream source inspected at `826992bd72b9f9ab09254dc43551facdf94cb07b` (not an assertion that this is the deployed server commit):

- [Plugin page loader](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/src/routes/plugins/$name.tsx#L194): only loads version details when package.latestVersion is set, and calls fetchPackageReadme without a version.
- [README API helper](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/src/lib/packageApi.ts#L565): adds the version query only when supplied; converts 404 to null.
- [Release promotion logic](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/convex/packages.ts#L11510): promotion requires a requested latest tag. Beta alone does not promote the default version. The publication update at lines 11921–11928 also leaves package verification/scan aggregates unchanged without promotion.
- [Topic rendering](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/src/routes/plugins/$name.tsx#L1182): slices topics to DETAIL_HERO_TOPIC_LIMIT, which is four in DetailPageShell.tsx.

The evidence does **not** support “README present means wait for ingestion.” The default request cannot select a version. A new tag pointing at the same good README would not supply the missing default pointer either.

## Resolution boundary

The safe upstream fix is to let a beta-only plugin page select a published release for its README/details while keeping default installation policy explicit. This repository does not control ClawHub's renderer. No upstream issue or message has been sent in this task.

Setting latest to beta.2 would change unqualified installation behavior; it is not a cosmetic repair and was not done. Republishing unchanged content under beta.3 is not justified by the evidence. The local implementation adds source/tag/archive/link/default-README checks to RELEASING.md. Until the registry behavior is resolved, use the [GitHub README](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/README.md) and the version-pinned installation command.

[Published release evidence](https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.2) · [Package API](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate) · [Pinned README API](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/file?path=README.md&preview=1&version=0.1.0-beta.2)
