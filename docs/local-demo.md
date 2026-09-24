# Local container demo and source installation

### No-profile container demo

Run from this repository. Docker downloads dependencies during the build. The runs use disposable state, no host-directory mounts, and no model credentials.

```sh
docker build -t dgr-openclaw-test .
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test npm test
docker run --rm --network none --cap-drop ALL --security-opt no-new-privileges dgr-openclaw-test
```

### Build from source

```sh
npm pack
openclaw plugins install ./dgr-ai-labs-openclaw-dgr-gate-0.1.1.tgz --force --accept-capabilities
```

Use `--force` only for the local archive you reviewed. The published version is `0.1.0`; these documentation edits are staged for a future release.

