# Architecture Decisions

## Overview

JobSphere is a production-oriented full-stack recruitment platform built with Laravel, React, and PostgreSQL.

The project follows a client-server architecture where the frontend and backend are developed as independent applications communicating through a RESTful API.

This document explains the major architectural decisions made during the development of Version 1.

---

# High-Level Architecture

```text
                 React Frontend
                       │
                    Axios
                       │
                RESTful API
                       │
             Laravel Backend
                       │
         Laravel Sanctum Authentication
                       │
                 PostgreSQL
```

---

# Frontend

**Technology:** React + Vite

### Decision

The frontend is separated from the backend to provide a modern Single Page Application (SPA) experience.

### Benefits

- Fast user interface
- Component-based architecture
- Independent frontend deployment
- Easy API integration
- Better scalability

---

# Backend

**Technology:** Laravel

### Decision

Laravel was selected because it provides a mature ecosystem for building secure and maintainable REST APIs.

### Benefits

- MVC architecture
- Built-in authentication support
- Request validation
- Eloquent ORM
- Database migrations
- API Resources
- Clean routing

---

# Database

**Technology:** PostgreSQL

### Decision

PostgreSQL was chosen instead of MySQL to gain experience with another production-grade relational database while building a portfolio project.

### Benefits

- Strong relational model
- Excellent data integrity
- Reliable indexing
- Advanced SQL features
- Production-ready performance

---

# Authentication

**Technology:** Laravel Sanctum

### Decision

Laravel Sanctum provides lightweight token-based authentication suitable for first-party SPAs.

### Benefits

- Secure authentication
- Token management
- Easy integration with React
- Official Laravel package

---

# Email Verification

**Technology:** Resend

### Decision

Resend is used to deliver One-Time Password (OTP) emails during account verification.

### Benefits

- Simple API
- Reliable email delivery
- Modern developer experience

---

# API Design

The backend exposes a RESTful API.

### Principles

- Resource-oriented endpoints
- Proper HTTP methods
- JSON request and response format
- Stateless communication
- Consistent validation
- Standard HTTP status codes

---

# Database Design

The database follows a normalized relational structure.

Core entities include:

- Users
- Candidate Profiles
- Recruiter Profiles
- Companies
- Jobs
- Applications
- Saved Jobs
- Industries
- Countries
- Cities

Relationships are enforced using foreign keys to maintain referential integrity.

---

# Authorization

The application supports multiple user roles.

- Candidate
- Recruiter
- Admin

Role-based authorization is enforced on protected routes to ensure users can only access resources permitted for their role.

---

# Deployment

The application is deployed using separate frontend and backend services.

| Component | Platform   |
| :-------- | :--------- |
| Frontend  | Vercel     |
| Backend   | Railway    |
| Database  | PostgreSQL |

---

# Design Goals

The architecture was designed with the following goals:

- Maintainability
- Scalability
- Separation of concerns
- Clean project structure
- Production-oriented development
- Secure authentication
- RESTful API design

---

# Future Improvements

Planned architectural improvements include:

- File storage for profile photos and company logos
- Fully responsive user interface
- Additional admin capabilities
- Performance optimizations
- Continued feature enhancements
