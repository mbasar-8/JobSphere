# JobSphere API Documentation

Version: 1.0 (V1)

---

# 1. API Overview

## Purpose

This document defines the REST API used by the JobSphere frontend and backend.

The frontend is built with React, while the backend is built with Laravel. All communication between the client and server is performed through JSON-based REST APIs.

This document focuses only on the APIs required for JobSphere Version 1 (V1). Additional endpoints may be introduced in future versions.

---

## Technology Stack

Frontend

- React
- Axios
- React Router

Backend

- Laravel
- PostgreSQL
- Laravel Sanctum

---

## Base URL

Development

```
http://localhost:8000/api
```

Production

```
https://your-domain.com/api
```

The production URL will be updated after deployment.

---

## API Principles

JobSphere APIs follow these principles:

- RESTful endpoint design
- JSON request and response bodies
- Stateless communication
- Token-based authentication using Laravel Sanctum
- Proper HTTP status codes
- Consistent response structure
- Secure input validation
- Principle of least privilege

---

# 2. API Standards

## Request Format

Requests must use JSON unless uploading files.

Example

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

---

## HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

---

## Authentication

Protected endpoints require an authenticated user.

Authentication will use Laravel Sanctum.

Clients must send the access token with every protected request.

```
Authorization: Bearer {access_token}
```

---

## Content Type

```
Content-Type: application/json
Accept: application/json
```

File upload endpoints will use:

```
multipart/form-data
```

---

## API Versioning

The initial release targets Version 1 (V1).

Future breaking changes should be introduced through a new API version while maintaining backward compatibility where practical.

---

## Date & Time

All timestamps are stored in UTC by the backend.

Responses use ISO 8601 date-time format.

Example

```
2026-11-07T08:30:00Z
```

---

## Pagination

Collection endpoints should return paginated results.

Default page size:

```
20
```

Clients may request a different page size within allowed limits.

---

## General Development Rules

- Validate every request.
- Never trust client input.
- Return meaningful error messages.
- Keep response structures consistent.
- Protect all sensitive endpoints with authentication and authorization.
- Keep business logic in the backend.
- Avoid breaking API contracts within V1.
- Document new endpoints as they are implemented.
