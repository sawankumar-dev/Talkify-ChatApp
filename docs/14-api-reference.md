# API Reference

> **Project:** Real-Time Chat Application
> **API Version:** `v1`
> **Base URL:** `/api/v1`
> **Protocol:** HTTP/HTTPS
> **Backend:** Node.js + Express.js
> **Database:** MongoDB + Mongoose
> **Real-Time:** WebSocket
> **Authentication:** JWT + HTTP-only Cookies

---

# Table of Contents

* [1. API Conventions](#1-api-conventions)
* [2. Authentication](#2-authentication)
* [3. Users](#3-users)
* [4. Conversations](#4-conversations)
* [5. Conversation Members](#5-conversation-members)
* [6. Messages](#6-messages)
* [7. Reactions](#7-reactions)
* [8. Attachments](#8-attachments)
* [9. Notifications](#9-notifications)
* [10. Blocks](#10-blocks)
* [11. Health](#11-health)
* [12. Admin](#12-admin)
* [13. Common Error Codes](#13-common-error-codes)
* [14. Authentication Requirements](#14-authentication-requirements)
* [15. Pagination Reference](#15-pagination-reference)
* [16. API Response Reference](#16-api-response-reference)
* [17. HTTP Status Reference](#17-http-status-reference)
* [18. Complete Endpoint Map](#18-complete-endpoint-map)

---

# 1. API Conventions

## Base URL

Development:

```text
http://localhost:5000/api/v1
```

Production:

```text
https://api.example.com/api/v1
```

---

## Content Type

JSON requests:

```http
Content-Type: application/json
```

File uploads:

```http
Content-Type: multipart/form-data
```

---

## Authentication

Protected routes use the authenticated user session.

Authentication information will primarily be handled through secure HTTP-only cookies.

Conceptually:

```text
Client
   |
   | Cookie
   v
Express
   |
   v
Auth Middleware
   |
   v
req.user
```

---

## Standard Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

---

# 2. Authentication

Authentication prefix:

```text
/auth
```

---

## 2.1 Register

### Endpoint

```http
POST /api/v1/auth/register
```

### Authentication

```text
Public
```

### Request Body

```json
{
  "username": "sawan",
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

### Fields

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `username` | string | Yes      |
| `email`    | string | Yes      |
| `password` | string | Yes      |

### Success

```http
201 Created
```

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "username": "sawan",
      "email": "user@example.com"
    }
  }
}
```

### Possible Errors

```text
EMAIL_ALREADY_EXISTS
USERNAME_ALREADY_EXISTS
VALIDATION_ERROR
```

---

# 2.2 Login

### Endpoint

```http
POST /api/v1/auth/login
```

### Authentication

```text
Public
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

### Success

```http
200 OK
```

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "username": "sawan",
      "email": "user@example.com"
    }
  }
}
```

Authentication cookies are set by the server.

### Possible Errors

```text
INVALID_CREDENTIALS
ACCOUNT_DISABLED
VALIDATION_ERROR
```

---

# 2.3 Logout

### Endpoint

```http
POST /api/v1/auth/logout
```

### Authentication

```text
Required
```

### Success

```http
200 OK
```

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

# 2.4 Refresh Session

### Endpoint

```http
POST /api/v1/auth/refresh
```

### Authentication

```text
Refresh authentication required
```

### Success

```http
200 OK
```

```json
{
  "success": true,
  "message": "Session refreshed"
}
```

---

# 2.5 Current User

### Endpoint

```http
GET /api/v1/auth/me
```

### Authentication

```text
Required
```

### Success

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "USER_ID",
      "username": "sawan",
      "email": "user@example.com"
    }
  }
}
```

---

# 2.6 Forgot Password

### Endpoint

```http
POST /api/v1/auth/forgot-password
```

### Authentication

```text
Public
```

### Request

```json
{
  "email": "user@example.com"
}
```

### Success

```http
200 OK
```

```json
{
  "success": true,
  "message": "If the account exists, password reset instructions have been sent"
}
```

---

# 2.7 Reset Password

### Endpoint

```http
POST /api/v1/auth/reset-password
```

### Authentication

```text
Public + reset token
```

### Request

```json
{
  "token": "RESET_TOKEN",
  "password": "NewStrongPassword123!"
}
```

---

# 3. Users

User prefix:

```text
/users
```

---

# 3.1 Get Users

### Endpoint

```http
GET /api/v1/users
```

### Authentication

```text
Required
```

### Query Parameters

```text
?page=1
&limit=20
&search=sawan
```

### Example

```http
GET /api/v1/users?search=sawan&page=1&limit=20
```

### Success

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "hasNextPage": false
    }
  }
}
```

---

# 3.2 Get User

### Endpoint

```http
GET /api/v1/users/:userId
```

### Path Parameters

| Parameter | Description    |
| --------- | -------------- |
| `userId`  | Target user ID |

### Success

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "USER_ID",
      "username": "sawan",
      "bio": "Developer"
    }
  }
}
```

---

# 3.3 Get Current User

### Endpoint

```http
GET /api/v1/users/me
```

### Authentication

```text
Required
```

---

# 3.4 Update Current User

### Endpoint

```http
PATCH /api/v1/users/me
```

### Request

```json
{
  "username": "newUsername",
  "bio": "Full Stack Developer"
}
```

### Success

```json
{
  "success": true,
  "message": "Profile updated",
  "data": {
    "user": {}
  }
}
```

---

# 3.5 Update Avatar

### Endpoint

```http
PATCH /api/v1/users/me/avatar
```

### Authentication

```text
Required
```

### Content Type

```text
multipart/form-data
```

### Form Field

```text
avatar
```

---

# 3.6 Update Status

### Endpoint

```http
PATCH /api/v1/users/me/status
```

### Request

```json
{
  "status": "online"
}
```

Allowed application statuses may include:

```text
online
offline
away
busy
```

Real-time presence itself is handled through WebSocket.

---

# 4. Conversations

Prefix:

```text
/conversations
```

---

# 4.1 Get Conversations

### Endpoint

```http
GET /api/v1/conversations
```

### Authentication

```text
Required
```

### Query

```text
?page=1
&limit=20
&sort=-updatedAt
```

### Success

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "hasNextPage": false
    }
  }
}
```

---

# 4.2 Create Conversation

### Endpoint

```http
POST /api/v1/conversations
```

### Authentication

```text
Required
```

---

## Direct Conversation

### Request

```json
{
  "type": "direct",
  "memberIds": [
    "USER_ID"
  ]
}
```

---

## Group Conversation

### Request

```json
{
  "type": "group",
  "name": "Developers",
  "memberIds": [
    "USER_ID_1",
    "USER_ID_2"
  ]
}
```

### Success

```http
201 Created
```

```json
{
  "success": true,
  "message": "Conversation created",
  "data": {
    "conversation": {}
  }
}
```

---

# 4.3 Get Conversation

### Endpoint

```http
GET /api/v1/conversations/:conversationId
```

### Authentication

```text
Required
```

### Authorization

User must be a member of the conversation.

---

# 4.4 Update Conversation

### Endpoint

```http
PATCH /api/v1/conversations/:conversationId
```

### Request

```json
{
  "name": "New Group Name"
}
```

### Authorization

Usually:

```text
Group Admin
```

---

# 4.5 Delete / Leave Conversation

### Endpoint

```http
DELETE /api/v1/conversations/:conversationId
```

### Authentication

```text
Required
```

Depending on conversation type:

```text
Direct chat → archive/remove relationship
Group → leave group
Admin → possibly delete/archive group
```

Exact behavior service layer define karegi.

---

# 5. Conversation Members

Prefix:

```text
/conversations/:conversationId/members
```

---

# 5.1 Get Members

```http
GET /api/v1/conversations/:conversationId/members
```

### Authentication

```text
Required
```

---

# 5.2 Add Member

```http
POST /api/v1/conversations/:conversationId/members
```

### Request

```json
{
  "userId": "USER_ID"
}
```

### Authorization

```text
Conversation Admin
```

---

# 5.3 Update Member

```http
PATCH /api/v1/conversations/:conversationId/members/:userId
```

### Request

```json
{
  "role": "admin"
}
```

---

# 5.4 Remove Member

```http
DELETE /api/v1/conversations/:conversationId/members/:userId
```

### Authorization

```text
Conversation Admin
```

---

# 6. Messages

Messages ke liye do concepts hain:

```text
HTTP → History / CRUD
WebSocket → Real-Time delivery
```

Prefix:

```text
/conversations/:conversationId/messages
```

---

# 6.1 Get Messages

### Endpoint

```http
GET /api/v1/conversations/:conversationId/messages
```

### Authentication

```text
Required
```

### Authorization

```text
Conversation Member
```

### Query Parameters

```text
?limit=50
&before=CURSOR
```

### Example

```http
GET /api/v1/conversations/123/messages?limit=50&before=abc123
```

### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "MESSAGE_ID",
        "conversationId": "CONVERSATION_ID",
        "senderId": "USER_ID",
        "type": "text",
        "content": "Hello bro!",
        "createdAt": "2026-08-11T10:00:00.000Z"
      }
    ],
    "pagination": {
      "nextCursor": "CURSOR",
      "hasMore": true
    }
  }
}
```

---

# 6.2 Create Message Through HTTP

### Endpoint

```http
POST /api/v1/conversations/:conversationId/messages
```

### Authentication

```text
Required
```

### Request

```json
{
  "type": "text",
  "content": "Hello bro!"
}
```

### Important

Live chat ke liye primary flow WebSocket hoga.

HTTP endpoint fallback/testing/history architecture mein useful rahega.

---

# 6.3 Get Message

```http
GET /api/v1/messages/:messageId
```

---

# 6.4 Edit Message

```http
PATCH /api/v1/messages/:messageId
```

### Request

```json
{
  "content": "Updated message"
}
```

### Authorization

Normally:

```text
Message Owner
```

---

# 6.5 Delete Message

```http
DELETE /api/v1/messages/:messageId
```

### Behavior

Preferred:

```text
Soft Delete
```

Database:

```text
deletedAt
```

Response:

```json
{
  "success": true,
  "message": "Message deleted"
}
```

---

# 7. Reactions

Prefix:

```text
/messages/:messageId/reactions
```

---

# 7.1 Get Reactions

```http
GET /api/v1/messages/:messageId/reactions
```

---

# 7.2 Add Reaction

```http
POST /api/v1/messages/:messageId/reactions
```

### Request

```json
{
  "emoji": "❤️"
}
```

---

# 7.3 Remove Reaction

```http
DELETE /api/v1/messages/:messageId/reactions/:emoji
```

---

# 8. Attachments

Prefix:

```text
/attachments
```

---

# 8.1 Upload Attachment

```http
POST /api/v1/attachments
```

### Authentication

```text
Required
```

### Content Type

```text
multipart/form-data
```

### Form

```text
file=<binary>
```

---

# 8.2 Get Attachment

```http
GET /api/v1/attachments/:attachmentId
```

---

# 8.3 Delete Attachment

```http
DELETE /api/v1/attachments/:attachmentId
```

---

# 9. Notifications

Prefix:

```text
/notifications
```

---

# 9.1 Get Notifications

```http
GET /api/v1/notifications
```

### Query

```text
?page=1
&limit=20
&unread=true
```

---

# 9.2 Mark Notification Read

```http
PATCH /api/v1/notifications/:notificationId/read
```

---

# 9.3 Mark All Read

```http
POST /api/v1/notifications/read-all
```

---

# 10. Blocks

Prefix:

```text
/blocks
```

---

# 10.1 Get Blocked Users

```http
GET /api/v1/blocks
```

---

# 10.2 Block User

```http
POST /api/v1/blocks
```

### Request

```json
{
  "userId": "USER_ID"
}
```

---

# 10.3 Unblock User

```http
DELETE /api/v1/blocks/:userId
```

---

# 11. Health

---

# 11.1 Basic Health

```http
GET /api/v1/health
```

### Response

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

---

# 12. Admin

Prefix:

```text
/admin
```

All admin routes require:

```text
Authentication
+
Admin Authorization
```

---

# 12.1 Get Users

```http
GET /api/v1/admin/users
```

---

# 12.2 Get User

```http
GET /api/v1/admin/users/:userId
```

---

# 12.3 Update User Status

```http
PATCH /api/v1/admin/users/:userId/status
```

### Request

```json
{
  "status": "suspended"
}
```

---

# 12.4 Delete User

```http
DELETE /api/v1/admin/users/:userId
```

---

# 12.5 Reports

```http
GET /api/v1/admin/reports
```

---

# 13. Common Error Codes

Application-level error codes:

| Code                       | Meaning                              |
| -------------------------- | ------------------------------------ |
| `VALIDATION_ERROR`         | Invalid request                      |
| `INVALID_CREDENTIALS`      | Login failed                         |
| `UNAUTHORIZED`             | Authentication required              |
| `FORBIDDEN`                | Permission denied                    |
| `USER_NOT_FOUND`           | User doesn't exist                   |
| `CONVERSATION_NOT_FOUND`   | Conversation doesn't exist           |
| `MESSAGE_NOT_FOUND`        | Message doesn't exist                |
| `NOT_A_MEMBER`             | User isn't a conversation member     |
| `ALREADY_MEMBER`           | User already belongs to conversation |
| `EMAIL_ALREADY_EXISTS`     | Email already registered             |
| `USERNAME_ALREADY_EXISTS`  | Username already registered          |
| `MESSAGE_EDIT_FORBIDDEN`   | Cannot edit message                  |
| `MESSAGE_DELETE_FORBIDDEN` | Cannot delete message                |
| `ALREADY_REACTED`          | Reaction already exists              |
| `NOT_REACTED`              | Reaction doesn't exist               |
| `USER_BLOCKED`             | User is blocked                      |
| `RATE_LIMITED`             | Too many requests                    |
| `INVALID_CURSOR`           | Pagination cursor invalid            |
| `RESOURCE_NOT_FOUND`       | Resource doesn't exist               |
| `INTERNAL_SERVER_ERROR`    | Unexpected server error              |

---

# 14. Authentication Requirements

Legend:

```text
PUBLIC
```

No authentication.

```text
AUTH
```

Authenticated user required.

```text
ADMIN
```

Authenticated admin required.

---

## Authentication

| Method | Endpoint                | Auth    |
| ------ | ----------------------- | ------- |
| POST   | `/auth/register`        | PUBLIC  |
| POST   | `/auth/login`           | PUBLIC  |
| POST   | `/auth/logout`          | AUTH    |
| POST   | `/auth/refresh`         | REFRESH |
| GET    | `/auth/me`              | AUTH    |
| POST   | `/auth/forgot-password` | PUBLIC  |
| POST   | `/auth/reset-password`  | PUBLIC  |

---

## Users

| Method | Endpoint           | Auth |
| ------ | ------------------ | ---- |
| GET    | `/users`           | AUTH |
| GET    | `/users/:userId`   | AUTH |
| GET    | `/users/me`        | AUTH |
| PATCH  | `/users/me`        | AUTH |
| PATCH  | `/users/me/avatar` | AUTH |
| PATCH  | `/users/me/status` | AUTH |

---

## Conversations

| Method | Endpoint                         | Auth |
| ------ | -------------------------------- | ---- |
| GET    | `/conversations`                 | AUTH |
| POST   | `/conversations`                 | AUTH |
| GET    | `/conversations/:conversationId` | AUTH |
| PATCH  | `/conversations/:conversationId` | AUTH |
| DELETE | `/conversations/:conversationId` | AUTH |

---

# 15. Pagination Reference

## Offset Pagination

Use for:

```text
Users
Conversations
Notifications
```

Example:

```http
GET /api/v1/users?page=2&limit=20
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 2,
    "limit": 20,
    "hasNextPage": true
  }
}
```

---

## Cursor Pagination

Use primarily for:

```text
Messages
```

Example:

```http
GET /api/v1/conversations/123/messages?limit=50&before=abc
```

Response:

```json
{
  "items": [],
  "pagination": {
    "nextCursor": "xyz",
    "hasMore": true
  }
}
```

---

# 16. API Response Reference

## Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

## Collection

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {}
  }
}
```

---

## Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

---

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "fields": {
      "email": "Invalid email",
      "password": "Password is required"
    }
  }
}
```

---

# 17. HTTP Status Reference

## `200 OK`

Successful request.

```text
GET
PATCH
DELETE
```

depending on response behavior.

---

## `201 Created`

New resource created.

```text
POST /conversations
POST /messages
```

---

## `204 No Content`

Successful operation with no response body.

Useful for certain delete operations.

---

## `400 Bad Request`

Malformed or invalid request.

---

## `401 Unauthorized`

Authentication missing or invalid.

---

## `403 Forbidden`

User authenticated hai but action allowed nahi hai.

Example:

```text
User is not conversation admin
```

---

## `404 Not Found`

Resource doesn't exist.

---

## `409 Conflict`

Resource state conflict.

Example:

```text
Email already exists
User already belongs to group
```

---

## `422 Unprocessable Entity`

Semantic validation failure.

Project-wide convention decide karne ke baad `400` aur `422` mein consistency maintain karni hai.

---

## `429 Too Many Requests`

Rate limit exceeded.

---

## `500 Internal Server Error`

Unexpected backend error.

---

## `503 Service Unavailable`

Dependency/service temporarily unavailable.

---

# 18. Complete Endpoint Map

```text
/api/v1
│
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /refresh
│   ├── GET    /me
│   ├── POST   /forgot-password
│   └── POST   /reset-password
│
├── /users
│   ├── GET    /
│   ├── GET    /me
│   ├── PATCH  /me
│   ├── PATCH  /me/avatar
│   ├── PATCH  /me/status
│   └── GET    /:userId
│
├── /conversations
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:conversationId
│   ├── PATCH  /:conversationId
│   ├── DELETE /:conversationId
│   │
│   └── /:conversationId/members
│       ├── GET    /
│       ├── POST   /
│       ├── PATCH  /:userId
│       └── DELETE /:userId
│
├── /conversations/:conversationId/messages
│   ├── GET    /
│   └── POST   /
│
├── /messages
│   └── /:messageId
│       ├── GET    /
│       ├── PATCH  /
│       └── DELETE /
│
├── /messages/:messageId/reactions
│   ├── GET    /
│   ├── POST   /
│   └── DELETE /:emoji
│
├── /attachments
│   ├── POST   /
│   ├── GET    /:attachmentId
│   └── DELETE /:attachmentId
│
├── /notifications
│   ├── GET    /
│   ├── PATCH  /:notificationId/read
│   └── POST   /read-all
│
├── /blocks
│   ├── GET    /
│   ├── POST   /
│   └── DELETE /:userId
│
├── /health
│   └── GET    /
│
└── /admin
    ├── GET    /users
    ├── GET    /users/:userId
    ├── PATCH  /users/:userId/status
    ├── DELETE /users/:userId
    └── GET    /reports
```

---

# API Development Order

Hamare project ko implement karte waqt APIs isi order mein banana best rahega:

```text
1. Health API
      ↓
2. Authentication API
      ↓
3. User API
      ↓
4. Conversation API
      ↓
5. Member API
      ↓
6. Message API
      ↓
7. WebSocket Message Events
      ↓
8. Reaction API
      ↓
9. Attachment API
      ↓
10. Notification API
      ↓
11. Block API
      ↓
12. Admin API
```

---

# API + WebSocket Relationship

Final system:

```text
                    FRONTEND
                       |
              +--------+--------+
              |                 |
             HTTP            WebSocket
              |                 |
              v                 v
         Express API       Socket Server
              |                 |
              v                 v
         Controllers        Socket Events
              |                 |
              +--------+--------+
                       |
                       v
                    Services
                       |
                       v
                    Mongoose
                       |
                       v
                    MongoDB
```

### Important Principle

```text
HTTP / WebSocket
       ↓
    Transport
       ↓
     Service
       ↓
   Business Logic
       ↓
    Database
```

Iska matlab:

> **Business logic ko HTTP controller aur WebSocket handler ke andar duplicate nahi karna hai.**

Dono ko same service layer use karni chahiye.

---

# Quick Reference

Agar sirf ek minute mein project ki API yaad karni ho:

```text
AUTH
/auth/*

USERS
/users/*

CHAT
/conversations/*

MESSAGES
/conversations/:id/messages
/messages/:messageId

REACTIONS
/messages/:messageId/reactions

FILES
/attachments/*

NOTIFICATIONS
/notifications/*

BLOCKING
/blocks/*

HEALTH
/health

ADMIN
/admin/*
```

---

# Final Rule

> **`api-design.md` explain karta hai ki API ko kaise design karna hai.**
>
> **`api-reference.md` batata hai ki actual API mein kaunsa endpoint kya karta hai.**

Isliye development ke time:

```text
Need to understand API architecture?
        ↓
api-design.md

Need to find an endpoint quickly?
        ↓
api-reference.md
```

Dono files ka purpose alag hai, aur dono milkar hamare backend ka complete API contract banayengi.
