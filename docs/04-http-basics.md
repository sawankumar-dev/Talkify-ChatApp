# 🌐 HTTP Mastery — Complete Guide

> **Project:** Chat Application
> **Level:** Beginner → Advanced
> **Purpose:** Understand HTTP deeply before learning WebSocket and Socket.IO.

---

## 📚 Table of Contents

1. [What is HTTP?](#1-what-is-http)
2. [Why HTTP Exists](#2-why-http-exists)
3. [Client and Server](#3-client-and-server)
4. [HTTP Request](#4-http-request)
5. [HTTP Response](#5-http-response)
6. [Request Methods](#6-request-methods)
7. [GET](#7-get)
8. [POST](#8-post)
9. [PUT](#9-put)
10. [PATCH](#10-patch)
11. [DELETE](#11-delete)
12. [HTTP Headers](#12-http-headers)
13. [Important Request Headers](#13-important-request-headers)
14. [Important Response Headers](#14-important-response-headers)
15. [HTTP Body](#15-http-body)
16. [Content-Type](#16-content-type)
17. [JSON](#17-json)
18. [URL Structure](#18-url-structure)
19. [Path Parameters](#19-path-parameters)
20. [Query Parameters](#20-query-parameters)
21. [Request vs Response](#21-request-vs-response)
22. [HTTP Status Codes](#22-http-status-codes)
23. [2xx Success](#23-2xx-success)
24. [3xx Redirection](#24-3xx-redirection)
25. [4xx Client Errors](#25-4xx-client-errors)
26. [5xx Server Errors](#26-5xx-server-errors)
27. [Cookies](#27-cookies)
28. [Sessions](#28-sessions)
29. [Authentication](#29-authentication)
30. [Authorization](#30-authorization)
31. [JWT](#31-jwt)
32. [HTTP-Only Cookies](#32-http-only-cookies)
33. [CORS](#33-cors)
34. [Preflight Requests](#34-preflight-requests)
35. [HTTP and HTTPS](#35-http-and-https)
36. [Statelessness](#36-statelessness)
37. [REST](#37-rest)
38. [RESTful API Design](#38-restful-api-design)
39. [CRUD and HTTP](#39-crud-and-http)
40. [Idempotency](#40-idempotency)
41. [Safe Methods](#41-safe-methods)
42. [Caching](#42-caching)
43. [Pagination](#43-pagination)
44. [Filtering](#44-filtering)
45. [Sorting](#45-sorting)
46. [Rate Limiting](#46-rate-limiting)
47. [HTTP Errors](#47-http-errors)
48. [HTTP in Express](#48-http-in-express)
49. [HTTP in Our Chat Application](#49-http-in-our-chat-application)
50. [Complete Login Flow](#50-complete-login-flow)
51. [Complete Message Fetch Flow](#51-complete-message-fetch-flow)
52. [Why HTTP Is Not Enough for Chat](#52-why-http-is-not-enough-for-chat)
53. [HTTP vs WebSocket](#53-http-vs-websocket)
54. [Mental Model](#54-mental-model)
55. [HTTP Mastery Checklist](#55-http-mastery-checklist)

---

# 1. What is HTTP?

**HTTP** stands for:

> **HyperText Transfer Protocol**

It is a communication protocol used by clients and servers to exchange information over a network.

In a web application:

```text
Client
   │
   │ HTTP Request
   ▼
Server
   │
   │ HTTP Response
   ▼
Client
```

For example, when you open a website:

```text
Browser
   │
   │ GET /
   ▼
Web Server
   │
   │ HTML
   ▼
Browser
```

HTTP defines the rules for this communication.

---

# 2. Why HTTP Exists

Imagine two computers communicating without any rules.

One computer sends:

```text
Hello
```

The other computer has no idea:

* What is this?
* What resource is being requested?
* Is this an error?
* What format is the data?
* Who sent it?
* What should be returned?

HTTP solves this problem by defining a standard communication structure.

For example:

```text
GET /users/123 HTTP/1.1
Host: example.com
Accept: application/json
```

The server can understand:

* Method: `GET`
* Resource: `/users/123`
* Protocol: `HTTP/1.1`
* Expected response format: JSON

---

# 3. Client and Server

HTTP communication normally involves two sides.

## Client

The client initiates the request.

Examples:

* Browser
* React application
* Mobile application
* Another server
* CLI application

## Server

The server receives the request and produces a response.

Examples:

* Node.js
* Express
* Python
* Go
* Java
* PHP

The basic model is:

```text
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       │ Request
       ▼
┌──────────────┐
│    Server    │
└──────┬───────┘
       │
       │ Response
       ▼
┌──────────────┐
│    Client    │
└──────────────┘
```

---

# 4. HTTP Request

An HTTP request is a message sent by the client to the server.

A request contains several important parts:

```text
Request
│
├── Method
├── URL
├── Headers
└── Body
```

Example:

```http
POST /api/auth/login HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret"
}
```

Let's break this down.

---

# 5. HTTP Request Structure

```text
┌─────────────────────────────────────┐
│ Method + URL + HTTP Version         │
├─────────────────────────────────────┤
│ Headers                             │
│                                     │
│ Content-Type: application/json      │
│ Authorization: Bearer ...           │
├─────────────────────────────────────┤
│ Body                                │
│                                     │
│ {                                   │
│   "email": "...",                   │
│   "password": "..."                 │
│ }                                   │
└─────────────────────────────────────┘
```

The body is optional.

For example, a typical `GET` request may not need a body.

---

# 6. HTTP Response

After receiving the request, the server sends an HTTP response.

A response contains:

```text
Response
│
├── Status Code
├── Headers
└── Body
```

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Login successful",
  "user": {
    "id": "123",
    "name": "Sawan"
  }
}
```

---

# 7. Request/Response Cycle

The complete communication looks like:

```text
Client
  │
  │ HTTP Request
  │
  ▼
Server
  │
  │ Process request
  │
  ▼
Database
  │
  │ Data
  ▼
Server
  │
  │ HTTP Response
  ▼
Client
```

This is the fundamental HTTP model.

---

# 8. Request Methods

HTTP provides different methods to describe what the client wants to do.

The most important ones are:

| Method | Common Purpose              |
| ------ | --------------------------- |
| GET    | Read data                   |
| POST   | Create/process data         |
| PUT    | Replace a resource          |
| PATCH  | Partially update a resource |
| DELETE | Delete a resource           |

---

# 9. GET

`GET` is normally used to retrieve data.

Example:

```http
GET /api/users
```

The server may return:

```json
[
  {
    "id": "1",
    "name": "User One"
  },
  {
    "id": "2",
    "name": "User Two"
  }
]
```

Another example:

```http
GET /api/users/123
```

This asks for one particular user.

---

# 10. GET in Our Chat Application

We may use:

```http
GET /api/conversations
```

to retrieve the user's conversations.

And:

```http
GET /api/conversations/123/messages
```

to retrieve messages.

Flow:

```text
React
  │
  │ GET /api/conversations/123/messages
  ▼
Express
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
MongoDB
  │
  ▼
Messages
  │
  ▼
React
```

---

# 11. POST

`POST` is commonly used to create a new resource or perform an operation.

Example:

```http
POST /api/users
```

Body:

```json
{
  "name": "Sawan",
  "email": "user@example.com",
  "password": "secret"
}
```

The server may create a user.

---

# 12. POST in Our Chat Application

Login:

```http
POST /api/auth/login
```

Create conversation:

```http
POST /api/conversations
```

Create group:

```http
POST /api/groups
```

Upload file:

```http
POST /api/uploads
```

---

# 13. PUT

`PUT` is generally used to replace an entire resource.

For example:

```http
PUT /api/users/123
```

Body:

```json
{
  "name": "Sawan",
  "email": "user@example.com",
  "bio": "Developer"
}
```

The idea is:

> Replace the representation of resource `123` with this representation.

In real-world APIs, `PUT` is less commonly needed than `PATCH` for ordinary profile updates.

---

# 14. PATCH

`PATCH` is used for partial updates.

Suppose the user only changes their name.

```http
PATCH /api/users/123
```

Body:

```json
{
  "name": "Sawan Kumar"
}
```

Only the specified field needs to change.

This is useful for:

* Updating profile
* Changing avatar
* Updating status
* Editing a message

---

# 15. DELETE

`DELETE` is used to remove a resource.

Example:

```http
DELETE /api/messages/123
```

The server may delete or soft-delete the message.

---

# 16. HTTP Method Summary

```text
GET
 ↓
Read

POST
 ↓
Create / Process

PUT
 ↓
Replace

PATCH
 ↓
Partial Update

DELETE
 ↓
Delete
```

A useful CRUD mapping is:

| CRUD   | HTTP      |
| ------ | --------- |
| Create | POST      |
| Read   | GET       |
| Update | PUT/PATCH |
| Delete | DELETE    |

---

# 17. HTTP Headers

Headers contain metadata about a request or response.

Example:

```http
Content-Type: application/json
Authorization: Bearer token
Accept: application/json
```

Think of headers as information describing the message.

---

# 18. Request Headers

Request headers are sent by the client.

Example:

```http
GET /api/users HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer abc123
```

The server can use these headers to understand the request.

---

# 19. Response Headers

Response headers are sent by the server.

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache
```

They provide information about the response.

---

# 20. Important Request Headers

## `Content-Type`

Tells the server what format the request body uses.

Example:

```http
Content-Type: application/json
```

Meaning:

> The request body contains JSON.

---

## `Accept`

Tells the server what response format the client prefers.

Example:

```http
Accept: application/json
```

---

## `Authorization`

Used commonly for authentication credentials.

Example:

```http
Authorization: Bearer eyJ...
```

---

## `Cookie`

Contains cookies associated with the request.

Example:

```http
Cookie: accessToken=abc123
```

Browsers usually manage this automatically according to cookie rules.

---

# 21. Important Response Headers

## `Content-Type`

Example:

```http
Content-Type: application/json
```

Means the response body contains JSON.

---

## `Set-Cookie`

Used by the server to instruct the browser to store a cookie.

Example:

```http
Set-Cookie: accessToken=abc123; HttpOnly; Secure
```

---

## `Cache-Control`

Controls caching behavior.

Example:

```http
Cache-Control: no-store
```

---

## `Location`

Often used when the response points to another resource.

Example:

```http
Location: /api/users/123
```

---

# 22. HTTP Body

The body contains the actual data being sent.

Example:

```json
{
  "username": "sawan",
  "password": "secret"
}
```

The body is commonly used with:

* POST
* PUT
* PATCH

A body is generally not used for normal GET requests.

---

# 23. Content-Type

`Content-Type` tells the receiver how to interpret the body.

Common types include:

```text
application/json
application/x-www-form-urlencoded
multipart/form-data
text/plain
```

---

# 24. JSON

Our application will primarily use JSON for API communication.

Example:

```json
{
  "username": "sawan",
  "email": "user@example.com"
}
```

JSON is popular because it is:

* Human-readable
* Easy to parse
* Supported by JavaScript
* Supported by almost every backend language

---

# 25. URL Structure

A URL can be broken into different parts.

Example:

```text
https://example.com:443/api/users/123?active=true
```

```text
https
  ↓
Protocol

example.com
  ↓
Host

443
  ↓
Port

/api/users/123
  ↓
Path

active=true
  ↓
Query Parameter
```

---

# 26. Path Parameters

A path parameter identifies a specific resource.

Example:

```http
GET /api/users/123
```

Here:

```text
123
```

is the user ID.

Another example:

```http
GET /api/conversations/abc/messages
```

Here:

```text
abc
```

is the conversation ID.

---

# 27. Query Parameters

Query parameters provide additional options.

Example:

```http
GET /api/messages?limit=20&page=2
```

Here:

```text
limit = 20
page  = 2
```

Query parameters are useful for:

* Pagination
* Searching
* Filtering
* Sorting
* Optional configuration

---

# 28. Path vs Query Parameters

### Path Parameter

Use when identifying a resource.

```text
/users/123
```

### Query Parameter

Use when modifying how the collection is retrieved.

```text
/users?page=2&limit=20
```

Think:

```text
Path
 ↓
Which resource?

Query
 ↓
How should I retrieve it?
```

---

# 29. Request vs Response

The two should never be confused.

## Request

Client → Server

```text
GET /api/users
```

## Response

Server → Client

```text
200 OK
[
  ...
]
```

Complete flow:

```text
CLIENT
  │
  │ Request
  ▼
SERVER
  │
  │ Response
  ▼
CLIENT
```

---

# 30. HTTP Status Codes

Status codes tell the client what happened.

They are divided into five categories:

```text
1xx → Informational
2xx → Success
3xx → Redirection
4xx → Client Error
5xx → Server Error
```

---

# 31. 1xx — Informational

These indicate that the request has been received or is being processed.

They are less important for our initial API development.

Examples:

```text
100 Continue
101 Switching Protocols
```

`101 Switching Protocols` becomes particularly interesting when studying protocol upgrades and WebSocket.

---

# 32. 2xx — Success

The request was successfully handled.

Important codes:

```text
200 OK
201 Created
202 Accepted
204 No Content
```

---

# 33. `200 OK`

The request succeeded.

Example:

```http
GET /api/users/123
```

Response:

```http
200 OK
```

---

# 34. `201 Created`

Used when a new resource has been created.

Example:

```http
POST /api/conversations
```

Response:

```http
201 Created
```

---

# 35. `204 No Content`

The operation succeeded but there is no response body.

Example:

```http
DELETE /api/messages/123
```

Response:

```http
204 No Content
```

---

# 36. 3xx — Redirection

These indicate that additional action may be required to complete the request.

Examples:

```text
301 Moved Permanently
302 Found
304 Not Modified
```

`304 Not Modified` is particularly relevant to caching.

---

# 37. 4xx — Client Errors

These indicate a problem with the request or the client's permissions.

Important codes:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Content
429 Too Many Requests
```

---

# 38. `400 Bad Request`

The request is malformed or invalid.

Example:

```json
{
  "email": "not-an-email"
}
```

The server may respond:

```http
400 Bad Request
```

---

# 39. `401 Unauthorized`

This generally means:

> The request does not have valid authentication credentials.

Example:

```text
Accessing protected resource
        ↓
No valid authentication
        ↓
401
```

---

# 40. `403 Forbidden`

The server understands who the user is but refuses the action.

Example:

```text
User
 ↓
Authenticated
 ↓
Attempt admin operation
 ↓
Not allowed
 ↓
403
```

A useful distinction:

```text
401
 ↓
You are not properly authenticated.

403
 ↓
You are authenticated, but not allowed.
```

---

# 41. `404 Not Found`

The requested resource cannot be found.

Example:

```http
GET /api/users/999999
```

if that user doesn't exist.

---

# 42. `409 Conflict`

Used when a request conflicts with the current state.

Example:

```text
Register with an email that already exists
```

The API may return:

```http
409 Conflict
```

---

# 43. `422 Unprocessable Content`

The server understands the request format but the submitted data fails semantic validation.

For example:

```json
{
  "age": -50
}
```

The syntax is valid JSON, but the value is invalid according to application rules.

---

# 44. `429 Too Many Requests`

Used when the client sends too many requests within a certain period.

Example:

```text
100 login attempts
        ↓
Rate limiter
        ↓
429 Too Many Requests
```

This becomes important for protecting login and other sensitive endpoints.

---

# 45. 5xx — Server Errors

These indicate a problem on the server side.

Important codes:

```text
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
```

---

# 46. `500 Internal Server Error`

A generic server-side failure.

Example:

```text
Controller
   ↓
Service
   ↓
Unexpected error
   ↓
500
```

We should avoid exposing internal implementation details to the client.

Bad:

```json
{
  "error": "MongoDB password authentication failed at..."
}
```

Better:

```json
{
  "message": "Internal server error"
}
```

The detailed error should be logged securely on the server.

---

# 47. `503 Service Unavailable`

Indicates that the server is temporarily unable to handle the request.

Possible causes:

* Maintenance
* Overload
* Dependency unavailable

---

# 48. Status Code Cheat Sheet

| Code | Meaning               |
| ---: | --------------------- |
|  200 | OK                    |
|  201 | Created               |
|  204 | No Content            |
|  301 | Moved Permanently     |
|  304 | Not Modified          |
|  400 | Bad Request           |
|  401 | Unauthorized          |
|  403 | Forbidden             |
|  404 | Not Found             |
|  409 | Conflict              |
|  422 | Unprocessable Content |
|  429 | Too Many Requests     |
|  500 | Internal Server Error |
|  502 | Bad Gateway           |
|  503 | Service Unavailable   |
|  504 | Gateway Timeout       |

---

# 49. Cookies

A cookie is a small piece of data stored by the browser and associated with a domain.

The server can send:

```http
Set-Cookie: sessionId=abc123
```

The browser stores it.

Later, the browser may send:

```http
Cookie: sessionId=abc123
```

---

# 50. Cookie Flow

```text
Server
  │
  │ Set-Cookie
  ▼
Browser
  │
  │ stores cookie
  │
  │ later request
  ▼
Server
```

Cookies are especially useful for authentication.

---

# 51. Important Cookie Attributes

## `HttpOnly`

Prevents JavaScript from directly reading the cookie.

```text
HttpOnly
```

This helps reduce certain token theft risks from client-side script access.

---

## `Secure`

Cookie should only be sent over HTTPS.

```text
Secure
```

---

## `SameSite`

Controls when cookies are sent in cross-site contexts.

Common values:

```text
Strict
Lax
None
```

---

# 52. Sessions

A traditional session-based authentication system may work like this:

```text
Login
 ↓
Server creates session
 ↓
Session stored on server
 ↓
Session ID sent to browser
 ↓
Browser stores session cookie
 ↓
Future requests contain session ID
```

The server uses the session ID to identify the user.

---

# 53. JWT Authentication

JWT stands for:

> JSON Web Token

A JWT can carry claims about an authenticated user.

Typical architecture:

```text
Login
 ↓
Verify credentials
 ↓
Create JWT
 ↓
Send token
 ↓
Client sends token on future requests
 ↓
Server verifies token
```

JWT is not itself a database.

It is a signed token format.

---

# 54. JWT Structure

A JWT typically has three sections:

```text
Header.Payload.Signature
```

Example shape:

```text
xxxxx.yyyyy.zzzzz
```

Conceptually:

```text
Header
  +
Payload
  +
Signature
```

The payload can contain claims such as:

```json
{
  "sub": "user-id",
  "role": "user"
}
```

Sensitive information should not be placed into a JWT merely because it is encoded.

---

# 55. Authentication vs Authorization

These two concepts are fundamental.

## Authentication

> Who are you?

Example:

```text
Login
 ↓
Verify identity
```

## Authorization

> What are you allowed to do?

Example:

```text
Authenticated User
 ↓
Can this user delete this message?
```

---

# 56. HTTP-Only Authentication Cookies

For our chat application, we can use HTTP-only cookies for authentication tokens.

Conceptually:

```text
Login
  ↓
Server
  ↓
JWT
  ↓
Set-Cookie
  ↓
Browser
```

Future request:

```text
Browser
  │
  │ Cookie
  ▼
Server
  │
  │ Verify JWT
  ▼
Authenticated User
```

This keeps token access away from ordinary client-side JavaScript when the cookie is `HttpOnly`.

---

# 57. CORS

CORS stands for:

> Cross-Origin Resource Sharing

Suppose:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:5000
```

These are different origins.

The browser applies cross-origin security rules.

The server must explicitly allow the frontend origin when appropriate.

---

# 58. What is an Origin?

An origin consists of:

```text
scheme + host + port
```

For example:

```text
http://localhost:5173
```

has:

```text
scheme = http
host   = localhost
port   = 5173
```

Changing the port creates a different origin.

---

# 59. CORS Flow

```text
React
  │
  │ Cross-Origin Request
  ▼
Browser
  │
  ▼
Express
  │
  │ CORS Headers
  ▼
Browser
```

The browser decides whether the frontend is allowed to access the response based on CORS rules.

---

# 60. Credentials and Cookies

When using cookies across origins, the client and server must be configured appropriately.

Conceptually:

```text
Frontend
   │
   │ credentials
   ▼
Browser
   │
   ▼
Backend
```

The server must allow credentials for the trusted origin.

We will configure this carefully when implementing authentication.

---

# 61. Preflight Requests

For some cross-origin requests, the browser sends an `OPTIONS` request first.

Example:

```http
OPTIONS /api/messages
```

This is called a **preflight request**.

The browser may ask the server:

```text
Are these methods allowed?
Are these headers allowed?
Is this origin allowed?
```

The server responds with appropriate CORS headers.

---

# 62. HTTPS

HTTP data can be protected using TLS:

```text
HTTP
 +
TLS
 =
HTTPS
```

HTTPS provides encrypted communication between client and server.

Instead of:

```text
http://example.com
```

we use:

```text
https://example.com
```

---

# 63. Why HTTPS Matters

Without encryption, sensitive information could potentially be exposed while traveling across an untrusted network.

HTTPS protects data in transit.

Important for:

* Login credentials
* Cookies
* Messages
* Personal information
* API tokens

---

# 64. HTTP Is Stateless

HTTP is fundamentally stateless.

This means each request is conceptually independent.

For example:

```text
Request 1:
GET /api/users

Request 2:
GET /api/messages

Request 3:
POST /api/messages
```

HTTP itself does not automatically remember:

> "This is the same user from request 1."

Application mechanisms such as:

* Cookies
* Sessions
* JWT
* Other authentication mechanisms

allow applications to maintain identity across requests.

---

# 65. REST

REST stands for:

> Representational State Transfer

REST is an architectural style for designing networked APIs.

A REST-style API organizes functionality around resources.

For example:

```text
/users
/conversations
/messages
```

---

# 66. REST Resources

Instead of designing endpoints like:

```text
/getAllUsers
/createUser
/deleteUser
```

we can design resource-oriented endpoints:

```text
GET    /users
POST   /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

The HTTP method describes the operation.

---

# 67. RESTful API Design

For users:

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

For conversations:

```text
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id
PATCH  /api/conversations/:id
DELETE /api/conversations/:id
```

For messages:

```text
GET    /api/conversations/:conversationId/messages
POST   /api/conversations/:conversationId/messages
```

Real-time sending may instead happen through Socket.IO.

---

# 68. CRUD

CRUD means:

```text
Create
Read
Update
Delete
```

Example for users:

```text
CREATE
POST /users

READ
GET /users

UPDATE
PATCH /users/:id

DELETE
DELETE /users/:id
```

---

# 69. Idempotency

An operation is **idempotent** if repeating it produces the same intended final state.

For example:

```text
PUT /users/123
```

with the same complete representation can be repeated without changing the final state after the first successful operation.

This is different from saying the server must return the exact same response every time.

---

# 70. Safe Methods

A safe HTTP method is intended not to modify server state.

The main example:

```text
GET
```

A GET request should generally be read-only.

Bad API design:

```text
GET /delete-user/123
```

A better design:

```text
DELETE /users/123
```

The method communicates the intended operation.

---

# 71. Caching

Caching allows previously generated data to be reused.

Conceptually:

```text
Client
  │
  ▼
Cache
  │
  ├── Found → Return cached response
  │
  └── Missing
        ↓
      Server
```

HTTP provides headers that help control caching.

Examples:

```http
Cache-Control
ETag
Last-Modified
Expires
```

---

# 72. ETag

An `ETag` identifies a particular representation of a resource.

Conceptually:

```text
Client
  │
  │ If-None-Match
  ▼
Server
  │
  ├── unchanged → 304
  │
  └── changed → 200 + new data
```

This can reduce unnecessary data transfer.

---

# 73. Pagination

Chat applications can contain thousands or millions of messages.

We should not load everything at once.

Instead:

```http
GET /api/conversations/123/messages?page=2&limit=50
```

or use cursor-based pagination.

---

# 74. Cursor Pagination

For chat systems, cursor-based pagination can be particularly useful.

Conceptually:

```text
Newest
  ↓
Message 100
Message 99
Message 98
...
Message 51
  ↓
Cursor
  ↓
Load older messages
```

Example:

```http
GET /api/conversations/123/messages?cursor=abc&limit=50
```

The exact pagination strategy will be decided during API design.

---

# 75. Filtering

Filtering allows clients to request a subset of data.

Example:

```http
GET /api/users?search=sawan
```

Or:

```http
GET /api/messages?type=image
```

---

# 76. Sorting

Sorting controls result order.

Example:

```http
GET /api/users?sort=name
```

Or:

```http
GET /api/messages?sort=createdAt
```

The API should define which fields can actually be used for sorting.

---

# 77. Rate Limiting

Rate limiting restricts how frequently a client can perform an operation.

Example:

```text
Client
  │
  │ 100 requests
  ▼
Rate Limiter
  │
  ├── Allowed
  │
  └── Too many → 429
```

Important endpoints include:

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/forgot-password
```

Rate limiting helps reduce abuse.

---

# 78. HTTP Error Response Design

Errors should have a consistent structure.

Example:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

For validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email"
  }
}
```

A consistent format makes frontend error handling easier.

---

# 79. Express and HTTP

Our backend uses Express.

Conceptually:

```text
HTTP Request
      ↓
Node.js HTTP Server
      ↓
Express
      ↓
Router
      ↓
Middleware
      ↓
Controller
      ↓
Service
      ↓
MongoDB
```

Express gives us convenient tools for building HTTP APIs.

---

# 80. Express Request Object

In Express, a route handler receives a request object.

Conceptually:

```ts
(req, res)
```

The request object contains information such as:

```text
req.params
req.query
req.body
req.headers
req.cookies
```

---

# 81. Express Response Object

The response object allows the server to respond to the client.

Conceptually:

```ts
res.status(200).json({
  message: "Success"
});
```

This produces an HTTP response.

---

# 82. Request Data in Express

Suppose:

```http
PATCH /api/users/123?verbose=true
```

Body:

```json
{
  "name": "Sawan"
}
```

The server can conceptually access:

```text
req.params
   ↓
id = 123

req.query
   ↓
verbose = true

req.body
   ↓
name = Sawan
```

---

# 83. HTTP Flow in Our Backend

Our backend follows:

```text
HTTP Request
     ↓
Express
     ↓
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
     ↓
Model
     ↓
Service
     ↓
Controller
     ↓
HTTP Response
```

---

# 84. HTTP in Our Chat Application

HTTP will be responsible primarily for operations such as:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Users

```text
GET   /api/users/:id
PATCH /api/users/:id
GET   /api/users?search=sawan
```

### Conversations

```text
GET  /api/conversations
POST /api/conversations
GET  /api/conversations/:id
```

### Messages

```text
GET /api/conversations/:id/messages
```

### Uploads

```text
POST /api/uploads
```

Real-time message delivery will use Socket.IO.

---

# 85. Complete Login Flow

Let's understand a complete request.

The user enters:

```text
Email
Password
```

React sends:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret"
}
```

---

## Step 1 — Browser

React creates an HTTP request.

```text
React
 ↓
POST /api/auth/login
```

---

## Step 2 — Express Router

The route matches:

```text
POST /api/auth/login
```

---

## Step 3 — Validation

The request body is validated.

```text
email
password
```

If invalid:

```text
400 / 422
```

depending on our API's chosen convention.

---

## Step 4 — Controller

The controller receives the validated request.

```text
auth.controller.ts
```

---

## Step 5 — Service

The controller calls:

```text
auth.service.ts
```

The service:

```text
Find user
   ↓
Verify password
   ↓
Generate tokens
```

---

## Step 6 — Database

The user is retrieved from MongoDB.

```text
MongoDB
 ↓
User
```

---

## Step 7 — Authentication

If credentials are valid:

```text
Access Token
Refresh Token
```

are generated according to our authentication design.

---

## Step 8 — Response

The server responds:

```http
200 OK
Set-Cookie: ...
Content-Type: application/json
```

Body:

```json
{
  "success": true,
  "user": {
    "id": "123",
    "name": "Sawan"
  }
}
```

---

# 86. Complete Protected Request

Suppose the user wants their conversations.

```http
GET /api/conversations
```

The browser sends authentication cookies.

```text
Browser
   │
   │ Cookie
   ▼
Express
```

Authentication middleware verifies the token.

```text
Cookie
  ↓
JWT Verification
  ↓
User Identity
  ↓
req.user
```

Then:

```text
Controller
   ↓
Service
   ↓
MongoDB
```

Finally:

```text
MongoDB
   ↓
Service
   ↓
Controller
   ↓
JSON Response
   ↓
React
```

---

# 87. Complete Message Fetch Flow

Suppose the user opens a conversation.

React requests:

```http
GET /api/conversations/abc123/messages?limit=50
```

Flow:

```text
React
  │
  ▼
HTTP Request
  │
  ▼
Express
  │
  ▼
Auth Middleware
  │
  ▼
Message Controller
  │
  ▼
Message Service
  │
  ├── Verify conversation
  ├── Verify membership
  └── Fetch messages
  │
  ▼
Message Model
  │
  ▼
MongoDB
  │
  ▼
Messages
  │
  ▼
React
```

---

# 88. Why HTTP Is Not Enough for Chat

This is the most important reason we are learning WebSocket next.

Imagine User A sends a message to User B.

With ordinary HTTP, User B would need to repeatedly ask:

```text
GET /api/messages
```

For example:

```text
Every 1 second
   ↓
GET messages
   ↓
Server
   ↓
No new message
```

Again:

```text
GET messages
   ↓
No new message
```

Again:

```text
GET messages
   ↓
No new message
```

This is inefficient.

---

# 89. Polling

The technique above is called polling.

```text
Client
  │
  ├── Request
  ├── Request
  ├── Request
  ├── Request
  └── Request
```

The client continuously asks:

> "Anything new?"

This creates unnecessary traffic when nothing has changed.

---

# 90. Long Polling

Long polling improves this somewhat.

The server keeps the request open until there is new information or a timeout occurs.

Conceptually:

```text
Client
  │
  │ Request
  ▼
Server
  │
  │ waits...
  │
  │ new message
  ▼
Response
```

Then the client sends another request.

This is better than aggressive polling but still isn't the ideal modern real-time communication model for our application.

---

# 91. WebSocket

WebSocket allows a long-lived connection between client and server.

Instead of:

```text
Request
Response
Request
Response
Request
Response
```

we can have:

```text
Client
   │
   │
   │ Persistent Connection
   │
   ▼
Server
```

Both sides can communicate through the established connection.

---

# 92. HTTP vs WebSocket

### HTTP

```text
Client
  │
  │ Request
  ▼
Server
  │
  │ Response
  ▼
Client
```

### WebSocket

```text
Client
  │
  │
  │ Persistent connection
  │
  ▼
Server

Either side can send messages
over the established connection.
```

This makes WebSocket suitable for:

* Chat
* Live notifications
* Presence
* Typing indicators
* Real-time dashboards
* Multiplayer systems

---

# 93. Important: Socket.IO Is Not WebSocket

This distinction is extremely important.

```text
WebSocket
    ↓
A communication protocol/API

Socket.IO
    ↓
A real-time communication library/framework
```

Socket.IO can use WebSocket as a transport when possible, but Socket.IO is not simply another name for WebSocket.

We will study this properly in the next documents.

---

# 94. HTTP and WebSocket Together

Our chat application will use both.

```text
                    CHAT APP
                       │
             ┌─────────┴─────────┐
             │                   │
            HTTP              Socket.IO
             │                   │
             ▼                   ▼
       Request/Response      Real-Time
             │                   │
             │                   │
       Login                  New Message
       Register               Typing
       Profile                Presence
       Old Messages           Read Receipt
       Search                Notifications
```

This is the architecture we want.

---

# 95. What HTTP Does in Our Chat App

HTTP will handle:

```text
Authentication
User profiles
User search
Conversation creation
Conversation management
Historical messages
File uploads
Settings
Other request/response operations
```

---

# 96. What Socket.IO Does

Socket.IO will handle:

```text
New messages
Typing indicators
Online/offline presence
Read receipts
Real-time notifications
Conversation events
```

---

# 97. The Complete Communication Model

```text
                         CHAT APPLICATION
                                │
                ┌───────────────┴───────────────┐
                │                               │
              HTTP                          Socket.IO
                │                               │
        Request / Response                 Real-Time Events
                │                               │
        ┌───────┴────────┐              ┌───────┴────────┐
        │                │              │                │
      React            Express        React           Socket Server
        │                │              │                │
        └────────────────┴──────────────┴────────────────┘
                                │
                                ▼
                            Services
                                │
                                ▼
                             MongoDB
```

---

# 98. HTTP Mental Model

Whenever you see:

```text
HTTP
```

think:

```text
Client
  ↓
Request
  ↓
Server
  ↓
Processing
  ↓
Response
  ↓
Client
```

Then ask:

1. What method?
2. What URL?
3. What headers?
4. What body?
5. What status code?
6. What response body?

---

# 99. Request Mental Model

Remember:

```text
REQUEST
│
├── Method
├── URL
├── Headers
└── Body
```

Example:

```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret"
}
```

---

# 100. Response Mental Model

Remember:

```text
RESPONSE
│
├── Status Code
├── Headers
└── Body
```

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Success"
}
```

---

# 101. The Most Important HTTP Concepts

Before moving to WebSocket, you should understand these concepts:

```text
HTTP
 │
 ├── Request
 │    ├── Method
 │    ├── URL
 │    ├── Headers
 │    └── Body
 │
 ├── Response
 │    ├── Status Code
 │    ├── Headers
 │    └── Body
 │
 ├── Cookies
 ├── Authentication
 ├── Authorization
 ├── CORS
 ├── HTTPS
 ├── REST
 ├── CRUD
 ├── Pagination
 ├── Caching
 └── Rate Limiting
```

---

# 102. HTTP Cheat Sheet

## Methods

```text
GET
POST
PUT
PATCH
DELETE
```

## Common Status Codes

```text
200 → OK
201 → Created
204 → No Content

400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
409 → Conflict
422 → Validation/Semantic error
429 → Too Many Requests

500 → Internal Server Error
503 → Service Unavailable
```

## Common Headers

```text
Content-Type
Accept
Authorization
Cookie
Set-Cookie
Cache-Control
ETag
Location
```

---

# 103. HTTP Learning Exercise

Before continuing to WebSocket, manually understand these requests.

### Exercise 1

```http
GET /api/users
```

Identify:

* Method
* Path
* Purpose

---

### Exercise 2

```http
GET /api/users/123
```

Identify:

* Method
* Resource
* Path parameter

---

### Exercise 3

```http
GET /api/users?page=2&limit=20
```

Identify:

* Method
* Query parameters
* Their values

---

### Exercise 4

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret"
}
```

Identify:

* Method
* Path
* Header
* Body

---

### Exercise 5

```http
PATCH /api/users/123
Content-Type: application/json

{
  "name": "New Name"
}
```

Identify:

* Method
* Path parameter
* Body
* Why PATCH instead of GET?

---

### Exercise 6

Suppose MongoDB is unavailable while processing:

```http
GET /api/conversations
```

Which category of status code should the server return?

Think:

```text
2xx
3xx
4xx
5xx
```

---

# 104. HTTP Mastery Checklist

You can consider the HTTP foundation strong when you can explain these without memorizing definitions.

### Fundamentals

* [ ] What is HTTP?
* [ ] What is a client?
* [ ] What is a server?
* [ ] What is a request?
* [ ] What is a response?

### Requests

* [ ] HTTP methods
* [ ] GET
* [ ] POST
* [ ] PUT
* [ ] PATCH
* [ ] DELETE
* [ ] Headers
* [ ] Body
* [ ] Content-Type
* [ ] Path parameters
* [ ] Query parameters

### Responses

* [ ] Status codes
* [ ] 2xx
* [ ] 3xx
* [ ] 4xx
* [ ] 5xx

### Authentication

* [ ] Cookies
* [ ] Sessions
* [ ] JWT
* [ ] Authentication
* [ ] Authorization
* [ ] HTTP-only cookies

### Browser Security

* [ ] CORS
* [ ] Preflight
* [ ] HTTPS
* [ ] SameSite
* [ ] Secure cookies

### API Design

* [ ] REST
* [ ] CRUD
* [ ] Idempotency
* [ ] Pagination
* [ ] Filtering
* [ ] Sorting
* [ ] Rate limiting
* [ ] Error responses

### Advanced

* [ ] Caching
* [ ] ETag
* [ ] Statelessness
* [ ] Polling
* [ ] Long polling
* [ ] HTTP vs WebSocket

---

# 105. Final Mental Model

If you remember only one diagram from this document, remember this:

```text
                         HTTP
                          │
              ┌───────────┴───────────┐
              │                       │
           REQUEST                 RESPONSE
              │                       │
       ┌──────┼──────┐         ┌──────┼──────┐
       │      │      │         │      │      │
    Method   URL   Headers   Status  Headers Body
                   │
                  Body
              │
              ▼
           SERVER
              │
              ▼
          APPLICATION
              │
              ▼
           DATABASE
```

And for our chat application:

```text
                    React Client
                         │
             ┌───────────┴───────────┐
             │                       │
            HTTP                 Socket.IO
             │                       │
             ▼                       ▼
          Express              Real-Time Server
             │                       │
             └───────────┬───────────┘
                         │
                         ▼
                      Services
                         │
                         ▼
                      MongoDB
```

The key idea is:

> **HTTP is primarily request/response communication.**

> **Socket.IO will give our application real-time event communication.**

> **MongoDB will persist our application data.**

## That distinction is the foundation of the entire chat application.

# 🚀 Next Step

The next document will be:

```text
docs/05-websocket.md
```

There we will start from **absolute zero**:

```text
HTTP
  ↓
Why polling is inefficient
  ↓
Long Polling
  ↓
Why we need persistent connections
  ↓
TCP
  ↓
WebSocket
  ↓
WebSocket Handshake
  ↓
HTTP Upgrade
  ↓
Connection Lifecycle
  ↓
Client ↔ Server Communication
  ↓
WebSocket Events
  ↓
Connection Close
  ↓
WebSocket vs HTTP
  ↓
Where Socket.IO fits
```

After that:

```text
05-websocket.md
       ↓
06-socket-io.md
       ↓
07-realtime-architecture.md
```

Then hum **actual chat application ka real-time engine** build karna start karenge.
