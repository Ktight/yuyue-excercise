# API Contracts

`src/**` is the modular source of truth. `openapi.yaml` is generated and must never be edited by hand. The current frozen version is `1.5.0`; module readiness is recorded in `status.json`.

Public response formats are frozen:

- success: `{code, message, data}`
- paginated data: `{items, page, page_size, total}`
- error: `{code, message, errors, request_id}`
- authentication: Bearer JWT with `access_token` and `refresh_token`

Rebuild and validate from the repository root:

```powershell
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
python contracts/scripts/validate_examples.py
python contracts/scripts/check_enum_sync.py
```

The frontend consumes `contracts/openapi.yaml` and `contracts/enums.json`. It must regenerate types and enums after pulling a contract commit; generated files must not be hand-edited.

## Phase 4–5 frozen decisions

- Course templates are always company-scoped. Global templates do not exist.
- Course cover upload is deferred; `cover_image` is response-only.
- Course activation/deactivation uses idempotent `PATCH status`.
- Student creation atomically creates a `role=student` User; company comes from the authenticated token.
- Trainer visibility is limited to `primary_trainer=self`. Attendance-based visibility is deferred until Phase 6 models exist.
- Membership status is computed from active flag, dates and count/stored balance. Payment, renewal and consumption ledgers are outside Phase 5.
- Body measurements use cm, kg and integer scores from 1 through 10. Missing trend values are omitted, never converted to zero.
- Body photo upload is deferred; `photos` is response-only.
- Sensitive health fields are available only through staff-only tenant-scoped endpoints. Cross-tenant and out-of-scope object access returns 404; sensitive values must not be echoed in logs/errors.
- Body assessment physical deletion is company/super-admin only. Phase 5 does not yet have a persistent audit-log model; audit retention must be added before widening deletion rights.

See `PHASE_8_DELIVERY.md` for the latest class-record, class-media and class-template contract decisions and verification evidence.
