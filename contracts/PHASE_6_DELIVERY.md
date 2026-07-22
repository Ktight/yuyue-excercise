# Phase 6 Contract and Backend Delivery

Date: 2026-07-22
Original contract version: `1.3.0`; student discovery alignment: `1.6.0`

## Readiness

| Module | Contract | Backend API |
|---|---|---|
| Schedules | CONTRACT_READY | API_READY |
| Bookings | CONTRACT_READY | API_READY |

## Frozen decisions

- Recurrence uses ISO weekdays (`1=Monday`, `7=Sunday`) and a duration of 1 to 52 weeks. Recurring creation is atomic and returns `created_count`.
- A room and trainer cannot have two schedules with the same date and start time. Recurring creation preflights both constraints and database constraints protect concurrent writes.
- Schedule list supports company-scoped date range, store, trainer, course category and status filters. `bookings_count` counts active reservations only and `remaining_capacity` is returned explicitly.
- Students use the same schedule list endpoint, but server-side filtering exposes only tenant-owned, published, future, before-deadline schedules with capacity, membership eligibility, no time conflict and no previous booking.
- Personal booking status remains sourced from `GET /api/bookings/`; discovery does not duplicate it because schedules with any previous booking by the student are excluded.
- Students self-book with their authenticated `accounts.User` ID. Trainers and managers proxy-book by supplying `student_id`, which is also an `accounts.User` ID and never a `StudentProfile` ID.
- Booking validates published status, deadline, remaining capacity, overlapping student bookings and membership eligibility inside a transaction.
- Count cards consume one use on booking and restore one use on the first successful cancellation. Duplicate bookings and repeated cancellation return conflict responses.
- Booking responses contain nested schedule and student summaries. Students list only their own bookings; trainers list bookings for their schedules.

## Verification commands

```powershell
Push-Location backend
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
Pop-Location
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
python contracts/scripts/validate_examples.py
python contracts/scripts/check_enum_sync.py
```

The 1.6.0 alignment passed all 40 backend tests with no model drift or Django system-check issues. Contract validation passed 76 paths, 117 operations, 9 synchronized enums and 265 schema-validated examples.

`seed_demo_data` is intentionally restricted to `DEBUG=True` environments because its deterministic integration accounts use a documented shared password.
