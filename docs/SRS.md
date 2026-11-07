# JobSphere

## Software Requirements Specification (SRS)

---

# 1. Project Overview

JobSphere is a modern full-stack job portal platform designed to connect job seekers with recruiters through a secure, scalable, and user-friendly recruitment system.

The platform enables candidates to create professional profiles, upload resumes, search and apply for jobs, while allowing recruiters to manage companies, publish job postings, and review applications through a centralized dashboard.

This project is being developed as a portfolio-grade production-oriented application following real-world software engineering practices, including software architecture planning, database design, API-first development, documentation, and version control.

---

# 2. Project Goals

The primary goals of JobSphere are:

- Build a production-oriented recruitment platform.
- Practice real-world software architecture and system design.
- Develop secure authentication with email verification.
- Design scalable REST APIs using Laravel.
- Build a responsive user interface using React.
- Apply PostgreSQL relational database design principles.
- Follow professional Git and GitHub workflows.
- Produce a portfolio-quality project demonstrating full-stack development skills.

---

# 3. Target Users

JobSphere serves three primary user groups:

### Candidate

Individuals searching for employment opportunities.

### Recruiter

Company representatives responsible for publishing jobs and managing applications.

### Administrator

System administrators responsible for managing platform operations, users, and companies.

---

# 4. User Roles

## Candidate

Candidates can:

- Register and verify their email.
- Complete their professional profile.
- Upload a resume.
- Search and filter jobs.
- Save jobs for later.
- Apply for jobs.
- Track application status.

---

## Recruiter

Recruiters can:

- Register and verify their email.
- Create and manage a company profile.
- Publish and manage job postings.
- Review applicants.
- Update application statuses.

---

## Administrator

Administrators can:

- Manage users.
- Manage companies.
- Monitor platform activities.
- Maintain overall system integrity.

---

# 5. Core Features

## Authentication

- User registration with role selection.
- Email verification using One-Time Password (OTP).
- Secure login and logout.
- Forgot password and password reset.
- Role-based authentication and authorization.

---

## Candidate Features

- Complete professional profile.
- Upload and manage resume.
- Manage technical skills.
- Search and filter job listings.
- Save jobs for future applications.
- Apply for jobs.
- Track application status.
- Manage account settings.

---

## Recruiter Features

- Create and manage a company profile.
- Upload company logo.
- Publish, edit, close, and manage job postings.
- View applicants for each job.
- Update application status.
- Manage recruiter account settings.

---

## Public Features

- Browse available jobs.
- Search jobs by keyword.
- Filter jobs by location, industry, employment type, workplace type, and salary.
- View company information.
- View public job details.

---

## Administration Features

- Manage users.
- Manage companies.
- Manage industries.
- Manage countries and cities.
- Monitor platform activities.
- Suspend or deactivate accounts when necessary.

---

## Security Features

- Password hashing.
- Email verification.
- Protected API endpoints.
- Input validation.
- Authorization based on user roles.
- Secure file upload validation.
