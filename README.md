# DGR Gate — a pre-execution gate for OpenClaw tool calls

**A rule in the prompt is a request. A rule in the tool is a gate.**

![Sandbox checks](https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Sandbox%20checks/badge.svg) ![Analyzer evidence](https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Analyzer%20evidence/badge.svg) ![Version](https://img.shields.io/badge/version-0.1.2-blue) ![License](https://img.shields.io/badge/license-Apache--2.0-blue)

Tell an agent to confirm before acting and the instruction lives in its context —
where it can be compacted away, or argued past by text the agent reads. DGR Gate
moves the check into the tool that performs the action, against operator-configured policy rather than the model’s judgment.

**This release gates two demo tools it ships itself — a synthetic payment and an
invoice attachment. It does not gate your existing OpenClaw tools.** It exists so you can see the mechanism work, and tell us which real action to gate next.

## What it does

- Requires an invoice stored by `dgr_invoice_attachment` before `dgr_sandbox_payment` can simulate a payment. The evidence is synthetic text, not proof of a real invoice or human approval.
- Checks proposed actions against a closed schema and deterministic policy. Unknown fields, including `trustedEvidence`, yield `INVALID_ACTION`; they cannot replace stored evidence.
- Commits each synthetic effect with its hash-chained decision record in one SQLite transaction. Replay checks and storage-failure handling are shared by both tools. Some refusals and failures have no record.

## Where the gate sits

`DGR demo tool → pre-execution gate → synthetic effect + decision record`

The check runs inside each tool’s execution path; the model does not choose whether to invoke it. Policy comes from host configuration, not an agent-supplied claim. This is not policy secrecy: the host operator can change the plugin, policy or database, and other tools are outside this gate.

## Install

```sh
openclaw plugins install clawhub:@dgr-ai-labs/openclaw-dgr-gate --accept-capabilities
openclaw plugins inspect dgr-gate --runtime --json
```

For a reproducible install matching this source version:

```sh
openclaw plugins install clawhub:@dgr-ai-labs/openclaw-dgr-gate@0.1.2 --accept-capabilities
```

Requires OpenClaw **2026.9.5** and Node **>=24.16.0 <25**. Use a disposable profile first. Package name: `@dgr-ai-labs/openclaw-dgr-gate`; manifest/configuration ID: `dgr-gate`. Review the capability prompt and restart the Gateway after installation. Conversational use needs your normal host model setup.

[Container demo and source installation](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/local-demo.md) · [Moving from DGR Sandbox](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/migration.md).

## Starter policy

Merge into the selected profile’s configuration, keeping existing entries:

```json
{"plugins":{"entries":{"dgr-gate":{"enabled":true,"config":{"maxPaymentMinor":1000,"allowedDestinations":["sandbox-vendor"],"maxAttachmentBytes":4096}}}}}
```

Add `dgr-gate` and its two tools to any allowlists. Restart the Gateway after policy changes. Amounts are USD cents; limits apply per action.

| Rule | Example blocked attempt | Reason |
| --- | --- | --- |
| `maxPaymentMinor: 1000` | Pay 2000 cents | `AMOUNT_LIMIT` |
| `allowedDestinations: ["sandbox-vendor"]` | Pay `other` | `DESTINATION_NOT_ALLOWED` |
| `maxAttachmentBytes: 4096` | Attach 4097 ASCII bytes | `ATTACHMENT_LIMIT` |

Use only synthetic invoice text. Each invoice ID can be attached once and paid once; restarting preserves that history. [More policy examples](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/policies.md).

## Results and reasons

Common outcomes below; [all 13 reason codes and precedence](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/reasons.md).

| Code | Status | Trigger |
| --- | --- | --- |
| `AMOUNT_LIMIT` | `denied` | Payment exceeds the configured amount |
| `DESTINATION_NOT_ALLOWED` | `denied` | Destination is outside the configured list |
| `INVOICE_REQUIRED` | `denied` | No stored invoice |
| `INVOICE_ALREADY_PAID` | `denied` | Invoice already has a payment |
| `ATTACHMENT_LIMIT` | `denied` | Invoice text exceeds the configured UTF-8 byte limit |
| `DEADLINE_EXCEEDED` | `denied` or `unavailable` | Admission deadline reached before effect insertion or before commit |
| `STORE_UNAVAILABLE` | `unavailable` | Gate stopped or faulted, or storage setup failed |
| `STORE_FAILURE` | `unavailable` or `uncertain` | Transaction failed; a commit already started may have an ambiguous outcome |

Do not automatically retry `uncertain` results. Stop the Gateway and inspect state before recovery. Missing call IDs and several failure paths return `recorded: false`; committed decisions have receipts.

## Worked run

Example output from the installed-host test through the real Gateway, without a model:

```text
INVOKED dgr_invoice_attachment attach-demo simulated ALLOWED
INVOKED dgr_sandbox_payment over-limit denied AMOUNT_LIMIT
INVOKED dgr_sandbox_payment pay-demo simulated ALLOWED
INVOKED dgr_sandbox_payment pay-demo denied DUPLICATE_ATTEMPT
INVOKED dgr_sandbox_payment pay-again denied INVOICE_ALREADY_PAID
INVOKED dgr_invoice_attachment fault-call unavailable STORE_FAILURE
INVOKED dgr_invoice_attachment latched-call unavailable STORE_UNAVAILABLE
```

The pre-execution gate checks a **1000 ms admission deadline** before effects and again before commit. An expired check refuses the action or rolls back and stops further actions. This fail-closed property is not a promise about call completion time.

## ⚠️ What this does not do yet

- It gates only `dgr_sandbox_payment` and `dgr_invoice_attachment`, not other OpenClaw tools. No real funds, caller-selected file writes or external uploads occur.
- The operator can edit the plugin or database. Record verification is **self-consistency-only**; it does not establish authenticity against an operator or completeness without a trusted external anchor.
- State lives in `dgr-sandbox/sandbox.sqlite` under the host’s state directory. Deleting it resets invoice, payment, decision and replay history. The unavailable latch is in memory, not a durable lockout.
- Synthetic invoice text is stored in SQLite. There are no network calls in `src/`; this does not describe host dependencies.

## Why this exists and apply this to your case

The two demo tools let you examine a pre-execution gate with deterministic checks, stored evidence and fail-closed handling. Broader action coverage is future work.

Which real action would you want gated: a payout, a mass-message, a credential read or a destructive file operation? None is gated by this demo. Use the [use-case starter](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/templates/use-case/README.md) to describe the action, evidence, policy and failure behavior. These are proposals, not available integrations; see the [architecture](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/architecture.md).

## Testing, removal and feedback

Run the [container checks](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/local-demo.md) for unit/SQLite tests and installed-host dispatch. This is not a conversational-agent or production payment test. The badges link to CI; they do not certify the plugin.

Preview removal, then uninstall from the profile used to install:
```sh
openclaw plugins uninstall dgr-gate --dry-run
openclaw plugins uninstall dgr-gate
```

Inspect the host state directory separately; do not assume uninstall erased SQLite history. Deleting it resets the record rather than recovering it. Share your OS, host version and outcome in [Discussions](https://github.com/DGR-AI-Labs/dgr-openclaw/discussions), report defects through [Issues](https://github.com/DGR-AI-Labs/dgr-openclaw/issues/new/choose), and report vulnerabilities [privately](https://github.com/DGR-AI-Labs/dgr-openclaw/security/advisories/new).

## Credits

- **[Khazretgali Sapenov](https://github.com/sapenov)** — `sapenov`
- **[Maksym Tykhenko](https://github.com/mtykhenko)** — `mtykhenko`
- **[Gaziz Nugmanov](https://github.com/gaziz)** — `gaziz`
- **[Sergiu Bakayev](https://github.com/bakaevs)** — `bakaevs`

Credit acknowledges contribution, not certification.

## Provenance

Authored by Codex under founder direction. This is a separate JavaScript/SQLite demo with no inherited production assurance. Source linkage, record hashes and registry scans do not establish build provenance attestation. Consult [release evidence and procedures](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/RELEASING.md) for the exact source/artifact under examination.
