# ClawHub crawlability check

Observed 2026-09-24 with curl and a Googlebot user agent, without executing JavaScript. The [listing](https://clawhub.ai/dgr-ai-labs/plugins/openclaw-dgr-gate) returned 97,887 bytes. Both the README-only sentence “Record verification is self-consistency-only.” and the full summary were present in HTML elements outside script/style content. The missing-README placeholder was absent.

## HTTP observations

- Page HEAD: HTTP 200; content-type text/html; charset=utf-8.
- Cache headers: age 0; cache-control public, max-age=0, must-revalidate; x-vercel-cache MISS.
- [robots.txt](https://clawhub.ai/robots.txt): HTTP 200; User-agent * disallows /api/ and /admin/. No rule disallows the listing path. No robots meta tag was present in the fetched HTML.
- [Version-pinned README](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/file?path=README.md&preview=1&version=0.1.1): HTTP 200, with README content.
- [Unversioned README](https://clawhub.ai/api/v1/packages/%40dgr-ai-labs%2Fopenclaw-dgr-gate/file?path=README.md&preview=1): HTTP 200, with README content.

The README is present in server-rendered HTML in this observation. This does not reproduce the external reviewer’s missing-README result and does not establish search indexing or future availability. The API paths remain under the robots exclusion despite their successful HTTP responses.

## Reproduce

```sh
curl -sL 'https://clawhub.ai/dgr-ai-labs/plugins/openclaw-dgr-gate' -A 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' | wc -c
curl -sI 'https://clawhub.ai/dgr-ai-labs/plugins/openclaw-dgr-gate'
```

Use a distinctive string from the document actually served at the time of the check. Byte counts and cache headers can change between requests. Inspect HTML elements separately from serialized script data before claiming server-rendered content.

The earlier diagnosis is preserved in the [source-history record](https://github.com/DGR-AI-Labs/dgr-openclaw/blob/66da14eac6e3088de8c0b2a363d3e7fc213b6d6f/docs/clawhub-listing-diagnosis.md). It is not substituted for this fresh HTTP observation.
