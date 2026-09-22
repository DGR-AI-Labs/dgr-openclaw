# Quick start: try the sandbox safely

Try an early DGR plugin for OpenClaw and tell us whether it works on your machine. This is a test candidate, not a production release.

**No real money moves. No bank, Gmail, cloud account, real invoice, API key, or model subscription is needed.** The plugin stores fictional invoice text and simulated payment records inside a disposable container. It controls only its own two tools.

Want to propose or build another scenario? Use the separate [contributor quick start](contributor-quick-start.md). You can give feedback on either track or both.

## What you need

- Git.
- Docker installed and running with Linux-container support. Docker Desktop works on Windows and macOS; Docker Engine also works on Linux.
- Internet access for the initial build to download the test environment.

The container supplies Node and OpenClaw. You do not need to install or configure them separately. Do not connect your existing OpenClaw profile, credentials, or host folders.

## Run the test

Open a terminal (PowerShell on Windows is fine). Copy each command below and wait for it to finish. If one fails, stop and send us the error.

```sh
git clone --branch sandbox-plugin https://github.com/DGR-AI-Labs/dgr-openclaw.git
cd dgr-openclaw
git checkout 5639e82926796b6f7cd62494a500223b772cfd6a
docker build -t dgr-openclaw-test .
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test npm test
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test
```

The checkout pins the previously tested implementation. Git's “detached HEAD” message is expected. This quick-start page was added afterward, so keep it open in your browser. If you already have a folder with this repository's name, use a fresh parent folder before cloning.

The initial build can take several minutes. The two test runs have networking disabled and use no host-directory mounts.

## What should happen

- The first test run reports **44 tests passed, zero failed**.
- The second run installs the plugin into a real OpenClaw host and runs an automated integration test. It should finish successfully with zero failed tests. Its seven tool calls are exercised within the test, not reported as seven separate test cases.

That integration test attaches fictional invoice text, refuses an over-limit simulated payment, allows an in-policy simulated payment, refuses duplicate payments, and checks that database failure stops further actions. You do not need to supply an invoice or payment source. No model conversation or real external service is involved.

Warnings alone are not necessarily failures. If you are unsure about the final result, send us the last screen of output with any sensitive information removed.

## Send back one short reply

Copy whichever fits:

> WORKED — OS: ___. Both test commands passed. Instructions: clear / confusing at ___.

> DID NOT WORK — OS: ___. Failed command: ___. Error: ___ (or attach a sanitized screenshot).

> COULD NOT START — OS: ___. Missing prerequisite or unclear step: ___.

Reply to the person who sent you this guide, or comment on the [review pull request](https://github.com/DGR-AI-Labs/dgr-openclaw/pull/1). Please do not include credentials or personal data. Testing does not require approving the code.

## Optional: try a conversation

This is separate from the account-free test above. If you already use OpenClaw, the [installation and configuration guide](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/5639e82926796b6f7cd62494a500223b772cfd6a/README.md) explains how to try sample invoice and simulated payment requests in a disposable profile. It requires the documented OpenClaw and Node versions and your own configured model, with its usual charges. Keep all data synthetic.

## Cleanup

The test containers remove themselves when they exit. To remove the local test image afterward:

```sh
docker image rm dgr-openclaw-test
```

Docker may retain build cache; this command does not delete other images or caches.
