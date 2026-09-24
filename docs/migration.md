# Moving from DGR Sandbox

Stop the Gateway and back up its state and configuration, including the old policy values, before switching. Remove the old plugin with `openclaw plugins uninstall dgr-sandbox`; retain the database. Install the new package, restore those policy values under `plugins.entries.dgr-gate.config`, update the plugin allowlist to `dgr-gate`, and restart. Do not load both identities together: the tool names are unchanged. With the same host state root, DGR Gate reuses `dgr-sandbox/sandbox.sqlite`, preserving invoices, payments, decisions and replay history.

