# Phase 4–5 Contract and Backend Delivery

Date: 2026-07-22  
Contract version: `1.2.0`
Backend commit: `bff1ebe`

## Readiness

| Module | Contract | Backend API |
|---|---|---|
| Course Templates | CONTRACT_READY | API_READY |
| Students | CONTRACT_READY | API_READY |
| Body Assessments | CONTRACT_READY | API_READY |

Frontend `UI_READY / MOCK_READY` is intentionally not claimed by this backend delivery. The frontend must pull the formal contract commit, regenerate types/enums, implement its adapters/mocks/forms/lists and pass `check:all` before Phase 6 starts.

## Startup

Do not reuse a machine-bound committed virtual environment. From `backend/`, create a fresh environment and run:

```powershell
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe manage.py migrate
.venv\Scripts\python.exe manage.py seed_demo_data
.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000
```

Base URL: `http://localhost:8000/api/`  
Health check: `GET http://localhost:8000/api/health/`

## Deterministic demo data

All accounts use password `DemoPass123!`.

| Phone | Role | Tenant/store |
|---|---|---|
| 13910000000 | super_admin | global |
| 13910000001 | company_admin | Demo Company A |
| 13910000002 | store_manager | Demo Company A / Demo Store A |
| 13910000003 | trainer | Demo Company A / Demo Store A |
| 13910000004 | student | Demo Company A / Demo Store A |
| 13910000005 | trainer | Demo Company B / Demo Store B |
| 13910000006 | student | Demo Company B / Demo Store B |

The seed is idempotent and creates two companies, two stores, multiple trainers and students. These records are suitable for cross-tenant list/detail denial tests.

## Frozen business decisions

- Course templates: no global records; token company is authoritative. Search/category/difficulty/status/ordering are supported. `private` capacity must be 1. Cover upload is deferred. Use PATCH `status`; repeated status PATCH is idempotent. DELETE is available to admins while scheduling references do not yet exist; clients should prefer inactive status.
- Students: creation creates both User and profile in one transaction. Phone is globally unique. Company is token-derived. Company admins see company data, managers their store, trainers assigned students only. Attendance-based trainer visibility is deferred because training/attendance relations do not yet exist.
- Membership: `active`, `expired`, `suspended`, `exhausted` are computed. Count cards require positive remaining count; stored cards require positive minor-unit balance; dates and active flag apply to all cards. Renewal/payment/consumption ledgers are excluded.
- Body assessments: `assess_date` is a local date; future dates fail. Height is cm, weight kg, scores integer 1–10, all measurement/score values may be null. Trend supports height/weight/flexibility/core, is date-ascending and omits missing values. One point yields `has_trend=false`.
- Sensitive data: super/company admins, a student's store manager, and assigned trainer may read/update health records. Student self-service is not published. Cross-scope objects are hidden with 404. Photos are read-only until a signed media-resource contract exists. Delete is super/company-admin only and currently physical; audit persistence is deferred and required before broadening the policy.

## Validation commands

```powershell
python backend/manage.py makemigrations --check --dry-run
python backend/manage.py test
python contracts/scripts/bundle_openapi.py
python contracts/scripts/validate_contracts.py
python contracts/scripts/validate_examples.py
python contracts/scripts/check_enum_sync.py
```

The formal backend and contract commit hashes are recorded in the delivery response after Git commits are created.

## Recorded verification output

```text
Backend system check: no issues (0 silenced)
Migration drift check: No changes detected
Empty-database migration: all migrations applied OK
Backend test suite: Ran 32 tests in 34.701s — OK
Runtime health: GET /api/health/ — 200, code=OK, status=healthy
Runtime login: trainer 13910000003 — 200, tenant/store IDs and JWT returned

validate_contracts.py: OpenAPI valid: 76 paths, 114 operations; Enums synchronized: 9; Examples schema-valid: 258
validate_examples.py: OpenAPI valid: 76 paths, 114 operations; Enums synchronized: 9; Examples schema-valid: 258
check_enum_sync.py: OpenAPI valid: 76 paths, 114 operations; Enums synchronized: 9; Examples schema-valid: 258
openapi-typescript 7.13.0: contracts/openapi.yaml generated successfully
```
