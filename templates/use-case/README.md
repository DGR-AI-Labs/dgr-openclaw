# New use-case starter

Copy this outline into your proposal. This is a documentation template, not a working module or permission to add new actions.

## Proposed module structure

```text
src/modules/<use-case>.js     fixed name, version, schema and description
test/<use-case>.test.js       independent expected effects and refusals
```

Additional source paths need explicit scope agreement. Also identify necessary edits to the shared action validator, canonical encoding, configuration/policy, transactional effect handling, manifest and user instructions. Do not create a separate authorization engine.

## Fill in

- User problem and concrete workflow:
- Financial action and why existing native controls are insufficient:
- Supported host/version and fixed destination:
- Strict input fields, bounds, unknown-field behavior and action version:
- Policy limits and default-deny behavior:
- Trusted evidence source (never an agent assertion):
- Exact synthetic effect, retry behavior and failure-after-effect outcome:
- All alternate routes and explicit exclusions:
- Maintainer and compatibility ownership:
- Human/agent authorship:

## Required tests

| Scenario | Expected decision | Independently observed effect |
|---|---|---|
| Valid request | Allowed/simulated | Exactly the declared synthetic effect |
| Limit edge and one beyond | Explicit expected outcomes | Beyond limit has none |
| Missing/unknown/malformed fields | Denied | None |
| Missing required evidence | Denied | None |
| Same attempt, including changed payload | Denied | No second effect |
| New attempt for same business action | Defined policy | No accidental duplicate |
| Persistence failure | Unavailable or uncertain as specified | Inspect durable state |
| Restart and stale state | Defined outcome | No automatic recovery execution |
| Decision/argument substitution | Denied | None |
| Disabled check in isolated mutant | Test must fail | Test detects synthetic effect |
| Installed host invocation | Matches contract | Actual packed module exercised |

Describe tests actually run separately from planned tests. A mocked host is not an installed-host result. External-effect integrations require a separate contract for credentials, atomicity limits and ambiguous outcomes; the SQLite simulator's guarantees cannot simply be copied.
