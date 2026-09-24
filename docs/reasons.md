# Results and reasons

These are all 13 reason codes. Validation and policy checks run in source order; the first applicable refusal wins. A storage failure can replace the normal result.

| Code | Status | Trigger |
| --- | --- | --- |
| `ALLOWED` | `simulated` | Valid action passes policy, replay and evidence checks; transaction commits |
| `MISSING_CALL_ID` | `denied` | Call ID is not a string, is empty, or exceeds 1024 characters |
| `DUPLICATE_ATTEMPT` | `denied` | Call ID's attempt digest already exists |
| `INVALID_ACTION` | `denied` | Unknown action, malformed input, extra fields, invalid Unicode or unsupported currency |
| `AMOUNT_LIMIT` | `denied` | Payment exceeds configured per-action amount |
| `DESTINATION_NOT_ALLOWED` | `denied` | Destination is outside the configured list |
| `INVOICE_REQUIRED` | `denied` | Payment has no stored invoice |
| `INVOICE_ALREADY_PAID` | `denied` | Invoice already has a payment |
| `ATTACHMENT_LIMIT` | `denied` | Invoice text exceeds the configured UTF-8 byte limit |
| `INVOICE_ALREADY_ATTACHED` | `denied` | Invoice ID already exists |

Fail-closed paths:

| Code | Status | Trigger |
| --- | --- | --- |
| `DEADLINE_EXCEEDED` | `denied` or `unavailable` | Admission deadline reached before effect insertion, or later before commit; the latter rolls back and latches unavailable |
| `STORE_UNAVAILABLE` | `unavailable` | Gate/plugin already stopped or faulted, or storage setup/execution threw at the tool boundary |
| `STORE_FAILURE` | `unavailable` or `uncertain` | Transaction work failed; if commit had started, its durable outcome may be ambiguous |

Do not automatically retry `uncertain` results. Stop the Gateway and inspect state before recovery. A missing call ID is not recorded; committed decisions have receipts. Other failures may have no receipt.
