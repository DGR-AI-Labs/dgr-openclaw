# DGR Sandbox for OpenClaw

Evidence-gated simulated payments for the two tools this sandbox guards: a stored synthetic invoice is required before payment.

![Sandbox checks](https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Sandbox%20checks/badge.svg) ![Analyzer evidence](https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Analyzer%20evidence/badge.svg) ![Version](https://img.shields.io/badge/version-0.1.0--beta.1-blue) ![License](https://img.shields.io/badge/license-Apache--2.0-blue)

## What it does

- Requires an invoice stored by `dgr_invoice_attachment` before `dgr_sandbox_payment` can simulate a payment. This is synthetic test evidence, not proof of a real invoice or human approval.
- Refuses an agent-supplied `trustedEvidence` field with `INVALID_ACTION`; an assertion cannot replace the stored invoice.
- Commits a synthetic effect and its hash-chained decision record together, checks replay, and stops further actions after storage failure. Record verification is self-consistency-only.

The gate sits inside the two tools that own these effects. Through these tools, there is no route around it to the sandbox effects or ledger. The model does not decide whether the gate runs. This does not constrain the host operator, who can change the plugin, policy or database, or use other tools.

## Install

The catalog command is:

```sh
openclaw plugins install clawhub:@dgr-ai-labs/openclaw-sandbox
```

The registry currently reports no `latestVersion`. For the published beta, select the version explicitly:

```sh
openclaw plugins install clawhub:@dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1 --accept-capabilities
openclaw plugins inspect dgr-sandbox --runtime --json
```

Requires OpenClaw **2026.9.5** and Node **>=24.16.0 <25**. Use a disposable profile for the first trial. The npm package name is `@dgr-ai-labs/openclaw-sandbox`; the manifest ID and configuration key are `dgr-sandbox`. Review the installer's capability prompt and restart the Gateway after installation. Conversational use needs your normal host model setup; the container test below does not.

### No-profile container demo

Run from this repository. Docker downloads dependencies during the build. The runs use disposable state, no host-directory mounts, and no model credentials.

```sh
docker build -t dgr-openclaw-test .
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test npm test
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test
```

### Build from source

```sh
npm pack
openclaw plugins install ./dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz --force --accept-capabilities
```

Use `--force` only for the local archive you reviewed. This branch's documentation and constants refactor are not in the published beta archive, even though the manifest version remains unchanged pending the next release decision.

## Starter policy

Merge this entry into the selected profile's configuration; keep existing entries:

```json
{"plugins":{"entries":{"dgr-sandbox":{"enabled":true,"config":{"maxPaymentMinor":1000,"allowedDestinations":["sandbox-vendor"],"maxAttachmentBytes":4096}}}}}
```

If you maintain plugin or tool allowlists, add `dgr-sandbox` and its two tool names to the relevant lists. Restart the Gateway after changing policy. Unknown keys and invalid values are refused. Amounts are USD cents and each limit applies per action.

| Rule | Example blocked attempt | Reason |
| --- | --- | --- |
| `maxPaymentMinor: 1000` | Pay 2000 cents | `AMOUNT_LIMIT` |
| `allowedDestinations: ["sandbox-vendor"]` | Pay `other` | `DESTINATION_NOT_ALLOWED` |
| `maxAttachmentBytes: 4096` | Attach 4097 ASCII bytes | `ATTACHMENT_LIMIT` |

Only synthetic text belongs in the invoice store. Each invoice ID can be attached once and paid once; restarting preserves that history. More policy examples are in [docs/policies.md](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/policies.md).

## Results and reasons

These are all 13 reason codes. Validation and policy checks run in source order; the first applicable refusal wins. A storage failure can replace the normal result.

| Code | Status | Trigger |
| --- | --- | --- |
| `ALLOWED` | `simulated` | Valid action passes policy, replay and evidence checks; transaction commits |
| `MISSING_CALL_ID` | `denied` | Call ID is not a string, is empty, or exceeds 1024 characters |
| `DUPLICATE_ATTEMPT` | `denied` | Call ID's attempt digest already exists |
| `INVALID_ACTION` | `denied` | Unknown action, malformed input, extra fields, invalid Unicode or unsupported currency |
| `AMOUNT_LIMIT` | `denied` | Payment exceeds configured per-action amount |
| `DESTINATION_NOT_ALLOWED` | `denied` | Destination is outside the configured list |
| `INVOICE_REQUIRED` | `denied` | Payment has no stored invoice |
| `INVOICE_ALREADY_PAID` | `denied` | Invoice already has a payment |
| `ATTACHMENT_LIMIT` | `denied` | Invoice text exceeds the configured UTF-8 byte limit |
| `INVOICE_ALREADY_ATTACHED` | `denied` | Invoice ID already exists |

Fail-closed paths:

| Code | Status | Trigger |
| --- | --- | --- |
| `DEADLINE_EXCEEDED` | `denied` or `unavailable` | Admission deadline reached before effect insertion, or later before commit; the latter rolls back and latches unavailable |
| `STORE_UNAVAILABLE` | `unavailable` | Gate/plugin already stopped or faulted, or storage setup/execution threw at the tool boundary |
| `STORE_FAILURE` | `unavailable` or `uncertain` | Transaction work failed; if commit had started, its durable outcome may be ambiguous |

Do not automatically retry `uncertain` results. Stop the Gateway and inspect state before recovery. A missing call ID is not recorded; committed decisions have receipts. Other failures may have no receipt.

## Worked run

Fresh local `npm run test:installed` output through the real Gateway, without a model:

```text
INVOKED dgr_invoice_attachment attach-demo simulated ALLOWED
INVOKED dgr_sandbox_payment over-limit denied AMOUNT_LIMIT
INVOKED dgr_sandbox_payment pay-demo simulated ALLOWED
INVOKED dgr_sandbox_payment pay-demo denied DUPLICATE_ATTEMPT
INVOKED dgr_sandbox_payment pay-again denied INVOICE_ALREADY_PAID
INVOKED dgr_invoice_attachment fault-call unavailable STORE_FAILURE
INVOKED dgr_invoice_attachment latched-call unavailable STORE_UNAVAILABLE
```

The gate checks a **1000 ms admission deadline** before effects and again before commit. If either check sees that the deadline has elapsed, it blocks or rolls back instead of committing an allowed effect. This is a fail-closed admission rule, not a promise about call completion time.

## ⚠️ What this does not do yet

- It gates only `dgr_sandbox_payment` and `dgr_invoice_attachment`, not other OpenClaw tools.
- The operator can edit the database or plugin. Hash-chained record verification is **self-consistency-only**, not proof against an operator.
- State is `dgr-sandbox/sandbox.sqlite` under the host's state directory. Deleting it resets invoices, payments, decisions and replay history. The unavailable latch is in memory, not a durable lockout.
- There is no provenance attestation: the registry reports `hasProvenance: false`, tier `source-linked`, scope `artifact-only`.
- This is a sandbox: no real funds, caller-selected file writes, or external uploads. Synthetic invoice text is stored in the local SQLite file. No network calls exist in `src/`; this is not a claim about host dependencies.

## Why this exists

This tests evidence-gated execution in a small synthetic workflow. Future work will explore governance across more action classes, with source review and tests for each addition. That is roadmap intent, not a current capability; the [architecture](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/architecture.md) keeps registration explicit.

## Registry scan

For published version `0.1.0-beta.1`, checked 2026-09-23: **version-level scan is clean/benign while the package-level aggregate status is still pending.** The [version response](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox/versions/0.1.0-beta.1) and [package response](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox) are separate evidence. These results describe the published artifact, not this changed checkout, and are not a certification.

## Testing, removal and feedback

Local pinned-host checks: **44 tests passed, 6/6 mutation controls killed, package check passed, and one installed-host test passed with seven Gateway invocations**. The badges show remote workflow state, not CI acceptance of this unpublished branch. A later registry-installation record for the original beta is retained in its [release](https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.1).

Preview removal, then uninstall from the same profile used to install:

```sh
openclaw plugins uninstall dgr-sandbox --dry-run
openclaw plugins uninstall dgr-sandbox
```

Inspect the host state directory separately for `dgr-sandbox/sandbox.sqlite`; do not assume uninstall erased the data. Preserve it if you need the history. Deleting it is a reset, not recovery of the original record.

Share your OS, OpenClaw version and outcome in [Discussions](https://github.com/DGR-AI-Labs/dgr-openclaw/discussions), report defects through [Issues](https://github.com/DGR-AI-Labs/dgr-openclaw/issues/new/choose), and use [private vulnerability reporting](https://github.com/DGR-AI-Labs/dgr-openclaw/security/advisories/new) for security findings.

## Package metadata and authorship

Display name: `DGR Sandbox`. Family: `code-plugin`. Version: `0.1.0-beta.1`. License: `Apache-2.0`. Category: `developer-tools`. Proposed discovery topics: `[]`. Release tag: `beta`. Repository: `https://github.com/DGR-AI-Labs/dgr-openclaw`.

Authored by Codex under founder direction. This is a separate JavaScript/SQLite sandbox, with no inherited production assurance. Source facts were checked at `9a6ba64faf7bb400cea5b8b721c5e094fd1b4dac`; the original published artifact points to `4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7`. See [RELEASING.md](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/RELEASING.md) for release records and listing sync.
