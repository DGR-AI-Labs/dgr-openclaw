# DGR Gate for OpenClaw

**An agent action should have to prove itself before it runs.**

![Sandbox checks](https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Sandbox%20checks/badge.svg) ![Analyzer evidence](https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Analyzer%20evidence/badge.svg) ![Version](https://img.shields.io/badge/version-0.1.1-blue) ![License](https://img.shields.io/badge/license-Apache--2.0-blue)

## What it does

- Requires an invoice stored by `dgr_invoice_attachment` before `dgr_sandbox_payment` can simulate a payment. This is synthetic test evidence, not proof of a real invoice or human approval.
- Uses a closed input schema: any unknown field, including `trustedEvidence`, yields `INVALID_ACTION`. Payment evidence comes from stored state; invented fields cannot supply it.
- Commits a synthetic effect and its hash-chained decision record together, checks replay, and stops further actions after storage failure. Record verification is self-consistency-only.

The gate sits inside the two tools that own these effects. Through these tools, there is no route around it to the sandbox effects or ledger. The model does not decide whether the gate runs. This does not constrain the host operator, who can change the plugin, policy or database, or use other tools.

## Install

```sh
openclaw plugins install clawhub:@dgr-ai-labs/openclaw-dgr-gate --accept-capabilities
```

For reproducible installs, select the version explicitly:

```sh
openclaw plugins install clawhub:@dgr-ai-labs/openclaw-dgr-gate@0.1.1 --accept-capabilities
openclaw plugins inspect dgr-gate --runtime --json
```

ClawHub currently resolves the unpinned command to `0.1.0`; the pinned `0.1.1` command becomes available when this patch is published. A non-prerelease version does not expand scope or establish production assurance.

Requires OpenClaw **2026.9.5** and Node **>=24.16.0 <25**. Use a disposable profile for the first trial. The npm package name is `@dgr-ai-labs/openclaw-dgr-gate`; the manifest ID and configuration key are `dgr-gate`. Review the installer's capability prompt and restart the Gateway after installation. Conversational use needs your normal host model setup; the container test below does not.


[Container demo and source installation](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/local-demo.md) · [Moving from DGR Sandbox](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/migration.md).

## Starter policy

Merge this entry into the selected profile's configuration; keep existing entries:

```json
{"plugins":{"entries":{"dgr-gate":{"enabled":true,"config":{"maxPaymentMinor":1000,"allowedDestinations":["sandbox-vendor"],"maxAttachmentBytes":4096}}}}}
```

Add `dgr-gate` and its two tools to any allowlists. Restart the Gateway after policy changes. Amounts are USD cents; limits apply per action.

| Rule | Example blocked attempt | Reason |
| --- | --- | --- |
| `maxPaymentMinor: 1000` | Pay 2000 cents | `AMOUNT_LIMIT` |
| `allowedDestinations: ["sandbox-vendor"]` | Pay `other` | `DESTINATION_NOT_ALLOWED` |
| `maxAttachmentBytes: 4096` | Attach 4097 ASCII bytes | `ATTACHMENT_LIMIT` |

Only synthetic text belongs in the invoice store. Each invoice ID can be attached once and paid once; restarting preserves that history. More policy examples are in [docs/policies.md](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/policies.md).

## Results and reasons

Common refusals and fail-closed outcomes; [all 13 codes and precedence](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/reasons.md).

| Code | Status | Trigger |
| --- | --- | --- |
| `AMOUNT_LIMIT` | `denied` | Payment exceeds configured per-action amount |
| `DESTINATION_NOT_ALLOWED` | `denied` | Destination is outside the configured list |
| `INVOICE_REQUIRED` | `denied` | Payment has no stored invoice |
| `INVOICE_ALREADY_PAID` | `denied` | Invoice already has a payment |
| `ATTACHMENT_LIMIT` | `denied` | Invoice text exceeds the configured UTF-8 byte limit |
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
- No provenance attestation is established for this candidate. The old published beta reports `hasProvenance: false`, tier `source-linked`, scope `artifact-only`; those results do not transfer to the renamed package.
- This is a sandbox: no real funds, caller-selected file writes, or external uploads. Synthetic invoice text is stored in the local SQLite file. No network calls exist in `src/`; this is not a claim about host dependencies.

## Why this exists

This tests evidence-gated execution in a small synthetic workflow. Future work will explore governance across more action classes, with source review and tests for each addition. That is roadmap intent, not a current capability; the [architecture](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/architecture.md) keeps registration explicit.

## Apply this to your case

Which action would you want gated: a payout, a mass-message, a credential read, or a destructive file operation? None of these real actions is gated by this sandbox. Use the [use-case starter](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/templates/use-case/README.md) to describe your workflow, evidence source, policy and failure behavior, then share it in Discussions. These are proposals for future work, not available integrations.

## Testing, removal and feedback

Local pinned-host checks: **44 tests passed, 6/6 mutation controls killed, package check passed, and one installed-host test passed with seven Gateway invocations**. The badges show remote workflow state, not CI acceptance of this unpublished branch.

For `@dgr-ai-labs/openclaw-dgr-gate@0.1.0`, checked 2026-09-24: [version-level verification](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/versions/0.1.0) and [package-level scan](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate) both report `clean`. This describes the published artifact, not this edited checkout, and is not certification or provenance attestation.

Preview removal, then uninstall from the same profile used to install:
```sh
openclaw plugins uninstall dgr-gate --dry-run
openclaw plugins uninstall dgr-gate
```

Inspect the host state directory separately for `dgr-sandbox/sandbox.sqlite`; do not assume uninstall erased the data. Preserve it if you need the history. Deleting it is a reset, not recovery of the original record.

Share your OS, OpenClaw version and outcome in [Discussions](https://github.com/DGR-AI-Labs/dgr-openclaw/discussions), report defects through [Issues](https://github.com/DGR-AI-Labs/dgr-openclaw/issues/new/choose), and use [private vulnerability reporting](https://github.com/DGR-AI-Labs/dgr-openclaw/security/advisories/new) for security findings.

## Credits

- **[Khazretgali Sapenov](https://github.com/sapenov)** — `sapenov`
- **[Maksym Tykhenko](https://github.com/mtykhenko)** — `mtykhenko`
- **[Gaziz Nugmanov](https://github.com/gaziz)** — `gaziz`
- **[Sergiu Bakayev](https://github.com/bakaevs)** — `bakaevs`

Credit acknowledges contribution. It is not certification of the claims in this
README; see [docs/release-review.md](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/release-review.md).

## Authorship

Authored by Codex under founder direction. This is a separate JavaScript/SQLite sandbox, with no inherited production assurance. Published `0.1.0` is tag `v0.1.0` at commit `9c46d5a8c3711da6d1909a7c565329fedc750217`. These documentation edits are not part of that published artifact. See [RELEASING.md](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/RELEASING.md).
