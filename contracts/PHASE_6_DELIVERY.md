# Phase 6 Contract and Backend Delivery

Date: 2026-07-22
Contract version: `1.3.0`

## Readiness

| Module | Contract | Backend API |
|---|---|---|
| Schedules | CONTRACT_READY | API_READY |
| Bookings | CONTRACT_READY | API_READY |

## Frozen decisions

- Recurrence uses ISO weekdays (`1=Monday`, `7=Sunday`) and a duration of 1 to 52 weeks. Recurring creation is atomic and returns `created_count`.
- A room and trainer cannot have two schedules with the same date and start time. Recurring creation preflights both constraints and database constraints protect concurrent writes.
- Schedule list supports company-scoped date range, store, trainer, course category and status filters. Booking totals are returned as `bookings_count`.
- Students self-book with their authenticated user ID. Trainers and managers proxy-book by supplying `student_id`.
- Booking validates published status, deadline, remaining capacity, overlapping student bookings and membership eligibility inside a transaction.
- Count cards consume one use on booking and restore one use on the first successful cancellation. Duplicate bookings and repeated cancellation return conflict responses.
- Booking responses contain nested schedule and student summaries. Students list only their own bookings; trainers list bookings for their schedules.

## Verification commands

```powershell
python backend/manage.py makemigrations --check --dry-run
python backend/manage.py test
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
python contracts/scripts/validate_examples.py
python contracts/scripts/check_enum_sync.py
```

The delivery commit is recorded in the final Phase 6 handoff.
