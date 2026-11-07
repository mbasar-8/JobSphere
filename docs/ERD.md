# JobSphere

## Entity Relationship Diagram (ERD)

---

# 1. Database Overview

JobSphere uses PostgreSQL as its primary relational database management system.

The database is designed to support a recruitment platform connecting candidates and recruiters through structured user profiles, company information, job postings, applications, and related resources.

The database follows relational database design principles, including:

- Primary key and foreign key constraints.
- Referential integrity.
- Appropriate normalization.
- Unique constraints where necessary.
- Indexing for frequently queried fields.
- Many-to-many relationships through junction tables.

The database schema is designed around the business requirements of JobSphere V1, while allowing future enhancements without unnecessary complexity.

---

# 2. Database Design Principles

The following principles guide the database design:

### 2.1 Separation of Concerns

Authentication data, candidate information, recruiter information, company data, and job-related information are stored separately.

### 2.2 Referential Integrity

Foreign key constraints ensure that related records maintain valid relationships.

### 2.3 Data Consistency

Unique constraints, validation rules, and appropriate database constraints help maintain consistent data.

### 2.4 Historical Data Preservation

Important business records, particularly job applications, must remain available even when a user deactivates their account.

### 2.5 Scalability

The database structure should support future features without introducing unnecessary complexity into V1.

---

## 3. Entity List

The JobSphere V1 database consists of the following entities, grouped by their responsibilities.

### 3.1 Authentication and User Management

| Entity            | Responsibility                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| users             | Stores authentication credentials, user roles, account status, and email verification information.  |
| otp_verifications | Stores securely hashed OTP verification records for email verification and password reset purposes. |

### 3.2 Candidate Management

| Entity             | Responsibility                                                                         |
| ------------------ | -------------------------------------------------------------------------------------- |
| candidate_profiles | Stores candidate-specific personal and professional profile information.               |
| resumes            | Stores candidate resume file information. V1 supports one active resume per candidate. |
| experiences        | Stores structured work experience records for candidates.                              |
| education          | Stores structured educational background records for candidates.                       |
| skills             | Stores the available skills in the platform.                                           |
| candidate_skills   | Connects candidates with their selected skills.                                        |

### 3.3 Recruiter and Company Management

| Entity             | Responsibility                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| recruiter_profiles | Stores recruiter-specific personal and professional information.               |
| companies          | Stores company information, including its industry, logo, and contact details. |
| industries         | Stores industry categories used by companies and job listings.                 |

### 3.4 Job Management

| Entity | Responsibility                                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------------------------------- |
| jobs   | Stores job postings, descriptions, requirements, employment types, workplace types, salary information, and job status. |

### 3.5 Application Management

| Entity                     | Responsibility                                                                   |
| -------------------------- | -------------------------------------------------------------------------------- |
| applications               | Stores job applications, their statuses, and the resume version used.            |
| application_status_history | Stores application status changes to maintain a historical application timeline. |

### 3.6 Saved Jobs

| Entity     | Responsibility                                                      |
| ---------- | ------------------------------------------------------------------- |
| saved_jobs | Connects candidates with jobs they have saved for future reference. |

### 3.7 Location Management

| Entity    | Responsibility                                                   |
| --------- | ---------------------------------------------------------------- |
| countries | Stores supported country information.                            |
| cities    | Stores city information and associates each city with a country. |

**Note:** The entity list represents the proposed V1 database structure. Relationships, attributes, constraints, and implementation details will be defined in the following sections.

---

### 4.1 Users

Stores the core authentication and account information for all platform users.

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

**Design Notes:**

- The `users` table stores authentication and account-related information only.
- Candidate names are stored in `candidate_profiles.full_name`.
- Recruiter names are stored in `recruiter_profiles.full_name`.
- The user's name is collected during profile completion after email verification.

**Important Constraints:**

- Email addresses must be unique.
- Passwords must always be stored as secure hashes.
- Public registration must not allow users to register as administrators.
- Only verified and active users can access protected platform features.
- Role and status values must be restricted to the supported values.

### 4.2 OTP Verifications

Stores securely hashed OTP records for email verification and password reset operations.

| Column         | Data Type    | Constraints         | Description                                  |
| -------------- | ------------ | ------------------- | -------------------------------------------- |
| id             | BIGINT       | PK, AUTO INCREMENT  | Unique OTP record identifier                 |
| user_id        | BIGINT       | FK, NOT NULL        | References users.id                          |
| otp_hash       | VARCHAR(255) | NOT NULL            | Securely hashed OTP value                    |
| purpose        | VARCHAR(30)  | NOT NULL            | email_verification or password_reset         |
| expires_at     | TIMESTAMP    | NOT NULL            | OTP expiration timestamp                     |
| attempts       | SMALLINT     | NOT NULL, DEFAULT 0 | Number of incorrect verification attempts    |
| consumed_at    | TIMESTAMP    | NULL                | Timestamp when the OTP was successfully used |
| created_at     | TIMESTAMP    | NOT NULL            | OTP creation timestamp                       |
| updated_at     | TIMESTAMP    | NOT NULL            | Last record update timestamp                 |
| invalidated_at | TIMESTAMPTZ  | NULL                |

**OTP Lifecycle Rules:**

- An OTP is usable only if `consumed_at` and `invalidated_at` are both NULL, its expiration time has not passed, and its attempt count is below 5.
- When a new OTP is issued for the same user and purpose, the previous usable OTP must be invalidated.
- OTP invalidation and creation must happen within a database transaction.
- A successfully verified OTP must have `consumed_at` set.
- An invalidated OTP must never be accepted, even if its expiration time has not passed.

**Important Constraints:**

- Each OTP record must belong to an existing user.
- OTP values must be securely hashed before storage.
- OTP records must have a supported purpose.
- Expired OTPs must not be accepted.
- Successfully consumed OTPs must not be reused.
- Incorrect verification attempts must be limited.
- Resending an OTP should invalidate or supersede the previous active OTP for the same user and purpose.

### 4.3 Candidate Profiles

Stores personal and professional profile information for candidate accounts.

| Column        | Data Type    | Constraints          | Description                      |
| ------------- | ------------ | -------------------- | -------------------------------- |
| id            | BIGINT       | PK, AUTO INCREMENT   | Unique profile identifier        |
| user_id       | BIGINT       | FK, UNIQUE, NOT NULL | References users.id              |
| full_name     | VARCHAR(150) | NOT NULL             | Candidate's full name            |
| profile_photo | VARCHAR(255) | NULL                 | Profile photo storage path       |
| headline      | VARCHAR(180) | NULL                 | Professional headline            |
| about         | TEXT         | NULL                 | Candidate's professional summary |
| phone         | VARCHAR(30)  | NULL                 | Contact phone number             |
| gender        | VARCHAR(20)  | NULL                 | Candidate's gender               |
| date_of_birth | DATE         | NULL                 | Candidate's date of birth        |
| city_id       | BIGINT       | FK, NULL             | References cities.id             |
| linkedin_url  | VARCHAR(255) | NULL                 | LinkedIn profile URL             |
| github_url    | VARCHAR(255) | NULL                 | GitHub profile URL               |
| portfolio_url | VARCHAR(255) | NULL                 | Personal portfolio URL           |
| created_at    | TIMESTAMP    | NOT NULL             | Profile creation timestamp       |
| updated_at    | TIMESTAMP    | NOT NULL             | Last profile update timestamp    |

**Important Constraints:**

- Each user can have only one candidate profile.
- A candidate profile must belong to an existing user.
- Only users with the candidate role can own candidate profiles.
- The city reference must point to an existing city.
- Optional profile information may remain NULL until the candidate completes their profile.

### 4.4 Resumes

Stores uploaded resume file information for candidates.

V1 supports one active resume per candidate.

| Column        | Data Type    | Constraints          | Description                      |
| ------------- | ------------ | -------------------- | -------------------------------- |
| id            | BIGINT       | PK, AUTO INCREMENT   | Unique resume identifier         |
| candidate_id  | BIGINT       | FK, UNIQUE, NOT NULL | References candidate_profiles.id |
| file_path     | VARCHAR(255) | NOT NULL             | Resume file storage path         |
| original_name | VARCHAR(255) | NOT NULL             | Original uploaded file name      |
| uploaded_at   | TIMESTAMP    | NOT NULL             | Resume upload timestamp          |
| created_at    | TIMESTAMP    | NOT NULL             | Record creation timestamp        |
| updated_at    | TIMESTAMP    | NOT NULL             | Last record update timestamp     |

**Important Constraints:**

- Each candidate can have only one active resume in V1.
- Each resume must belong to an existing candidate profile.
- Only supported resume file formats and sizes may be uploaded.
- Uploaded files must be stored securely and must not be publicly accessible by default.
- Replacing a resume must not modify historical application resume snapshots.
- Deleting or replacing the current resume must not remove resume files associated with existing applications.

### 4.5 Experiences

Stores structured work experience records for candidates.

A candidate can have multiple work experience records.

| Column          | Data Type    | Constraints             | Description                                |
| --------------- | ------------ | ----------------------- | ------------------------------------------ |
| id              | BIGINT       | PK, AUTO INCREMENT      | Unique experience identifier               |
| candidate_id    | BIGINT       | FK, NOT NULL            | References candidate_profiles.id           |
| company_name    | VARCHAR(150) | NOT NULL                | Previous or current employer name          |
| job_title       | VARCHAR(150) | NOT NULL                | Position or job title                      |
| employment_type | VARCHAR(30)  | NULL                    | Employment type                            |
| location        | VARCHAR(150) | NULL                    | Work location                              |
| start_date      | DATE         | NOT NULL                | Employment start date                      |
| end_date        | DATE         | NULL                    | Employment end date                        |
| is_current      | BOOLEAN      | NOT NULL, DEFAULT FALSE | Whether the candidate currently works here |
| description     | TEXT         | NULL                    | Responsibilities and achievements          |
| created_at      | TIMESTAMP    | NOT NULL                | Record creation timestamp                  |
| updated_at      | TIMESTAMP    | NOT NULL                | Last record update timestamp               |

**Important Constraints:**

- Each experience record must belong to an existing candidate profile.
- A candidate can have multiple experience records.
- `end_date` must be NULL when `is_current` is TRUE.
- `end_date` must not be earlier than `start_date`.
- Employment type must use supported values when provided.

### 4.6 Education

Stores structured educational background records for candidates.

A candidate can have multiple education records.

| Column           | Data Type    | Constraints        | Description                            |
| ---------------- | ------------ | ------------------ | -------------------------------------- |
| id               | BIGINT       | PK, AUTO INCREMENT | Unique education identifier            |
| candidate_id     | BIGINT       | FK, NOT NULL       | References candidate_profiles.id       |
| institution_name | VARCHAR(180) | NOT NULL           | School, college, or university name    |
| degree           | VARCHAR(120) | NOT NULL           | Degree or qualification                |
| field_of_study   | VARCHAR(150) | NULL               | Major or field of study                |
| start_date       | DATE         | NULL               | Education start date                   |
| end_date         | DATE         | NULL               | Graduation or expected completion date |
| grade            | VARCHAR(50)  | NULL               | GPA, CGPA, percentage, or grade        |
| description      | TEXT         | NULL               | Additional educational details         |
| created_at       | TIMESTAMP    | NOT NULL           | Record creation timestamp              |
| updated_at       | TIMESTAMP    | NOT NULL           | Last record update timestamp           |

**Important Constraints:**

- Each education record must belong to an existing candidate profile.
- A candidate can have multiple education records.
- If both dates are provided, `end_date` must not be earlier than `start_date`.
- Institution and degree information are required.
- Candidates may leave optional academic details NULL.

### 4.7 Skills

Stores the list of available skills that candidates can associate with their profiles.

| Column     | Data Type    | Constraints        | Description                  |
| ---------- | ------------ | ------------------ | ---------------------------- |
| id         | BIGINT       | PK, AUTO INCREMENT | Unique skill identifier      |
| name       | VARCHAR(100) | UNIQUE, NOT NULL   | Skill name                   |
| created_at | TIMESTAMP    | NOT NULL           | Record creation timestamp    |
| updated_at | TIMESTAMP    | NOT NULL           | Last record update timestamp |

**Important Constraints:**

- Each skill name must be unique.
- Skill names should be normalized to prevent duplicate entries caused by differences in capitalization or spacing.
- Skills should be managed through controlled platform data rather than arbitrary duplicate entries.

### 4.8 Candidate Skills

Connects candidate profiles with their selected skills through a many-to-many relationship.

| Column       | Data Type | Constraints        | Description                      |
| ------------ | --------- | ------------------ | -------------------------------- |
| id           | BIGINT    | PK, AUTO INCREMENT | Unique record identifier         |
| candidate_id | BIGINT    | FK, NOT NULL       | References candidate_profiles.id |
| skill_id     | BIGINT    | FK, NOT NULL       | References skills.id             |
| created_at   | TIMESTAMP | NOT NULL           | Record creation timestamp        |
| updated_at   | TIMESTAMP | NOT NULL           | Last record update timestamp     |

**Important Constraints:**

- Each record must reference an existing candidate profile and skill.
- The combination of `candidate_id` and `skill_id` must be unique.
- A candidate must not be able to add the same skill more than once.
- Deleting a candidate profile should remove its associated candidate skill relationships.

### 4.9 Recruiter Profiles

Stores personal and professional information for recruiter accounts.

| Column        | Data Type    | Constraints          | Description                          |
| ------------- | ------------ | -------------------- | ------------------------------------ |
| id            | BIGINT       | PK, AUTO INCREMENT   | Unique recruiter profile identifier  |
| user_id       | BIGINT       | FK, UNIQUE, NOT NULL | References users.id                  |
| full_name     | VARCHAR(150) | NOT NULL             | Recruiter's full name                |
| phone         | VARCHAR(30)  | NULL                 | Contact phone number                 |
| designation   | VARCHAR(120) | NULL                 | Recruiter's job title or designation |
| profile_photo | VARCHAR(255) | NULL                 | Recruiter profile photo storage path |
| created_at    | TIMESTAMP    | NOT NULL             | Profile creation timestamp           |
| updated_at    | TIMESTAMP    | NOT NULL             | Last profile update timestamp        |

**Important Constraints:**

- Each user can have only one recruiter profile.
- Each recruiter profile must belong to an existing user.
- Only users with the recruiter role can own recruiter profiles.
- Optional profile information may remain NULL until completed.

### 4.10 Industries

Stores predefined industry categories used to classify companies.

| Column     | Data Type    | Constraints        | Description                      |
| ---------- | ------------ | ------------------ | -------------------------------- |
| id         | BIGINT       | PK, AUTO INCREMENT | Unique industry identifier       |
| name       | VARCHAR(120) | UNIQUE, NOT NULL   | Industry name                    |
| slug       | VARCHAR(140) | UNIQUE, NOT NULL   | URL-friendly industry identifier |
| created_at | TIMESTAMP    | NOT NULL           | Record creation timestamp        |
| updated_at | TIMESTAMP    | NOT NULL           | Last record update timestamp     |

**Important Constraints:**

- Industry names must be unique.
- Industry slugs must be unique.
- Industries should be managed through controlled platform data.
- An industry referenced by existing companies should not be physically deleted.

### 4.11 Companies

Stores company information managed by recruiter accounts.

In V1, each company is owned by one recruiter. A company can have multiple job postings.

| Column       | Data Type    | Constraints          | Description                      |
| ------------ | ------------ | -------------------- | -------------------------------- |
| id           | BIGINT       | PK, AUTO INCREMENT   | Unique company identifier        |
| recruiter_id | BIGINT       | FK, UNIQUE, NOT NULL | References recruiter_profiles.id |
| industry_id  | BIGINT       | FK, NOT NULL         | References industries.id         |
| company_name | VARCHAR(180) | NOT NULL             | Official company name            |
| slug         | VARCHAR(200) | UNIQUE, NOT NULL     | URL-friendly company identifier  |
| logo         | VARCHAR(255) | NULL                 | Company logo storage path        |
| website      | VARCHAR(255) | NULL                 | Official company website         |
| email        | VARCHAR(255) | NULL                 | Company contact email            |
| phone        | VARCHAR(30)  | NULL                 | Company contact phone            |
| description  | TEXT         | NULL                 | Company overview and description |
| city_id      | BIGINT       | FK, NULL             | References cities.id             |
| company_size | VARCHAR(30)  | NULL                 | Number of employees              |
| created_at   | TIMESTAMP    | NOT NULL             | Company creation timestamp       |
| updated_at   | TIMESTAMP    | NOT NULL             | Last company update timestamp    |

**Important Constraints:**

- Each company must belong to an existing recruiter profile.
- A recruiter can own only one company in V1.
- Each company must reference an existing industry.
- Company slugs must be unique.
- The city reference must point to an existing city.
- Company size must use supported values: 1–10, 11–50, 51–200, or 200+.
- Companies associated with historical job postings and applications must not be physically deleted.

### 4.12 Jobs

Stores job postings created and managed by companies.

A company can publish multiple job postings.

| Column               | Data Type     | Constraints        | Description                                              |
| -------------------- | ------------- | ------------------ | -------------------------------------------------------- |
| id                   | BIGINT        | PK, AUTO INCREMENT | Unique job identifier                                    |
| company_id           | BIGINT        | FK, NOT NULL       | References companies.id                                  |
| title                | VARCHAR(180)  | NOT NULL           | Job title                                                |
| slug                 | VARCHAR(220)  | UNIQUE, NOT NULL   | URL-friendly job identifier                              |
| description          | TEXT          | NOT NULL           | Detailed job description                                 |
| responsibilities     | TEXT          | NULL               | Key job responsibilities                                 |
| requirements         | TEXT          | NULL               | Required qualifications and skills                       |
| benefits             | TEXT          | NULL               | Job benefits and perks                                   |
| employment_type      | VARCHAR(30)   | NOT NULL           | Full-time, part-time, contract, internship, or freelance |
| workplace_type       | VARCHAR(20)   | NOT NULL           | On-site, remote, or hybrid                               |
| city_id              | BIGINT        | FK, NULL           | References cities.id                                     |
| salary_type          | VARCHAR(20)   | NOT NULL           | Fixed, range, negotiable, or not_disclosed               |
| salary_min           | NUMERIC(12,2) | NULL               | Minimum salary amount                                    |
| salary_max           | NUMERIC(12,2) | NULL               | Maximum salary amount                                    |
| currency             | VARCHAR(3)    | NULL               | ISO 4217 currency code, such as BDT or USD               |
| salary_period        | VARCHAR(20)   | NULL               | Monthly, yearly, hourly, or another supported period     |
| status               | VARCHAR(20)   | NOT NULL           | Draft, published, closed, or archived                    |
| application_deadline | DATE          | NULL               | Last date for submitting applications                    |
| published_at         | TIMESTAMP     | NULL               | Job publication timestamp                                |
| created_at           | TIMESTAMP     | NOT NULL           | Job creation timestamp                                   |
| updated_at           | TIMESTAMP     | NOT NULL           | Last job update timestamp                                |

**Important Constraints:**

- Each job must belong to an existing company.
- Job slugs must be unique.
- Employment type, workplace type, salary type, and status must use supported values.
- Salary amounts must not be negative.
- For a salary range, `salary_min` must not exceed `salary_max`.
- Salary fields must follow the rules defined by the selected salary type.
- Published jobs must have the required job information.
- Jobs must not be physically deleted; they should be closed or archived to preserve historical application data.
- The application deadline must not be earlier than the publication date when both dates are available.

### 4.13 Applications

Stores job application records submitted by candidates.

A candidate can apply to multiple jobs, and each job can receive multiple applications.

| Column               | Data Type    | Constraints        | Description                                   |
| -------------------- | ------------ | ------------------ | --------------------------------------------- |
| id                   | BIGINT       | PK, AUTO INCREMENT | Unique application identifier                 |
| candidate_id         | BIGINT       | FK, NOT NULL       | References candidate_profiles.id              |
| job_id               | BIGINT       | FK, NOT NULL       | References jobs.id                            |
| resume_snapshot_path | VARCHAR(255) | NOT NULL           | Resume file snapshot used at application time |
| cover_letter         | TEXT         | NULL               | Candidate's optional cover letter             |
| status               | VARCHAR(30)  | NOT NULL           | Current application status                    |
| applied_at           | TIMESTAMP    | NOT NULL           | Application submission timestamp              |
| created_at           | TIMESTAMP    | NOT NULL           | Record creation timestamp                     |
| updated_at           | TIMESTAMP    | NOT NULL           | Last record update timestamp                  |

**Important Constraints:**

- Each application must belong to an existing candidate profile and job.
- A candidate must not apply to the same job more than once.
- The combination of `candidate_id` and `job_id` must be unique.
- Applications must reference a valid resume snapshot.
- The resume snapshot must remain unchanged even if the candidate replaces their current resume.
- Applications must not be physically deleted as part of normal job or account management.
- Application status must use supported values.
- Only eligible published jobs can receive new applications.
- A candidate must not apply after the job's application deadline.

### 4.14 Application Status History

Stores the historical status changes of job applications to provide a complete application timeline.

An application can have multiple status history records.

| Column         | Data Type   | Constraints        | Description                                           |
| -------------- | ----------- | ------------------ | ----------------------------------------------------- |
| id             | BIGINT      | PK, AUTO INCREMENT | Unique history record identifier                      |
| application_id | BIGINT      | FK, NOT NULL       | References applications.id                            |
| status         | VARCHAR(30) | NOT NULL           | Application status at this point in time              |
| changed_by     | BIGINT      | FK, NULL           | References users.id; NULL for system-generated events |
| note           | TEXT        | NULL               | Optional explanation or update note                   |
| created_at     | TIMESTAMP   | NOT NULL           | Timestamp of the status change                        |

**Important Constraints:**

- Each history record must belong to an existing application.
- Each status value must use a supported application status.
- `changed_by`, when provided, must reference an existing user.
- Status history records must be append-only during normal application operations.
- Every application status change must create a corresponding history record.
- The current application status must remain consistent with the latest status history record.
- Historical status records must not be modified or deleted through normal recruiter or candidate operations.

### 4.15 Saved Jobs

Connects candidate profiles with jobs saved for future reference.

A candidate can save multiple jobs, and a job can be saved by multiple candidates.

| Column       | Data Type | Constraints        | Description                      |
| ------------ | --------- | ------------------ | -------------------------------- |
| id           | BIGINT    | PK, AUTO INCREMENT | Unique saved job identifier      |
| candidate_id | BIGINT    | FK, NOT NULL       | References candidate_profiles.id |
| job_id       | BIGINT    | FK, NOT NULL       | References jobs.id               |
| created_at   | TIMESTAMP | NOT NULL           | Timestamp when the job was saved |

**Important Constraints:**

- Each saved job record must reference an existing candidate profile and job.
- The combination of `candidate_id` and `job_id` must be unique.
- A candidate must not be able to save the same job more than once.
- Removing a saved job should delete only the saved relationship, not the actual job.
- Saving a job must not automatically submit a job application.

### 4.16 Countries

Stores the list of supported countries for location management.

| Column     | Data Type    | Constraints        | Description                   |
| ---------- | ------------ | ------------------ | ----------------------------- |
| id         | BIGINT       | PK, AUTO INCREMENT | Unique country identifier     |
| name       | VARCHAR(120) | UNIQUE, NOT NULL   | Country name                  |
| iso2_code  | CHAR(2)      | UNIQUE, NOT NULL   | Two-letter ISO country code   |
| iso3_code  | CHAR(3)      | UNIQUE, NOT NULL   | Three-letter ISO country code |
| created_at | TIMESTAMP    | NOT NULL           | Record creation timestamp     |
| updated_at | TIMESTAMP    | NOT NULL           | Last record update timestamp  |

**Important Constraints:**

- Country names must be unique.
- ISO country codes must follow the supported ISO 3166-1 standard.
- Countries referenced by existing cities must not be physically deleted.

### 4.17 Cities

Stores city information associated with countries.

| Column     | Data Type    | Constraints        | Description                  |
| ---------- | ------------ | ------------------ | ---------------------------- |
| id         | BIGINT       | PK, AUTO INCREMENT | Unique city identifier       |
| country_id | BIGINT       | FK, NOT NULL       | References countries.id      |
| name       | VARCHAR(120) | NOT NULL           | City name                    |
| created_at | TIMESTAMP    | NOT NULL           | Record creation timestamp    |
| updated_at | TIMESTAMP    | NOT NULL           | Last record update timestamp |

**Important Constraints:**

- Each city must belong to an existing country.
- The combination of `country_id` and `name` must be unique.
- Cities referenced by candidate profiles, companies, or jobs must not be physically deleted.
- Country information for a city must be retrieved through its country relationship rather than duplicated in other tables.

## 5. Entity Relationships

This section defines the relationships between JobSphere V1 database entities.

### 5.1 Authentication Relationships

| Parent Entity | Child Entity      | Relationship | Foreign Key               |
| ------------- | ----------------- | ------------ | ------------------------- |
| users         | otp_verifications | One-to-Many  | otp_verifications.user_id |

A user can have multiple OTP verification records for different purposes or verification attempts.

### 5.2 Candidate Relationships

| Parent Entity      | Child Entity       | Relationship | Foreign Key                   |
| ------------------ | ------------------ | ------------ | ----------------------------- |
| users              | candidate_profiles | One-to-One   | candidate_profiles.user_id    |
| candidate_profiles | resumes            | One-to-One   | resumes.candidate_id          |
| candidate_profiles | experiences        | One-to-Many  | experiences.candidate_id      |
| candidate_profiles | education          | One-to-Many  | education.candidate_id        |
| candidate_profiles | candidate_skills   | One-to-Many  | candidate_skills.candidate_id |
| skills             | candidate_skills   | One-to-Many  | candidate_skills.skill_id     |

The candidate_skills entity implements the many-to-many relationship between candidate_profiles and skills.

### 5.3 Recruiter and Company Relationships

| Parent Entity      | Child Entity       | Relationship | Foreign Key                |
| ------------------ | ------------------ | ------------ | -------------------------- |
| users              | recruiter_profiles | One-to-One   | recruiter_profiles.user_id |
| recruiter_profiles | companies          | One-to-One   | companies.recruiter_id     |
| industries         | companies          | One-to-Many  | companies.industry_id      |

In V1, each recruiter can own one company, while each company belongs to one industry.

### 5.4 Job Relationships

| Parent Entity | Child Entity | Relationship | Foreign Key     |
| ------------- | ------------ | ------------ | --------------- |
| companies     | jobs         | One-to-Many  | jobs.company_id |
| cities        | jobs         | One-to-Many  | jobs.city_id    |

A company can publish multiple jobs. A job may optionally reference a city.

### 5.5 Application Relationships

| Parent Entity      | Child Entity               | Relationship | Foreign Key                               |
| ------------------ | -------------------------- | ------------ | ----------------------------------------- |
| candidate_profiles | applications               | One-to-Many  | applications.candidate_id                 |
| jobs               | applications               | One-to-Many  | applications.job_id                       |
| applications       | application_status_history | One-to-Many  | application_status_history.application_id |
| users              | application_status_history | One-to-Many  | application_status_history.changed_by     |

The applications entity represents the relationship between candidates and jobs. The unique combination of candidate_id and job_id prevents duplicate applications.

### 5.6 Saved Jobs Relationships

| Parent Entity      | Child Entity | Relationship | Foreign Key             |
| ------------------ | ------------ | ------------ | ----------------------- |
| candidate_profiles | saved_jobs   | One-to-Many  | saved_jobs.candidate_id |
| jobs               | saved_jobs   | One-to-Many  | saved_jobs.job_id       |

The saved_jobs entity implements the many-to-many relationship between candidate_profiles and jobs.

### 5.7 Location Relationships

| Parent Entity | Child Entity       | Relationship | Foreign Key                |
| ------------- | ------------------ | ------------ | -------------------------- |
| countries     | cities             | One-to-Many  | cities.country_id          |
| cities        | candidate_profiles | One-to-Many  | candidate_profiles.city_id |
| cities        | companies          | One-to-Many  | companies.city_id          |

A country can have multiple cities. Candidate profiles and companies may optionally reference a city.

### 5.8 Relationship Design Rules

- Every foreign key must reference a valid primary or unique key.
- One-to-one relationships must enforce uniqueness on the foreign key.
- Many-to-many relationships must use dedicated intermediate entities.
- Foreign key constraints must preserve referential integrity.
- Unique constraints must prevent duplicate relationships where required.
- Deletion behavior must preserve historical application and recruitment data.

## 6. Foreign Key and Deletion Policies

JobSphere must preserve historical recruitment data and maintain referential integrity.

### 6.1 Deletion Policy Principles

The database will use the following foreign key deletion behaviors:

- CASCADE: Deletes dependent child records when their parent is permanently deleted.
- RESTRICT: Prevents deletion of a parent record while dependent records exist.
- SET NULL: Sets an optional foreign key to NULL when its referenced record is permanently deleted.

Physical deletion must not be used for normal account deactivation, job closure, or company management operations.

### 6.2 Foreign Key Deletion Rules

| Parent Entity      | Child Entity               | On Delete Policy | Reason                                                                              |
| ------------------ | -------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| users              | otp_verifications          | CASCADE          | OTP records are dependent authentication records.                                   |
| users              | candidate_profiles         | RESTRICT         | Candidate profile must not be deleted while the account exists.                     |
| users              | recruiter_profiles         | RESTRICT         | Recruiter profile must not be deleted while the account exists.                     |
| candidate_profiles | resumes                    | RESTRICT         | Resume records must be preserved unless explicitly managed.                         |
| candidate_profiles | experiences                | CASCADE          | Experience records depend on the candidate profile.                                 |
| candidate_profiles | education                  | CASCADE          | Education records depend on the candidate profile.                                  |
| candidate_profiles | candidate_skills           | CASCADE          | Candidate-skill relationships are dependent records.                                |
| skills             | candidate_skills           | RESTRICT         | Skills referenced by candidate profiles must not be physically deleted.             |
| recruiter_profiles | companies                  | RESTRICT         | Companies must retain their ownership history.                                      |
| industries         | companies                  | RESTRICT         | Industries referenced by companies must not be physically deleted.                  |
| companies          | jobs                       | RESTRICT         | Historical job postings must be preserved.                                          |
| cities             | candidate_profiles         | SET NULL         | Candidate location is optional.                                                     |
| cities             | companies                  | SET NULL         | Company location is optional.                                                       |
| cities             | jobs                       | SET NULL         | Job location is optional.                                                           |
| countries          | cities                     | RESTRICT         | Countries referenced by cities must not be deleted.                                 |
| candidate_profiles | applications               | RESTRICT         | Application history must be preserved.                                              |
| jobs               | applications               | RESTRICT         | Jobs with application records must not be deleted.                                  |
| applications       | application_status_history | RESTRICT         | Application timelines must be preserved.                                            |
| users              | application_status_history | SET NULL         | Historical status records should remain if an actor account is permanently removed. |
| candidate_profiles | saved_jobs                 | CASCADE          | Saved-job relationships are dependent records.                                      |
| jobs               | saved_jobs                 | CASCADE          | Saved-job relationships may be removed if a job is permanently purged.              |

### 6.3 Account Deactivation

- Candidate accounts must be deactivated instead of physically deleted.
- Deactivated candidates must retain their historical applications and application status history.
- Recruiter accounts must not be physically deleted through normal account management.
- Account status changes must not remove associated company, job, or application records.
- Deactivated or suspended accounts must not be allowed to perform restricted platform operations.

### 6.4 Job and Company Preservation

- Jobs must be closed or archived instead of physically deleted.
- Companies associated with historical jobs must not be physically deleted.
- Industries, countries, and cities referenced by existing records must not be physically deleted.
- Historical application records must remain available according to the platform's data retention policy.

### 6.5 Permanent Data Purging

Physical deletion, where legally and operationally permitted, must be handled through a controlled administrative or maintenance process.

Such operations must evaluate all foreign key dependencies and preserve required historical records.

Normal candidate, recruiter, and administrator operations must not bypass these deletion policies.

### 6.6 Permanent Deletion Policy

- CASCADE operations are permitted only during controlled permanent data purging.
- Normal application workflows must never physically delete candidate accounts, recruiter accounts, jobs, applications, or application history.
- Candidate and recruiter accounts must be deactivated instead of deleted.
- Jobs must be closed or archived instead of deleted.
- Application records and their historical data must be preserved.

## 7. Database Constraints and Indexes

JobSphere will use PostgreSQL constraints and indexes to maintain data integrity, prevent invalid records, and improve query performance.

### 7.1 Primary Key Constraints

- Every entity must have a primary key.
- Primary keys must uniquely identify each record.
- Primary key values must never be NULL.

### 7.2 Unique Constraints

The following unique constraints must be enforced:

| Entity             | Unique Column(s)           | Purpose                                         |
| ------------------ | -------------------------- | ----------------------------------------------- |
| users              | email                      | Prevent duplicate accounts                      |
| candidate_profiles | user_id                    | One candidate profile per user                  |
| recruiter_profiles | user_id                    | One recruiter profile per user                  |
| resumes            | candidate_id               | One active resume per candidate                 |
| skills             | name                       | Prevent duplicate skills                        |
| candidate_skills   | candidate_id, skill_id     | Prevent duplicate candidate-skill relationships |
| industries         | name                       | Prevent duplicate industries                    |
| industries         | slug                       | Prevent duplicate industry URLs                 |
| companies          | recruiter_id               | One company per recruiter in V1                 |
| companies          | slug                       | Prevent duplicate company URLs                  |
| jobs               | slug                       | Prevent duplicate job URLs                      |
| applications       | candidate_id, job_id       | Prevent duplicate applications                  |
| saved_jobs         | candidate_id, job_id       | Prevent duplicate saved jobs                    |
| countries          | name, iso2_code, iso3_code | Prevent duplicate country records               |
| cities             | country_id, name           | Prevent duplicate city names within a country   |

### 7.3 Check Constraints

The database must enforce the following validation rules:

**User Accounts**

- `role` must be one of: candidate, recruiter, admin.
- `status` must be one of: pending_verification, active, suspended, deactivated.

**OTP Verification**

- `attempts` must not be negative.
- `attempts` must not exceed the configured maximum of 5.

**Candidate Experiences**

- `end_date` must not be earlier than `start_date`.
- If `is_current` is TRUE, `end_date` must be NULL.

**Education**

- If both dates are provided, `end_date` must not be earlier than `start_date`.

**Jobs**

- `employment_type` must use a supported value.
- `workplace_type` must be on_site, remote, or hybrid.
- `salary_type` must be fixed, range, negotiable, or not_disclosed.
- `salary_min` and `salary_max` must not be negative.
- For a range, both salary amounts must be provided and `salary_min` must not exceed `salary_max`.
- Salary fields must follow the rules associated with the selected salary type.
- `status` must be draft, published, closed, or archived.

**Applications**

- Application status must use a supported value.
- A candidate must not apply to the same job more than once.

**Application Status History**

- Each status history record must use a supported application status.

### 7.4 Indexing Strategy

Indexes should be created for frequently queried foreign keys and commonly filtered columns.

| Entity                     | Indexed Column(s)               | Purpose                                      |
| -------------------------- | ------------------------------- | -------------------------------------------- |
| users                      | email                           | Fast login and account lookup                |
| otp_verifications          | user_id, purpose                | Find OTP records by user and purpose         |
| candidate_profiles         | user_id                         | Retrieve candidate profiles                  |
| candidate_profiles         | city_id                         | Filter candidates by location                |
| resumes                    | candidate_id                    | Retrieve candidate resumes                   |
| experiences                | candidate_id                    | Retrieve candidate experience records        |
| education                  | candidate_id                    | Retrieve candidate education records         |
| candidate_skills           | skill_id                        | Find candidates by skill                     |
| recruiter_profiles         | user_id                         | Retrieve recruiter profiles                  |
| companies                  | industry_id                     | Filter companies by industry                 |
| companies                  | city_id                         | Filter companies by location                 |
| jobs                       | company_id                      | Retrieve jobs belonging to a company         |
| jobs                       | status, published_at            | Retrieve published jobs                      |
| jobs                       | city_id                         | Filter jobs by location                      |
| jobs                       | employment_type, workplace_type | Filter jobs by employment and workplace type |
| jobs                       | application_deadline            | Filter jobs by application deadline          |
| applications               | candidate_id, applied_at        | Retrieve candidate application history       |
| applications               | job_id, status                  | Retrieve and filter job applicants           |
| application_status_history | application_id, created_at      | Retrieve application timelines               |
| application_status_history | changed_by                      | Retrieve status changes made by a user       |
| saved_jobs                 | candidate_id, created_at        | Retrieve candidate saved jobs                |
| cities                     | country_id                      | Retrieve cities by country                   |

### 7.5 Composite Index Considerations

The following composite indexes should be considered for common query patterns:

- `jobs(status, published_at)` for published job listings.
- `applications(job_id, status)` for recruiter applicant filtering.
- `applications(candidate_id, applied_at)` for candidate application history.
- `application_status_history(application_id, created_at)` for application timelines.
- `saved_jobs(candidate_id, created_at)` for saved job listings.

Unique constraints may already create indexes. Duplicate indexes must not be created unnecessarily.

### 7.6 Indexing Principles

- Foreign keys should be indexed when they are frequently used in joins or filtering.
- Composite indexes should follow actual query patterns.
- Unique constraints should be preferred when uniqueness is a business requirement.
- Indexes should be added based on expected usage and verified through query analysis.
- Excessive indexing should be avoided because indexes increase storage requirements and write overhead.

## 8. Business Rules and Data Integrity

This section defines the essential business rules that must be enforced by the JobSphere V1 database and application logic.

### 8.1 Account Management Rules

- Every account must have a unique email address.
- Each account must have exactly one supported role: candidate, recruiter, or admin.
- Public registration must support candidate and recruiter roles only.
- Unverified accounts must not access protected platform features.
- Suspended and deactivated accounts must not perform normal authenticated operations.
- Account deactivation must preserve historical recruitment records.

### 8.2 Email OTP Rules

- OTPs must contain exactly 6 numeric digits.
- OTPs must expire after 10 minutes.
- A maximum of 5 incorrect verification attempts is allowed per OTP.
- OTP values must be stored as secure hashes.
- Resending an OTP must invalidate the previous active OTP for the same user and purpose.
- A successfully consumed OTP must never be reusable.
- OTP verification and consumption must be handled atomically.

### 8.3 Candidate Profile Rules

- Each candidate account can have one candidate profile.
- A candidate can maintain one active resume in V1.
- A candidate can add multiple experiences and education records.
- A candidate can associate multiple skills with their profile.
- Duplicate candidate-skill relationships are not allowed.

### 8.4 Recruiter and Company Rules

- Each recruiter account can own one company in V1.
- Each company must belong to one industry.
- A company can publish multiple jobs.
- Company ownership must be preserved for historical recruitment records.

### 8.5 Job Management Rules

- A job must belong to an existing company.
- Only published jobs can receive applications.
- Closed and archived jobs must not accept new applications.
- A candidate cannot apply after the application deadline.
- A job must be closed or archived instead of physically deleted.
- Employment type and workplace type must be validated independently.

### 8.6 Salary Validation Rules

| Salary Type   | salary_min | salary_max | Description                        |
| ------------- | ---------- | ---------- | ---------------------------------- |
| Fixed         | Required   | NULL       | One fixed salary amount            |
| Range         | Required   | Required   | Minimum and maximum salary         |
| Negotiable    | NULL       | NULL       | Salary is negotiable               |
| Not Disclosed | NULL       | NULL       | Salary information is not provided |

Additional rules:

- Salary amounts must not be negative.
- For a range, `salary_min` must not exceed `salary_max`.
- Currency and salary period must be provided when a salary amount is specified.
- Currency must use a supported ISO 4217 currency code.

### Salary Database Constraints

The database must enforce the following rules:

1. Salary amounts must never be negative.
2. For `fixed`, `salary_min` is required and `salary_max` must be NULL.
3. For `range`, both `salary_min` and `salary_max` are required, and `salary_min` must not exceed `salary_max`.
4. For `negotiable` and `not_disclosed`, both salary amounts must be NULL.
5. `currency` and `salary_period` are required when salary amounts are specified.

These rules must be enforced using PostgreSQL CHECK constraints where applicable. Currency code validation will be handled at the application layer in V1.

### 8.7 Application Management Rules

- A candidate can apply to multiple jobs.
- A candidate can apply to a particular job only once.
- Every application must preserve the resume used at submission time.
- Application status changes must create corresponding history records.
- The current application status must match the latest status history record.
- Application creation and initial status history creation must occur in one database transaction.
- Application status updates and history insertion must also occur in one database transaction.
- Historical application records must be preserved.

### 8.8 Saved Job Rules

- Candidates can save multiple jobs.
- A candidate cannot save the same job more than once.
- Saving a job must not create an application.
- Removing a saved job must not affect the actual job posting.

### 8.9 Data Integrity and Security

- Foreign key constraints must maintain valid relationships.
- Unique constraints must prevent duplicate business records.
- Check constraints must reject invalid values.
- Sensitive authentication data must never be stored in plain text.
- File uploads must be validated for allowed formats and file sizes.
- Application and account operations must enforce authorization rules at the application layer.
- Database transactions must be used for operations involving multiple dependent records.

### 8.10 Application Status Values

The V1 application statuses are:

- `applied`
- `under_review`
- `shortlisted`
- `interview`
- `hired`
- `rejected`
- `withdrawn`

### 8.11 Application Withdrawal Rules

- Candidates can withdraw their own applications.
- Recruiters cannot withdraw an application on behalf of a candidate.
- Every withdrawal must create a new record in `application_status_history`.
- Withdrawn applications and their historical records must be preserved.
- Withdrawal must not delete the application or its resume snapshot.

### 8.12 Application Status Transition Rules

The following status transitions are allowed:

| Current Status | Allowed Next Status               |
| -------------- | --------------------------------- |
| Applied        | Under Review, Rejected, Withdrawn |
| Under Review   | Shortlisted, Rejected, Withdrawn  |
| Shortlisted    | Interview, Rejected, Withdrawn    |
| Interview      | Hired, Rejected, Withdrawn        |
| Hired          | None                              |
| Rejected       | None                              |
| Withdrawn      | None                              |

**Additional Rules:**

- `hired`, `rejected`, and `withdrawn` are terminal statuses.
- Terminal statuses cannot be changed once assigned.
- Candidates can withdraw their own applications from any non-terminal status.
- Recruiters can update application statuses according to the allowed transition rules.
- Every valid status change must update `applications.status` and append a corresponding `application_status_history` record within the same database transaction.
- Initial application creation and its `applied` history record must also occur within the same transaction.
- Application history is append-only and must never be edited or deleted through normal application workflows.

## 9. PostgreSQL Implementation Standards

JobSphere uses PostgreSQL as its primary relational database.

The following implementation standards must be followed when translating the ERD into database migrations.

### 9.1 Primary Key Generation

- All primary keys will use BIGINT.
- Auto-generated primary keys will use PostgreSQL IDENTITY columns.
- The preferred definition is `BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`.

### 9.2 Timestamp Standards

- Time-related columns should use TIMESTAMPTZ to support timezone-aware data.
- Application timestamps should be stored consistently in UTC.
- User-facing timestamps should be converted to the user's preferred timezone.
- `created_at` and `updated_at` should be maintained consistently by the application.

### 9.3 Data Integrity

- Foreign keys must reference valid primary or unique keys.
- Unique constraints and CHECK constraints must be enforced by PostgreSQL.
- Composite unique constraints must be used where multiple columns together define uniqueness.
- Database transactions must protect operations involving multiple dependent records.

### 9.4 Naming Conventions

- Table names must use lowercase snake_case and plural naming where appropriate.
- Column names must use lowercase snake_case.
- Primary keys should use `id`.
- Foreign keys should follow the referenced entity name with the `_id` suffix.
- Index names should follow a consistent naming convention.

### 9.5 Database Security

- Database credentials must not be exposed in frontend code.
- Sensitive authentication information must be protected.
- Application users must access data through authorized application operations.
- Production database access must follow the principle of least privilege.
