# Make publication claims match the published sandbox and current source

The README still calls the beta unpublished, while ClawHub serves 0.1.0-beta.1. GitHub About also still says “Pre-implementation.” This bundle replaces the README with scoped evidence-gated execution copy, updates the package summary, moves historical release instructions, and adds a README-derived listing map with a drift check. The About replacement is founder copy only.

Derived implementation HEAD: `9a6ba64faf7bb400cea5b8b721c5e094fd1b4dac`.
Published artifact source: `4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7`.

The founder-requested constants refactor is the prerequisite commit. **This documentation bundle does not modify src/, tests, openclaw.plugin.json, Dockerfile, workflow logic, or scripts/mutations.mjs relative to that prerequisite.** Local main is older, so the requested main...branch diff includes prior commits; it must not be presented as this bundle's scope.

Files: README.md, package.json (description and one script only), RELEASING.md, docs/clawhub-listing.md, docs/policies.md, docs/publication-discrepancy-ledger.md, docs/open-items.md, GITHUB_ABOUT.md, scripts/check-listing.mjs, PR_BODY.md.

Omitted claims: operator-proof integrity; whole-agent governance; absent Cedar/Ed25519/capability tokens/before_tool_call/out-of-process primitives; latency promises; present-tense cross-action governance; provenance attestation; dedicated unconfirmed listing fields/lengths; verified uninstall deletion of sandbox data; unqualified bare catalog installability. The 1000 ms number is explicitly an admission rule, never a completion-time claim.

The bypass suite is deferred by explicit scope. The frozen REASONS/STATUS precondition is satisfied; no further constants blocker remains. No bypass test was authored.

Known review gaps: two new /blob/main links cannot resolve before integration; aggregate scan pending differs from clean/benign version scan; the branch needs its prerequisite integrated before a zero-src comparison against main is possible; the exact About-length limit is not established by recon. Every README/RELEASING URL was resolved and failures are retained below. No PR, push, About setting edit, authentication or publication was performed.

## Derived values

| Value | Exact source quote / location |
| --- | --- |
| Package / version / license | `"@dgr-ai-labs/openclaw-sandbox"`, `"0.1.0-beta.1"`, `"Apache-2.0"`; package.json:2,3,7 |
| Node / OpenClaw | `">=24.16.0 <25"`, `">=2026.9.5 <2026.9.6"`, `"2026.9.5"`; package.json:9,34–39 after script addition |
| Tool names | `name: 'dgr_sandbox_payment'`, `name: 'dgr_invoice_attachment'`; src/modules/payment.js:2, src/modules/invoice.js:2 |
| Runtime config key | `"id": "dgr-sandbox"`; openclaw.plugin.json:2 |
| Defaults | `input.maxPaymentMinor ?? 1000`, `input.maxAttachmentBytes ?? 4096`, `input.allowedDestinations ?? ['sandbox-vendor']`; src/config.js:23–25 |
| Statuses/reasons | `export const STATUS = Object.freeze({`, `export const REASONS = Object.freeze({`; src/gate.js:10,16; entries :11–29 |
| Deadline | `const DEADLINE_MS = 1000;`; src/gate.js:9; denial/rollback checks :75,94–97 |
| State | `join(stateRoot, 'dgr-sandbox', 'sandbox.sqlite')`; src/index.js:25 |
| Record guarantee | `verification: 'self-consistency-only'`; src/records.js:17 |
| Category | `"developer-tools"`; openclaw.plugin.json:7 |
| Uninstall | Pinned CLI help: `Usage: openclaw plugins uninstall [options] <ids...>`; `--dry-run Show what would be removed without making changes` |

## Validation evidence

Raw command outputs and diff snapshots follow in the completed local review packet. The final evidence-only update to this file is not part of the package file allowlist.
