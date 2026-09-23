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

### Scope snapshots before adding this evidence appendix

The command outputs below bind the tested candidate. The following evidence-only commit changes PR_BODY.md and a source citation in the discrepancy ledger, both excluded from the package.

```sh
git rev-parse HEAD
```

```text
c12e10062beca9ff3c45a0adb7370d54e93cec1c
```

```sh
git diff --stat main...docs/publication-accuracy
```

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
 CHANGELOG.md                           |   14 +
 CONTRIBUTING.md                        |    4 +-
 GITHUB_ABOUT.md                        |    5 +
 PR_BODY.md                             |   36 ++
 README.md                              |  164 ++++--
 RELEASING.md                           |   53 ++
 SECURITY.md                            |    2 +-
 docs/analyzer-evidence.md              |   36 ++
 docs/architecture.md                   |    4 +-
 docs/clawhub-listing.md                |   54 ++
 docs/contributor-quick-start.md        |   14 +-
 docs/feedback.md                       |    4 +-
 docs/open-items.md                     |   39 ++
 docs/policies.md                       |   33 ++
 docs/publication-discrepancy-ledger.md |   54 ++
 docs/quick-start.md                    |   12 +-
 docs/release-review.md                 |   33 ++
 package.json                           |    5 +-
 scripts/check-listing.mjs              |   55 ++
 scripts/mutations.mjs                  |    2 +-
 src/gate.js                            |   55 +-
 src/index.js                           |    6 +-
 test/installed.test.js                 |    2 +
 32 files changed, 1874 insertions(+), 105 deletions(-)
```

That comparison is NOT zero-src: it includes prior commits on the stacked branch. The bundle-only comparison is:

```sh
git diff --stat 9a6ba64...HEAD
```

```text
 GITHUB_ABOUT.md                        |   5 +
 PR_BODY.md                             |  36 +++++++
 README.md                              | 170 ++++++++++++++++++++-------------
 RELEASING.md                           |  53 ++++++++++
 docs/clawhub-listing.md                |  54 +++++++++++
 docs/open-items.md                     |  39 ++++++++
 docs/policies.md                       |  33 +++++++
 docs/publication-discrepancy-ledger.md |  54 +++++++++++
 package.json                           |   5 +-
 scripts/check-listing.mjs              |  55 +++++++++++
 10 files changed, 434 insertions(+), 70 deletions(-)
```

```sh
git diff --exit-code 9a6ba64...HEAD -- src openclaw.plugin.json Dockerfile .github test scripts/mutations.mjs
```

```text

```

The preceding command produced no output and exited 0.

### Raw verification outputs

The npm test commands ran inside the pinned Docker image with `--rm --network none --cap-drop ALL --security-opt no-new-privileges`; npm pack and the pure-JS listing check ran in the checkout.

```sh
npm test
```

```text

> @dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1 test
> node --test test/config.test.js test/actions.test.js test/gate.test.js test/plugin.test.js

✔ malformed payment refuses: null (1.374407ms)
✔ malformed payment refuses: [] (0.183687ms)
✔ malformed payment refuses: {} (0.164251ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":500,"currency":"USD","extra":1} (0.114617ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":500,"currency":"USD","trustedEvidence":true} (1.301749ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":0,"currency":"USD"} (0.231826ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":-1,"currency":"USD"} (0.093986ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":1.5,"currency":"USD"} (0.153088ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":"500","currency":"USD"} (0.165347ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"sandbox-vendor","amountMinor":500,"currency":"EUR"} (0.22764ms)
✔ malformed payment refuses: {"invoiceId":"demo","destination":"../x","amountMinor":500,"currency":"USD"} (0.128272ms)
✔ malformed payment refuses: {"invoiceId":"x\ny","destination":"sandbox-vendor","amountMinor":500,"currency":"USD"} (0.081926ms)
✔ canonical action ignores property order and binds each payment field (0.69398ms)
✔ invoice uses UTF-8 byte length, rejects malformed Unicode and raw paths (0.234117ms)
✔ unknown action refuses (0.100863ms)
✔ default sandbox policy is immutable and canonical (2.764561ms)
✔ invalid configuration rejects: null (0.300097ms)
✔ invalid configuration rejects: [] (0.165746ms)
✔ invalid configuration rejects: {"unknown":true} (0.12568ms)
✔ invalid configuration rejects: {"maxPaymentMinor":null} (0.165845ms)
✔ invalid configuration rejects: {"maxPaymentMinor":0} (0.105447ms)
✔ invalid configuration rejects: {"maxPaymentMinor":1.1} (2.909078ms)
✔ invalid configuration rejects: {"maxPaymentMinor":"1000"} (0.360395ms)
✔ invalid configuration rejects: {"maxPaymentMinor":null} (0.286742ms)
✔ invalid configuration rejects: {"allowedDestinations":[]} (0.420993ms)
✔ invalid configuration rejects: {"allowedDestinations":["x","x"]} (0.291327ms)
✔ invalid configuration rejects: {"allowedDestinations":["../x"]} (0.120896ms)
✔ invalid configuration rejects: {"maxAttachmentBytes":-1} (0.144517ms)
✔ invalid configuration rejects: {"maxAttachmentBytes":262145} (0.090796ms)
✔ each policy dimension changes its commitment (3.879833ms)
✔ allowed actions create exact synthetic effects and consistent receipts (35.868027ms)
✔ over limit records denial and creates no effect (16.562447ms)
✔ wrong destination records denial and creates no effect (13.568054ms)
✔ agent evidence records denial and creates no effect (13.443172ms)
✔ exact payment limit accepted; invoice evidence required (26.096185ms)
✔ same attempt, changed action, second connection and new attempt cannot replay a payment (26.417311ms)
✔ attachment is immutable and byte-bounded (17.704729ms)
✔ real record-write failure rolls back effect and latches unavailable (17.536691ms)
✔ real database lock produces no effect (511.948071ms)
✔ real commit failure returns uncertain and does not retry (514.750111ms)
✔ unknown fields and absent call IDs cannot produce effects (14.756787ms)
✔ record tampering fails self-consistency verification (22.556268ms)
✔ mock-host: exactly two tool registrations, real gate and lifecycle (34.232991ms)
✔ mock-host: unavailable storage fails closed (1.202182ms)
ℹ tests 44
ℹ suites 0
ℹ pass 44
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1330.673197
```

```sh
npm run test:mutations
```

```text

> @dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1 test:mutations
> node scripts/mutations.mjs

KILLED payment-limit
KILLED destination
KILLED invoice-evidence
KILLED attachment-limit
KILLED fault-latch
KILLED invoice-replay-reason
6/6 mutants killed; baseline passed.
```

```sh
npm run package:check
```

```text

> @dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1 package:check
> node scripts/package-check.mjs

{"status":"PASS","files":["LICENSE","README.md","SECURITY.md","openclaw.plugin.json","package.json","src/actions.js","src/config.js","src/gate.js","src/index.js","src/modules/invoice.js","src/modules/payment.js","src/records.js"],"bytes":13511}
```

```sh
npm run test:installed
```

```text

> @dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1 test:installed
> node --test test/installed.test.js

HOST OpenClaw 2026.9.5 (ec9c1a1)
PACKAGE sha512-VAByAVMCcINyCUzCszrMd09ZQwVjlgc0bUBTdhDj7fGBTyonR6EpHV89fHpB2RYy3D4P9sofFutQ0p8yXv7HPQ==
WARNING - Installing plugin from local archive: /tmp/dgr-installed-S80chR/dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz
This source is outside ClawHub review and trust metadata. Only continue if you trust the publisher, package contents, and install source.
Extracting /tmp/dgr-installed-S80chR/dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz…
Plugin manifest id "dgr-sandbox" differs from npm package name "@dgr-ai-labs/openclaw-sandbox"; using manifest id as the config key.
Installing to /tmp/dgr-installed-S80chR/state/extensions/dgr-sandbox…
Installed plugin: dgr-sandbox
Saved for the next Gateway start.

[... MIDDLE CUT: runtime-inspection JSON ...]
INVOKED dgr_invoice_attachment attach-demo simulated ALLOWED
INVOKED dgr_sandbox_payment over-limit denied AMOUNT_LIMIT
INVOKED dgr_sandbox_payment pay-demo simulated ALLOWED
INVOKED dgr_sandbox_payment pay-demo denied DUPLICATE_ATTEMPT
INVOKED dgr_sandbox_payment pay-again denied INVOICE_ALREADY_PAID
INVOKED dgr_invoice_attachment fault-call unavailable STORE_FAILURE
INVOKED dgr_invoice_attachment latched-call unavailable STORE_UNAVAILABLE
GATEWAY_LOG 2026-09-23T20:58:37.520+00:00 [gateway] loading configuration…
2026-09-23T20:58:37.545+00:00 [gateway] resolving authentication…
2026-09-23T20:58:37.548+00:00 [gateway] starting...
2026-09-23T20:58:37.572+00:00 [gateway] shutdown budget at startup: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T20:58:37.675+00:00 [gateway] spawn broker ready pid=224
2026-09-23T20:58:38.537+00:00 [gateway] starting HTTP server...
2026-09-23T20:58:39.517+00:00 [gateway] ready
2026-09-23T20:58:39.694+00:00 [gateway] starting channels and sidecars...
2026-09-23T20:58:39.709+00:00 [gateway] agent model: openai/gpt-6-astra (thinking=medium, fast=off)
2026-09-23T20:58:39.710+00:00 [gateway] http server listening (2 plugins: dgr-sandbox, memory-core; 2.1s)
2026-09-23T20:58:39.710+00:00 [gateway] log file: /tmp/openclaw/openclaw-2026-09-23.log
2026-09-23T20:58:40.063+00:00 [gateway/channels] skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)
2026-09-23T20:58:40.144+00:00 [plugins] memory-core: created managed dreaming cron job.
2026-09-23T20:58:40.147+00:00 [gateway] startup outcomes: internal-hooks=skipped (not-configured); internal-startup-hook=skipped (no-handlers-loaded); gateway-start-hooks=scheduled; gmail-watcher=skipped (hooks-disabled); gmail-model=skipped (not-configured)
2026-09-23T20:58:40.150+00:00 [heartbeat] started
2026-09-23T20:58:40.158+00:00 [gateway] ready
2026-09-23T20:58:40.401+00:00 [admission] closed: stop (SIGTERM)
2026-09-23T20:58:40.402+00:00 [gateway] received SIGTERM; shutting down
2026-09-23T20:58:40.404+00:00 [gateway] shutdown budget at shutdown: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T20:58:40.407+00:00 [gateway] draining active work before stop with timeout 315000ms: rootRequests=2
2026-09-23T20:58:40.687+00:00 [gateway] sidecars.restart-sentinel failed after gateway ready: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:58:40.689+00:00 [main-session-restart-recovery] main-session restart recovery failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:58:40.714+00:00 [cron] failed to enter start root: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:58:40.743+00:00 [gateway] restart sentinel refresh failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:58:40.745+00:00 [gateway] gateway_start hook failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:58:40.756+00:00 [gateway] update check readiness wait failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:58:40.911+00:00 [gateway] active-work drain settled; beginning server close
2026-09-23T20:58:40.934+00:00 [gmail-watcher] gmail watcher stopped
2026-09-23T20:58:40.980+00:00 [shutdown] completed cleanly in 64ms

✔ packed plugin installs and enforces through real OpenClaw HTTP tool dispatch (20276.199234ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 20335.493389
```

```sh
npm pack --dry-run
```

```text
npm notice
npm notice 📦  @dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1
npm notice Tarball Contents
npm notice 11.4kB LICENSE
npm notice 10.2kB README.md
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
npm notice name: @dgr-ai-labs/openclaw-sandbox
npm notice version: 0.1.0-beta.1
npm notice filename: dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz
npm notice package size: 13.5 kB
npm notice unpacked size: 40.0 kB
npm notice shasum: 92454421c4028e2108003f7794338273d8ad347c
npm notice integrity: sha512-VAByAVMCcINyC[...]utQ0p8yXv7HPQ==
npm notice total files: 12
npm notice
dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz
```

```sh
docker build --progress plain -t dgr-openclaw-publication-test .
```

```text
#0 building with "default" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 410B done
#1 DONE 0.0s

#2 [internal] load metadata for docker.io/library/node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6
#2 DONE 0.1s

#3 [internal] load .dockerignore
#3 transferring context: 92B done
#3 DONE 0.0s

#4 [1/4] FROM docker.io/library/node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6
#4 resolve docker.io/library/node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6 0.0s done
#4 DONE 0.0s

#5 [internal] load build context
#5 transferring context: 219.47kB 0.1s done
#5 DONE 0.1s

#6 [2/4] RUN npm install --global --ignore-scripts --omit=optional openclaw@2026.9.5     && openclaw --version
#6 CACHED

#7 [3/4] WORKDIR /plugin
#7 CACHED

#8 [4/4] COPY --chown=node:node . .
#8 DONE 0.4s

#9 exporting to image
#9 exporting layers
#9 exporting layers 0.5s done
#9 exporting manifest sha256:e6afd1647e3a09e5773eda2430e83d1d4414123461029414b76647ccf142cd06 0.0s done
#9 exporting config sha256:1090f0b4816baeb0592f64f71e58b3566dd170c155645b4c4c1a8fc0b64b4179 0.0s done
#9 exporting attestation manifest sha256:06aa158b4d47d6328c2019bb5cc43196a036e3cf91a6c463acfa0f518f4ff20b 0.0s done
#9 exporting manifest list sha256:c26a27f1a271669af72bb1df40b57061d96c2d424b423944cfcbd5ebea6733d0 0.0s done
#9 naming to docker.io/library/dgr-openclaw-publication-test:latest done
#9 unpacking to docker.io/library/dgr-openclaw-publication-test:latest
#9 unpacking to docker.io/library/dgr-openclaw-publication-test:latest 0.3s done
#9 DONE 0.9s
```

```sh
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-publication-test
```

```text
HOST OpenClaw 2026.9.5 (ec9c1a1)
PACKAGE sha512-VAByAVMCcINyCUzCszrMd09ZQwVjlgc0bUBTdhDj7fGBTyonR6EpHV89fHpB2RYy3D4P9sofFutQ0p8yXv7HPQ==
WARNING - Installing plugin from local archive: /tmp/dgr-installed-2b8rYh/dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz
This source is outside ClawHub review and trust metadata. Only continue if you trust the publisher, package contents, and install source.
Extracting /tmp/dgr-installed-2b8rYh/dgr-ai-labs-openclaw-sandbox-0.1.0-beta.1.tgz…
Plugin manifest id "dgr-sandbox" differs from npm package name "@dgr-ai-labs/openclaw-sandbox"; using manifest id as the config key.
Installing to /tmp/dgr-installed-2b8rYh/state/extensions/dgr-sandbox…
Installed plugin: dgr-sandbox
Saved for the next Gateway start.

[... MIDDLE CUT: runtime-inspection JSON ...]
INVOKED dgr_invoice_attachment attach-demo simulated ALLOWED
INVOKED dgr_sandbox_payment over-limit denied AMOUNT_LIMIT
INVOKED dgr_sandbox_payment pay-demo simulated ALLOWED
INVOKED dgr_sandbox_payment pay-demo denied DUPLICATE_ATTEMPT
INVOKED dgr_sandbox_payment pay-again denied INVOICE_ALREADY_PAID
INVOKED dgr_invoice_attachment fault-call unavailable STORE_FAILURE
INVOKED dgr_invoice_attachment latched-call unavailable STORE_UNAVAILABLE
GATEWAY_LOG 2026-09-23T20:58:57.926+00:00 [gateway] loading configuration…
2026-09-23T20:58:57.951+00:00 [gateway] resolving authentication…
2026-09-23T20:58:57.955+00:00 [gateway] starting...
2026-09-23T20:58:57.980+00:00 [gateway] shutdown budget at startup: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T20:58:58.088+00:00 [gateway] spawn broker ready pid=211
2026-09-23T20:58:58.964+00:00 [gateway] starting HTTP server...
2026-09-23T20:58:59.940+00:00 [gateway] ready
2026-09-23T20:59:00.118+00:00 [gateway] starting channels and sidecars...
2026-09-23T20:59:00.133+00:00 [gateway] agent model: openai/gpt-6-astra (thinking=medium, fast=off)
2026-09-23T20:59:00.134+00:00 [gateway] http server listening (2 plugins: dgr-sandbox, memory-core; 2.2s)
2026-09-23T20:59:00.135+00:00 [gateway] log file: /tmp/openclaw/openclaw-2026-09-23.log
2026-09-23T20:59:00.515+00:00 [gateway/channels] skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)
2026-09-23T20:59:00.598+00:00 [plugins] memory-core: created managed dreaming cron job.
2026-09-23T20:59:00.601+00:00 [gateway] startup outcomes: internal-hooks=skipped (not-configured); internal-startup-hook=skipped (no-handlers-loaded); gateway-start-hooks=scheduled; gmail-watcher=skipped (hooks-disabled); gmail-model=skipped (not-configured)
2026-09-23T20:59:00.605+00:00 [heartbeat] started
2026-09-23T20:59:00.615+00:00 [gateway] ready
2026-09-23T20:59:00.840+00:00 [admission] closed: stop (SIGTERM)
2026-09-23T20:59:00.841+00:00 [gateway] received SIGTERM; shutting down
2026-09-23T20:59:00.842+00:00 [gateway] shutdown budget at shutdown: drain=315000ms shutdown=325000ms reserve=10000ms exitMargin=5000ms; source=Gateway stop policy=330000ms
2026-09-23T20:59:00.845+00:00 [gateway] draining active work before stop with timeout 315000ms: rootRequests=2
2026-09-23T20:59:01.145+00:00 [gateway] sidecars.restart-sentinel failed after gateway ready: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:59:01.147+00:00 [main-session-restart-recovery] main-session restart recovery failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:59:01.171+00:00 [cron] failed to enter start root: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:59:01.199+00:00 [gateway] restart sentinel refresh failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:59:01.201+00:00 [gateway] gateway_start hook failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:59:01.212+00:00 [gateway] update check readiness wait failed: GatewayDrainingError: gateway is draining for restart
2026-09-23T20:59:01.348+00:00 [gateway] active-work drain settled; beginning server close
2026-09-23T20:59:01.390+00:00 [gmail-watcher] gmail watcher stopped
2026-09-23T20:59:01.430+00:00 [shutdown] completed cleanly in 52ms

✔ packed plugin installs and enforces through real OpenClaw HTTP tool dispatch (19858.319283ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 19920.599862
```

```sh
npm run check:listing
```

```text

> @dgr-ai-labs/openclaw-sandbox@0.1.0-beta.1 check:listing
> node scripts/check-listing.mjs

PASS: tagline, version, license, category, topics, badges, identity, and full README digest agree.
```

### URL resolver output

Every Markdown URL in README.md and RELEASING.md was fetched with HTTP GET, following redirects. The two 404s are real: files exist locally but have not been integrated into remote main. They are not counted as passes. All links are absolute; repository-file links use /blob/main, while required badge/registry/feedback links use their actual endpoints.

```sh
HTTP GET every Markdown URL in README.md and RELEASING.md
```

```text
200 https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox
200 https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-sandbox/versions/0.1.0-beta.1
200 https://docs.openclaw.ai/clawhub/publishing
200 https://docs.openclaw.ai/plugins
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/CHANGELOG.md
404 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/RELEASING.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/analyzer-evidence.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/architecture.md
404 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/policies.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/docs/release-review.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/discussions
200 https://github.com/DGR-AI-Labs/dgr-openclaw/issues/new/choose
200 https://github.com/DGR-AI-Labs/dgr-openclaw/releases/tag/v0.1.0-beta.1
200 https://github.com/DGR-AI-Labs/dgr-openclaw/security/advisories/new
200 https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Analyzer%20evidence/badge.svg
200 https://github.com/DGR-AI-Labs/dgr-openclaw/workflows/Sandbox%20checks/badge.svg
200 https://img.shields.io/badge/license-Apache--2.0-blue
200 https://img.shields.io/badge/version-0.1.0--beta.1-blue
```

```sh
HTTP GET old README URLs not present in the new pair
```

```text
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/CONTRIBUTING.md
200 https://github.com/DGR-AI-Labs/dgr-openclaw/blob/main/templates/use-case/README.md
```

### Claim-discipline review

| Forbidden item | Disposition |
| --- | --- |
| Operator-proof implication | PASS: README opening and limitations explicitly permit operator changes/bypass. |
| Tamper-proof / immutable / audit-grade language | PASS: none appears in the new README; self-consistency-only is explicit. |
| Governing unrelated tools | PASS: hook and limitations name the two-tool scope. |
| Cedar / Ed25519 / capability tokens / before_tool_call / out-of-process gating | PASS: no such implementation is claimed in README. |
| Latency figure | PASS: 1000 ms is explicitly an admission rule, not call completion time. |
| Present-tense cross-action governance | PASS: Why this exists marks it as future work. |
| Model chooses whether gate runs | PASS: gate is inside the effect-owning tools and does not depend on model consultation. |
| Unpublished / no registry installation | PASS: removed from current copy; required stale sentence deleted from historical log. |
| Provenance implication | PASS: hasProvenance false and source-linked/artifact-only are explicit. |
| Unqualified clean registry verdict | PASS: exact version-clean/benign versus package-pending qualifier and separate evidence links. |

Additional checks: README transcript matches all seven fresh INVOKED lines; README is 147 lines; all three policy presets validate and produce their stated amount/destination/attachment refusals; six isolated negative drift cases (tagline, version, license, category, topics, listing) are rejected; checker passes ESLint; historical block equality verified after the required sentence deletion. These are local checks, not a new CI result.

### NOT ESTABLISHED / omitted

Dedicated listing homepage/license/screenshots/permissions fields and undocumented length limits; exact GitHub About length limit; default host's absolute state path; database deletion by uninstall; dependency-wide assurance; stronger provenance upgrade outcome; bare catalog installation with latestVersion null. The zero-src comparison against current main and two live links remain pending prerequisite integration and publication of this branch. All are disclosed instead of silently invented or repaired through unauthorized actions.

**BUNDLE COMPLETE WITH OMISSIONS**
