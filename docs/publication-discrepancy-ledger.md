# Content claim traceability

The detailed earlier claim-by-claim comparison is preserved in the [source-history record](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/66da14eac6e3088de8c0b2a363d3e7fc213b6d6f/docs/publication-discrepancy-ledger.md). Consult that fixed revision when auditing earlier wording; do not treat its commands or observations as current installation instructions.

## Current mechanism and boundaries

- The pre-execution gate is called by the two registered demo tools: src/index.js:18–26 and src/actions.js:2–4.
- Policy is read from host configuration: src/index.js:11 and src/config.js:19–36. No policy-secrecy guarantee is implemented.
- Agent-supplied extra fields are refused: src/actions.js:7–11. Payment requires stored invoice state: src/gate.js:71.
- Synthetic effects and decision records share the local transaction: src/gate.js:63–102. Missing call IDs and failure paths can be unrecorded: src/gate.js:54–55,94–107.
- The 1000 ms constant governs admission checks: src/gate.js:9,75,94–97. It does not guarantee completion time.
- Verification is self-consistency-only; completeness needs an external trust anchor: src/records.js:17–18. The operator can change the environment.
- No existing user tools are governed. Broader action coverage is a proposal for future source-reviewed modules.

## Copy discipline

Use one mechanism name: pre-execution gate. Describe determinism, evidence requirements and fail-closed handling as properties. Keep the two-demo-tool limit near the opening. Contribution credits acknowledge work; they do not certify claims. Registry observations, when needed for an audit, must be tied to the exact package/version and kept distinct from build provenance.
