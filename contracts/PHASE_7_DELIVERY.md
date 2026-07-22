# Phase 7 Contract and Backend Delivery

Date: 2026-07-22
Contract version: `1.4.0`

## Readiness

| Module | Contract | Backend API |
|---|---|---|
| Attendance | CONTRACT_READY | API_READY |

## Frozen decisions

- Confirming a schedule creates one absent attendance record for every active booking. The operation is idempotent through the booking one-to-one constraint.
- Check-in at or before the schedule start is `present`; check-in after the start is `late`. The server records the operation time and actor.
- Trainers and higher roles may auto-create records, batch check in and mark leave. Students may view and check in only their own records.
- Batch check-in is atomic and requires every selected student to have an attendance record for the requested schedule.
- Student statistics expose total and attended counts, attendance rate, late count, leave count and the current consecutive-attendance streak.
- Course statistics expose active booking count, arrived count and attendance rate. Cancelled bookings and stale attendance rows are excluded.
- All attendance reads and actions are company-scoped. Out-of-scope objects are not exposed.

## Verification commands

```powershell
python backend/manage.py check
python backend/manage.py makemigrations --check --dry-run
python backend/manage.py test
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
python contracts/scripts/validate_examples.py
python contracts/scripts/check_enum_sync.py
```

The delivery commit is recorded in the final Phase 7 handoff.
