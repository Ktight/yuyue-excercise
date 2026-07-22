# Phase 8 Contract and Backend Delivery

Date: 2026-07-22
Contract version: `1.5.0`

## Readiness

| Module | Contract | Backend API |
|---|---|---|
| Class records | CONTRACT_READY | API_READY |
| Class media | CONTRACT_READY | API_READY |
| Class templates | CONTRACT_READY | API_READY |

Training plans remain a Phase 9 contract and API concern. Phase 8 includes only the nullable relationship and model extension point needed by class records.

## Frozen decisions

- A class record is created from exactly one present/late attendance. Student, trainer, store, schedule, company and class date are derived server-side.
- Trainers may create and edit only records for schedules they teach. Company administrators, store managers and super administrators have company-scoped read access.
- Draft records transition once to `completed`; completed records are immutable.
- Pose sequences contain exactly `warmup`, `main` and `cooldown`; every pose requires a non-empty name and positive duration.
- Batch creation targets all present/late attendances in one trainer-owned schedule. Common content is merged with validated per-student overrides in one atomic transaction.
- Media metadata is nested under a class record. Only the owning trainer writes it; staff roles have company-scoped read access.
- Uploads accept images and videos up to 10MB. Local development uses `MEDIA_ROOT`; image thumbnails are JPEG files bounded to 300x300. Production storage is configured through Django `STORAGES`.
- Trainers read company-shared templates and their own personal templates. Super and company administrators manage templates and all related resources must belong to one company.

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

Delivery verification on 2026-07-22 applied the complete migration chain to a clean in-memory database, reported no model drift or Django system-check issues, and passed all 36 backend tests. Contract verification passed 77 paths, 118 operations, 9 synchronized enums and 265 schema-validated examples.

Phase 8 integration coverage includes single and eight-student batch creation, JSON round trips and shape validation, student/date/trainer filtering, tenant and role permissions, nested media, template visibility, upload and thumbnail access, state transition, completed-record immutability and full rollback on conflict.
