# JobSphere

# Software Requirements Specification (SRS)

Version: 1.0 (Final)
Status: Architecture Frozen
Project Type: Portfolio-grade Full Stack Recruitment Platform

---

# Table of Contents

1. Project Overview
2. Project Goals
3. Scope
4. Target Users
5. User Roles
6. Functional Requirements
7. Non-Functional Requirements
8. Security Requirements
9. System Architecture
10. Technology Stack
11. Development Principles

---

# 1. Project Overview

JobSphere is a modern, production-oriented recruitment platform designed to connect job seekers with employers through a secure, scalable, and user-friendly web application.

The platform enables candidates to create professional profiles, upload resumes, search for jobs, and submit applications. Recruiters can create company profiles, publish job vacancies, review applicants, and manage recruitment activities through a centralized dashboard.

JobSphere is being developed primarily as a portfolio-grade software engineering project that follows real-world development practices including:

- Software Requirements Specification (SRS)
- Entity Relationship Design (ERD)
- API-first backend development
- RESTful architecture
- Secure authentication
- Professional Git workflow
- Production-ready folder structure
- Clean code principles
- Documentation-driven development

The objective is not only to build a functional recruitment platform, but also to demonstrate professional software engineering practices suitable for enterprise-level development.

---

# 2. Project Goals

The primary goals of JobSphere are:

- Build a production-quality recruitment platform.
- Practice real-world software architecture and system design.
- Implement secure authentication and authorization.
- Build scalable REST APIs using Laravel.
- Develop a modern frontend using React.
- Apply PostgreSQL relational database design principles.
- Follow documentation-driven development.
- Follow professional Git and GitHub workflows.
- Produce a portfolio-quality full-stack application.
- Design the application following clean architecture principles and maintainable coding standards.

---

# 3. Project Scope

JobSphere Version 1 focuses on the complete recruitment lifecycle between candidates and recruiters.

The system includes:

- User Authentication
- Email Verification
- Candidate Profile Management
- Recruiter Profile Management
- Company Management
- Job Posting Management
- Job Search
- Job Applications
- Saved Jobs
- Resume Management
- Application Tracking
- Administrator Management

The following features are intentionally excluded from Version 1:

- Real-time chat
- Video interviews
- AI resume analysis
- Payment integration
- Subscription plans
- Multi-company recruiter accounts
- Multi-language support
- Social login
- Two-factor authentication (2FA)

These features may be introduced in future versions.

---

# 4. Target Users

JobSphere serves three categories of users.

## Candidate

Individuals looking for employment opportunities.

Candidates create professional profiles, upload resumes, search jobs, and submit job applications.

---

## Recruiter

Recruiters represent companies and are responsible for hiring.

They manage company information, publish jobs, review applications, and update hiring progress.

---

## Administrator

Administrators manage the platform.

They oversee users, companies, industries, platform data, and system integrity.

---

# 5. User Roles

JobSphere supports three system roles.

## Candidate

Candidates can:

- Register
- Verify email
- Complete profile
- Upload resume
- Manage experiences
- Manage education
- Manage skills
- Search jobs
- Save jobs
- Apply for jobs
- Withdraw applications
- Track application status
- Manage account settings

---

## Recruiter

Recruiters can:

- Register
- Verify email
- Complete recruiter profile
- Create company profile
- Edit company information
- Publish jobs
- Edit jobs
- Close jobs
- Review applicants
- Update application status
- Manage recruiter account settings

---

## Administrator

Administrators can:

- Manage users
- Manage companies
- Manage industries
- Manage countries
- Manage cities
- Monitor platform activities
- Suspend accounts
- Deactivate accounts
- Maintain overall platform integrity

Public registration does not allow administrator account creation.

Administrator accounts are created only through administrative operations.

---

# 6. Functional Requirements

## 6.1 Authentication Module

The authentication module shall provide:

- User registration
- Candidate registration
- Recruiter registration
- Email verification using OTP
- Secure login
- Secure logout
- Current authenticated user API
- Forgot password
- Password reset
- Role-based authorization

Public registration shall allow only:

- Candidate
- Recruiter

Administrator registration is prohibited.

Only verified and active users may access protected APIs.

---

## 6.2 Candidate Module

Candidates shall be able to:

- Complete profile
- Update profile
- Upload profile photo
- Upload resume
- Replace resume
- Add experience
- Edit experience
- Delete experience
- Add education
- Edit education
- Delete education
- Add skills
- Remove skills
- View application history
- Save jobs
- Remove saved jobs

---

## 6.3 Recruiter Module

Recruiters shall be able to:

- Complete recruiter profile
- Create company
- Edit company
- Upload company logo
- Publish jobs
- Edit jobs
- Close jobs
- Archive jobs
- Review applicants
- Change application status

---

## 6.4 Public Module

Unauthenticated users shall be able to:

- Browse jobs
- Search jobs
- Filter jobs
- View company information
- View public job details

Authentication is required before applying for jobs.

---

## 6.5 Company Module

Each recruiter can create and manage one company in Version 1.

The company module shall provide:

- Create company profile
- Update company information
- Upload company logo
- View public company profile
- Associate company with an industry
- Associate company with a city

Company information includes:

- Company name
- Industry
- Description
- Website
- Contact email
- Phone number
- Company size
- Logo
- City

A recruiter can own only one company in Version 1.

---

## 6.6 Job Module

Recruiters shall be able to:

- Create jobs
- Publish jobs
- Edit jobs
- Close jobs
- Archive jobs

Each job includes:

- Title
- Description
- Responsibilities
- Requirements
- Benefits
- Employment type
- Workplace type
- Salary information
- Currency
- Salary period
- City
- Application deadline
- Status

Only published jobs are visible publicly.

Closed or archived jobs cannot receive new applications.

---

## 6.7 Application Module

Candidates shall be able to:

- Apply for jobs
- View submitted applications
- Withdraw applications

Recruiters shall be able to:

- Review applications
- Update application status
- View application timeline

Every application shall preserve:

- Resume snapshot
- Application history
- Status timeline

Application history must never be modified or deleted through normal platform operations.

---

## 6.8 Saved Jobs Module

Candidates shall be able to:

- Save jobs
- Remove saved jobs
- View saved jobs

Saving a job does not create a job application.

---

## 6.9 Administration Module

Administrators shall be able to:

- Manage users
- Manage companies
- Manage industries
- Manage countries
- Manage cities
- Monitor platform activities
- Suspend accounts
- Deactivate accounts

Administrators are responsible for maintaining platform integrity.

---

# 7. Non-Functional Requirements

## 7.1 Performance

The system should:

- Return API responses efficiently.
- Minimize unnecessary database queries.
- Support pagination for large datasets.
- Optimize frequently executed queries.
- Use appropriate database indexing.

---

## 7.2 Scalability

The architecture shall support future expansion without requiring major redesign.

Future enhancements may include:

- Multiple recruiters per company
- Multiple company branches
- Subscription plans
- AI-powered recommendations
- Messaging
- Notifications
- Multi-language support

---

## 7.3 Maintainability

The project shall follow:

- Modular architecture
- Reusable components
- Consistent naming conventions
- Separation of concerns
- Service-oriented backend design
- Clean folder organization

Documentation shall remain synchronized with implementation.

---

## 7.4 Reliability

The system shall ensure:

- Database consistency
- Transaction safety
- Graceful error handling
- Secure authentication
- Proper validation

Operations involving multiple related records shall use database transactions.

---

## 7.5 Availability

The platform should remain operational under normal usage.

Critical operations shall provide meaningful error responses instead of exposing internal exceptions.

---

## 7.6 Usability

The application shall provide:

- Responsive design
- Accessible forms
- Clear validation messages
- Consistent UI
- Intuitive navigation
- Mobile-friendly layouts

---

# 8. Security Requirements

JobSphere follows a security-first approach.

## Authentication

- Passwords must be securely hashed.
- Authentication uses Laravel Sanctum.
- Protected APIs require authentication.
- Tokens must remain confidential.

---

## Authorization

Every protected endpoint shall verify:

- Authentication
- User role
- Resource ownership

Users must never access resources belonging to other users unless explicitly permitted.

---

## Email Verification

The system shall support:

- Six-digit numeric OTP
- Secure OTP hashing
- OTP expiration
- Maximum verification attempts
- OTP invalidation
- Atomic verification

---

## Input Validation

All user input shall be validated.

Validation shall be enforced on:

- API requests
- File uploads
- Authentication
- Profile updates

---

## File Upload Security

Uploaded files shall:

- Be validated
- Have allowed MIME types
- Have maximum size restrictions
- Be stored securely
- Not be publicly executable

---

## API Security

Protected APIs shall:

- Require authentication
- Return appropriate HTTP status codes
- Never expose sensitive information
- Return consistent JSON responses

---

# 9. System Architecture

JobSphere follows a modern client-server architecture.

Frontend:

- React
- Vite
- React Router
- Axios
- Tailwind CSS

Backend:

- Laravel
- REST API
- Sanctum Authentication

Database:

- PostgreSQL

Storage:

- Local Storage (Development)
- Cloud Storage (Future)

Communication:

React

↓

Axios

↓

Laravel REST API

↓

PostgreSQL

The frontend never communicates directly with the database.

---

# 10. Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

---

## Backend

- Laravel
- Laravel Sanctum
- Form Requests
- Eloquent ORM

---

## Database

- PostgreSQL

---

## Version Control

- Git
- GitHub

---

## Development Tools

- Visual Studio Code
- Postman
- Composer
- Node.js
- npm

---

# 11. Development Principles

JobSphere follows documentation-driven development.

Development order shall always be:

1. SRS
2. ERD
3. Database Design
4. Migrations
5. Models
6. Relationships
7. Form Requests
8. Services
9. Controllers
10. Routes
11. API Testing
12. Frontend Integration
13. UI Polish
14. Testing
15. Documentation Update

The implementation must remain consistent with the approved SRS and ERD.

Architecture changes require updating the documentation before implementation.

Feature development should be completed module-by-module rather than across multiple unfinished modules simultaneously.

The project shall prioritize code readability, maintainability, security, and scalability over premature optimization.

---

# End of Software Requirements Specification
