# Contributor quick start: test the contribution experience

Help us answer a second question: **can someone new understand how to propose and test another scenario?** You can do this independently of testing the two default tools.

The current extension points are ordinary source modules plus explicit changes to the pre-execution gate. There is no automatic module loader or stable third-party SDK. A copied template does not register a new tool.

## Prerequisites

- For implementation and executable tests: Git and Docker with Linux-container support, plus internet for the initial build. A documentation-only proposal needs only repository access and a GitHub account.
- A GitHub account to open an issue or pull request. Fork the public repository if you do not have write access.
- Basic JavaScript and test-writing knowledge for code changes. Node is supplied by the Docker image; a local editor is enough.
- Synthetic data only. No bank, Gmail, payment-provider credentials, or real external effects.

For implementation or executable testing, first complete the [default-scenario quick start](quick-start.md). Keep its tested checkout separate from your contribution checkout. You may submit a proposal without Docker or running tests; state what you read and which tests you did not run.

## 1. Start from main

The implementation is merged into `main`. In your own clone or fork, fetch main and create a contribution branch from it.

```sh
git fetch origin
git switch --create contribution/my-scenario origin/main
```

For a fork, ensure its main branch matches upstream main before starting. Record your starting commit with `git rev-parse HEAD` in your proposal.

Read [CONTRIBUTING](../CONTRIBUTING.md), the [architecture](architecture.md), and the [use-case template](../templates/use-case/README.md).

## 2. Pick a small exercise

**Simplest contribution:** add an independently checked test or improve an unclear instruction for an existing invoice/payment scenario. Explain what was missing and the behavior you expect.

**New use case:** copy the use-case template into a GitHub issue and describe a synthetic scenario, such as a simulated expense reimbursement with a fixed policy limit. This is a proposal, not an existing feature. Specify allowed and denied examples, the exact local effect, duplicate behavior, failure behavior, and the files you expect to change. Obtain maintainer scope agreement before implementing the new effect.

Tell us if the template or architecture is insufficient to write that proposal. That is useful contribution-test feedback even without code.

## 3. Implement an agreed scenario

Use the existing invoice and payment modules as examples. List all required touchpoints:

- Module schema and fixed tool identity.
- Explicit input validation and canonical action encoding.
- Shared policy, transactional effect handling and decision records.
- Host registration, manifest, configuration and package file allowlist as applicable.
- Tests and plain-English documentation.

All effects must pass through the pre-execution gate. Do not add another allow path, dynamic executable callback, arbitrary filesystem path, or external service. A new module file alone is not an integration.

## 4. Test your edited source

Rebuild after edits so the container includes your changes:

```sh
docker build -t dgr-openclaw-contribution .
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-contribution npm test
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-contribution npm run test:mutations
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-contribution npm run package:check
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-contribution
```

The unit-test command currently lists test files explicitly. If you add a test file, include it in the test command; merely creating it will not run it. Update package expectations for agreed new shipped files. Extend the installed-host test to invoke the new tool through the packed plugin: the existing integration test covers only the two default tools.

Cover allowed and denied outcomes, malformed inputs, boundaries, missing evidence, duplicate attempts and business actions, persistence failures, and restart behavior. Inspect actual stored effects rather than only response messages. Add a deliberate-bug control that proves your new tests detect a disabled relevant check. See the template for the complete test matrix.

## 5. Share results

Open a draft pull request targeting **main**. Link your proposal, state the starting commit, describe actual changes and authorship, and distinguish tests you ran from tests still planned. Do not include credentials, personal data, or private DGR material.

Contributor feedback can be this short:

> CONTRIBUTION WORKED — I proposed/added ___. Tests actually run: ___. Instructions were clear / unclear at ___. Proposal or PR: ___.

> CONTRIBUTION BLOCKED — I tried ___. I got stuck at ___. Missing documentation or error: ___.

An issue/proposal is enough to test the design experience. A working new module requires maintainer review, the applicable independent reviews and analyses, and release approval; opening a PR does not expand released coverage.
