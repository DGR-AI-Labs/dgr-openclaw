# Add a use case

New here? Follow the [contributor quick start](docs/contributor-quick-start.md) for setup, a small exercise, test commands, and feedback.

Start with the [use-case template](templates/use-case/README.md). Submit a proposal describing the workflow and expected benefit before adding a new effect. The first version supports only sandbox payment and invoice attachment.

Use normal source modules in this repository, not Git submodules. Each module defines a strict action contract. The shared gate owns policy, persistence and effects; never add an independent allow path, arbitrary executable callback, untrusted evidence assertion or agent-selected filesystem path.

Expected source touchpoints are the module definition, explicit action validation/canonicalization, shared policy/effect handling, plugin manifest, configuration, documentation and tests. Changing one without the others is incomplete. This is not yet a stable third-party SDK.

Run `npm test`, `npm run test:mutations`, `npm run package:check` and the Docker installed-host suite. Tests must establish allowed and denied outcomes by inspecting effects, not just returned messages. Cover malformed input, exact limit boundaries, missing evidence, replay, changed payloads, database failures and uncertain outcomes. Use synthetic fixtures only.

Changes require maintainer scope agreement and review appropriate to their consequence. Enforcement changes require independent human and non-author cross-model review, required analyses and adversarial evidence. Disclose actual human/agent authorship. Do not claim a review or independent rerun you did not perform. The founder approves release; a contributor does not approve their own enforcement change.

Public contributions must contain no credentials, private project records, personal data or customer material. New modules require a named maintainer and supported-host statement. The project may decline scope expansion even when code is available.
