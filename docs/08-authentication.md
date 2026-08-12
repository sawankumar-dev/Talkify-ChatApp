# Authentication

> **Project:** Real-Time Chat Application
> **Document:** `authentication.md`
> **Purpose:** HTTP aur WebSocket dono ke liye secure authentication system design karna
> **Stack:** Node.js + Express.js + MongoDB + JWT + WebSocket
> **Language:** Hinglish

---

# Table of Contents

1. [Authentication Kya Hai?](#1-authentication-kya-hai)
2. [Authentication vs Authorization](#2-authentication-vs-authorization)
3. [Hamare System Mein Authentication](#3-hamare-system-mein-authentication)
4. [Authentication Architecture](#4-authentication-architecture)
5. [User Registration Flow](#5-user-registration-flow)
6. [Login Flow](#6-login-flow)
7. [Password Security](#7-password-security)
8. [JWT Kya Hai?](#8-jwt-kya-hai)
9. [JWT Structure](#9-jwt-structure)
10. [Access Token](#10-access-token)
11. [Refresh Token](#11-refresh-token)
12. [Access + Refresh Token Architecture](#12-access--refresh-token-architecture)
13. [Token Expiration](#13-token-expiration)
14. [HTTP Authentication](#14-http-authentication)
15. [WebSocket Authentication](#15-websocket-authentication)
16. [WebSocket Handshake](#16-websocket-handshake)
17. [Socket Authentication Flow](#17-socket-authentication-flow)
18. [Socket User Context](#18-socket-user-context)
19. [Authorization](#19-authorization)
20. [Conversation Authorization](#20-conversation-authorization)
21. [Message Authorization](#21-message-authorization)
22. [Logout](#22-logout)
23. [Refresh Token Rotation](#23-refresh-token-rotation)
24. [Token Revocation](#24-token-revocation)
25. [Multiple Devices](#25-multiple-devices)
26. [Session Management](#26-session-management)
27. [Cookie Security](#27-cookie-security)
28. [CORS](#28-cors)
29. [CSRF](#29-csrf)
30. [XSS](#30-xss)
31. [WebSocket Security](#31-websocket-security)
32. [Rate Limiting](#32-rate-limiting)
33. [Brute Force Protection](#33-brute-force-protection)
34. [Input Validation](#34-input-validation)
35. [Password Reset](#35-password-reset)
36. [Email Verification](#36-email-verification)
37. [Account Locking](#37-account-locking)
38. [Session Revocation](#38-session-revocation)
39. [Authentication Errors](#39-authentication-errors)
40. [Security Headers](#40-security-headers)
41. [Environment Variables](#41-environment-variables)
42. [Authentication Models](#42-authentication-models)
43. [Authentication Controllers](#43-authentication-controllers)
44. [Authentication Services](#44-authentication-services)
45. [Authentication Middleware](#45-authentication-middleware)
46. [Authentication Routes](#46-authentication-routes)
47. [WebSocket Authentication Architecture](#47-websocket-authentication-architecture)
48. [Complete Login Flow](#48-complete-login-flow)
49. [Complete WebSocket Flow](#49-complete-websocket-flow)
50. [Complete Logout Flow](#50-complete-logout-flow)
51. [Common Mistakes](#51-common-mistakes)
52. [Production Security Rules](#52-production-security-rules)
53. [Implementation Order](#53-implementation-order)
54. [Authentication Checklist](#54-authentication-checklist)

---

# 1. Authentication Kya Hai?

Authentication ka simple meaning:

> **"Tum kaun ho?"**

Example:

```text
User
  ↓
Email + Password
  ↓
Server
  ↓
Identity Verify
  ↓
Authenticated
```

Chat application mein server ko pata hona chahiye:

```text
Ye request kis user ki hai?
```

---

# 2. Authentication vs Authorization

Dono ko confuse nahi karna.

## Authentication

```text
Who are you?
```

Example:

```text
User = Sawan
```

---

## Authorization

```text
What are you allowed to do?
```

Example:

```text
Sawan conversation #123 ka member hai?
```

Agar hai:

```text
Allowed
```

Agar nahi:

```text
Forbidden
```

---

# 3. Hamare System Mein Authentication

Hamare application mein do major authentication contexts hain:

```text
HTTP Authentication
        +
WebSocket Authentication
```

Architecture:

```text
                    Client
                   /      \
                  /        \
               HTTP       WebSocket
                |             |
                v             v
          Auth Middleware  Socket Auth
                |             |
                +------+------+
                       |
                     User
```

---

# 4. Authentication Architecture

Complete authentication architecture:

```text
Client
  |
  v
Register / Login
  |
  v
Auth Controller
  |
  v
Auth Service
  |
  v
User Model
  |
  v
MongoDB
```

Login ke baad:

```text
User
  |
  v
Access Token
  +
Refresh Token
```

---

# 5. User Registration Flow

Basic registration:

```text
Client
  |
  | POST /api/auth/register
  v
Server
  |
  v
Validate Input
  |
  v
Check Existing User
  |
  v
Hash Password
  |
  v
Create User
  |
  v
MongoDB
```

Example payload:

```json
{
  "name": "Sawan",
  "email": "user@example.com",
  "password": "strong-password"
}
```

Password ko plain text mein database mein kabhi store nahi karna.

---

# 6. Login Flow

```text
Client
  |
  | email + password
  v
Auth Controller
  |
  v
Auth Service
  |
  v
Find User
  |
  v
Compare Password
  |
  +---- Invalid → Error
  |
  +---- Valid
          |
          v
      Generate Tokens
          |
          v
        Response
```

---

# 7. Password Security

Password ko:

```text
password
```

ke form mein store nahi karna.

Instead:

```text
password
   ↓
bcrypt / Argon2
   ↓
passwordHash
```

Database:

```json
{
  "password": "..."
}
```

aisa nahi.

Instead:

```json
{
  "passwordHash": "$..."
}
```

---

# 8. Password Hashing

Password hashing one-way process hona chahiye.

```text
Password
   |
   v
Hash Function
   |
   v
Hash
```

Login:

```text
Input Password
   |
   v
Hash Verification
   |
   v
Stored Hash
```

Important:

> Password ko decrypt karne ki zarurat nahi honi chahiye.

---

# 9. JWT Kya Hai?

JWT:

> **JSON Web Token**

Ye ek signed token format hai jise server user identity aur claims represent karne ke liye use kar sakta hai.

Basic architecture:

```text
User
  ↓
Login
  ↓
Server
  ↓
JWT
  ↓
Client
```

---

# 10. JWT Structure

JWT generally:

```text
HEADER.PAYLOAD.SIGNATURE
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

```json
{
  "sub": "user-id",
  "iat": 1234567890,
  "exp": 1234569999
}
```

### Signature

Signature ensure karti hai ki token server ke secret/key se validly sign hua hai.

---

# 11. Important JWT Rule

JWT payload encrypted nahi hota by default.

Isliye token payload mein:

```text
password
credit card
secret information
```

nahi rakhni.

JWT ko:

```text
Signed
```

samjho, automatically:

```text
Encrypted
```

nahi.

---

# 12. Access Token

Access token short-lived authentication credential hoga.

Example conceptual lifetime:

```text
5 minutes
15 minutes
30 minutes
```

Exact duration implementation decision hogi.

Architecture:

```text
Access Token
     |
     v
Protected API
```

Example:

```text
GET /api/users/me
```

Server token verify karega.

---

# 13. Refresh Token

Access token expire hone ke baad user ko baar-baar login nahi karna chahiye.

Isliye refresh token use hota hai.

```text
Access Token
   ↓
Short life

Refresh Token
   ↓
Longer life
```

Flow:

```text
Access Token Expired
        |
        v
Refresh Token
        |
        v
New Access Token
```

---

# 14. Access + Refresh Token Architecture

```text
                 Login
                   |
                   v
            +------+------+
            |             |
      Access Token   Refresh Token
            |             |
       Short-lived     Long-lived
            |             |
       API / WS       Refresh API
```

---

# 15. Token Storage

Browser application mein sensitive authentication tokens ke storage ko carefully design karna chahiye.

Common secure approach:

```text
HttpOnly Cookie
```

Browser JavaScript directly HttpOnly cookie read nahi kar sakta.

Example conceptual cookies:

```text
accessToken
refreshToken
```

---

# 16. Secure Cookie Flags

Production mein cookies ko generally:

```text
HttpOnly
Secure
SameSite
```

jaise attributes ke saath configure karna chahiye.

### HttpOnly

JavaScript se cookie access difficult/prevent karta hai.

### Secure

Cookie HTTPS connection par hi send hoti hai.

### SameSite

Cross-site request behavior control karta hai.

---

# 17. Token Expiration

Access token:

```text
Short-lived
```

Refresh token:

```text
Longer-lived
```

Example:

```text
10:00 → Login

10:15 → Access token expires

10:15 → Refresh token used

10:15 → New access token
```

---

# 18. HTTP Authentication

Protected HTTP request:

```text
Client
  |
  | Request + authentication
  v
Auth Middleware
  |
  v
Verify Token
  |
  +---- Invalid → 401
  |
  +---- Valid
          |
          v
       Controller
```

---

# 19. HTTP Auth Middleware

Middleware ka responsibility:

```text
Read credentials
Validate token
Decode identity
Find/verify user if required
Attach user context
Continue
```

Conceptual:

```text
request
   ↓
authenticate
   ↓
request.user
   ↓
controller
```

---

# 20. `req.user`

Authentication successful hone ke baad:

```text
req.user
```

mein authenticated user ka context available ho sakta hai.

Example:

```js
req.user = {
  id: userId
};
```

Controller:

```text
req.user.id
```

use kar sakta hai.

---

# 21. WebSocket Authentication

WebSocket connection HTTP request se start hota hai aur phir WebSocket connection establish hota hai.

Conceptual:

```text
Client
  |
  | WebSocket Handshake
  v
Server
  |
  v
Authenticate
  |
  +---- Invalid → Reject
  |
  +---- Valid
          |
          v
       Connected
```

---

# 22. WebSocket Handshake

Initial request conceptually:

```text
Client
   |
   | HTTP Upgrade Request
   v
Server
   |
   | 101 Switching Protocols
   v
WebSocket
```

Authentication ko connection establish hone se pehle ya handshake context mein perform kiya ja sakta hai, depending on architecture.

---

# 23. WebSocket Authentication Flow

```text
Client
   |
   | Connect
   v
WebSocket Server
   |
   v
Extract Credentials
   |
   v
Verify Access Token
   |
   +------ Invalid
   |          |
   |          v
   |       Reject
   |
   +------ Valid
              |
              v
        Create Socket Context
              |
              v
          Connection
```

---

# 24. Socket User Context

Authentication successful hone ke baad socket ke saath user identity associate karenge.

Conceptually:

```js
socket.user = {
  id: userId
};
```

Then events:

```text
socket
   ↓
socket.user.id
```

se authenticated user identify ho sakta hai.

---

# 25. Important Rule

Client se aaya hua:

```json
{
  "userId": "123"
}
```

trusted nahi karna.

Example:

```text
User A
   |
   | userId = User B
   v
Server
```

Server ko token/session identity se user A identify karna chahiye.

Correct:

```text
socket.user.id
```

---

# 26. Authorization

Authentication ke baad authorization check karna zaruri hai.

Example:

```text
User authenticated
        |
        v
Can access conversation #123?
        |
      /   \
    Yes    No
     |      |
  Allow   Reject
```

---

# 27. Conversation Authorization

Suppose:

```text
Conversation #100
```

members:

```text
User A
User B
```

User C:

```text
Conversation #100 access?
```

Answer:

```text
NO
```

Even if User C authenticated hai.

---

# 28. Message Authorization

Suppose message:

```text
messageId = 123
conversationId = 456
```

Server ko verify karna chahiye:

```text
Current User
      ↓
Conversation Member?
      ↓
Message belongs to conversation?
```

Then operation allow karo.

---

# 29. Logout

Logout ka basic flow:

```text
Client
  |
  | POST /logout
  v
Server
  |
  v
Invalidate Session / Refresh Token
  |
  v
Clear Cookies
  |
  v
Success
```

WebSocket bhi disconnect karna useful hai:

```text
Logout
  ↓
WebSocket disconnect
```

---

# 30. Access Token Expiration

Suppose:

```text
Access Token expired
```

HTTP request:

```text
GET /api/messages
```

Response:

```text
401 Unauthorized
```

Client:

```text
Refresh
  ↓
New Access Token
  ↓
Retry Request
```

---

# 31. Refresh Token Rotation

Advanced security mein refresh token rotation use ki ja sakti hai.

Concept:

```text
Refresh Token A
      ↓
Refresh
      ↓
Access Token B
      +
Refresh Token C
```

Purana refresh token invalidate:

```text
Refresh Token A
      ↓
Revoked
```

Agar purana token dobara use ho:

```text
Potential token reuse
        ↓
Security response
```

---

# 32. Token Revocation

JWT stateless nature ke karan server ke paas har token ka active state automatically nahi hota.

Isliye refresh tokens/sessions ko database mein track karna useful hai.

Example collection:

```text
sessions
```

Fields conceptually:

```text
userId
tokenHash
device
createdAt
expiresAt
revokedAt
```

---

# 33. Refresh Token Hashing

Database mein raw refresh token store karne ke bajay hash store karna safer approach ho sakta hai.

```text
Refresh Token
     ↓
Hash
     ↓
MongoDB
```

Agar database leak ho bhi jaye to raw refresh token directly available nahi hota.

---

# 34. Multiple Devices

User simultaneously:

```text
Laptop
Phone
Tablet
```

par logged in ho sakta hai.

Therefore:

```text
One User
   |
   +--- Session A
   +--- Session B
   +--- Session C
```

Aur WebSocket:

```text
User
 ├── Socket A
 ├── Socket B
 └── Socket C
```

---

# 35. Session Management

Session model conceptual:

```json
{
  "userId": "user-id",
  "tokenHash": "hash",
  "device": "Chrome",
  "createdAt": "...",
  "expiresAt": "...",
  "revokedAt": null
}
```

User apne sessions dekh sakta hai:

```text
Chrome - Active
Android - Active
Firefox - Active
```

Aur ek session revoke kar sakta hai.

---

# 36. Logout Current Device

```text
Current Session
      ↓
Revoke
      ↓
Clear Cookies
      ↓
Disconnect Socket
```

Other devices:

```text
Still Logged In
```

---

# 37. Logout All Devices

```text
User
  ↓
Logout All
  ↓
Revoke all sessions
  ↓
Invalidate refresh tokens
  ↓
Disconnect active sockets
```

---

# 38. Cookie Security

Production cookies:

```text
HttpOnly: true
Secure: true
SameSite: appropriate value
```

Development mein:

```text
Secure
```

configuration environment ke according adjust ho sakti hai.

---

# 39. CORS

Agar frontend aur backend different origins par hain:

```text
Frontend
https://client.example.com

Backend
https://api.example.com
```

to CORS configuration required ho sakti hai.

Credentials use karte waqt:

```text
credentials: true
```

aur server-side allowed origins carefully configure karne chahiye.

Wildcard:

```text
*
```

ke saath credentials configuration generally appropriate nahi hoti.

---

# 40. CSRF

Cookie-based authentication mein CSRF considerations important hain.

Attacker malicious site se request trigger karne ki koshish kar sakta hai.

Protection:

```text
SameSite cookies
CSRF tokens where needed
Origin/Referer validation where appropriate
```

Architecture ke according protection choose karni chahiye.

---

# 41. XSS

XSS ka matlab:

> Cross-Site Scripting

Attacker malicious JavaScript inject karne ki koshish kar sakta hai.

Protection:

```text
Output escaping
Content Security Policy
Input validation
Safe rendering
HttpOnly cookies
```

Chat application mein message content ko blindly HTML ke roop mein render nahi karna.

---

# 42. WebSocket Security

WebSocket ke liye:

```text
WSS
```

production mein use karna chahiye.

```text
ws://
```

development mein ho sakta hai.

Production:

```text
wss://
```

---

# 43. WebSocket Authorization

Sirf connection authenticate karna enough nahi.

Har sensitive event ke liye authorization:

```text
chat:send
conversation:join
message:read
message:delete
```

check karna chahiye.

---

# 44. Connection Limits

Ek malicious user:

```text
1000 WebSocket connections
```

open karne ki koshish kar sakta hai.

Isliye:

```text
Per-IP limits
Per-user limits
Connection rate limits
```

useful hain.

---

# 45. Rate Limiting

Important events:

```text
login
register
refresh
password reset
WebSocket connection
message send
```

rate limited hone chahiye.

---

# 46. Brute Force Protection

Attacker:

```text
password1
password2
password3
...
```

try kar sakta hai.

Protection:

```text
Rate limiting
Progressive delays
Temporary lockout
Monitoring
```

---

# 47. Login Failure

Response generic rakhna better hota hai.

Instead of revealing:

```text
User doesn't exist
```

or:

```text
Wrong password
```

generic response:

```text
Invalid email or password
```

useful ho sakta hai.

Isse user enumeration reduce hota hai.

---

# 48. Input Validation

Login:

```text
email
password
```

Register:

```text
name
email
password
```

validate karna zaruri hai.

Validation layer:

```text
Request
  ↓
Validator
  ↓
Controller
```

---

# 49. Password Reset

Forgot password flow:

```text
User
  |
  | Forgot Password
  v
Server
  |
  v
Generate Reset Token
  |
  v
Email
  |
  v
User
  |
  | Reset Token
  v
Server
  |
  v
Verify Token
  |
  v
New Password
```

Reset token short-lived hona chahiye.

---

# 50. Password Reset Token

Raw reset token database mein store karne ke bajay hash store karna safer approach hai.

```text
Reset Token
    ↓
Hash
    ↓
MongoDB
```

Token use hone ke baad:

```text
Invalidate
```

---

# 51. Email Verification

Registration ke baad:

```text
User
  ↓
Register
  ↓
Create Account
  ↓
Verification Token
  ↓
Email
  ↓
User clicks link
  ↓
Verify
  ↓
emailVerified = true
```

---

# 52. Email Verification Authorization

Agar application policy ke according verified email required hai:

```text
emailVerified = false
```

to selected actions block ho sakte hain.

Example:

```text
Create conversation
Send messages
```

Exact policy project requirements par depend karegi.

---

# 53. Account Locking

Suspicious login behavior par temporary lock:

```text
Too many failures
      ↓
Temporary lock
      ↓
Wait
      ↓
Unlock
```

Permanent lock automatically nahi karna unless carefully designed.

---

# 54. Authentication Errors

Common HTTP status:

### `400 Bad Request`

Invalid input.

### `401 Unauthorized`

Authentication missing/invalid.

### `403 Forbidden`

Authenticated but not authorized.

### `404 Not Found`

Resource doesn't exist.

### `429 Too Many Requests`

Rate limit exceeded.

---

# 55. Authentication Models

Recommended models:

```text
User
Session
```

Potential future model:

```text
EmailVerificationToken
PasswordResetToken
```

Lekin tokens ko dedicated collections ya session/token strategy ke according design kar sakte hain.

---

# 56. User Model

Conceptual:

```text
User
├── name
├── email
├── passwordHash
├── avatar
├── emailVerified
├── status
├── createdAt
└── updatedAt
```

---

# 57. Session Model

Conceptual:

```text
Session
├── userId
├── tokenHash
├── device
├── userAgent
├── ip
├── createdAt
├── expiresAt
└── revokedAt
```

Sensitive IP/device retention ko privacy requirements ke according handle karna chahiye.

---

# 58. Authentication Controllers

Recommended controllers:

```text
auth.controller.js
```

Methods:

```text
register
login
logout
refresh
logoutAll
verifyEmail
forgotPassword
resetPassword
getCurrentUser
```

---

# 59. Authentication Services

Recommended:

```text
auth.service.js
```

Responsibilities:

```text
registerUser
loginUser
refreshSession
logoutSession
logoutAllSessions
verifyEmail
createPasswordReset
resetPassword
```

---

# 60. Password Service

Password-related logic separate rakhna useful ho sakta hai:

```text
password.service.js
```

Responsibilities:

```text
hashPassword
comparePassword
validatePassword
```

---

# 61. Token Service

Token-related logic:

```text
token.service.js
```

Responsibilities:

```text
generateAccessToken
generateRefreshToken
verifyAccessToken
hashRefreshToken
verifyRefreshToken
```

---

# 62. Authentication Middleware

HTTP:

```text
auth.middleware.js
```

Responsibilities:

```text
authenticate
requireVerifiedUser
```

Authorization ke liye:

```text
authorization.middleware.js
```

ya service-level checks use kiye ja sakte hain.

---

# 63. WebSocket Authentication

Separate socket middleware:

```text
socket-auth.middleware.js
```

Conceptual flow:

```text
Socket Connection
      ↓
Extract Credential
      ↓
Verify Token
      ↓
Find User
      ↓
Attach User
      ↓
Accept Connection
```

---

# 64. Authentication Routes

Recommended:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/logout-all
GET  /api/auth/me
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

# 65. Route Responsibility

## Register

```text
POST /register
```

New account.

## Login

```text
POST /login
```

Create authenticated session.

## Refresh

```text
POST /refresh
```

New access token.

## Logout

```text
POST /logout
```

Current session revoke.

## Logout All

```text
POST /logout-all
```

All sessions revoke.

## Me

```text
GET /me
```

Current authenticated user.

---

# 66. WebSocket Authentication Architecture

```text
                    CLIENT
                       |
                       |
                  WebSocket
                  Handshake
                       |
                       v
              Socket Auth Middleware
                       |
                +------+------+
                |             |
              Invalid        Valid
                |             |
              Reject          v
                         socket.user
                              |
                              v
                       Connection Manager
                              |
                              v
                         Event Router
```

---

# 67. Complete Login Flow

```text
                     CLIENT
                        |
                        |
                  POST /login
                        |
                        v
                Auth Controller
                        |
                        v
                  Auth Service
                        |
                        v
                  Find User
                        |
                        v
                Compare Password
                        |
                 +------+------+
                 |             |
               Fail           Pass
                 |             |
                401            v
                         Create Session
                              |
                    +---------+---------+
                    |                   |
              Access Token       Refresh Token
                    |                   |
                    +---------+---------+
                              |
                              v
                           Cookies
                              |
                              v
                           CLIENT
```

---

# 68. Complete WebSocket Flow

```text
CLIENT
  |
  | Connect
  v
WebSocket Server
  |
  v
Socket Authentication
  |
  v
Verify Access Token
  |
  +------ Invalid
  |         |
  |       Reject
  |
  +------ Valid
            |
            v
        socket.user
            |
            v
      Connection Manager
            |
            v
       Join Required Rooms
            |
            v
          Ready
```

---

# 69. WebSocket Event Authorization

Example:

```text
chat:send
```

Flow:

```text
Event
  ↓
Authenticated?
  ↓
Conversation member?
  ↓
Payload valid?
  ↓
Allowed?
  ↓
Chat Service
```

---

# 70. Logout Flow

```text
Client
  |
  | POST /logout
  v
Auth Controller
  |
  v
Auth Service
  |
  v
Revoke Session
  |
  v
Clear Cookies
  |
  v
Disconnect Socket
  |
  v
Success
```

---

# 71. Logout All Flow

```text
User
  |
  | logout-all
  v
Auth Service
  |
  v
Find all sessions
  |
  v
Revoke all
  |
  v
Invalidate authentication
  |
  v
Disconnect active sockets
```

---

# 72. Authentication Data Flow

```text
                   USER
                     |
                     v
                  LOGIN
                     |
                     v
                AUTH SERVICE
                     |
          +----------+----------+
          |                     |
          v                     v
       MONGODB              TOKEN SERVICE
          |                     |
          |               +-----+-----+
          |               |           |
          |             Access      Refresh
          |               |           |
          +---------------+-----------+
                          |
                          v
                       CLIENT
```

---

# 73. Authentication + Real-Time Architecture

Final integration:

```text
                          CLIENT
                         /      \
                        /        \
                     HTTP       WebSocket
                      |             |
                      v             v
               Auth Middleware   Socket Auth
                      |             |
                      +------+------+
                             |
                             v
                          User
                             |
               +-------------+-------------+
               |                           |
               v                           v
         HTTP Controllers             Event Router
               |                           |
               v                           v
           Services                    Handlers
               |                           |
               +-------------+-------------+
                             |
                             v
                          MongoDB
```

---

# 74. Authentication Security Layers

```text
                Authentication
                      |
       +--------------+--------------+
       |              |              |
    Password         JWT          Session
       |              |              |
     Hashing       Signing       Revocation
       |              |              |
       +--------------+--------------+
                      |
                Authorization
                      |
                Rate Limiting
                      |
                  Validation
                      |
                  Monitoring
```

---

# 75. Common Mistakes

## Mistake 1

Password plain text mein store karna.

---

## Mistake 2

JWT payload mein password rakhna.

---

## Mistake 3

JWT ko automatically encrypted samajhna.

---

## Mistake 4

Client ke `userId` par trust karna.

---

## Mistake 5

Authentication ko authorization samajhna.

---

## Mistake 6

WebSocket connection authenticate na karna.

---

## Mistake 7

Har authenticated user ko har conversation access de dena.

---

## Mistake 8

Refresh tokens ko unlimited lifetime dena.

---

## Mistake 9

Logout ke baad refresh session revoke na karna.

---

## Mistake 10

Multiple devices ko handle na karna.

---

## Mistake 11

Rate limiting ignore karna.

---

## Mistake 12

Production mein `ws://` use karna.

---

## Mistake 13

Sensitive data logs mein print karna.

---

# 76. Production Security Rules

Production mein:

```text
✓ HTTPS
✓ WSS
✓ Strong password hashing
✓ Short-lived access tokens
✓ Refresh token rotation
✓ Refresh token revocation
✓ Secure cookies
✓ HttpOnly cookies
✓ Appropriate SameSite policy
✓ CORS restrictions
✓ CSRF protection where applicable
✓ Input validation
✓ Rate limiting
✓ Brute-force protection
✓ WebSocket authorization
✓ Conversation membership checks
✓ Secure secrets
✓ Security logging
✓ Monitoring
```

---

# 77. Environment Variables

Authentication secrets source code mein hard-code nahi karne.

Example:

```env
NODE_ENV=development

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

Production secrets secure secret-management system/environment mein rakhne chahiye.

---

# 78. Authentication Folder Structure

Recommended:

```text
src/
│
├── modules/
│   │
│   └── auth/
│       ├── auth.controller.js
│       ├── auth.service.js
│       ├── auth.routes.js
│       ├── auth.validator.js
│       └── auth.constants.js
│
├── services/
│   ├── token.service.js
│   └── password.service.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── authorization.middleware.js
│
├── websocket/
│   └── middleware/
│       └── socket-auth.middleware.js
│
└── models/
    ├── user.model.js
    └── session.model.js
```

---

# 79. Authentication Request Lifecycle

HTTP:

```text
Request
  ↓
CORS
  ↓
Rate Limit
  ↓
Validation
  ↓
Authentication
  ↓
Authorization
  ↓
Controller
  ↓
Service
  ↓
Database
  ↓
Response
```

WebSocket:

```text
Connection
  ↓
Origin / Connection Checks
  ↓
Authentication
  ↓
Connection Manager
  ↓
Event
  ↓
Validation
  ↓
Authorization
  ↓
Handler
  ↓
Service
  ↓
Database
  ↓
Event Dispatch
```

---

# 80. Authentication State Machine

User account state:

```text
REGISTERED
     |
     v
EMAIL_UNVERIFIED
     |
     v
VERIFIED
     |
     v
ACTIVE
     |
     +--------+
     |        |
     v        v
LOCKED     DISABLED
```

Session state:

```text
CREATED
   |
   v
ACTIVE
   |
   +------+
   |      |
   v      v
EXPIRED REVOKED
```

---

# 81. WebSocket Connection State

```text
CONNECTING
     |
     v
AUTHENTICATING
     |
     +-------> REJECTED
     |
     v
CONNECTED
     |
     v
AUTHENTICATED
     |
     v
DISCONNECTED
     |
     v
RECONNECTING
```

---

# 82. Authentication Contract

Har authentication operation ka clear contract hona chahiye.

Example login:

```text
Input
  ↓
email
password

Output
  ↓
authenticated session
current user
```

Failure:

```text
401 Unauthorized
```

---

# 83. What WebSocket Should Trust

WebSocket server ko trust karna chahiye:

```text
Verified token identity
Server-side session
Server-side authorization
Validated payload
```

Trust nahi karna:

```text
Client userId
Client role
Client conversation membership
Client message ownership
```

---

# 84. Security Mental Model

Har request/event ke liye ye 5 questions pucho:

```text
1. User kaun hai?
2. Token/session valid hai?
3. User ko ye resource access karne ki permission hai?
4. Payload valid hai?
5. Is action ko abhi perform karna allowed hai?
```

Agar inmein se koi important check fail hai:

```text
Reject
```

---

# 85. Implementation Order

Authentication ko is order mein build karenge:

## Step 1

```text
User Model
```

## Step 2

```text
Password Hashing
```

## Step 3

```text
Register
```

## Step 4

```text
Login
```

## Step 5

```text
Access Token
```

## Step 6

```text
Refresh Token
```

## Step 7

```text
Session Model
```

## Step 8

```text
Auth Middleware
```

## Step 9

```text
Current User
```

## Step 10

```text
Logout
```

## Step 11

```text
Refresh Rotation
```

## Step 12

```text
WebSocket Authentication
```

## Step 13

```text
Socket User Context
```

## Step 14

```text
Authorization
```

## Step 15

```text
Multiple Devices
```

## Step 16

```text
Rate Limiting
```

## Step 17

```text
Email Verification
```

## Step 18

```text
Password Reset
```

---

# 86. Authentication Checklist

## User

* [ ] User model
* [ ] Unique email
* [ ] Password hash
* [ ] Email verification
* [ ] Account status

## Register

* [ ] Validate input
* [ ] Check duplicate email
* [ ] Hash password
* [ ] Create user
* [ ] Send verification

## Login

* [ ] Validate credentials
* [ ] Compare password
* [ ] Generate access token
* [ ] Generate refresh token
* [ ] Create session
* [ ] Set secure cookies

## Access Token

* [ ] Short expiration
* [ ] Signature verification
* [ ] User identity
* [ ] No sensitive data

## Refresh Token

* [ ] Longer expiration
* [ ] Secure storage
* [ ] Rotation
* [ ] Revocation
* [ ] Reuse detection

## HTTP

* [ ] Authentication middleware
* [ ] Authorization
* [ ] CORS
* [ ] CSRF strategy
* [ ] Rate limiting

## WebSocket

* [ ] Handshake authentication
* [ ] Socket user context
* [ ] Connection manager
* [ ] Event authorization
* [ ] WSS

## Security

* [ ] Password hashing
* [ ] Secure cookies
* [ ] HTTPS
* [ ] WSS
* [ ] Input validation
* [ ] Rate limiting
* [ ] Brute-force protection
* [ ] Security logging

---

# 87. Final Mental Model

Authentication ko simply is tarah yaad rakho:

```text
                 USER
                   |
                   v
                LOGIN
                   |
                   v
            VERIFY PASSWORD
                   |
                   v
              CREATE SESSION
                   |
          +--------+--------+
          |                 |
          v                 v
    ACCESS TOKEN      REFRESH TOKEN
          |                 |
          v                 v
    HTTP + WebSocket     New Access
          |
          v
    AUTHENTICATION
          |
          v
    AUTHORIZATION
          |
          v
       RESOURCE
```

Aur WebSocket ke liye:

```text
Client
  |
  | Connect
  v
WebSocket Handshake
  |
  v
Authenticate
  |
  +---- Invalid → Reject
  |
  +---- Valid
          |
          v
      socket.user
          |
          v
      Connection
          |
          v
        Event
          |
          v
      Authorize
          |
          v
       Handler
          |
          v
       Service
          |
          v
      MongoDB
```

---

# 88. Final Principle

> **Authentication ka kaam user ki identity establish karna hai.**

> **Authorization ka kaam decide karna hai ki authenticated user kya kar sakta hai.**

> **WebSocket authentication connection establish karne ke liye identity provide karti hai, lekin har sensitive real-time action par authorization phir bhi required hai.**

> **MongoDB persistent authentication/session state ka source ho sakta hai, jabki WebSocket sirf authenticated identity ko real-time communication layer tak carry karta hai.**

> **Secure authentication ka matlab sirf JWT generate karna nahi hai; complete system mein password security, sessions, token lifecycle, authorization, revocation, rate limiting, WebSocket security aur failure handling sab included hain.**

---

# End

**Next recommended documentation:**

```text
authorization.md
```

Usme hum specifically dekhenge:

```text
Authentication
      ↓
Authorization
      ↓
RBAC
      ↓
Conversation Permissions
      ↓
Message Permissions
      ↓
Group Roles
      ↓
Admin Permissions
      ↓
WebSocket Event Authorization
```

Aur phir authentication + authorization ko actual chat architecture ke saath connect karenge.
