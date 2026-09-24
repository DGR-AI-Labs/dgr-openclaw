# Release evidence and review requirements

## Scope

The pre-execution gate controls synthetic invoice attachment and simulated USD payment on the documented OpenClaw/Node versions. It does not control unrelated tools, move real funds or establish production assurance.

## Evidence to retain

1. Record the exact source revision, artifact digest, maintainer and publication authorization.
2. Retain independent human review, analyzer scope/results and finding dispositions against that revision. Automated checks and author-side validation do not substitute for independent human review.
3. Run unit/SQLite tests, deliberate-bug controls, package checks and installed-host dispatch tests. Distinguish these from model-driven conversation, real-service execution and customer use.
4. Inspect package-level and exact-version registry metadata separately. Verify installation and rendered content for the exact artifact under examination.
5. Record actual authorship and reviewer work. Credits do not certify the mechanism.

The [analyzer guide](analyzer-evidence.md) explains evidence collection. Source linkage is not authenticated build provenance, and sandbox record consistency is not authenticity against an operator.

## Historical evidence

The [earlier review record](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/66da14eac6e3088de8c0b2a363d3e7fc213b6d6f/docs/release-review.md), [PR #1](https://github.com/DGR-AI-Labs/dgr-openclaw/pull/1) and [baseline CI run](https://github.com/DGR-AI-Labs/dgr-openclaw/actions/runs/35903047401) retain their original context. They do not establish acceptance of later changes.

Documentation authored by Codex under repository-owner direction; this document is not an independent review.
