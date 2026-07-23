# Phase 10 Contract and Backend Delivery

Date: 2026-07-23
Contract version: `1.8.0`

## Readiness

| Module | Contract | Backend API |
|---|---|---|
| Student feedback | CONTRACT_READY | API_READY |
| Live stage-report preview | CONTRACT_READY | API_READY |

## Feedback decisions

- `class_record` is a ClassRecord primary key. The nested feedback student `id` and feedback list `student_id` filter are `accounts.User` primary keys.
- The authenticated student is always the feedback owner; clients cannot submit company or student fields.
- A ClassRecord belongs to one student, so its OneToOne feedback uniquely identifies that student's feedback even for group schedules.
- Feedback may be created only for a completed ClassRecord owned by the authenticated student in the same tenant.
- Feedback is immutable in Phase 10. PATCH and DELETE are not published and responses expose `is_editable=false`.
- A duplicate returns HTTP 409 with `FEEDBACK_ALREADY_EXISTS`; a draft record returns 409 with `CLASS_RECORD_NOT_COMPLETED`; inaccessible or nonexistent records return 404 with `CLASS_RECORD_NOT_FOUND`.
- Students read only their own feedback. Trainers read feedback for classes they taught. Store managers are store-scoped, company administrators are company-scoped and super administrators may filter by company.
- Feelings are frozen as `easy / moderate / hard` and synchronized through `contracts/enums.json`.
- Feedback photos are deferred. Create requests reject the field and responses return an empty read-only array. No Base64, arbitrary URL, upload, replacement or delete behavior is published.
- There is no submission deadline in Phase 10; eligibility depends on ownership and completed status.

## Report-preview decisions

- `GET /api/reports/` computes a live preview and does not create a Report resource.
- `student_id` is an `accounts.User` primary key. `start` and `end` are inclusive dates; future end dates are rejected and an inclusive range cannot exceed 366 calendar days.
- Students see self, trainers see their primary students, store managers see students in their store, company administrators see their tenant and super administrators can access all tenants.
- Out-of-scope and cross-tenant students return 404 to avoid resource disclosure.
- Training count includes completed ClassRecords only.
- Attendance rate is `(present + late) / active-booking attendance records` in the range, rounded to four decimals and expressed from 0 to 1. It is `null` when no attendance exists.
- Average rating uses non-null ClassRecord completion ratings, rounded to two decimals, and is `null` when no ratings exist.
- Body comparison uses the latest assessment not later than the range start and the latest assessment not later than the range end. Numeric deltas are returned only when two distinct comparable assessments exist.
- Feedback summary includes total, feeling distribution and up to three representative non-empty comments.
- The overlapping training plan selection prefers active, then paused, then the newest completed plan. Plan progress is overall plan progress, not range-only progress.
- Empty data is represented by nulls, empty arrays and stable `data_notes`; missing measurements are never replaced with fabricated zero values.
- Report persistence, draft/generated/published/archived lifecycle, export and sharing are explicitly deferred and no endpoints are published for them.

## Verification

Executed on 2026-07-23:

- `manage.py check`: no issues.
- `makemigrations --check --dry-run`: no changes detected.
- Fresh migration chain and the local development database: all migrations applied, including `feedback.0001_student_feedback_phase_10`.
- Backend regression: 44 tests passed.
- Contract validation: 69 paths, 107 operations, 10 synchronized enum groups and 265 schema-valid examples.
- Live seeded smoke test: student report and feedback endpoints returned `OK`; the demo student had two completed sessions and two feedback records.

Reproduction commands:

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

The permanent Phase 10 tests cover completed-record eligibility, unsupported photos, immutable feedback, stable duplicate and state errors, tenant/role visibility for all five roles, the `/api/reports/` route, eight-session aggregation with a 0.875 attendance ratio, plan summary, body deltas, empty-data semantics, private/no-store response caching, future-date rejection and the inclusive 366-day boundary. Demo data provides linked completed records, feedback, body assessments and an active plan for the five-role integration accounts.
