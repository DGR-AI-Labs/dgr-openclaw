# Evidence needed before stronger claims

## Registry observations

Capture package-level and exact-version verification separately when evaluating an artifact. A scanner result is not certification; one component cannot substitute for the aggregate result. An HTTP-successful README endpoint is not evidence of indexing. See the [crawlability check](clawhub-listing-diagnosis.md).

## Build provenance

Source linkage and content hashes do not establish authenticated build provenance. Any proposal for attestations must define the trusted builder identity, source binding, reproducible inputs and retained evidence. Require the returned verification fields before making an attestation claim. This documentation change does not add attestation or change publisher settings.

## Scope expansion

The pre-execution gate covers two demo tools. A new action needs explicit requirements, failure semantics, source review and installed-host tests. Existing tools, real payments and operator resistance are not established by the demo.

## Workflow display name

The workflow is named `Sandbox checks` (`.github/workflows/ci.yml:1`). If that name is changed in separate work, update its README badge URL in the same change.

Earlier observations and decisions are preserved in the [source-history record](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/66da14eac6e3088de8c0b2a363d3e7fc213b6d6f/docs/open-items.md).
