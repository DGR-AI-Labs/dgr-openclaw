# DGR Sandbox for OpenClaw

**Experimental sandbox, version 0.1.0-beta.1. Founder release approval is recorded; remaining release checks are tracked in the [release review record](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/release-review.md).** Two tools let you try policy-controlled financial actions using synthetic data. No real money moves and no attachment is uploaded or written to a caller-selected file. This plugin does not protect your other OpenClaw tools.

## What you need

OpenClaw **2026.9.5**, Node **24.16 or newer within Node 24**, and a disposable OpenClaw profile for the first trial. No separate DGR runtime, Rust compiler, bank account, API key or model subscription is required for the deterministic test. To use the tools conversationally, your normal OpenClaw model setup is needed.

## Install the review candidate

From this repository, run `npm pack`. Inspect the resulting archive, then install it into your chosen OpenClaw profile:

```sh
openclaw plugins install ./dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz --force --accept-capabilities
openclaw plugins inspect dgr-sandbox --runtime --json
```

The force flag acknowledges this local package source. Use it only for the archive you reviewed. Restart your Gateway after installation. The plugin has **not** been published to ClawHub yet. A future ClawHub install command must use the actual approved publisher/package name.

## Configure

Merge this entry into your OpenClaw configuration; do not replace your existing configuration:

```json
{
  "plugins": {
    "entries": {
      "dgr-sandbox": {
        "enabled": true,
        "config": {
          "maxPaymentMinor": 1000,
          "allowedDestinations": ["sandbox-vendor"],
          "maxAttachmentBytes": 4096
        }
      }
    }
  }
}
```

If you use a plugin allowlist, add `dgr-sandbox`. If your agent has a tool allowlist, add `dgr_sandbox_payment` and `dgr_invoice_attachment`. Keep any existing entries. Restart the Gateway after changing policy. Unknown fields or invalid settings are refused.

Amounts are **USD cents**: 1000 means ten dollars. Limits apply to each simulated payment, not a daily aggregate. Each invoice can be attached once and paid once. Restarting does not erase that history. Do not reuse an invoice identifier for a fresh example.

## Your first example

1. Ask your agent: “Use dgr_invoice_attachment to attach the synthetic text ‘Demo invoice, no real transaction’ to invoice demo-001.”
2. Ask: “Use dgr_sandbox_payment to simulate paying 500 USD cents for demo-001 to sandbox-vendor.”
3. Attach a second synthetic invoice, demo-002, and request 2000 cents. You should get `AMOUNT_LIMIT`, and no payment is recorded.

Successful results say `simulated`, never that a real payment occurred. A denied request explains the reason. `unavailable` means the sandbox cannot safely proceed; `uncertain` means a database commit outcome was ambiguous. Do not automatically retry uncertain actions. Stop the Gateway and inspect the sandbox before recovery.

Only synthetic sample data belongs here. An attached invoice is a local fixture, not verified commercial evidence or human approval.

## Where the sandbox lives

The database is `dgr-sandbox/sandbox.sqlite` under the host's OpenClaw state directory. It stores synthetic invoice content, payments, consumed attempts and decision records. No telemetry is sent. Administrators can modify that database; the record chain checks consistency, not authenticity against an administrator. Deleting the database erases replay history: never present a reset sandbox as the original durable record.

## Test without your profile or credentials

```sh
docker build -t dgr-openclaw-test .
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test npm test
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test
```

The first command downloads the pinned host and dependencies at build time. The runs use disposable container state and no host-directory mounts. The second run packs and installs this plugin and invokes the real Gateway tool API; it uses no model and no external endpoint. It is an installed-dispatch test, not a conversational-agent test. The container's optional host packages and install scripts are omitted, so this does not validate every OpenClaw feature.

## Contribute or publish

See [CONTRIBUTING.md](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/CONTRIBUTING.md), the [use-case template](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/templates/use-case/README.md), and the [architecture](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/architecture.md). New action classes need review; installing this package does not dynamically load community executors.

For a release: complete independent review and all required checks, inspect the packed file list, bind the candidate to its source commit, confirm ClawHub publisher ownership and compatibility metadata, and run ClawHub package validation and a publish dry run. Public repository visibility and a real publish are separate founder decisions. The development package currently has `private: true` to deter accidental npm publication; review that field deliberately for the chosen registry release process.

Authored by Codex under founder direction. Design principles draw on prior DGR work; this is a separate JavaScript/SQLite sandbox implementation, not the verified Rust core or private runtime. No inherited certification or production assurance is claimed.

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

Observed locally in the pinned Node/OpenClaw Docker environment: 44 unit and real-SQLite tests passed; six isolated deliberate-bug controls were caught; package allowlist validation passed; and packed-plugin installation plus seven real Gateway tool invocations passed. The installed checks include allowed/denied actions, replay refusal, real database record failure and the unavailable-state latch. There was no model-driven conversation, real payment, registry installation or customer deployment.

Earlier Semgrep, CodeQL and ESLint scans were run separately. The **Analyzer evidence** CI workflow now retains source-bound reports for all three tools; see [scope and review instructions](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/analyzer-evidence.md). Accepted release evidence and final dispositions belong to the review packet. These checks do not replace independent human review. Founder release approval is recorded; outstanding independent review and publication checks are listed in the release review record. Host dependencies were resolved during image construction; the tested image is bound in retained evidence, and rebuilding can require fresh dependency review.

## Feedback and participation

Share successful setups, questions and workflow ideas in [GitHub Discussions](https://github.com/DGR-AI-Labs/dgr-openclaw/discussions). Use [Issues](https://github.com/DGR-AI-Labs/dgr-openclaw/issues/new/choose) for reproducible defects and use-case proposals. Include the tested commit or release, OS and OpenClaw version. Report vulnerabilities through [private reporting](https://github.com/DGR-AI-Labs/dgr-openclaw/security/advisories/new).
