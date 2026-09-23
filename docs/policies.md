# Synthetic sandbox policy examples

These examples change only the three keys defined in `src/config.js:6–9` and validated at `src/config.js:19–36`. Paste an object into `plugins.entries.dgr-sandbox.config`, keeping other configuration. Restart the selected Gateway after a policy change. They are proposed examples, not additional built-in presets.

The schema declares `maxPaymentMinor` integer 1–1000000, default 1000; `maxAttachmentBytes` integer 1–262144, default 4096; `allowedDestinations` a unique array of 1–32 strings matching `^[A-Za-z0-9_-]{1,64}$`, default `["sandbox-vendor"]`. Unknown keys throw `DGR configuration must contain only documented policy fields.` (`src/config.js:20–21`). Invalid values throw `DGR configuration has invalid limits or destinations.` (:26–32).

## Strict

```json
{"maxPaymentMinor":100,"allowedDestinations":["sandbox-vendor"],"maxAttachmentBytes":256}
```

A valid 101-cent payment yields `AMOUNT_LIMIT`; a valid payment to `other` within the amount cap yields `DESTINATION_NOT_ALLOWED`; 257 ASCII attachment bytes yield `ATTACHMENT_LIMIT`. These examples isolate one failing rule at a time (`src/gate.js:69–74`).

## Demo (the actual defaults)

```json
{"maxPaymentMinor":1000,"allowedDestinations":["sandbox-vendor"],"maxAttachmentBytes":4096}
```

A 2000-cent payment yields `AMOUNT_LIMIT`. A within-cap payment to `other` yields `DESTINATION_NOT_ALLOWED`. 4097 ASCII attachment bytes yield `ATTACHMENT_LIMIT`. These defaults are literal values at `src/config.js:23–25`.

## Permissive, still bounded

```json
{"maxPaymentMinor":100000,"allowedDestinations":["sandbox-vendor","sandbox-backup"],"maxAttachmentBytes":65536}
```

A 100001-cent payment yields `AMOUNT_LIMIT`; a within-cap payment to `other` yields `DESTINATION_NOT_ALLOWED`; 65537 ASCII attachment bytes yield `ATTACHMENT_LIMIT`. This preset does not bypass invoice evidence, replay, schema or storage checks.

## Rules shared by all three

A valid within-policy payment without a stored invoice yields `INVOICE_REQUIRED` (`src/gate.js:71`). Reusing a call ID yields `DUPLICATE_ATTEMPT` (:65–66); a new attempt for a paid invoice yields `INVOICE_ALREADY_PAID` (:72); another attachment for the same ID yields `INVOICE_ALREADY_ATTACHED` (:74). An extra `trustedEvidence` field yields `INVALID_ACTION` (`src/actions.js:7–11`; `test/gate.test.js:36–42`). Amounts are USD cents, not a daily cap. Invoice content is synthetic evidence, not human approval. Store failures and ambiguous commits retain the behaviors in README; no preset makes the operator subject to the gate.
