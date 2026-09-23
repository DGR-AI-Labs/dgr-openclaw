# Architecture: one gate, source-reviewed use-case modules

Status: implementation merged; founder release approval recorded on 2026-09-23. Remaining independent review and publication checks are tracked in [the release review record](release-review.md). Prepared by Codex under founder direction. The first release targets sandbox payment and invoice attachment only.

## How the pieces fit

```text
OpenClaw
   │
   ▼
Plugin registration and strict configuration
   │
   ├── Sandbox payment module
   └── Invoice attachment module
             │
             ▼
       Shared developer gate
       validate → policy → bind action → consume attempt
             │
             ▼
       Local SQLite transaction
       synthetic effect + decision/outcome records
             │
             ▼
       Plain-language result and record
```

This is one repository and one installable package. Use normal JavaScript modules, not Git submodules or downloaded third-party executors. A release has an explicit closed list of supported actions. Installing an update must not silently enable a new capability.

## Use-case modules

Each source-reviewed module supplies:

- A fixed action name and version.
- A strict input schema and independent runtime validation.
- A canonical action representation binding every effect-relevant field.
- Its required policy fields and trusted state/evidence requirements.
- A fixed sandbox effect definition with documented retry and failure behavior.
- Human-readable result descriptions and examples.
- Action-specific tests against shared expected outcomes.

Modules must not bypass the shared gate, obtain database write access through an ungoverned path, mint authority from an identifier, accept an arbitrary callback/path/command, or treat agent-supplied claims as trusted evidence.

Keep the first release's registration explicit. The contract describes source contribution boundaries, not an arbitrary runtime plugin API. Adding a module changes reviewed source and requires a new qualified release.

## Shared components

The shared gate owns policy evaluation, action binding, duplicate-attempt checks, storage transactions, decision records, failure behavior and dispatch. Both tools use the same sequence. A use-case module cannot replace a denial or report success after recording fails.

Host configuration owns the policy and sandbox state location. Agent arguments contain only proposed action data. The simulator stores synthetic payments and bounded invoice content in the same database as its records, allowing atomic sandbox effects and records. This guarantee does not apply to external APIs or file writes.

The design is a separate JavaScript/SQLite developer implementation inspired by DGR's existing contract work. It is not a wrapper over the verified Rust core or the private runtime, and inherits none of their acceptance claims. Founder authoring disposition was given in the project conversation; independent implementation review and release acceptance remain separate.

## First two modules

| Module | User-facing action | Sandbox effect | Explicit exclusion |
|---|---|---|---|
| Payment | Request a USD payment within configured limits | A simulated payment row | No bank connection or real funds |
| Invoice attachment | Attach bounded synthetic invoice content to a logical invoice identifier | Bounded content in the sandbox database | No arbitrary filesystem path or authentic-invoice claim |

These modules do not control unrelated OpenClaw tools. A person with privileged host or database access can change the environment. Ledger self-consistency is not operator-proof authenticity.

## Contributor workflow

1. Propose a concrete workflow, benefit, destination and threat boundary before implementing a new effect.
2. Agree scope and maintainer ownership; new action classes are not automatically approved.
3. Supply synthetic examples and independent expected accept/deny/failure cases.
4. Add the module through explicit source registration and the shared gate.
5. Pass the common conformance suite and action-specific tests, including installed-host and negative controls where applicable.
6. Complete required independent human review and analyzer-evidence review before release acceptance.

Document unsupported routes, supported versions and failure-after-effect behavior. Do not equate test volume with enforcement proof. Use accurate human/agent contribution provenance.

## What to avoid initially

- Git submodules, a second repository per use case, dynamic module discovery or auto-loading community code.
- A separate policy engine or independent ledger in each action module.
- A generic execute-anything tool or callbacks passed in agent arguments.
- Claiming a stable public SDK before the first two modules have qualified the contract.
- Expanding the initial financial workflow scope solely because an implementation is contributed.

The third independently contributed use case should test whether these boundaries are sufficient. Refine the contributor API using that evidence before promising broad compatibility.

## Architecture acceptance

The implementation must demonstrate that both tools pass through the same gate, malformed requests and missing policy deny, attempts cannot be replayed, unknown action versions refuse, effects and records have the declared transactional behavior, and a contributor can identify the finite touchpoints for a new module. See the candidate validation summary in README.md for observations and remaining review requirements.
