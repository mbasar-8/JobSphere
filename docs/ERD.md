# JobSphere

## Entity Relationship Diagram (ERD)

---

# 1. Database Overview

JobSphere uses **PostgreSQL** as its primary relational database management system.

The database is designed to support a modern recruitment platform where candidates can build professional profiles, upload resumes, search and apply for jobs, while recruiters can manage companies, publish job postings, and review applicants through a secure and scalable system.

The database follows relational database design principles to ensure maintainability, consistency, scalability, and long-term extensibility.

The schema is intentionally designed around the business requirements of **JobSphere V1**, while allowing future versions to introduce additional functionality without requiring major architectural changes.

---

# 2. Database Design Principles

The following principles guide the database design.

## 2.1 Separation of Concerns

Authentication data, candidate information, recruiter information, company data, job data, and application data are stored in separate tables.

Each table has a single responsibility and should not contain unrelated business information.

---

## 2.2 Referential Integrity

Foreign key constraints ensure that every relationship references a valid parent record.

Child records cannot exist without their required parent records.

---

## 2.3 Data Consistency

Business rules are enforced through:

- Primary Keys
- Foreign Keys
- Unique Constraints
- Check Constraints
- Database Transactions

---

## 2.4 Historical Data Preservation

Historical recruitment data must never be lost.

Instead of physical deletion:

- Jobs are archived.
- Applications are preserved.
- Application history is preserved.
- Resume snapshots remain unchanged.

---

## 2.5 Scalability

The database structure is designed to support future versions of JobSphere.

Future enhancements may include:

- Multiple recruiters per company
- Multiple resumes
- Company teams
- Internal messaging
- Notifications
- Premium subscriptions

The V1 schema intentionally remains simple while keeping future expansion possible.

---

# 3. Entity List

The JobSphere V1 database consists of the following entities.

---

## 3.1 Authentication Module

| Entity            | Responsibility                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| users             | Stores authentication credentials, account roles, account status, and email verification information. |
| otp_verifications | Stores securely hashed OTP records for email verification and password reset operations.              |

---

## 3.2 Candidate Module

| Entity             | Responsibility                                  |
| ------------------ | ----------------------------------------------- |
| candidate_profiles | Stores candidate profile information.           |
| resumes            | Stores uploaded resume information.             |
| experiences        | Stores work experience records.                 |
| education          | Stores educational background.                  |
| skills             | Stores available platform skills.               |
| candidate_skills   | Connects candidates with their selected skills. |

---

## 3.3 Recruiter Module

| Entity             | Responsibility                        |
| ------------------ | ------------------------------------- |
| recruiter_profiles | Stores recruiter profile information. |
| companies          | Stores company information.           |
| industries         | Stores industry categories.           |

---

## 3.4 Job Module

| Entity | Responsibility                              |
| ------ | ------------------------------------------- |
| jobs   | Stores job postings published by companies. |

---

## 3.5 Application Module

| Entity                     | Responsibility                                |
| -------------------------- | --------------------------------------------- |
| applications               | Stores candidate job applications.            |
| application_status_history | Stores historical application status changes. |

---

## 3.6 Saved Jobs Module

| Entity     | Responsibility               |
| ---------- | ---------------------------- |
| saved_jobs | Stores candidate saved jobs. |

---

## 3.7 Location Module

| Entity    | Responsibility              |
| --------- | --------------------------- |
| countries | Stores supported countries. |
| cities    | Stores supported cities.    |

---

# 4. Entity Specifications

## 4.1 Users

Stores the authentication and account information for every platform user.

| Column            | Data Type    | Constraints      |
| ----------------- | ------------ | ---------------- |
| id                | BIGINT       | PK, Identity     |
| email             | VARCHAR(255) | UNIQUE, NOT NULL |
| password          | VARCHAR(255) | NOT NULL         |
| role              | VARCHAR(20)  | NOT NULL         |
| status            | VARCHAR(30)  | NOT NULL         |
| email_verified_at | TIMESTAMPTZ  | NULL             |
| created_at        | TIMESTAMPTZ  | NOT NULL         |
| updated_at        | TIMESTAMPTZ  | NOT NULL         |

**Design Notes**

- The users table stores authentication information only.
- Candidate personal information is stored in `candidate_profiles`.
- Recruiter personal information is stored in `recruiter_profiles`.
- User names are collected during profile completion after email verification.
- Public registration supports only Candidate and Recruiter accounts.

**Supported Role Values**

- candidate
- recruiter
- admin

**Supported Status Values**

- pending_verification
- active
- suspended
- deactivated

**Important Constraints**

- Email addresses must be unique.
- Passwords must always be securely hashed.
- Public registration must never create administrator accounts.
- Only active users may access protected APIs.
- Authentication data must remain independent from profile information.

---

## 4.2 OTP Verifications

Stores securely hashed OTP records used for email verification and password reset.

| Column         | Data Type    | Constraints  | Description                    |
| -------------- | ------------ | ------------ | ------------------------------ |
| id             | BIGINT       | PK, Identity | Unique OTP record              |
| user_id        | BIGINT       | FK, NOT NULL | References users.id            |
| otp_hash       | VARCHAR(255) | NOT NULL     | Securely hashed OTP            |
| purpose        | VARCHAR(30)  | NOT NULL     | Verification purpose           |
| expires_at     | TIMESTAMPTZ  | NOT NULL     | OTP expiration time            |
| attempts       | SMALLINT     | DEFAULT 0    | Incorrect attempts             |
| consumed_at    | TIMESTAMPTZ  | NULL         | Successful verification time   |
| invalidated_at | TIMESTAMPTZ  | NULL         | Previous OTP invalidation time |
| created_at     | TIMESTAMPTZ  | NOT NULL     | Creation timestamp             |
| updated_at     | TIMESTAMPTZ  | NOT NULL     | Last update timestamp          |

**Supported Purpose Values**

- email_verification
- password_reset

**OTP Lifecycle Rules**

An OTP is considered valid only when:

- consumed_at IS NULL
- invalidated_at IS NULL
- expires_at has not passed
- attempts < 5

When a new OTP is generated for the same user and purpose:

- The previous active OTP must be invalidated.
- OTP invalidation and creation must occur inside the same database transaction.

When verification succeeds:

- consumed_at is populated.
- The OTP can never be reused.

**Important Constraints**

- OTP values must never be stored in plain text.
- OTPs must contain exactly six numeric digits.
- OTPs expire after ten minutes.
- Maximum incorrect attempts: five.
- OTP generation, invalidation, and verification must be handled atomically using database transactions.

---

**End of ERD – Part 1**

---

## 4.3 Candidate Profiles

Stores personal and professional information for candidate accounts.

Each candidate account can have exactly one candidate profile.

| Column        | Data Type    | Constraints          | Description                |
| ------------- | ------------ | -------------------- | -------------------------- |
| id            | BIGINT       | PK, Identity         | Unique profile identifier  |
| user_id       | BIGINT       | FK, UNIQUE, NOT NULL | References users.id        |
| full_name     | VARCHAR(150) | NOT NULL             | Candidate's full name      |
| profile_photo | VARCHAR(255) | NULL                 | Profile photo storage path |
| headline      | VARCHAR(180) | NULL                 | Professional headline      |
| about         | TEXT         | NULL                 | Professional summary       |
| phone         | VARCHAR(30)  | NULL                 | Contact number             |
| gender        | VARCHAR(20)  | NULL                 | Candidate gender           |
| date_of_birth | DATE         | NULL                 | Date of birth              |
| city_id       | BIGINT       | FK, NULL             | References cities.id       |
| linkedin_url  | VARCHAR(255) | NULL                 | LinkedIn profile           |
| github_url    | VARCHAR(255) | NULL                 | GitHub profile             |
| portfolio_url | VARCHAR(255) | NULL                 | Personal portfolio         |
| created_at    | TIMESTAMPTZ  | NOT NULL             | Record creation time       |
| updated_at    | TIMESTAMPTZ  | NOT NULL             | Last update time           |

**Design Notes**

- Every candidate owns one profile.
- Profile information is collected after successful email verification.
- Authentication data is intentionally separated from profile data.
- Optional information may remain NULL until profile completion.

**Important Constraints**

- One candidate profile per user.
- Only users with the `candidate` role may own candidate profiles.
- city_id must reference an existing city.
- Profile information should be editable after account creation.

---

## 4.4 Resumes

Stores uploaded resume information.

JobSphere V1 supports one active resume per candidate.

| Column        | Data Type    | Constraints          | Description                      |
| ------------- | ------------ | -------------------- | -------------------------------- |
| id            | BIGINT       | PK, Identity         | Resume identifier                |
| candidate_id  | BIGINT       | FK, UNIQUE, NOT NULL | References candidate_profiles.id |
| file_path     | VARCHAR(255) | NOT NULL             | Storage path                     |
| original_name | VARCHAR(255) | NOT NULL             | Original uploaded filename       |
| uploaded_at   | TIMESTAMPTZ  | NOT NULL             | Upload timestamp                 |
| created_at    | TIMESTAMPTZ  | NOT NULL             | Record creation                  |
| updated_at    | TIMESTAMPTZ  | NOT NULL             | Last update                      |

**Design Notes**

- Only one active resume exists in V1.
- Applications always use a resume snapshot.
- Replacing a resume must not modify previously submitted applications.

**Important Constraints**

- One resume per candidate.
- Resume files must be stored securely.
- Only supported file types may be uploaded.
- Resume replacement must preserve historical application records.

---

## 4.5 Experiences

Stores candidate work experience.

A candidate may have multiple experience records.

| Column          | Data Type    | Constraints   | Description                      |
| --------------- | ------------ | ------------- | -------------------------------- |
| id              | BIGINT       | PK, Identity  | Experience identifier            |
| candidate_id    | BIGINT       | FK, NOT NULL  | References candidate_profiles.id |
| company_name    | VARCHAR(150) | NOT NULL      | Company                          |
| job_title       | VARCHAR(150) | NOT NULL      | Position                         |
| employment_type | VARCHAR(30)  | NULL          | Employment type                  |
| location        | VARCHAR(150) | NULL          | Workplace location               |
| start_date      | DATE         | NOT NULL      | Start date                       |
| end_date        | DATE         | NULL          | End date                         |
| is_current      | BOOLEAN      | DEFAULT FALSE | Current position                 |
| description     | TEXT         | NULL          | Responsibilities                 |
| created_at      | TIMESTAMPTZ  | NOT NULL      | Created                          |
| updated_at      | TIMESTAMPTZ  | NOT NULL      | Updated                          |

**Important Constraints**

- A candidate may have multiple experiences.
- end_date must be NULL when is_current is TRUE.
- end_date cannot be earlier than start_date.
- employment_type must use supported values.

---

## 4.6 Education

Stores educational background.

A candidate may have multiple education records.

| Column           | Data Type    | Constraints  | Description                      |
| ---------------- | ------------ | ------------ | -------------------------------- |
| id               | BIGINT       | PK, Identity | Education identifier             |
| candidate_id     | BIGINT       | FK, NOT NULL | References candidate_profiles.id |
| institution_name | VARCHAR(180) | NOT NULL     | Institution                      |
| degree           | VARCHAR(120) | NOT NULL     | Degree                           |
| field_of_study   | VARCHAR(150) | NULL         | Major                            |
| start_date       | DATE         | NULL         | Start date                       |
| end_date         | DATE         | NULL         | Graduation date                  |
| grade            | VARCHAR(50)  | NULL         | GPA/CGPA/Grade                   |
| description      | TEXT         | NULL         | Additional information           |
| created_at       | TIMESTAMPTZ  | NOT NULL     | Created                          |
| updated_at       | TIMESTAMPTZ  | NOT NULL     | Updated                          |

**Important Constraints**

- Multiple education records are allowed.
- Institution and degree are required.
- end_date cannot be earlier than start_date.
- Optional academic information may remain NULL.

---

## 4.7 Skills

Stores master skill data used throughout the platform.

| Column     | Data Type    | Constraints      |
| ---------- | ------------ | ---------------- |
| id         | BIGINT       | PK, Identity     |
| name       | VARCHAR(100) | UNIQUE, NOT NULL |
| created_at | TIMESTAMPTZ  | NOT NULL         |
| updated_at | TIMESTAMPTZ  | NOT NULL         |

**Design Notes**

- Skills are platform-managed.
- Duplicate skill names are not allowed.
- Skill names should be normalized before insertion.

**Important Constraints**

- Skill names must be unique.
- Different capitalization should not create duplicate skills.

---

## 4.8 Candidate Skills

Implements the many-to-many relationship between candidates and skills.

| Column       | Data Type   | Constraints  |
| ------------ | ----------- | ------------ |
| id           | BIGINT      | PK, Identity |
| candidate_id | BIGINT      | FK, NOT NULL |
| skill_id     | BIGINT      | FK, NOT NULL |
| created_at   | TIMESTAMPTZ | NOT NULL     |
| updated_at   | TIMESTAMPTZ | NOT NULL     |

**Design Notes**

- A candidate may have multiple skills.
- A skill may belong to multiple candidates.
- This table exists only to manage the relationship.

**Important Constraints**

- candidate_id and skill_id together must be unique.
- Duplicate candidate-skill relationships are not allowed.
- Deleting a candidate profile removes its related candidate skills.

---

**End of ERD – Part 2**

---

## 4.9 Recruiter Profiles

Stores personal and professional information for recruiter accounts.

Each recruiter account can have exactly one recruiter profile.

| Column        | Data Type    | Constraints          | Description                         |
| ------------- | ------------ | -------------------- | ----------------------------------- |
| id            | BIGINT       | PK, Identity         | Unique recruiter profile identifier |
| user_id       | BIGINT       | FK, UNIQUE, NOT NULL | References users.id                 |
| full_name     | VARCHAR(150) | NOT NULL             | Recruiter's full name               |
| phone         | VARCHAR(30)  | NULL                 | Contact number                      |
| designation   | VARCHAR(120) | NULL                 | Job title or designation            |
| profile_photo | VARCHAR(255) | NULL                 | Profile photo storage path          |
| created_at    | TIMESTAMPTZ  | NOT NULL             | Record creation timestamp           |
| updated_at    | TIMESTAMPTZ  | NOT NULL             | Last update timestamp               |

**Design Notes**

- Every recruiter owns one recruiter profile.
- Profile information is completed after email verification.
- Authentication data remains separated from recruiter information.

**Important Constraints**

- One recruiter profile per user.
- Only users with the `recruiter` role may own recruiter profiles.
- Profile information may be updated at any time.

---

## 4.10 Industries

Stores predefined industry categories used throughout the platform.

| Column     | Data Type    | Constraints      | Description               |
| ---------- | ------------ | ---------------- | ------------------------- |
| id         | BIGINT       | PK, Identity     | Industry identifier       |
| name       | VARCHAR(120) | UNIQUE, NOT NULL | Industry name             |
| slug       | VARCHAR(140) | UNIQUE, NOT NULL | URL-friendly identifier   |
| created_at | TIMESTAMPTZ  | NOT NULL         | Record creation timestamp |
| updated_at | TIMESTAMPTZ  | NOT NULL         | Last update timestamp     |

**Design Notes**

- Industries are managed by administrators.
- Companies select an industry from this table.
- Industries are shared across the entire platform.

**Important Constraints**

- Industry names must be unique.
- Industry slugs must be unique.
- Industries referenced by companies must not be physically deleted.

---

## 4.11 Companies

Stores company information managed by recruiters.

In JobSphere V1, one recruiter can own one company.

A company can publish multiple job postings.

| Column       | Data Type    | Constraints          | Description                      |
| ------------ | ------------ | -------------------- | -------------------------------- |
| id           | BIGINT       | PK, Identity         | Company identifier               |
| recruiter_id | BIGINT       | FK, UNIQUE, NOT NULL | References recruiter_profiles.id |
| industry_id  | BIGINT       | FK, NOT NULL         | References industries.id         |
| company_name | VARCHAR(180) | NOT NULL             | Official company name            |
| slug         | VARCHAR(200) | UNIQUE, NOT NULL     | URL-friendly company identifier  |
| logo         | VARCHAR(255) | NULL                 | Company logo                     |
| website      | VARCHAR(255) | NULL                 | Official website                 |
| email        | VARCHAR(255) | NULL                 | Company email                    |
| phone        | VARCHAR(30)  | NULL                 | Company phone                    |
| description  | TEXT         | NULL                 | Company overview                 |
| city_id      | BIGINT       | FK, NULL             | References cities.id             |
| company_size | VARCHAR(30)  | NULL                 | Number of employees              |
| created_at   | TIMESTAMPTZ  | NOT NULL             | Record creation timestamp        |
| updated_at   | TIMESTAMPTZ  | NOT NULL             | Last update timestamp            |

**Supported Company Size Values**

- 1-10
- 11-50
- 51-200
- 201-500
- 501-1000
- 1000+

**Design Notes**

- Every company belongs to one recruiter.
- A recruiter can manage only one company in V1.
- Future versions may support multiple recruiters per company.

**Important Constraints**

- recruiter_id must be unique.
- industry_id must reference an existing industry.
- city_id references an existing city.
- Company slug must be unique.
- Historical companies must not be physically deleted.

---

## 4.12 Jobs

Stores job postings published by companies.

A company can publish multiple jobs.

| Column               | Data Type     | Constraints      | Description             |
| -------------------- | ------------- | ---------------- | ----------------------- |
| id                   | BIGINT        | PK, Identity     | Job identifier          |
| company_id           | BIGINT        | FK, NOT NULL     | References companies.id |
| title                | VARCHAR(180)  | NOT NULL         | Job title               |
| slug                 | VARCHAR(220)  | UNIQUE, NOT NULL | URL slug                |
| description          | TEXT          | NOT NULL         | Job description         |
| responsibilities     | TEXT          | NULL             | Responsibilities        |
| requirements         | TEXT          | NULL             | Requirements            |
| benefits             | TEXT          | NULL             | Benefits                |
| employment_type      | VARCHAR(30)   | NOT NULL         | Employment type         |
| workplace_type       | VARCHAR(20)   | NOT NULL         | Workplace type          |
| city_id              | BIGINT        | FK, NULL         | References cities.id    |
| salary_type          | VARCHAR(20)   | NOT NULL         | Salary type             |
| salary_min           | DECIMAL(12,2) | NULL             | Minimum salary          |
| salary_max           | DECIMAL(12,2) | NULL             | Maximum salary          |
| currency             | VARCHAR(3)    | NULL             | ISO currency code       |
| salary_period        | VARCHAR(20)   | NULL             | Salary period           |
| status               | VARCHAR(20)   | NOT NULL         | Job status              |
| application_deadline | DATE          | NULL             | Application deadline    |
| published_at         | TIMESTAMPTZ   | NULL             | Publish timestamp       |
| created_at           | TIMESTAMPTZ   | NOT NULL         | Record creation         |
| updated_at           | TIMESTAMPTZ   | NOT NULL         | Last update             |

**Supported Employment Types**

- full_time
- part_time
- contract
- internship
- freelance

**Supported Workplace Types**

- onsite
- remote
- hybrid

**Supported Salary Types**

- fixed
- range
- negotiable
- not_disclosed

**Supported Job Status**

- draft
- published
- closed
- archived

**Design Notes**

- Jobs belong to companies.
- Only published jobs are publicly visible.
- Historical jobs are archived instead of deleted.

**Important Constraints**

- Salary values cannot be negative.
- salary_min cannot exceed salary_max.
- Published jobs must contain complete required information.
- Closed or archived jobs cannot receive new applications.
- Jobs must not be physically deleted during normal operations.

---

**End of ERD – Part 3**

---

## 4.13 Applications

Stores job applications submitted by candidates.

A candidate can apply to multiple jobs, and each job can receive multiple applications.

| Column               | Data Type    | Constraints  | Description                      |
| -------------------- | ------------ | ------------ | -------------------------------- |
| id                   | BIGINT       | PK, Identity | Application identifier           |
| candidate_id         | BIGINT       | FK, NOT NULL | References candidate_profiles.id |
| job_id               | BIGINT       | FK, NOT NULL | References jobs.id               |
| resume_snapshot_path | VARCHAR(255) | NOT NULL     | Resume used during application   |
| cover_letter         | TEXT         | NULL         | Candidate cover letter           |
| status               | VARCHAR(30)  | NOT NULL     | Current application status       |
| applied_at           | TIMESTAMPTZ  | NOT NULL     | Application submission time      |
| created_at           | TIMESTAMPTZ  | NOT NULL     | Record creation timestamp        |
| updated_at           | TIMESTAMPTZ  | NOT NULL     | Last update timestamp            |

**Supported Status Values**

- applied
- under_review
- shortlisted
- interview
- hired
- rejected
- withdrawn

**Design Notes**

- A candidate may apply to multiple jobs.
- A job may receive multiple applications.
- Every application permanently stores the resume used during submission.
- Historical application records must always be preserved.

**Important Constraints**

- The combination of `candidate_id` and `job_id` must be unique.
- A candidate cannot apply to the same job more than once.
- Resume snapshots must never change after submission.
- Applications must not be physically deleted.
- Candidates cannot apply after the application deadline.
- Only published jobs may receive applications.

---

## 4.14 Application Status History

Stores every application status change.

This table provides a complete timeline of each application.

| Column         | Data Type   | Constraints  | Description                   |
| -------------- | ----------- | ------------ | ----------------------------- |
| id             | BIGINT      | PK, Identity | History identifier            |
| application_id | BIGINT      | FK, NOT NULL | References applications.id    |
| status         | VARCHAR(30) | NOT NULL     | Status after change           |
| changed_by     | BIGINT      | FK, NULL     | References users.id           |
| note           | TEXT        | NULL         | Optional recruiter/admin note |
| created_at     | TIMESTAMPTZ | NOT NULL     | Change timestamp              |

**Design Notes**

- Every status update creates a new history record.
- History records are append-only.
- History must never be edited or deleted during normal application operations.

**Important Constraints**

- Every record belongs to an existing application.
- Status values must use supported application statuses.
- `changed_by` may be NULL for system-generated events.
- Application status updates and history creation must occur inside the same database transaction.

---

## 4.15 Saved Jobs

Stores jobs saved by candidates for future reference.

This table implements the many-to-many relationship between candidates and jobs.

| Column       | Data Type   | Constraints  | Description                      |
| ------------ | ----------- | ------------ | -------------------------------- |
| id           | BIGINT      | PK, Identity | Saved job identifier             |
| candidate_id | BIGINT      | FK, NOT NULL | References candidate_profiles.id |
| job_id       | BIGINT      | FK, NOT NULL | References jobs.id               |
| created_at   | TIMESTAMPTZ | NOT NULL     | Save timestamp                   |

**Design Notes**

- Candidates can save multiple jobs.
- A job can be saved by multiple candidates.
- Saving a job does not create an application.

**Important Constraints**

- The combination of `candidate_id` and `job_id` must be unique.
- Duplicate saved jobs are not allowed.
- Removing a saved job deletes only the relationship.
- Saving a job must never submit an application.

---

## 4.16 Countries

Stores the list of supported countries.

| Column     | Data Type    | Constraints      | Description               |
| ---------- | ------------ | ---------------- | ------------------------- |
| id         | BIGINT       | PK, Identity     | Country identifier        |
| name       | VARCHAR(120) | UNIQUE, NOT NULL | Country name              |
| iso2_code  | CHAR(2)      | UNIQUE, NOT NULL | ISO 3166-1 Alpha-2        |
| iso3_code  | CHAR(3)      | UNIQUE, NOT NULL | ISO 3166-1 Alpha-3        |
| created_at | TIMESTAMPTZ  | NOT NULL         | Record creation timestamp |
| updated_at | TIMESTAMPTZ  | NOT NULL         | Last update timestamp     |

**Design Notes**

- Countries are platform-managed master data.
- Cities reference countries through foreign keys.

**Important Constraints**

- Country names must be unique.
- ISO codes must be unique.
- Countries referenced by cities must not be physically deleted.

---

## 4.17 Cities

Stores supported cities.

Each city belongs to one country.

| Column     | Data Type    | Constraints  | Description               |
| ---------- | ------------ | ------------ | ------------------------- |
| id         | BIGINT       | PK, Identity | City identifier           |
| country_id | BIGINT       | FK, NOT NULL | References countries.id   |
| name       | VARCHAR(120) | NOT NULL     | City name                 |
| created_at | TIMESTAMPTZ  | NOT NULL     | Record creation timestamp |
| updated_at | TIMESTAMPTZ  | NOT NULL     | Last update timestamp     |

**Design Notes**

- A country can have multiple cities.
- Candidate profiles, companies, and jobs may reference cities.

**Important Constraints**

- (`country_id`, `name`) must be unique.
- Cities referenced by existing records must not be physically deleted.
- Country information should always be obtained through the relationship rather than duplicated elsewhere.

---

# 5. Entity Relationships

This section defines the relationships between all JobSphere entities.

### 5.1 Authentication Relationships

| Parent Entity | Child Entity      | Relationship | Foreign Key               |
| ------------- | ----------------- | ------------ | ------------------------- |
| users         | otp_verifications | One-to-Many  | otp_verifications.user_id |

A user can have multiple OTP records for different purposes or verification attempts.

---

### 5.2 Candidate Relationships

| Parent Entity      | Child Entity       | Relationship | Foreign Key                   |
| ------------------ | ------------------ | ------------ | ----------------------------- |
| users              | candidate_profiles | One-to-One   | candidate_profiles.user_id    |
| candidate_profiles | resumes            | One-to-One   | resumes.candidate_id          |
| candidate_profiles | experiences        | One-to-Many  | experiences.candidate_id      |
| candidate_profiles | education          | One-to-Many  | education.candidate_id        |
| candidate_profiles | candidate_skills   | One-to-Many  | candidate_skills.candidate_id |
| skills             | candidate_skills   | One-to-Many  | candidate_skills.skill_id     |

The `candidate_skills` table implements the many-to-many relationship between candidates and skills.

---

### 5.3 Recruiter Relationships

| Parent Entity      | Child Entity       | Relationship | Foreign Key                |
| ------------------ | ------------------ | ------------ | -------------------------- |
| users              | recruiter_profiles | One-to-One   | recruiter_profiles.user_id |
| recruiter_profiles | companies          | One-to-One   | companies.recruiter_id     |
| industries         | companies          | One-to-Many  | companies.industry_id      |

---

### 5.4 Job Relationships

| Parent Entity | Child Entity | Relationship | Foreign Key     |
| ------------- | ------------ | ------------ | --------------- |
| companies     | jobs         | One-to-Many  | jobs.company_id |
| cities        | jobs         | One-to-Many  | jobs.city_id    |

---

### 5.5 Application Relationships

| Parent Entity      | Child Entity               | Relationship | Foreign Key                               |
| ------------------ | -------------------------- | ------------ | ----------------------------------------- |
| candidate_profiles | applications               | One-to-Many  | applications.candidate_id                 |
| jobs               | applications               | One-to-Many  | applications.job_id                       |
| applications       | application_status_history | One-to-Many  | application_status_history.application_id |
| users              | application_status_history | One-to-Many  | application_status_history.changed_by     |

---

### 5.6 Saved Job Relationships

| Parent Entity      | Child Entity | Relationship | Foreign Key             |
| ------------------ | ------------ | ------------ | ----------------------- |
| candidate_profiles | saved_jobs   | One-to-Many  | saved_jobs.candidate_id |
| jobs               | saved_jobs   | One-to-Many  | saved_jobs.job_id       |

---

### 5.7 Location Relationships

| Parent Entity | Child Entity       | Relationship | Foreign Key                |
| ------------- | ------------------ | ------------ | -------------------------- |
| countries     | cities             | One-to-Many  | cities.country_id          |
| cities        | candidate_profiles | One-to-Many  | candidate_profiles.city_id |
| cities        | companies          | One-to-Many  | companies.city_id          |
| cities        | jobs               | One-to-Many  | jobs.city_id               |

---

**End of ERD – Part 4**

---

# 6. Foreign Key and Deletion Policies

JobSphere preserves historical recruitment data while maintaining referential integrity.

Physical deletion should be extremely rare. Normal application workflows must use status changes instead of deleting records.

---

## 6.1 Deletion Policy Principles

The following foreign key deletion behaviors are used throughout the system.

- **CASCADE** → Remove dependent child records.
- **RESTRICT** → Prevent deletion while dependent records exist.
- **SET NULL** → Remove the relationship while preserving the child record.

Normal business operations should deactivate or archive records instead of permanently deleting them.

---

## 6.2 Foreign Key Deletion Rules

| Parent Entity      | Child Entity               | On Delete | Reason                                                |
| ------------------ | -------------------------- | --------- | ----------------------------------------------------- |
| users              | otp_verifications          | CASCADE   | OTP records have no value after user deletion.        |
| users              | candidate_profiles         | RESTRICT  | Candidate profile must remain linked to its account.  |
| users              | recruiter_profiles         | RESTRICT  | Recruiter profile must remain linked to its account.  |
| candidate_profiles | resumes                    | RESTRICT  | Resume records are managed separately.                |
| candidate_profiles | experiences                | CASCADE   | Experiences belong only to the candidate.             |
| candidate_profiles | education                  | CASCADE   | Education belongs only to the candidate.              |
| candidate_profiles | candidate_skills           | CASCADE   | Relationship records are dependent.                   |
| skills             | candidate_skills           | RESTRICT  | Prevent deleting skills currently in use.             |
| recruiter_profiles | companies                  | RESTRICT  | Preserve company ownership history.                   |
| industries         | companies                  | RESTRICT  | Companies depend on industries.                       |
| companies          | jobs                       | RESTRICT  | Preserve historical jobs.                             |
| countries          | cities                     | RESTRICT  | Prevent deleting countries that still contain cities. |
| cities             | candidate_profiles         | SET NULL  | Candidate location is optional.                       |
| cities             | companies                  | SET NULL  | Company location is optional.                         |
| cities             | jobs                       | SET NULL  | Job location is optional.                             |
| candidate_profiles | applications               | RESTRICT  | Preserve application history.                         |
| jobs               | applications               | RESTRICT  | Preserve submitted applications.                      |
| applications       | application_status_history | RESTRICT  | Preserve complete application timeline.               |
| users              | application_status_history | SET NULL  | Preserve history even if actor is removed.            |
| candidate_profiles | saved_jobs                 | CASCADE   | Saved jobs depend on candidate profile.               |
| jobs               | saved_jobs                 | CASCADE   | Saved jobs disappear if job is permanently removed.   |

---

## 6.3 Account Deactivation

Normal users should never be physically deleted.

Instead:

- Candidate accounts become **deactivated**.
- Recruiter accounts become **deactivated**.
- Historical applications remain.
- Historical companies remain.
- Historical jobs remain.

---

## 6.4 Job Preservation

Jobs must never be deleted during normal operations.

Instead:

- Draft
- Published
- Closed
- Archived

are used to manage the job lifecycle.

---

## 6.5 Permanent Data Purging

Permanent deletion is reserved for controlled maintenance operations only.

Such operations must evaluate every foreign key dependency before removing records.

---

# 7. Database Constraints and Indexes

The following constraints maintain data integrity and improve query performance.

---

## 7.1 Primary Keys

Every table must contain:

- BIGINT Primary Key
- Auto-generated Identity column

Primary keys must never be NULL.

---

## 7.2 Unique Constraints

| Entity             | Unique Column(s)       |
| ------------------ | ---------------------- |
| users              | email                  |
| candidate_profiles | user_id                |
| recruiter_profiles | user_id                |
| resumes            | candidate_id           |
| skills             | name                   |
| candidate_skills   | candidate_id, skill_id |
| industries         | name                   |
| industries         | slug                   |
| companies          | recruiter_id           |
| companies          | slug                   |
| jobs               | slug                   |
| applications       | candidate_id, job_id   |
| saved_jobs         | candidate_id, job_id   |
| countries          | name                   |
| countries          | iso2_code              |
| countries          | iso3_code              |
| cities             | country_id, name       |

---

## 7.3 Check Constraints

### Users

Role must be one of:

- candidate
- recruiter
- admin

Status must be one of:

- pending_verification
- active
- suspended
- deactivated

---

### OTP

- attempts ≥ 0
- attempts ≤ 5

---

### Experience

- end_date ≥ start_date
- end_date must be NULL when is_current = TRUE

---

### Education

- end_date ≥ start_date

---

### Jobs

employment_type must be:

- full_time
- part_time
- contract
- internship
- freelance

workplace_type must be:

- onsite
- remote
- hybrid

salary_type must be:

- fixed
- range
- negotiable
- not_disclosed

status must be:

- draft
- published
- closed
- archived

salary_min must never be greater than salary_max.

Salary values cannot be negative.

---

### Applications

Status must be one of:

- applied
- under_review
- shortlisted
- interview
- hired
- rejected
- withdrawn

A candidate cannot apply to the same job twice.

---

## 7.4 Indexing Strategy

The following indexes should exist.

| Table                      | Indexed Columns      |
| -------------------------- | -------------------- |
| users                      | email                |
| otp_verifications          | user_id, purpose     |
| candidate_profiles         | user_id              |
| candidate_profiles         | city_id              |
| resumes                    | candidate_id         |
| experiences                | candidate_id         |
| education                  | candidate_id         |
| candidate_skills           | skill_id             |
| recruiter_profiles         | user_id              |
| companies                  | industry_id          |
| companies                  | city_id              |
| jobs                       | company_id           |
| jobs                       | status               |
| jobs                       | city_id              |
| jobs                       | employment_type      |
| jobs                       | workplace_type       |
| jobs                       | application_deadline |
| applications               | candidate_id         |
| applications               | job_id               |
| applications               | status               |
| application_status_history | application_id       |
| application_status_history | changed_by           |
| saved_jobs                 | candidate_id         |
| cities                     | country_id           |

---

## 7.5 Composite Indexes

The following composite indexes are recommended.

- jobs(status, published_at)
- applications(job_id, status)
- applications(candidate_id, applied_at)
- application_status_history(application_id, created_at)
- saved_jobs(candidate_id, created_at)

Indexes should be created only when they improve real query performance.

---

**End of ERD – Part 5**

---

# 8. Business Rules and Data Integrity

This section defines the business rules that must be enforced by the JobSphere application and database to ensure data consistency, security, and reliable recruitment workflows.

---

## 8.1 Account Management Rules

The following rules apply to all platform accounts.

- Every account must use a unique email address.
- Every account must have exactly one role.
- Supported roles are:
  - candidate
  - recruiter
  - admin
- Public registration is allowed only for candidate and recruiter accounts.
- Email verification is required before accessing protected features.
- Suspended and deactivated accounts cannot access authenticated features.
- Normal account management must deactivate accounts instead of deleting them.
- Historical recruitment records must always be preserved.

---

## 8.2 OTP Verification Rules

Email verification and password reset use One-Time Passwords (OTP).

The following rules apply.

- OTPs must contain exactly six numeric digits.
- OTPs expire after ten minutes.
- Maximum incorrect attempts per OTP: five.
- OTP values must always be stored as secure hashes.
- A new OTP invalidates the previous active OTP for the same user and purpose.
- Successfully verified OTPs cannot be reused.
- OTP verification must be completed within a database transaction.
- Expired or invalidated OTPs must never be accepted.

---

## 8.3 Candidate Profile Rules

Candidate profiles follow these rules.

- Every candidate account owns exactly one candidate profile.
- Every candidate can upload one active resume in V1.
- A candidate can create multiple experience records.
- A candidate can create multiple education records.
- A candidate can select multiple skills.
- Duplicate candidate-skill relationships are not allowed.
- Optional profile information may remain empty until completed.

---

## 8.4 Recruiter and Company Rules

Recruiter accounts manage companies and job postings.

The following rules apply.

- Every recruiter owns one company in V1.
- Every company belongs to one recruiter.
- Every company belongs to one industry.
- A company can publish multiple jobs.
- Company ownership must remain available for historical recruitment records.
- Company records should be archived instead of deleted.

---

## 8.5 Job Management Rules

Job postings follow these rules.

- Every job belongs to an existing company.
- Only published jobs can receive applications.
- Draft jobs cannot receive applications.
- Closed jobs cannot receive applications.
- Archived jobs cannot receive applications.
- Candidates cannot apply after the application deadline.
- Jobs should be closed or archived instead of deleted.
- Employment type and workplace type must use supported values.

---

## 8.6 Salary Validation Rules

JobSphere supports four salary types.

| Salary Type   | salary_min | salary_max |
| ------------- | ---------- | ---------- |
| fixed         | Required   | NULL       |
| range         | Required   | Required   |
| negotiable    | NULL       | NULL       |
| not_disclosed | NULL       | NULL       |

Additional validation rules.

- Salary values must never be negative.
- For salary ranges, salary_min must not exceed salary_max.
- Currency is required whenever salary information exists.
- Salary period is required whenever salary information exists.
- Currency should use ISO 4217 codes.

---

## 8.7 Application Rules

Applications follow these rules.

- A candidate can apply to many jobs.
- A candidate can apply to the same job only once.
- Applications require a resume snapshot.
- Resume snapshots never change after submission.
- Every status update must create one history record.
- The current application status must always equal the latest history status.
- Creating an application and its first history record must happen in one transaction.
- Updating an application and its history must happen in one transaction.
- Applications must never be deleted during normal operations.

---

## 8.8 Saved Job Rules

Saved jobs behave independently from applications.

- Candidates can save multiple jobs.
- Duplicate saved jobs are not allowed.
- Saving a job does not create an application.
- Removing a saved job removes only the bookmark.

---

## 8.9 Security and Data Integrity

The platform must enforce the following.

- Foreign keys must maintain valid relationships.
- Unique constraints must prevent duplicate records.
- Check constraints must reject invalid data.
- Passwords must always be securely hashed.
- OTP values must always be securely hashed.
- Uploaded files must be validated.
- Authorization must be enforced at the application layer.
- Database transactions must protect multi-step operations.

---

## 8.10 Application Status Values

Supported application statuses are:

- applied
- under_review
- shortlisted
- interview
- hired
- rejected
- withdrawn

---

## 8.11 Application Withdrawal Rules

Candidates may withdraw their own applications.

The following rules apply.

- Only candidates may withdraw their own applications.
- Recruiters cannot withdraw applications on behalf of candidates.
- Withdrawal creates a new history record.
- Withdrawn applications remain in the database.
- Resume snapshots remain preserved.
- Withdrawal never deletes application history.

---

## 8.12 Application Status Transition Rules

Applications must follow the approved workflow.

| Current Status | Allowed Next Status               |
| -------------- | --------------------------------- |
| applied        | under_review, rejected, withdrawn |
| under_review   | shortlisted, rejected, withdrawn  |
| shortlisted    | interview, rejected, withdrawn    |
| interview      | hired, rejected, withdrawn        |
| hired          | —                                 |
| rejected       | —                                 |
| withdrawn      | —                                 |

Additional rules.

- hired is a terminal status.
- rejected is a terminal status.
- withdrawn is a terminal status.
- Terminal statuses cannot be changed.
- Recruiters may update application statuses only through valid transitions.
- Every valid transition must create a corresponding history record.
- Application history is append-only and must never be edited or deleted.

---

**End of ERD – Part 6**

---

# 9. PostgreSQL Implementation Standards

This section defines the database implementation standards for JobSphere V1.

These standards ensure consistency, maintainability, and compatibility when translating the ERD into Laravel migrations and PostgreSQL.

---

## 9.1 Primary Key Standard

The following rules apply to all primary keys.

- Every table must use a BIGINT primary key.
- Primary keys must be auto-generated using PostgreSQL Identity columns.
- The preferred PostgreSQL definition is:

```sql
BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
```

Primary keys must never be manually assigned by the application.

---

## 9.2 Timestamp Standard

JobSphere uses timezone-aware timestamps.

The following rules apply.

- Timestamp columns must use **TIMESTAMPTZ**.
- Application timestamps should always be stored in UTC.
- User-facing timestamps should be converted to the user's local timezone.
- Laravel's `created_at` and `updated_at` columns must remain consistent across all tables.

---

## 9.3 Foreign Key Standard

Foreign keys must enforce referential integrity.

Rules:

- Every foreign key must reference an existing primary key.
- Foreign keys must use appropriate ON DELETE policies.
- Foreign keys should be indexed whenever appropriate.
- Foreign key names should follow Laravel naming conventions.

---

## 9.4 Unique Constraint Standard

Business rules requiring uniqueness must always be enforced at the database level.

Examples include:

- User email
- Company slug
- Job slug
- Candidate skills
- Saved jobs
- Applications
- Country codes

Application-level validation alone is not sufficient.

---

## 9.5 Check Constraint Standard

Whenever PostgreSQL supports a rule using CHECK constraints, it should be enforced in the database.

Examples include:

- User role
- User status
- Salary validation
- Experience dates
- Education dates
- OTP attempt limits

Business logic that cannot be expressed using CHECK constraints should be implemented within the application layer.

---

## 9.6 Naming Conventions

The following naming conventions must be used consistently.

### Tables

- lowercase
- snake_case
- plural

Examples

- users
- candidate_profiles
- application_status_history

---

### Columns

- lowercase
- snake_case

Examples

- full_name
- company_name
- created_at

---

### Primary Keys

Use:

```text
id
```

for every table.

---

### Foreign Keys

Use:

```text
table_name_id
```

Examples:

- user_id
- company_id
- recruiter_id
- application_id

---

### Index Names

Indexes should follow PostgreSQL and Laravel naming conventions.

Examples:

```text
users_email_index

jobs_status_index

applications_candidate_id_job_id_unique
```

---

## 9.7 Transaction Standard

Database transactions must be used whenever multiple dependent operations occur.

Typical examples include:

- User registration + OTP creation
- OTP verification + email verification
- Application creation + initial status history
- Application status update + history insertion

All operations inside a transaction must either:

- Complete successfully together, or
- Roll back completely.

Partial updates are not allowed.

---

## 9.8 Security Standard

Sensitive information must never be stored in plain text.

The following rules apply.

### Passwords

Passwords must always be stored using Laravel's secure password hashing.

### OTP

OTP values must always be stored as hashes.

### Resume Files

Resume files must not be publicly accessible by default.

### Company Logos

Uploaded logos must be validated before storage.

### Profile Photos

Uploaded profile images must be validated before storage.

---

## 9.9 Migration Guidelines

When creating Laravel migrations:

- Use foreignId() whenever possible.
- Add foreign key constraints immediately.
- Add indexes during migration creation.
- Use enum validation in the application layer where appropriate.
- Use CHECK constraints where PostgreSQL supports them.
- Keep each migration focused on one table.

---

## 9.10 Future Expansion Guidelines

The database is designed to support future versions of JobSphere.

Possible future additions include:

- Multiple recruiters per company
- Multiple resumes per candidate
- Resume version history
- Company branches
- Job categories
- Skill proficiency levels
- Notifications
- Messaging
- Interview scheduling
- Employer subscriptions
- Premium candidate profiles
- Analytics and reporting
- AI-powered job matching

These features should be implemented without breaking the V1 schema.

---

# End of ERD

This ERD defines the complete JobSphere V1 database design.

It serves as the single source of truth for:

- Laravel Migrations
- Eloquent Models
- Database Relationships
- API Development
- Backend Business Logic
- Validation Rules
- Future Project Expansion

All implementation should strictly follow this document.

**Version:** 1.0
**Project:** JobSphere
**Database:** PostgreSQL
**Framework:** Laravel 12
**Frontend:** React + Vite + Tailwind CSS
