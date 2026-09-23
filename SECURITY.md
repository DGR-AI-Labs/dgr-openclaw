# Security and scope

This pre-release plugin controls only its two synthetic tools. It does not stop an agent using other OpenClaw tools, a malicious plugin, a privileged operator, or someone with database access. Host configuration, OpenClaw, Node and the operating system are trusted. Agent tool arguments are untrusted.

Never use customer data, bank credentials or real payment endpoints with the sandbox. Do not share your Gateway operator token. Report suspected vulnerabilities privately to the repository maintainers through GitHub private vulnerability reporting when enabled; otherwise request a private contact without posting exploit details or sensitive data in a public issue. Private reporting availability must be confirmed before public release.

No auto-update or publication workflow is included. Source review, independent negative controls and exact-host testing are required for a qualified release. Claims are limited to the tested source, host and declared routes.
