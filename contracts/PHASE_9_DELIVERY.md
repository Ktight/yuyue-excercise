# Phase 9 Contract and Backend Delivery

Date: 2026-07-23
Contract version: `1.7.0`

## Readiness

| Module | Contract | Backend API |
|---|---|---|
| Training plans | CONTRACT_READY | API_READY |
| Class-record plan linking | CONTRACT_READY | API_READY |

## Frozen implemented decisions

- `TrainingPlan.student` and training-plan `student_id` filters use a `StudentProfile` primary key. ClassRecord, booking and attendance student fields continue to use an `accounts.User` primary key.
- The authenticated trainer supplies the StudentProfile and plan content; `trainer` and `company` are inferred server-side. Trainers can read and write only plans they created. Company administrators and store managers have company-scoped read access. Super administrators may optionally select `company_id`.
- Plan dates are inclusive. `end_date` must not precede `start_date`; no maximum plan duration is enforced.
- Create requests explicitly supply `status`. Supported states are `active`, `completed` and `paused`. A serializer-level rule rejects a second active plan for one StudentProfile; this is intentionally not a database uniqueness constraint.
- Plan list filters are `student_id`, `trainer_id` and `status`, with standard `page / page_size` pagination and newest-created ordering.
- `POST complete` changes active or paused plans to completed and conflicts when repeated. `POST pause` changes active plans to paused and conflicts for paused or completed plans. Partial update can also change writable plan fields, including status.
- An owning trainer may delete a plan. Linked ClassRecords are retained and their nullable plan relationship is cleared by the database foreign-key behavior.
- Progress counts only linked ClassRecords with `status=completed`. Total target sessions are `ceil(inclusive_days / 7) * target_frequency_per_week`; the percentage is capped at 100 and rounded to two decimal places.
- Plan detail includes `linked_records` with `linked_records_page / linked_records_page_size` pagination. The default page size is 20 and the maximum is 100.
- A ClassRecord create request may provide a TrainingPlan ID in `plan`. If `plan` is omitted, the student's active plan is linked automatically. Explicit `plan: null` opts out. Explicit plans must belong to the same company and Student User.
- `session_number` is one plus the count of existing records linked to the same plan; an unlinked record starts at one.
- ClassRecord responses expose `plan` as nullable `{id, title, progress}`. The owning trainer may call `POST unlink` for draft or completed records; repeating unlink returns 409.

## Explicitly deferred

- Stages and stage items are not part of the Phase 9 model or API.
- No activate action or standalone progress endpoint is published.
- Average rating and rating trend are available to backend service code but are not public TrainingPlan response fields.
- Student self-service training-plan access remains draft and is not promoted by this delivery.

## Verification commands

```powershell
Push-Location backend
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py migrate
python manage.py test
Pop-Location
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
python contracts/scripts/validate_examples.py
python contracts/scripts/check_enum_sync.py
```

Delivery verification applies the migration chain on an isolated database, exercises plan creation and duplicate-active rejection, tenant and role visibility, 12-week progress, automatic ClassRecord linking, plan-relative session numbering, detail pagination, completion, pause and unlink, and runs the complete backend and contract suites.
