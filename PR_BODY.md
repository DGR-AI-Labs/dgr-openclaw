# Rename to DGR Gate and prepare beta.2 publication

The next artifact uses DGR Gate / `dgr-gate` / `@dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2`. The old `@dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1` remains a separate published artifact. This updates the identity, corrects the five publication-copy defects, and prepares the founder's next release.

Candidate source commit: `75dd94fda3258916115dfaf5b22a807effb6ead1`. Rename prerequisite: `184e59c`, following constants prerequisite `9a6ba64faf7bb400cea5b8b721c5e094fd1b4dac`. Old published source: `4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7`.

The rename is a separate commit before the documentation stack. Its only source change is the registration ID/display name in src/index.js:7; its installed-host fixture changes three identity references. Tool names, database path, state and record formats, reason ordering and enforcement code are preserved. Relative to the rename commit, the amended bundle has zero changes under src/, test/, Dockerfile, workflow logic and scripts/mutations.mjs. The founder's new authorization permits the version bump in both manifests and lockfile. The local main comparison includes earlier CI and constants commits and must not be described as docs-only.

The five corrections are: generic closed-schema rejection rather than special self-attestation detection; beta.2 rather than replacing beta.1; five approved topics; pinned install first; and listing metadata moved out of README. The principle hook is retained. Its scope paragraph and package summary explicitly require stored evidence for payments; attachment creates that evidence. “No real files” is narrowed to no caller-selected file writes because SQLite is a real local file. A future-use-case invitation is included, explicitly excluding present support for real payouts, messages, credential reads and destructive file operations.

Verification: 44 tests passed, 6/6 mutation controls killed, package check PASS, installed-host test 1 passed with the same seven INVOKED pairs, container demonstration passed, listing check passed, seven deliberate listing drift controls rejected, ESLint passed, and old-plugin SQLite state preserved replay protection after renaming. The migration check uses real SQLite and mock host registration; it does not establish end-to-end host config migration. The final archive and installed-host check were rerun after the last README wording change; unit/mutation/demo checks used the identical runtime and metadata with the preceding README wording.

ClawHub 0.23.3 accepted the no-upload preview for this candidate with the five topics supplied. Its text output does not echo topics or prove publisher authorization, namespace availability, acceptance of the artifact, or scans. Source commits are local. No push, PR, GitHub About edit, authentication, account/namespace creation, or publication occurred. The untracked recon report is retained outside the commits.

## Derived values

| Value | Exact defining source quote / location |
| --- | --- |
| Package | `"@dgr-ai-labs/openclaw-dgr-gate"`; package.json:2 |
| Version | `"0.1.0-beta.2"`; package.json:3, openclaw.plugin.json:4, package-lock.json:3,9 |
| Runtime identity | `"id": "dgr-gate"`, `"name": "DGR Gate"`; openclaw.plugin.json:2–3; src/index.js:7 |
| License | `"Apache-2.0"`; package.json:7 |
| Node / host | `">=24.16.0 <25"`, `">=2026.9.5 <2026.9.6"`, `"2026.9.5"`; package.json:9,34–39 |
| Tools | `"dgr_sandbox_payment"`, `"dgr_invoice_attachment"`; openclaw.plugin.json:14–15 |
| Category | `"developer-tools"`; openclaw.plugin.json:7 |
| State | `join(stateRoot, 'dgr-sandbox', 'sandbox.sqlite')`; src/index.js:25 |
| Deadline | `const DEADLINE_MS = 1000;`; src/gate.js:9 |
| Closed fields | `Object.keys(input).length !== module.fields.length`; src/actions.js:7; `Object.keys(input).some(k => !module.fields.includes(k))`; :9 |
| Record guarantee | `verification: 'self-consistency-only'`; src/records.js:17 |

Topics are founder-approved release inputs in docs/clawhub-listing.md, not existing registry values. The complete summary and README digest are mechanically derived there.

## Changed files and line counts

Counts below describe the candidate bundle relative to the rename prerequisite, before this evidence-only replacement of PR_BODY.md. This file is excluded from the package.

| File | Lines |
| --- | --- |
| CHANGELOG.md | 20 |
| GITHUB_ABOUT.md | 5 |
| PR_BODY.md | 501 |
| README.md | 151 |
| RELEASING.md | 55 |
| docs/clawhub-listing.md | 62 |
| docs/open-items.md | 39 |
| docs/policies.md | 33 |
| docs/publication-discrepancy-ledger.md | 63 |
| openclaw.plugin.json | 49 |
| package-lock.json | 16 |
| package.json | 42 |
| scripts/check-listing.mjs | 59 |

## Claim-discipline review

| Constraint | Result |
| --- | --- |
| Operator-proof / immutable / tamper-proof / audit-grade | PASS: no such assurance; operator bypass and self-consistency limits explicit |
| Governs tools other than its own two | PASS: own-tool names and exclusions explicit |
| Cedar / Ed25519 / capability tokens / before_tool_call / out-of-process gating | PASS: no claims of these absent mechanisms |
| Latency guarantee | PASS: 1000 ms is an admission threshold; no call-completion promise |
| Cross-action governance in present tense | PASS: use-case section explicitly future proposals |
| Model chooses whether the gate runs | PASS: gate is inside the registered tools |
| Publication / registry-installation status | PASS: old package is published; new identity is an unpublished candidate; no evidence transfer |
| Provenance | PASS: no attestation claimed; historical source-linked/artifact-only distinction retained |
| Agent self-attestation detection | PASS: generic unknown-field rejection; payment evidence from stored state |
| File / external effect claim | PASS: local SQLite disclosed; no real funds or caller-selected writes |
| Scan qualifier | PASS: old version clean/benign and old aggregate pending both retained; candidate scans not established |
| README length and links | PASS: 151 lines; absolute URLs; two future-main files currently 404, disclosed below |

The bypass suite remains explicitly deferred, with no remaining constants precondition blocker. No bypass test was authored.

## Remaining release gaps and NOT ESTABLISHED

- Candidate integration and remote CI on the final source; the local main diff includes prior work.
- New identity availability, publisher authorization, candidate publication and fresh registry installation; preview is not a release.
- New package/version scan and provenance fields; old aggregate pending versus version clean remains historical evidence only.
- End-to-end migration of an existing OpenClaw profile; replay continuity was checked with real SQLite and mock registration, while fresh installation was checked through the real Gateway.
- New RELEASING.md and docs/policies.md links are 404 until integrated into main; all other 17 audited URLs returned 200.
- Dedicated registry homepage/license/screenshots/permissions fields, independent long-description input, summary maximum, unknown string/dimension limits, exact GitHub About limit, complete dependency-tree assurance, absolute default state path, uninstall data deletion and provenance upgrade results remain NOT ESTABLISHED. Unconfirmed optional listing fields are unset.

## Raw verification output

Commands run in the pinned Docker image use Node 24 and OpenClaw 2026.9.5. Outputs below are real. Long installed-host logs are cut only in the middle and marked. The local logs also retain full output. Source HEAD and diff snapshots precede this evidence-only file update.

### `git rev-parse HEAD`

```text
75dd94fda3258916115dfaf5b22a807effb6ead1
```

### `git diff --stat main...docs/publication-accuracy`

```text
 .github/analyzers/codeql.yml           |    7 +
 .github/analyzers/eslint.config.mjs    |   11 +
 .github/analyzers/evidence.py          |   80 +++
 .github/analyzers/package-lock.json    | 1005 ++++++++++++++++++++++++++++++++
 .github/analyzers/package.json         |   10 +
 .github/analyzers/test_evidence.py     |   51 ++
 .github/workflows/analyzers.yml        |  124 ++++
 .gitignore                             |    2 +
 .semgrepignore                         |    3 +
 CHANGELOG.md                           |   20 +
 CONTRIBUTING.md                        |    4 +-
 GITHUB_ABOUT.md                        |    5 +
 PR_BODY.md                             |  501 ++++++++++++++++
 README.md                              |  174 +++---
 RELEASING.md                           |   55 ++
 SECURITY.md                            |    2 +-
 docs/analyzer-evidence.md              |   36 ++
 docs/architecture.md                   |    4 +-
 docs/clawhub-listing.md                |   62 ++
 docs/contributor-quick-start.md        |   14 +-
 docs/feedback.md                       |    4 +-
 docs/open-items.md                     |   39 ++
 docs/policies.md                       |   33 ++
 docs/publication-discrepancy-ledger.md |   63 ++
 docs/quick-start.md                    |   12 +-
 docs/release-review.md                 |   33 ++
 openclaw.plugin.json                   |    6 +-
 package-lock.json                      |    8 +-
 package.json                           |    9 +-
 scripts/check-listing.mjs              |   59 ++
 scripts/mutations.mjs                  |    2 +-
 src/gate.js                            |   55 +-
 src/index.js                           |    8 +-
 test/installed.test.js                 |    8 +-
 34 files changed, 2388 insertions(+), 121 deletions(-)
```

### `git diff --stat 184e59c HEAD`

```text
 CHANGELOG.md                           |  10 +-
 GITHUB_ABOUT.md                        |   5 +
 PR_BODY.md                             | 501 +++++++++++++++++++++++++++++++++
 README.md                              | 178 +++++++-----
 RELEASING.md                           |  55 ++++
 docs/clawhub-listing.md                |  62 ++++
 docs/open-items.md                     |  39 +++
 docs/policies.md                       |  33 +++
 docs/publication-discrepancy-ledger.md |  63 +++++
 openclaw.plugin.json                   |   2 +-
 package-lock.json                      |   4 +-
 package.json                           |   7 +-
 scripts/check-listing.mjs              |  59 ++++
 13 files changed, 940 insertions(+), 78 deletions(-)
```

### `git diff --stat 184e59c HEAD -- src/ test/ scripts/mutations.mjs Dockerfile .github/workflows/`

```text
```

Exit status 0; no output.

### `docker build --progress plain -t dgr-gate-publication-test .`

```text
#0 building with "default" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 410B done
#1 DONE 0.0s

#2 [internal] load metadata for docker.io/library/node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6
#2 DONE 0.0s

#3 [internal] load .dockerignore
#3 transferring context: 92B done
#3 DONE 0.0s

#4 [internal] load build context
#4 transferring context: 155.61kB 0.1s done
#4 DONE 0.1s

#5 [1/4] FROM docker.io/library/node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6
#5 resolve docker.io/library/node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6 0.0s done
#5 DONE 0.0s

#6 [2/4] RUN npm install --global --ignore-scripts --omit=optional openclaw@2026.9.5     && openclaw --version
#6 CACHED

#7 [3/4] WORKDIR /plugin
#7 CACHED

#8 [4/4] COPY --chown=node:node . .
#8 DONE 0.2s

#9 exporting to image
#9 exporting layers
#9 exporting layers 0.6s done
#9 exporting manifest sha256:9d7a561a666aef5d4d1fa772612a10ce7fd5839fd8eff6005e48ec6ce1dd0c08 0.0s done
#9 exporting config sha256:0c67a06d50d54be3328647f691b626e95ccc3d09d676047e5257b567972d75c1 0.0s done
#9 exporting attestation manifest sha256:591b574b94a661b30c6c2e8e9a8d25423c6437159f3df49ef13b593d69e01c79 0.0s done
#9 exporting manifest list sha256:0aca49ad704e8421b38bb29b5c1835e337e34cc99f29d191498c3391aa165f70 0.0s done
#9 naming to docker.io/library/dgr-gate-publication-test:latest done
#9 unpacking to docker.io/library/dgr-gate-publication-test:latest
#9 unpacking to docker.io/library/dgr-gate-publication-test:latest 0.4s done
#9 DONE 1.1s
```

### `docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-gate-publication-test npm run test`

```text

> @dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2 test
> node --test test/config.test.js test/actions.test.js test/gate.test.js test/plugin.test.js

✔ malformed payment refuses: null (2.224522ms)
✔ malformed payment refuses: [] (0.191896ms)
✔ malformed payment refuses: {} (0.243752ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":500,"currency":"USD","extra":1} (0.132974ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":500,"currency":"USD","trustedEvidence":true} (1.432453ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":0,"currency":"USD"} (0.261369ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":-1,"currency":"USD"} (0.101621ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":1.5,"currency":"USD"} (0.19956ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":"500","currency":"USD"} (0.126703ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":500,"currency":"EUR"} (0.257785ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"../x","amountMinor":500,"currency":"USD"} (0.127599ms)
✔ malformed payment refuses: {"invoiceId":"x\ny","destination":"sandbox-vendor","amountMinor":500,"currency":"USD"} (0.077436ms)
✔ canonical action ignores property order and binds each payment field (0.816952ms)
✔ invoice uses UTF-8 byte length, rejects malformed Unicode and raw paths (3.643837ms)
✔ unknown action refuses (0.117845ms)
✔ default sandbox policy is immutable and canonical (2.691821ms)
✔ invalid configuration rejects: null (0.170994ms)
✔ invalid configuration rejects: [] (0.133272ms)
✔ invalid configuration rejects: {"unknown":true} (0.19329ms)
✔ invalid configuration rejects: {"maxPaymentMinor":null} (0.124812ms)
✔ invalid configuration rejects: {"maxPaymentMinor":0} (0.110678ms)
✔ invalid configuration rejects: {"maxPaymentMinor":1.1} (1.270515ms)
✔ invalid configuration rejects: {"maxPaymentMinor":"1000"} (0.195579ms)
✔ invalid configuration rejects: {"maxPaymentMinor":null} (0.133173ms)
✔ invalid configuration rejects: {"allowedDestinations":[]} (0.268535ms)
✔ invalid configuration rejects: {"allowedDestinations":["x","x"]} (0.160246ms)
✔ invalid configuration rejects: {"allowedDestinations":["../x"]} (0.105006ms)
✔ invalid configuration rejects: {"maxAttachmentBytes":-1} (0.134864ms)
✔ invalid configuration rejects: {"maxAttachmentBytes":262145} (0.064795ms)
✔ each policy dimension changes its commitment (0.274209ms)
✔ allowed actions create exact synthetic effects and consistent receipts (24.266898ms)
✔ over limit records denial and creates no effect (29.826213ms)
✔ wrong destination records denial and creates no effect (19.227137ms)
✔ agent evidence records denial and creates no effect (16.138983ms)
✔ exact payment limit accepted; invoice evidence required (21.900147ms)
✔ same attempt, changed action, second connection and new attempt cannot replay a payment (28.95641ms)
✔ attachment is immutable and byte-bounded (24.451131ms)
✔ real record-write failure rolls back effect and latches unavailable (21.006357ms)
✔ real database lock produces no effect (510.318609ms)
✔ real commit failure returns uncertain and does not retry (510.678051ms)
✔ unknown fields and absent call IDs cannot produce effects (15.728802ms)
✔ record tampering fails self-consistency verification (14.38853ms)
✔ mock-host: exactly two tool registrations, real gate and lifecycle (35.229762ms)
✔ mock-host: unavailable storage fails closed (1.443103ms)
ℹ tests 44
ℹ suites 0
ℹ pass 44
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1325.516041
```

### `docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-gate-publication-test npm run test:mutations`

```text

> @dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2 test:mutations
> node scripts/mutations.mjs

KILLED payment-limit
KILLED destination
KILLED invoice-evidence
KILLED attachment-limit
KILLED fault-latch
KILLED invoice-replay-reason
6/6 mutants killed; baseline passed.
```

### `docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-gate-publication-test npm run package:check`

```text

> @dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2 package:check
> node scripts/package-check.mjs

{"status":"PASS","files":["LICENSE","README.md","SECURITY.md","openclaw.plugin.json","package.json","src/actions.js","src/config.js","src/gate.js","src/index.js","src/modules/invoice.js","src/modules/payment.js","src/records.js"],"bytes":13991}
```

### `docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-gate-publication-test npm run test:installed`

```text

> @dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2 test:installed
> node --test test/installed.test.js

HOST OpenClaw 2026.9.5 (ec9c1a1)
PACKAGE sha512-kxCNvi/3NIYopPfVQ8xaq/KTUJ/OVYiwkQ/KOe7A/vuj5uVFxJS3W2v+ZSsLMqWYGAQSkfPsSnESBd4NGYYO+A==
WARNING - Installing plugin from local archive: /tmp/dgr-installed-937wga/dgr-ai-labs-openclaw-dgr-gate-0.1.0-beta.2.tgz
This source is outside ClawHub review and trust metadata. Only continue if you trust the publisher, package contents, and install source.
Extracting /tmp/dgr-installed-937wga/dgr-ai-labs-openclaw-dgr-gate-0.1.0-beta.2.tgz…
Plugin manifest id "dgr-gate" differs from npm package name "@dgr-ai-labs/openclaw-dgr-gate"; using manifest id as the config key.
Installing to /tmp/dgr-installed-937wga/state/extensions/dgr-gate…
Installed plugin: dgr-gate
Saved for the next Gateway start.

RUNTIME_INSPECTION {
  "workspaceDir": "/tmp/dgr-installed-937wga/state/workspace",
  "plugin": {
    "id": "dgr-gate",
    "name": "DGR Gate",
    "description": "Two policy-controlled synthetic finance tools. Does not govern other OpenClaw tools.",
    "packageVersion": "0.1.0-beta.2",
    "version": "0.1.0-beta.2",
    "builtWithOpenClawVersion": "2026.9.5",
    "packageName": "@dgr-ai-labs/openclaw-dgr-gate",
[... CUT 151 middle lines of runtime inspection ...]
        "tools: dgr_sandbox_payment"
      ],
      "hooks": [],
      "mcpServers": [],
      "cliCommands": [],
      "cliBackends": [],
      "skills": [],
      "dangerousConfigFlags": []
    },
    "acceptedSurfaceHash": "a7cc8beb651fa63b44f380bc02ef844064480831cb7b45d7cefc4c645e38acdb",
    "acceptedSurfaceAt": "2026-09-23T21:54:09.171Z"
  }
}

INVOKED dgr_invoice_attachment attach-demo simulated ALLOWED
INVOKED dgr_sandbox_payment over-limit denied AMOUNT_LIMIT
INVOKED dgr_sandbox_payment pay-demo simulated ALLOWED
INVOKED dgr_sandbox_payment pay-demo denied DUPLICATE_ATTEMPT
INVOKED dgr_sandbox_payment pay-again denied INVOICE_ALREADY_PAID
INVOKED dgr_invoice_attachment fault-call unavailable STORE_FAILURE
INVOKED dgr_invoice_attachment latched-call unavailable STORE_UNAVAILABLE
GATEWAY_LOG 2026-09-23T21:54:21.827+00:00 [gateway] loading configuration…
2026-09-23T21:54:21.851+00:00 [gateway] resolving authentication…
2026-09-23T21:54:21.854+00:00 [gateway] starting...
2026-09-23T21:54:21.879+00:00 [gateway] shutdown budget at startup: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T21:54:21.983+00:00 [gateway] spawn broker ready pid=224
2026-09-23T21:54:22.962+00:00 [gateway] starting HTTP server...
2026-09-23T21:54:23.915+00:00 [gateway] ready
2026-09-23T21:54:24.106+00:00 [gateway] starting channels and sidecars...
2026-09-23T21:54:24.121+00:00 [gateway] agent model: openai/gpt-6-astra (thinking=medium, fast=off)
2026-09-23T21:54:24.122+00:00 [gateway] http server listening (2 plugins: dgr-gate, memory-core; 2.2s)
2026-09-23T21:54:24.123+00:00 [gateway] log file: /tmp/openclaw/openclaw-2026-09-23.log
2026-09-23T21:54:24.465+00:00 [gateway/channels] skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)
2026-09-23T21:54:24.545+00:00 [plugins] memory-core: created managed dreaming cron job.
2026-09-23T21:54:24.549+00:00 [gateway] startup outcomes: internal-hooks=skipped (not-configured); internal-startup-hook=skipped (no-handlers-loaded); gateway-start-hooks=scheduled; gmail-watcher=skipped (hooks-disabled); gmail-model=skipped (not-configured)
2026-09-23T21:54:24.552+00:00 [heartbeat] started
2026-09-23T21:54:24.559+00:00 [gateway] ready
2026-09-23T21:54:24.804+00:00 [admission] closed: stop (SIGTERM)
2026-09-23T21:54:24.805+00:00 [gateway] received SIGTERM; shutting down
2026-09-23T21:54:24.807+00:00 [gateway] shutdown budget at shutdown: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T21:54:24.809+00:00 [gateway] draining active work before stop with timeout 315000ms: rootRequests=2
2026-09-23T21:54:25.080+00:00 [gateway] sidecars.restart-sentinel failed after gateway ready: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:54:25.082+00:00 [main-session-restart-recovery] main-session restart recovery failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:54:25.105+00:00 [cron] failed to enter start root: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:54:25.131+00:00 [gateway] restart sentinel refresh failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:54:25.134+00:00 [gateway] gateway_start hook failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:54:25.144+00:00 [gateway] update check readiness wait failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:54:25.315+00:00 [gateway] active-work drain settled; beginning server close
2026-09-23T21:54:25.362+00:00 [gmail-watcher] gmail watcher stopped
2026-09-23T21:54:25.423+00:00 [shutdown] completed cleanly in 96ms

✔ packed plugin installs and enforces through real OpenClaw HTTP tool dispatch (21554.059915ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 21630.523787
```

### `npm pack --dry-run`

```text
npm notice
npm notice 📦  @dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2
npm notice Tarball Contents
npm notice 11.4kB LICENSE
npm notice 11.6kB README.md
npm notice 994B SECURITY.md
npm notice 1.1kB openclaw.plugin.json
npm notice 1.2kB package.json
npm notice 1.9kB src/actions.js
npm notice 2.2kB src/config.js
npm notice 6.6kB src/gate.js
npm notice 2.0kB src/index.js
npm notice 607B src/modules/invoice.js
npm notice 777B src/modules/payment.js
npm notice 1.1kB src/records.js
npm notice Tarball Details
npm notice name: @dgr-ai-labs/openclaw-dgr-gate
npm notice version: 0.1.0-beta.2
npm notice filename: dgr-ai-labs-openclaw-dgr-gate-0.1.0-beta.2.tgz
npm notice package size: 14.0 kB
npm notice unpacked size: 41.4 kB
npm notice shasum: c05531b51e80666df15d7f7b49a4f90ce15e355b
npm notice integrity: sha512-kxCNvi/3NIYop[...]nESBd4NGYYO+A==
npm notice total files: 12
npm notice
dgr-ai-labs-openclaw-dgr-gate-0.1.0-beta.2.tgz
```

### `docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-gate-publication-test`

```text
HOST OpenClaw 2026.9.5 (ec9c1a1)
PACKAGE sha512-SAY4ZJJMO97Y5I1hqmtZy2J5KZIHB04Wwd4scL2EVfWsSzfjfcziKZinwcFeJZZv2l4rOmEBkBa0foh+ZpcrVg==
WARNING - Installing plugin from local archive: /tmp/dgr-installed-5YVNHk/dgr-ai-labs-openclaw-dgr-gate-0.1.0-beta.2.tgz
This source is outside ClawHub review and trust metadata. Only continue if you trust the publisher, package contents, and install source.
Extracting /tmp/dgr-installed-5YVNHk/dgr-ai-labs-openclaw-dgr-gate-0.1.0-beta.2.tgz…
Plugin manifest id "dgr-gate" differs from npm package name "@dgr-ai-labs/openclaw-dgr-gate"; using manifest id as the config key.
Installing to /tmp/dgr-installed-5YVNHk/state/extensions/dgr-gate…
Installed plugin: dgr-gate
Saved for the next Gateway start.

RUNTIME_INSPECTION {
  "workspaceDir": "/tmp/dgr-installed-5YVNHk/state/workspace",
  "plugin": {
    "id": "dgr-gate",
    "name": "DGR Gate",
    "description": "Two policy-controlled synthetic finance tools. Does not govern other OpenClaw tools.",
    "packageVersion": "0.1.0-beta.2",
    "version": "0.1.0-beta.2",
    "builtWithOpenClawVersion": "2026.9.5",
    "packageName": "@dgr-ai-labs/openclaw-dgr-gate",
    "format": "openclaw",
    "source": "/tmp/dgr-installed-5YVNHk/state/extensions/dgr-gate/src/index.js",
    "rootDir": "/tmp/dgr-installed-5YVNHk/state/extensions/dgr-gate",
    "origin": "global",
[... CUT 146 middle lines of runtime inspection ...]
        "tools: dgr_invoice_attachment",
        "tools: dgr_sandbox_payment"
      ],
      "hooks": [],
      "mcpServers": [],
      "cliCommands": [],
      "cliBackends": [],
      "skills": [],
      "dangerousConfigFlags": []
    },
    "acceptedSurfaceHash": "a7cc8beb651fa63b44f380bc02ef844064480831cb7b45d7cefc4c645e38acdb",
    "acceptedSurfaceAt": "2026-09-23T21:51:20.384Z"
  }
}

INVOKED dgr_invoice_attachment attach-demo simulated ALLOWED
INVOKED dgr_sandbox_payment over-limit denied AMOUNT_LIMIT
INVOKED dgr_sandbox_payment pay-demo simulated ALLOWED
INVOKED dgr_sandbox_payment pay-demo denied DUPLICATE_ATTEMPT
INVOKED dgr_sandbox_payment pay-again denied INVOICE_ALREADY_PAID
INVOKED dgr_invoice_attachment fault-call unavailable STORE_FAILURE
INVOKED dgr_invoice_attachment latched-call unavailable STORE_UNAVAILABLE
GATEWAY_LOG 2026-09-23T21:51:32.454+00:00 [gateway] loading configuration…
2026-09-23T21:51:32.480+00:00 [gateway] resolving authentication…
2026-09-23T21:51:32.483+00:00 [gateway] starting...
2026-09-23T21:51:32.508+00:00 [gateway] shutdown budget at startup: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T21:51:32.620+00:00 [gateway] spawn broker ready pid=211
2026-09-23T21:51:33.648+00:00 [gateway] starting HTTP server...
2026-09-23T21:51:34.665+00:00 [gateway] ready
2026-09-23T21:51:34.840+00:00 [gateway] starting channels and sidecars...
2026-09-23T21:51:34.855+00:00 [gateway] agent model: openai/gpt-6-astra (thinking=medium, fast=off)
2026-09-23T21:51:34.856+00:00 [gateway] http server listening (2 plugins: dgr-gate, memory-core; 2.3s)
2026-09-23T21:51:34.857+00:00 [gateway] log file: /tmp/openclaw/openclaw-2026-09-23.log
2026-09-23T21:51:35.191+00:00 [gateway/channels] skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)
2026-09-23T21:51:35.266+00:00 [plugins] memory-core: created managed dreaming cron job.
2026-09-23T21:51:35.269+00:00 [gateway] startup outcomes: internal-hooks=skipped (not-configured); internal-startup-hook=skipped (no-handlers-loaded); gateway-start-hooks=scheduled; gmail-watcher=skipped (hooks-disabled); gmail-model=skipped (not-configured)
2026-09-23T21:51:35.272+00:00 [heartbeat] started
2026-09-23T21:51:35.280+00:00 [gateway] ready
2026-09-23T21:51:35.547+00:00 [admission] closed: stop (SIGTERM)
2026-09-23T21:51:35.547+00:00 [gateway] received SIGTERM; shutting down
2026-09-23T21:51:35.549+00:00 [gateway] shutdown budget at shutdown: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T21:51:35.552+00:00 [gateway] draining active work before stop with timeout 315000ms: rootRequests=2
2026-09-23T21:51:35.808+00:00 [gateway] sidecars.restart-sentinel failed after gateway ready: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:51:35.810+00:00 [main-session-restart-recovery] main-session restart recovery failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:51:35.833+00:00 [cron] failed to enter start root: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:51:35.860+00:00 [gateway] restart sentinel refresh failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:51:35.862+00:00 [gateway] gateway_start hook failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T21:51:35.867+00:00 [gateway] active-work drain settled; beginning server close
2026-09-23T21:51:35.894+00:00 [gmail-watcher] gmail watcher stopped
2026-09-23T21:51:35.939+00:00 [shutdown] completed cleanly in 57ms

✔ packed plugin installs and enforces through real OpenClaw HTTP tool dispatch (20539.003552ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 20601.017333
```

### `npm run check:listing`

```text

> @dgr-ai-labs/openclaw-dgr-gate@0.1.0-beta.2 check:listing
> node scripts/check-listing.mjs

PASS: summary, version, license, category, topics, badges, identity, contracts, lockfile and full README digest agree.
```

### `.github/analyzers/node_modules/.bin/eslint --config .github/analyzers/eslint.config.mjs scripts/check-listing.mjs --max-warnings 0`

```text
```

Exit status 0; no output.

### `Supplementary seven-field drift check in disposable copies`

```text
PASS: summary drift rejected
PASS: version drift rejected
PASS: license drift rejected
PASS: category drift rejected
PASS: topics drift rejected
PASS: contracts drift rejected
PASS: hook drift rejected
```

### `docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges -v /tmp/dgr-gate-verification:/evidence:ro dgr-gate-publication-test node /evidence/migration.mjs`

```text
PASS: old-plugin state reused by renamed plugin; duplicate attempt and paid-invoice history survive; one invoice, one payment, four ledger records.
Scope: real SQLite with mock host registration; not a host configuration-migration test.
```

### `HTTP resolver: every Markdown URL in README.md and RELEASING.md`

```text
200 https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox
200 https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox/versions/0.1.0-beta.1
200 https://docs.openclaw.ai/clawhub/publishing
200 https://docs.openclaw.ai/plugins
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/CHANGELOG.md
HTTP Error 404: Not Found https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/RELEASING.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/analyzer-evidence.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/architecture.md
HTTP Error 404: Not Found https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/policies.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/release-review.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/templates/use-case/README.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/discussions
200 https://github.com/DGR-AI-Labs/dgr-openclaw/issues/new/choose
200 https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.1
200 https://github.com/DGR-AI-Labs/dgr-openclaw/security/advisories/new
200 https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Analyzer%20evidence/badge.svg
200 https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Sandbox%20checks/badge.svg
200 https://img.shields.io/badge/license-Apache--2.0-blue
200 https://img.shields.io/badge/version-0.1.0--beta.2-blue
```

### `npm exec --yes --package=clawhub@0.23.3 -- clawhub package publish . --family code-plugin --owner dgr-ai-labs --tags beta --topics agent-safety,policy-enforcement,fail-closed,audit-trail,tool-gating --dry-run`

```text
Dry run - nothing will be published.

Source:    github:DGR-AI-Labs/dgr-openclaw@docs/publication-accuracy
Family:    code-plugin
Name:      @dgr-ai-labs/openclaw-dgr-gate
Display:   DGR Gate
Version:   0.1.0-beta.2
Commit:    75dd94fda3258916115dfaf5b22a807effb6ead1
Compat:    pluginApi=>=2026.9.5 <2026.9.6, builtWith=2026.9.5, sdk=2026.9.5, minGateway=2026.9.5
Files:     12 files (40.4 KB)
Tags:      beta

Files:
  LICENSE                      11.1 KB
  src/actions.js               1.8 KB
  src/config.js                2.1 KB
  src/gate.js                  6.5 KB
  src/index.js                 1.9 KB
  src/modules/invoice.js       607 B
  src/modules/payment.js       777 B
  src/records.js               1.0 KB
  openclaw.plugin.json         1.1 KB
  package.json                 1.2 KB
  README.md                    11.3 KB
  SECURITY.md                  994 B
```

**BUNDLE COMPLETE WITH OMISSIONS** — release and registry verification, pending-main links, and unestablished optional fields listed above.
