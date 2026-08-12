# API Design — Complete Guide

> **Project:** Real-Time Chat Application
> **API Style:** REST API
> **Backend:** Node.js + Express.js
> **Database:** MongoDB + Mongoose
> **Authentication:** JWT + HTTP-only Cookies
> **Real-Time:** WebSocket
> **API Version:** `v1`

---

# Table of Contents

1. [API Design Kya Hai](#1-api-design-kya-hai)
2. [API Ka Role](#2-api-ka-role)
3. [REST API Kya Hai](#3-rest-api-kya-hai)
4. [HTTP vs WebSocket](#4-http-vs-websocket)
5. [API Architecture](#5-api-architecture)
6. [Base URL](#6-base-url)
7. [API Versioning](#7-api-versioning)
8. [Resource Naming](#8-resource-naming)
9. [HTTP Methods](#9-http-methods)
10. [HTTP Status Codes](#10-http-status-codes)
11. [Request Structure](#11-request-structure)
12. [Response Structure](#12-response-structure)
13. [Error Response](#13-error-response)
14. [Validation](#14-validation)
15. [Authentication](#15-authentication)
16. [Authorization](#16-authorization)
17. [Cookies](#17-cookies)
18. [Headers](#18-headers)
19. [CORS](#19-cors)
20. [Rate Limiting](#20-rate-limiting)
21. [Pagination](#21-pagination)
22. [Cursor Pagination](#22-cursor-pagination)
23. [Filtering](#23-filtering)
24. [Sorting](#24-sorting)
25. [Searching](#25-searching)
26. [Idempotency](#26-idempotency)
27. [API Errors](#27-api-errors)
28. [Global Error Handling](#28-global-error-handling)
29. [Authentication API](#29-authentication-api)
30. [User API](#30-user-api)
31. [Conversation API](#31-conversation-api)
32. [Conversation Member API](#32-conversation-member-api)
33. [Message API](#33-message-api)
34. [Reaction API](#34-reaction-api)
35. [Attachment API](#35-attachment-api)
36. [Notification API](#36-notification-api)
37. [Block API](#37-block-api)
38. [Health API](#38-health-api)
39. [Admin API](#39-admin-api)
40. [Route Architecture](#40-route-architecture)
41. [Controller Architecture](#41-controller-architecture)
42. [Service Architecture](#42-service-architecture)
43. [Middleware Architecture](#43-middleware-architecture)
44. [API Request Lifecycle](#44-api-request-lifecycle)
45. [HTTP + WebSocket Boundary](#45-http--websocket-boundary)
46. [Security Rules](#46-security-rules)
47. [API Performance](#47-api-performance)
48. [API Documentation](#48-api-documentation)
49. [Testing](#49-testing)
50. [Production Checklist](#50-production-checklist)
51. [Final API Map](#51-final-api-map)

---

# 1. API Design Kya Hai

API Design ka matlab hai:

> Client aur backend ke beech communication ka clear contract design karna.

Hamare chat application mein:

```text
React Client
     |
     | HTTP Request
     v
 REST API
     |
     v
 Express Server
     |
     v
 Service
     |
     v
 Mongoose
     |
     v
 MongoDB
```

API decide karegi:

* kaunse endpoints honge
* kaunse HTTP methods honge
* request ka format kya hoga
* response ka format kya hoga
* authentication kaise hogi
* errors kaise return honge
* pagination kaise hogi
* authorization kaise hogi

---

# 2. API Ka Role

API frontend aur backend ke beech contract hai.

Example:

```text
Frontend
   |
   | POST /api/v1/auth/login
   |
   v
Backend
```

Backend:

```text
validate
   ↓
authenticate
   ↓
generate session/tokens
   ↓
response
```

Frontend ko internal database implementation pata hone ki zarurat nahi.

---

# 3. REST API Kya Hai

REST ek architectural style hai.

Resources ko URLs ke through represent karte hain.

Example:

```text
/users
/conversations
/messages
/notifications
```

Operations HTTP methods se represent hote hain.

```text
GET     → Read
POST    → Create
PATCH   → Partial Update
PUT     → Full Replacement
DELETE  → Delete
```

Hamare project mein primarily:

```text
GET
POST
PATCH
DELETE
```

use honge.

---

# 4. HTTP vs WebSocket

Ye distinction bahut important hai.

## HTTP

Use for:

```text
Login
Register
Profile
Conversation creation
Message history
Search
Notifications
Settings
```

## WebSocket

Use for:

```text
New message
Typing
Online status
Read receipt
Message delivered
Reaction updates
Live notifications
```

Architecture:

```text
                 Client
                   |
          +--------+--------+
          |                 |
         HTTP           WebSocket
          |                 |
        REST API         Socket Server
          |                 |
          +--------+--------+
                   |
                Services
                   |
                MongoDB
```

---

# 5. API Architecture

Recommended backend structure:

```text
src/
│
├── controllers/
│
├── services/
│
├── routes/
│
├── middlewares/
│
├── validators/
│
├── models/
│
├── utils/
│
└── app.js
```

Flow:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

---

# 6. Base URL

Development:

```text
http://localhost:5000/api/v1
```

Production example:

```text
https://api.example.com/api/v1
```

Individual endpoint:

```text
/api/v1/auth/login
```

---

# 7. API Versioning

Current version:

```text
v1
```

Base:

```text
/api/v1
```

Future:

```text
/api/v2
```

Versioning ka purpose backward compatibility maintain karna hai.

---

# 8. Resource Naming

Use plural nouns:

```text
/users
/conversations
/messages
/notifications
```

Avoid:

```text
/getUsers
/createConversation
/deleteMessage
```

HTTP method already operation explain karta hai.

Better:

```text
GET    /users
POST   /conversations
DELETE /messages/:messageId
```

---

# 9. HTTP Methods

## GET

Data retrieve:

```text
GET /api/v1/users/me
```

---

## POST

New resource/action:

```text
POST /api/v1/conversations
```

---

## PATCH

Partial update:

```text
PATCH /api/v1/users/me
```

---

## PUT

Full replacement.

Hamare project mein limited use hoga.

---

## DELETE

Resource delete:

```text
DELETE /api/v1/conversations/:conversationId
```

---

# 10. HTTP Status Codes

Important codes:

| Status | Meaning               |
| ------ | --------------------- |
| `200`  | Success               |
| `201`  | Created               |
| `204`  | Success, no content   |
| `400`  | Bad Request           |
| `401`  | Unauthenticated       |
| `403`  | Forbidden             |
| `404`  | Not Found             |
| `409`  | Conflict              |
| `422`  | Validation failure    |
| `429`  | Too Many Requests     |
| `500`  | Internal Server Error |
| `503`  | Service Unavailable   |

---

# 11. Request Structure

Example:

```http
POST /api/v1/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

# 12. Response Structure

Consistent response format maintain karenge.

Success:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "..."
    }
  }
}
```

---

# 13. Error Response

Standard error:

```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS"
  }
}
```

Validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

# 14. Validation

Validation multiple layers par hogi:

```text
Client
  ↓
Request Validation
  ↓
Business Validation
  ↓
Mongoose Validation
  ↓
MongoDB
```

Client validation UX improve karti hai.

Backend validation security aur correctness ke liye mandatory hai.

---

# 15. Authentication

Authentication ka question:

> "Tum kaun ho?"

Example:

```text
Login
 ↓
Verify credentials
 ↓
Create authenticated session
```

Hamare project mein authentication JWT/cookies based ho sakti hai.

---

# 16. Authorization

Authorization ka question:

> "Tumhe ye action karne ki permission hai?"

Example:

```text
User A
  |
  +── Can read conversation

User B
  |
  +── Cannot read private conversation
```

Authentication aur authorization same nahi hain.

---

# 17. Cookies

Authentication cookies:

```text
accessToken
refreshToken
```

Recommended properties:

```text
HttpOnly
Secure
SameSite
```

Production mein HTTPS required hoga.

---

# 18. Headers

Common headers:

```http
Content-Type: application/json
```

Authentication architecture ke according:

```http
Authorization: Bearer <token>
```

ya cookie-based authentication.

Request tracing:

```http
X-Request-ID: ...
```

useful ho sakta hai.

---

# 19. CORS

Frontend aur backend different origins par hon to CORS configure karna hoga.

Example:

```text
Frontend
https://app.example.com

Backend
https://api.example.com
```

Backend ko allowed origin explicitly configure karna chahiye.

Wildcard:

```text
*
```

authenticated production API ke liye blindly use nahi karna.

---

# 20. Rate Limiting

Important endpoints:

```text
/login
/register
/forgot-password
/search
```

par rate limiting lagani chahiye.

Example concept:

```text
IP/User
   ↓
100 requests / minute
   ↓
429 Too Many Requests
```

Login endpoint par especially strict limits useful hain.

---

# 21. Pagination

Conversation list:

```text
GET /api/v1/conversations?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "hasNextPage": true
    }
  }
}
```

---

# 22. Cursor Pagination

Messages ke liye cursor pagination better:

```text
GET /api/v1/conversations/:id/messages?limit=50&before=<cursor>
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "nextCursor": "...",
    "hasMore": true
  }
}
```

Reason:

```text
Chat history
      ↓
Millions of messages
      ↓
skip()
      ↓
Performance degrade
```

Cursor:

```text
Stable + scalable
```

---

# 23. Filtering

Example:

```text
GET /api/v1/conversations?type=group
```

Multiple:

```text
GET /api/v1/conversations?type=group&archived=false
```

Filters ko predictable rakho.

---

# 24. Sorting

Example:

```text
GET /api/v1/conversations?sort=-updatedAt
```

Messages:

```text
sort=-createdAt
```

Convention:

```text
- = descending
+ = ascending
```

ya project-wide explicit naming choose kar sakte ho.

Consistency most important hai.

---

# 25. Searching

User search:

```text
GET /api/v1/users?search=sawan
```

Message search:

```text
GET /api/v1/conversations/:id/messages/search?q=hello
```

Search ko dedicated endpoint ya query parameter ke through design kar sakte hain.

---

# 26. Idempotency

Same request multiple times accidentally execute ho sakti hai.

Example:

```text
Client
  |
  +── POST message
  |
  +── network timeout
  |
  +── retry
```

Potential duplicate message.

Idempotency key:

```http
Idempotency-Key: unique-client-message-id
```

Message creation architecture mein ye concept extremely useful ho sakta hai.

---

# 27. API Errors

Error categories:

```text
Authentication
Authorization
Validation
Not Found
Conflict
Rate Limit
Database
Internal
```

Application-level error codes define karna useful hai:

```text
AUTH_INVALID_CREDENTIALS
AUTH_UNAUTHORIZED
USER_NOT_FOUND
CONVERSATION_NOT_FOUND
CONVERSATION_FORBIDDEN
MESSAGE_NOT_FOUND
MESSAGE_ALREADY_DELETED
RATE_LIMITED
```

---

# 28. Global Error Handling

Express mein centralized error middleware:

```text
Controller
   |
   X Error
   |
   v
Global Error Handler
   |
   v
Standard JSON Response
```

Controller ke andar har jagah duplicate error formatting avoid karo.

---

# 29. Authentication API

Authentication routes:

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
POST /auth/forgot-password
POST /auth/reset-password
```

---

## Register

```http
POST /api/v1/auth/register
```

Body:

```json
{
  "username": "sawan",
  "email": "user@example.com",
  "password": "strong-password"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {}
  }
}
```

---

## Login

```http
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

---

## Logout

```http
POST /api/v1/auth/logout
```

Authentication required.

---

## Refresh

```http
POST /api/v1/auth/refresh
```

Refresh authentication state.

---

## Current User

```http
GET /api/v1/auth/me
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {}
  }
}
```

---

# 30. User API

Routes:

```text
GET   /users/:userId
GET   /users
GET   /users/me
PATCH /users/me
PATCH /users/me/avatar
PATCH /users/me/status
```

---

## Search Users

```http
GET /api/v1/users?search=sawan
```

---

## Get Profile

```http
GET /api/v1/users/:userId
```

Authorization determine karegi ki user ko kya fields dikhengi.

---

## Update Profile

```http
PATCH /api/v1/users/me
```

Body:

```json
{
  "username": "newName",
  "bio": "Developer"
}
```

---

# 31. Conversation API

Routes:

```text
GET    /conversations
POST   /conversations
GET    /conversations/:conversationId
PATCH  /conversations/:conversationId
DELETE /conversations/:conversationId
```

---

## Create Conversation

```http
POST /api/v1/conversations
```

Direct chat:

```json
{
  "type": "direct",
  "memberIds": [
    "userId"
  ]
}
```

Group:

```json
{
  "type": "group",
  "name": "Developers",
  "memberIds": [
    "userId1",
    "userId2"
  ]
}
```

---

## Get Conversations

```http
GET /api/v1/conversations
```

Pagination:

```text
?page=1&limit=20
```

---

## Get Conversation

```http
GET /api/v1/conversations/:conversationId
```

---

## Update Conversation

```http
PATCH /api/v1/conversations/:conversationId
```

Example:

```json
{
  "name": "New Group Name"
}
```

---

## Delete/Leave Conversation

```http
DELETE /api/v1/conversations/:conversationId
```

Exact semantics project authorization rules par depend karengi.

---

# 32. Conversation Member API

Routes:

```text
GET    /conversations/:conversationId/members
POST   /conversations/:conversationId/members
DELETE /conversations/:conversationId/members/:userId
PATCH  /conversations/:conversationId/members/:userId
```

---

## Add Member

```http
POST /api/v1/conversations/:conversationId/members
```

Body:

```json
{
  "userId": "..."
}
```

---

## Remove Member

```http
DELETE /api/v1/conversations/:conversationId/members/:userId
```

---

## Update Member Role

```http
PATCH /api/v1/conversations/:conversationId/members/:userId
```

Body:

```json
{
  "role": "admin"
}
```

---

# 33. Message API

Routes:

```text
GET    /conversations/:conversationId/messages
POST   /conversations/:conversationId/messages
GET    /messages/:messageId
PATCH  /messages/:messageId
DELETE /messages/:messageId
```

---

## Get Messages

```http
GET /api/v1/conversations/:conversationId/messages
```

Cursor:

```text
?limit=50&before=<cursor>
```

---

## Create Message

```http
POST /api/v1/conversations/:conversationId/messages
```

Body:

```json
{
  "type": "text",
  "content": "Hello bro!"
}
```

Important:

> Real-time message delivery WebSocket se hogi, lekin message persistence ke liye HTTP API bhi available ho sakti hai depending on architecture.

Hamare final design mein primary live messaging WebSocket se hogi.

---

## Get Message

```http
GET /api/v1/messages/:messageId
```

---

## Edit Message

```http
PATCH /api/v1/messages/:messageId
```

Body:

```json
{
  "content": "Updated message"
}
```

---

## Delete Message

```http
DELETE /api/v1/messages/:messageId
```

Soft delete preferred:

```text
deletedAt
```

---

# 34. Reaction API

Routes:

```text
POST   /messages/:messageId/reactions
DELETE /messages/:messageId/reactions/:emoji
GET    /messages/:messageId/reactions
```

Add:

```http
POST /api/v1/messages/:messageId/reactions
```

Body:

```json
{
  "emoji": "❤️"
}
```

---

# 35. Attachment API

Routes:

```text
POST /attachments
GET  /attachments/:attachmentId
DELETE /attachments/:attachmentId
```

Actual file storage architecture:

```text
Client
  |
  v
Upload API
  |
  v
Object Storage
  |
  v
Attachment metadata
  |
  v
MongoDB
```

MongoDB ko large files ke dumping ground ke roop mein use nahi karna.

---

# 36. Notification API

Routes:

```text
GET   /notifications
PATCH /notifications/:notificationId/read
POST  /notifications/read-all
```

---

## Get Notifications

```http
GET /api/v1/notifications
```

---

## Mark Read

```http
PATCH /api/v1/notifications/:notificationId/read
```

---

## Mark All Read

```http
POST /api/v1/notifications/read-all
```

---

# 37. Block API

Routes:

```text
GET    /blocks
POST   /blocks
DELETE /blocks/:userId
```

---

## Block

```http
POST /api/v1/blocks
```

Body:

```json
{
  "userId": "..."
}
```

---

## Unblock

```http
DELETE /api/v1/blocks/:userId
```

---

# 38. Health API

Basic health:

```http
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

More detailed internal health:

```text
MongoDB
WebSocket
Memory
Uptime
```

expose kar sakte ho, but sensitive infrastructure details public endpoint par unnecessarily expose mat karo.

---

# 39. Admin API

Admin routes separate namespace:

```text
/api/v1/admin
```

Examples:

```text
GET    /admin/users
GET    /admin/users/:userId
PATCH  /admin/users/:userId/status
DELETE /admin/users/:userId
GET    /admin/reports
```

Admin middleware:

```text
Authentication
      ↓
Authorization
      ↓
Role = admin
```

---

# 40. Route Architecture

Recommended:

```text
routes/
│
├── auth.routes.js
├── user.routes.js
├── conversation.routes.js
├── member.routes.js
├── message.routes.js
├── reaction.routes.js
├── attachment.routes.js
├── notification.routes.js
├── block.routes.js
├── health.routes.js
└── admin.routes.js
```

---

# 41. Controller Architecture

Controllers:

```text
controllers/
│
├── auth.controller.js
├── user.controller.js
├── conversation.controller.js
├── member.controller.js
├── message.controller.js
├── reaction.controller.js
├── attachment.controller.js
├── notification.controller.js
├── block.controller.js
└── admin.controller.js
```

Controller ka primary job:

```text
Request
 ↓
Input
 ↓
Service call
 ↓
Response
```

Controller ko giant business logic file nahi banana.

---

# 42. Service Architecture

Services:

```text
services/
│
├── auth.service.js
├── user.service.js
├── conversation.service.js
├── member.service.js
├── message.service.js
├── reaction.service.js
├── attachment.service.js
├── notification.service.js
└── block.service.js
```

Example:

```text
message.controller
       |
       v
message.service
       |
       +── authorization
       +── business rules
       +── Message model
       +── Conversation model
       +── Notification model
```

---

# 43. Middleware Architecture

Recommended:

```text
middlewares/
│
├── auth.middleware.js
├── authorization.middleware.js
├── validate.middleware.js
├── rate-limit.middleware.js
├── upload.middleware.js
└── error.middleware.js
```

Request:

```text
Request
  ↓
CORS
  ↓
Rate Limit
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Controller
```

---

# 44. API Request Lifecycle

Example:

```text
POST /messages
       |
       v
Express Router
       |
       v
Rate Limiter
       |
       v
Authentication
       |
       v
Validation
       |
       v
Controller
       |
       v
Message Service
       |
       +── Check conversation
       |
       +── Check membership
       |
       +── Check block
       |
       +── Validate message
       |
       v
Mongoose
       |
       v
MongoDB
       |
       v
Response
```

---

# 45. HTTP + WebSocket Boundary

Ye hamare project ka extremely important design decision hai.

## HTTP

Use:

```text
Authentication
Initial data
History
CRUD
Search
Profile
Settings
```

## WebSocket

Use:

```text
Live message
Typing
Presence
Read receipts
Delivery
Live reaction
```

Example:

```text
User sends message
       |
       v
WebSocket
       |
       v
Socket Handler
       |
       v
Message Service
       |
       v
MongoDB
       |
       +----> Sender ACK
       |
       +----> Receiver EVENT
```

---

# 46. Security Rules

Never trust:

```text
req.body
req.params
req.query
WebSocket payload
```

Everything must be validated.

---

## Rule 1

Authentication required endpoints clearly define karo.

---

## Rule 2

Authorization every protected resource par apply karo.

Example:

```text
GET /conversations/:id/messages
```

sirf conversation member access kar sake.

---

## Rule 3

Sensitive fields exclude karo.

```text
passwordHash
refreshToken
internal metadata
```

---

## Rule 4

Error response mein internal details leak mat karo.

Bad:

```json
{
  "error": "MongoServerError E11000 ..."
}
```

Better:

```json
{
  "success": false,
  "message": "Email already exists",
  "error": {
    "code": "EMAIL_ALREADY_EXISTS"
  }
}
```

---

# 47. API Performance

Important rules:

```text
Use indexes
Use projection
Use lean()
Use cursor pagination
Avoid unnecessary populate
Avoid N+1 queries
Avoid huge responses
Use compression where appropriate
Cache carefully
```

Chat history:

```text
conversationId + createdAt
```

index extremely important hoga.

---

# 48. API Documentation

Production project mein API documentation maintain karna important hai.

Possible tools:

```text
OpenAPI
Swagger UI
Postman
```

Documentation mein:

```text
Endpoint
Method
Authentication
Request
Response
Errors
Examples
```

hona chahiye.

---

# 49. Testing

API tests categories:

## Authentication

```text
Register
Login
Logout
Refresh
Unauthorized
```

## Users

```text
Profile
Search
Update
```

## Conversations

```text
Create
List
Get
Update
Delete/Leave
```

## Messages

```text
Create
Read
Edit
Delete
Pagination
Authorization
```

## Security

```text
Invalid token
Expired token
Wrong role
Non-member access
Blocked user
Rate limit
```

---

# 50. Production Checklist

## API Design

* [ ] API versioning
* [ ] Consistent naming
* [ ] Consistent response format
* [ ] Consistent errors
* [ ] Status codes
* [ ] Pagination
* [ ] Filtering
* [ ] Sorting

## Authentication

* [ ] Register
* [ ] Login
* [ ] Logout
* [ ] Refresh
* [ ] Current user

## Authorization

* [ ] User permissions
* [ ] Conversation permissions
* [ ] Member permissions
* [ ] Admin permissions

## Security

* [ ] CORS
* [ ] Rate limiting
* [ ] Input validation
* [ ] Secure cookies
* [ ] Sensitive field protection
* [ ] Error sanitization

## Performance

* [ ] Indexes
* [ ] Projection
* [ ] Lean
* [ ] Cursor pagination
* [ ] N+1 prevention

## Real-Time

* [ ] WebSocket authentication
* [ ] Event validation
* [ ] Message persistence
* [ ] ACK
* [ ] Reconnection strategy
* [ ] Duplicate message protection

---

# 51. Final API Map

## Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

---

## Users

```text
GET    /api/v1/users
GET    /api/v1/users/:userId
GET    /api/v1/users/me
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/avatar
PATCH  /api/v1/users/me/status
```

---

## Conversations

```text
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:conversationId
PATCH  /api/v1/conversations/:conversationId
DELETE /api/v1/conversations/:conversationId
```

---

## Members

```text
GET    /api/v1/conversations/:conversationId/members
POST   /api/v1/conversations/:conversationId/members
PATCH  /api/v1/conversations/:conversationId/members/:userId
DELETE /api/v1/conversations/:conversationId/members/:userId
```

---

## Messages

```text
GET    /api/v1/conversations/:conversationId/messages
POST   /api/v1/conversations/:conversationId/messages

GET    /api/v1/messages/:messageId
PATCH  /api/v1/messages/:messageId
DELETE /api/v1/messages/:messageId
```

---

## Reactions

```text
GET    /api/v1/messages/:messageId/reactions
POST   /api/v1/messages/:messageId/reactions
DELETE /api/v1/messages/:messageId/reactions/:emoji
```

---

## Attachments

```text
POST   /api/v1/attachments
GET    /api/v1/attachments/:attachmentId
DELETE /api/v1/attachments/:attachmentId
```

---

## Notifications

```text
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:notificationId/read
POST   /api/v1/notifications/read-all
```

---

## Blocks

```text
GET    /api/v1/blocks
POST   /api/v1/blocks
DELETE /api/v1/blocks/:userId
```

---

## Health

```text
GET    /api/v1/health
```

---

# Final Architecture

Hamare complete backend ka mental model:

```text
                         CLIENT
                           |
             +-------------+-------------+
             |                           |
            HTTP                      WebSocket
             |                           |
             v                           v
        REST ROUTES                 SOCKET EVENTS
             |                           |
             v                           v
        MIDDLEWARE                  SOCKET MIDDLEWARE
             |                           |
             v                           v
        CONTROLLERS                 SOCKET HANDLERS
             |                           |
             +-------------+-------------+
                           |
                           v
                       SERVICES
                           |
             +-------------+-------------+
             |                           |
          MONGOOSE                    OTHER
             |                       SERVICES
             v
          MongoDB
```

---

# Golden Rules

### Rule 1

> **URL resource ko represent kare, action ko nahi.**

Bad:

```text
/createMessage
```

Good:

```text
POST /messages
```

---

### Rule 2

> **Controller thin rakho, service powerful rakho.**

```text
Controller
   ↓
Service
   ↓
Model
```

---

### Rule 3

> **HTTP aur WebSocket ko alag transport samjho, lekin business logic ko duplicate mat karo.**

```text
HTTP ────────┐
             ├──> Service
WebSocket ───┘
```

---

### Rule 4

> **Authentication aur authorization ko kabhi mix mat karo.**

```text
Authentication
=
Who are you?

Authorization
=
What are you allowed to do?
```

---

### Rule 5

> **API contract stable aur predictable hona chahiye.**

Client ko har endpoint par completely different response format nahi milna chahiye.

---

### Rule 6

> **Chat application mein message history ke liye cursor pagination aur proper indexes critical hain.**

```text
conversationId
      +
createdAt
```

---

### Rule 7

> **WebSocket message ko directly trust mat karo.**

WebSocket bhi user input hai.

```text
Socket Payload
      ↓
Authenticate
      ↓
Validate
      ↓
Authorize
      ↓
Service
      ↓
Database
```

---

# Final Mental Model

Agar tum API architecture ko ek line mein samajhna chaho:

```text
Client → Route → Middleware → Controller → Service → Mongoose → MongoDB
```

Aur real-time ke liye:

```text
Client → WebSocket → Socket Handler → Service → Mongoose → MongoDB
```

**HTTP aur WebSocket alag roads hain, lekin destination aur business logic same ho sakta hai.**

Isi principle par hamara poora Real-Time Chat Application build hoga.
