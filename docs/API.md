# JobSphere REST API Documentation

## Overview

JobSphere provides a RESTful API built with Laravel. The API is consumed by the React frontend and uses JSON for all requests and responses.

Protected endpoints require authentication using **Laravel Sanctum**.

---

## Base URL

### Local Development

```text
http://127.0.0.1:8000/api
```

### Production

```text
https://jobsphere-production-8d895004.up.railway.app/api
```

---

## Authentication

Protected endpoints require the following HTTP header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# Public Routes

| Method | Endpoint              | Description                   |
| :----- | :-------------------- | :---------------------------- |
| GET    | `/companies/{slug}`   | View a public company profile |
| GET    | `/public/jobs`        | Browse published jobs         |
| GET    | `/public/jobs/{slug}` | View published job details    |

---

# Authentication Routes

| Method | Endpoint           | Authentication |
| :----- | :----------------- | :------------- |
| POST   | `/auth/register`   | No             |
| POST   | `/auth/verify-otp` | No             |
| POST   | `/auth/resend-otp` | No             |
| POST   | `/auth/login`      | No             |
| POST   | `/auth/logout`     | Yes            |
| GET    | `/auth/user`       | Yes            |

---

# Company Routes

| Method | Endpoint   |
| :----- | :--------- |
| POST   | `/company` |
| GET    | `/company` |
| PUT    | `/company` |

---

# Recruiter Profile Routes

| Method | Endpoint             |
| :----- | :------------------- |
| POST   | `/recruiter-profile` |
| GET    | `/recruiter-profile` |
| PUT    | `/recruiter-profile` |

---

# Candidate Profile Routes

| Method | Endpoint             |
| :----- | :------------------- |
| POST   | `/candidate-profile` |
| GET    | `/candidate-profile` |
| PUT    | `/candidate-profile` |

---

# Job Routes

| Method | Endpoint              |
| :----- | :-------------------- |
| GET    | `/jobs`               |
| POST   | `/jobs`               |
| GET    | `/jobs/{job}`         |
| PUT    | `/jobs/{job}`         |
| PATCH  | `/jobs/{job}/publish` |
| PATCH  | `/jobs/{job}/close`   |

---

# Application Routes

| Method | Endpoint                               |
| :----- | :------------------------------------- |
| GET    | `/applications`                        |
| POST   | `/applications`                        |
| GET    | `/applications/check/{job}`            |
| GET    | `/applications/{application}`          |
| PATCH  | `/applications/{application}/withdraw` |

---

# Saved Job Routes

| Method | Endpoint                  |
| :----- | :------------------------ |
| POST   | `/saved-jobs/{job}`       |
| GET    | `/saved-jobs`             |
| DELETE | `/saved-jobs/{job}`       |
| GET    | `/saved-jobs/check/{job}` |

---

# Recruiter Application Management

| Method | Endpoint                                       |
| :----- | :--------------------------------------------- |
| GET    | `/recruiter/applications`                      |
| GET    | `/recruiter/applications/{application}`        |
| PATCH  | `/recruiter/applications/{application}/status` |

---

# Industry Routes

| Method | Endpoint      |
| :----- | :------------ |
| GET    | `/industries` |

---

# City Routes

| Method | Endpoint  |
| :----- | :-------- |
| GET    | `/cities` |

---

# Dashboard Route

| Method | Endpoint     |
| :----- | :----------- |
| GET    | `/dashboard` |

---

## HTTP Status Codes

| Status Code | Description           |
| :---------- | :-------------------- |
| 200         | OK                    |
| 201         | Created               |
| 204         | No Content            |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 422         | Validation Error      |
| 500         | Internal Server Error |

---

## Notes

- All request and response bodies use **JSON**.
- Protected endpoints require a valid **Laravel Sanctum** access token.
- Validation errors return HTTP **422 Unprocessable Entity**.
- Authentication and authorization are enforced on protected routes.
- Public routes are accessible without authentication.
