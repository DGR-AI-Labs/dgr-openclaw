# ClawHub listing field map

This is founder review material, not a publication action. README.md is authoritative for copy; package.json and openclaw.plugin.json constrain identity and declarations. The author-controlled descriptive surface is small: package description, README body, one manifest category, and discovery topics. Identity, compatibility and release provenance remain constrained metadata, not free marketing copy.

The current published artifact is 0.1.0-beta.1 at 4cec6796a4f0a08a0c5f1d817d1e1f9321a333c7. The table below describes this branch's proposed README-derived values. A new version and founder approval are required to publish the changed bytes. Do not treat the table as a statement that the registry already contains the new summary.

## Confirmed field set and limits

The recon's §10 was checked against the [publishing docs](https://docs.openclaw.ai/clawhub/publishing), and these upstream sources at 826992bd72b9f9ab09254dc43551facdf94cb07b:

- [Package schema](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/packages/schema/src/packages.ts): lines 48–86 and 408–423.
- [Renderer](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/src/routes/plugins/$name.tsx): README 393; summary/topics 1182–1187; compatibility/configuration 1245–1312; repository/date/type 1542–1566; title 1705.
- [Summary extraction](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/convex/lib/packageRegistry.ts): 463–466 prefers package.json description.
- [Version renderer](https://github.com/openclaw/clawhub/blob/826992bd72b9f9ab09254dc43551facdf94cb07b/src/components/PluginVersionsPanel.tsx): 280–299 and 354, version/date/distribution tags/changelog.

The README body is the confirmed long-description surface. Publish it whole, including own-tools/operator limits. There is no separate promotional excerpt. The hook and summary are identical and retain their scope qualifier.

<!-- fields:start -->
| Field | Exact copy/value | README source |
| --- | --- | --- |
| name | `"@dgr-ai-labs/openclaw-sandbox"` | Install (literal scoped package name) |
| displayName | `"DGR Sandbox"` | Package metadata and authorship |
| summary | `"Evidence-gated simulated payments for the two tools this sandbox guards: a stored synthetic invoice is required before payment."` | Opening hook; package.json description |
| readme | `"README.md; sha256:17a7216fa88a557e1466ad763f9a06f31b02a84e6a8a9b04b295cae29b858aaa"` | Entire README, including limits and scan qualifier |
| family | `"code-plugin"` | Package metadata and authorship |
| version | `"0.1.0-beta.1"` | Package metadata and authorship |
| license (README only) | `"Apache-2.0"` | Package metadata and authorship; not a dedicated registry field |
| categories | `["developer-tools"]` | Package metadata and authorship |
| topics | `[]` | Package metadata and authorship; proposed, not asserted remote state |
| distTags | `["beta"]` | Package metadata and authorship |
| sourceRepo | `"https://github.com/DGR-AI-Labs/dgr-openclaw"` | Package metadata and authorship |
<!-- fields:end -->

| Additional confirmed rendered surface | Current value and README source | Defining source / limit |
| --- | --- | --- |
| Compatibility | OpenClaw 2026.9.5; plugin API >=2026.9.5 <2026.9.6; minimum Gateway/build/SDK 2026.9.5. README Install states supported host; the exact API range is manifest-derived, not new listing copy. | package.json:33–38; registry-generated compatibility panel; string length NOT ESTABLISHED |
| Configuration panel | maxPaymentMinor, allowedDestinations, maxAttachmentBytes; README Starter policy | openclaw.plugin.json:18–48; all optional; field description length NOT ESTABLISHED |
| Publisher | dgr-ai-labs, scoped name in README Install | Registry owner from inspect; not an added claim of official status |
| Version changelog | Published response has empty string; no new changelog copy proposed | Registry inspection; string limit NOT ESTABLISHED |
| Icon | Unset; no assets/icon.png in package; no README image selected | Confirmed bundled PNG maximum 512 KiB; dimension limits NOT ESTABLISHED |
| MCP/skills panels | Empty in inspected manifest summary; no README capability claim | Conditional renderer; not populated |
| Artifact details, dates, statistics | Registry generated; no copied stale size, hash or popularity values | Renderer; no new README claims |
| Scan/validation display | Published version clean/benign, package pending; README Registry scan | Separate registry values; not an author-set verdict |
| Install snippet | Generated from package name; README Install also supplies the explicit beta command | Registry latestVersion is null; unqualified default installability NOT ESTABLISHED |

Confirmed topic limits: at most 5, each at most 48 characters. One plugin category may be declared. Summary maximum, dedicated license/homepage/screenshots/permissions fields, and an independent long-description input are **NOT ESTABLISHED** and left unset. The summary toggle at 220 characters is a UI threshold, not a publishing limit. Apache-2.0 above is checked and rendered in README, not a claimed dedicated license field.

The exact manifest contracts are `{"tools":["dgr_sandbox_payment","dgr_invoice_attachment"]}` (openclaw.plugin.json:12–17). README What it does and limitations name those same two tools. A standalone contracts/permissions listing panel is NOT ESTABLISHED; do not invent one or describe absent permissions as a permission-free runtime.

## Drift check and release sync

Run `npm run check:listing`. To regenerate after a reviewed README edit, run `npm run check:listing -- --write`, then run the check again. It rejects tagline, version, license, category, topics, badge and whole-README drift. It does not authenticate or publish. Unknown registry string limits are not invented by the check.

README and this field map must ship in the same commit. Follow RELEASING.md: review source → check and dry run → founder publication of the same clean commit → registry review → pinned install verification → announcement. Neither runtime refactor nor README edits are a license to republish 0.1.0-beta.1. Keep source linkage distinct from provenance attestation.
