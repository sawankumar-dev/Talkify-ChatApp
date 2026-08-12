💬 Chat Application — System Architecture
1. Purpose

This document defines the technical architecture of the Chat Application.

It explains:

How the frontend communicates with the backend
How REST APIs work inside the application
How Socket.IO works inside the application
How data moves through the backend
How MongoDB fits into the system
How authentication is handled
How messages travel from one user to another
Why the application is divided into different layers
How the architecture can evolve in the future

The goal is to understand the system before implementing it.

2. High-Level Architecture

The application consists of three primary systems:

┌──────────────────────────────┐
│         React Client         │
│       TypeScript + Redux     │
└──────────────┬───────────────┘
               │
        HTTP / Socket.IO
               │
               ▼
┌──────────────────────────────┐
│       Node.js Backend        │
│                              │
│  Express + Socket.IO         │
│  Controllers + Services      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│          + Mongoose           │
└──────────────────────────────┘

There are two different communication channels between the frontend and backend:

                 React
                   │
          ┌────────┴────────┐
          │                 │
        HTTP            Socket.IO
          │                 │
          ▼                 ▼
      Express          Socket Server
          │                 │
          └────────┬────────┘
                   │
                   ▼
                MongoDB
3. Why Two Communication Channels?

A chat application has two different kinds of communication.

3.1 Request/Response Communication

The client asks the server for something.

Example:

GET /api/conversations

The server responds:

200 OK
[
   conversation1,
   conversation2
]

This is appropriate for operations such as:

Login
Register
Fetch profile
Search users
Fetch conversations
Fetch old messages
Create groups
Update profile
4. Real-Time Communication

Sometimes the server needs to send information to the client without waiting for another request.

Example:

User A sends a message.

User A
   │
   │ New Message
   ▼
Server
   │
   │ Real-Time Event
   ▼
User B

User B should not need to repeatedly ask:

"Do I have a new message?"

Instead, the server pushes the event to User B.

This is where Socket.IO is used.

5. Complete Communication Architecture
                         INTERNET
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       HTTP Requests                 Socket Connection
              │                           │
              ▼                           ▼
      ┌───────────────┐           ┌────────────────┐
      │    Express    │           │   Socket.IO    │
      │    Server     │           │     Server     │
      └───────┬───────┘           └───────┬────────┘
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                     Application Layer
                            │
                            ▼
                     Service Layer
                            │
                            ▼
                      Mongoose Models
                            │
                            ▼
                        MongoDB

Express and Socket.IO are two entry points into the same backend application.

6. Backend Layered Architecture

The backend will follow a layered architecture.

Request
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

Each layer has a specific responsibility.

7. Route Layer

Routes define which endpoint should handle a request.

Example:

POST /api/auth/login

The route connects the endpoint to the appropriate controller.

Example conceptual structure:

POST /api/auth/login
        │
        ▼
authController.login

Routes should not contain business logic.

Bad:

Route
 ├── validate password
 ├── query database
 ├── generate token
 └── send response

Better:

Route
  ↓
Controller
  ↓
Service
  ↓
Database
8. Middleware Layer

Middleware runs between the request and the controller.

Example:

Request
   ↓
Authentication Middleware
   ↓
Validation Middleware
   ↓
Controller

Middleware can perform tasks such as:

Authentication
Validation
Authorization
File processing
Request preprocessing
Error handling
9. Controller Layer

Controllers handle the HTTP request/response boundary.

A controller should:

Receive the request.
Extract required data.
Call the appropriate service.
Receive the result.
Send the response.

Conceptually:

HTTP Request
     ↓
Controller
     ↓
Service
     ↓
Result
     ↓
HTTP Response

Controllers should not contain large amounts of business logic.

10. Service Layer

The service layer contains business logic.

For example, sending a message may require:

Check conversation
       ↓
Check user membership
       ↓
Validate message
       ↓
Create message
       ↓
Save message
       ↓
Return message

This logic belongs in a service rather than directly inside a controller.

11. Model Layer

Models define how application data interacts with MongoDB.

We will use Mongoose.

Example models:

User
Conversation
ConversationMember
Message
MessageRead
RefreshToken

The model layer is responsible for database-related operations.

12. Database Layer

MongoDB stores persistent application data.

Example:

Users
Conversations
Messages
RefreshTokens

MongoDB is the final persistence layer.

13. Why Separate Controllers and Services?

Consider login.

Without a service layer:

Controller
 ├── Find user
 ├── Verify password
 ├── Generate token
 ├── Update database
 └── Send response

The controller becomes large.

With a service layer:

Controller
     │
     ▼
authService.login()
     │
     ├── Find user
     ├── Verify password
     └── Generate tokens

The controller remains focused on HTTP.

The service remains focused on business logic.

14. REST Request Flow

Suppose the frontend requests:

GET /api/conversations

The complete flow is:

React
  │
  │ HTTP Request
  ▼
Express Router
  │
  ▼
Authentication Middleware
  │
  ▼
Conversation Controller
  │
  ▼
Conversation Service
  │
  ▼
Conversation Model
  │
  ▼
MongoDB
  │
  ▼
Conversation data
  │
  ▼
Service
  │
  ▼
Controller
  │
  ▼
HTTP Response
  │
  ▼
React
15. REST Architecture

The REST side of the application will look like:

                REST API
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
     Auth        Users    Conversations
       │           │           │
       ▼           ▼           ▼
   Controller  Controller  Controller
       │           │           │
       ▼           ▼           ▼
    Service      Service      Service
       │           │           │
       └───────────┼───────────┘
                   ▼
                MongoDB
16. Socket Architecture

Socket.IO follows a different flow.

Socket Client
      │
      │ Event
      ▼
Socket Server
      │
      ▼
Socket Handler
      │
      ▼
Authentication
      │
      ▼
Validation
      │
      ▼
Service
      │
      ▼
MongoDB
      │
      ▼
Socket Event
      │
      ▼
Other Clients
17. Socket Handler vs Controller

This distinction is important.

A controller handles:

HTTP Request

A socket handler handles:

Socket Event

For example:

HTTP:
GET /api/messages
        ↓
messageController.getMessages()

Socket:

send_message
        ↓
messageSocket.sendMessage()

Both may call the same service.

18. Shared Business Logic

REST and Socket.IO may need the same business logic.

Example:

                ┌──────────────┐
                │ Message      │
                │ Service      │
                └──────┬───────┘
                       ▲
              ┌────────┴────────┐
              │                 │
        REST Controller    Socket Handler

This is useful because message-related rules do not need to be duplicated.

19. Authentication Architecture

Authentication will use JWT with HTTP-only cookies.

High-level flow:

Login Request
     ↓
Auth Controller
     ↓
Auth Service
     ↓
Verify User
     ↓
Verify Password
     ↓
Generate Tokens
     ↓
Set Cookies
     ↓
Response

For protected REST requests:

Request
   ↓
Cookie
   ↓
Auth Middleware
   ↓
Verify JWT
   ↓
Identify User
   ↓
Controller
20. Socket Authentication

Socket connections also need authentication.

Conceptually:

React
   │
   │ Connect
   ▼
Socket.IO Server
   │
   ▼
Socket Authentication
   │
   ▼
Verify User
   │
   ▼
Authenticated Socket

An unauthenticated socket should not be allowed to perform protected chat operations.

The exact implementation will be documented in the Socket.IO and authentication documents.

21. Conversation Architecture

A conversation is the logical container for messages.

Conversation
     │
     ├── Members
     │
     └── Messages

For example:

Conversation A
   │
   ├── User 1
   ├── User 2
   │
   ├── Message 1
   ├── Message 2
   └── Message 3
22. Conversation and Socket.IO Room

Each conversation can correspond to a Socket.IO room.

Example:

Conversation ID:
abc123

Socket Room:
conversation:abc123

Users participating in that conversation join the room.

conversation:abc123
        │
   ┌────┼────┐
   │    │    │
 User A User B User C

When a message is created, the server can emit the event to that room.

23. Message Architecture

A message belongs to:

Conversation
     │
     └── Message
           │
           └── Sender

Conceptually:

User A
  │
  │ creates
  ▼
Message
  │
  ├── conversationId
  ├── senderId
  ├── content
  └── createdAt
24. Complete Message Flow

Suppose User A sends:

"Hello bro!"

The architecture will eventually be:

User A
   │
   │ socket.emit("send_message")
   ▼
Socket.IO Server
   │
   ▼
Authenticate
   │
   ▼
Validate
   │
   ▼
Message Service
   │
   ├── Verify conversation
   ├── Verify membership
   ├── Create message
   └── Save message
   │
   ▼
MongoDB
   │
   ▼
Saved Message
   │
   ▼
Socket.IO Room
   │
   ▼
User B
   │
   ▼
React State
   │
   ▼
Chat UI
25. Why Save Before Broadcasting?

For the initial architecture, the message should be persisted before it is considered successfully created.

Conceptually:

Receive Message
      ↓
Validate
      ↓
Save to MongoDB
      ↓
Broadcast

This gives us a persistent source of truth.

If we broadcast first and database saving fails:

User B sees message
        ↓
Database save fails
        ↓
Message disappears from history

That creates inconsistent behavior.

Therefore, the initial architecture will prefer:

Database first
     ↓
Broadcast second

Later, more advanced reliability strategies can be considered.

26. Historical Messages vs New Messages

The application will use different mechanisms for old and new messages.

Old Messages

REST API:

GET /api/conversations/:id/messages

Flow:

React
 ↓
REST API
 ↓
MongoDB
 ↓
Messages
 ↓
React
New Messages

Socket.IO:

send_message
      ↓
Server
      ↓
MongoDB
      ↓
new_message
      ↓
React

Therefore:

REST API
    =
Historical Data

Socket.IO
    =
Real-Time Data
27. Presence Architecture

Presence means knowing whether a user is connected.

User connects
      ↓
Socket connection
      ↓
Mark online
      ↓
Notify relevant users

When disconnected:

Socket disconnect
      ↓
Mark offline
      ↓
Update lastSeen
      ↓
Notify relevant users

The complete design will be documented in:

docs/17-presence-system.md
28. Typing Architecture

Typing indicators should be treated as temporary real-time events.

User types
    ↓
typing_start
    ↓
Socket.IO
    ↓
Conversation Room
    ↓
Other Members

Typing information should generally not be stored permanently in MongoDB.

29. Read Receipt Architecture

Read status involves persistent information.

Conceptually:

User B opens message
       ↓
message_read
       ↓
Server
       ↓
Update read state
       ↓
Notify User A

The detailed design will be documented later.

30. Frontend Architecture

The frontend will be divided into several responsibilities.

React UI
   │
   ├── Components
   ├── Pages
   ├── Features
   ├── Redux
   ├── API Services
   └── Socket Client
31. Frontend Communication

The frontend has two major communication layers.

React
 │
 ├───────────────► API Client
 │                      │
 │                      ▼
 │                   Express
 │
 └───────────────► Socket Client
                        │
                        ▼
                    Socket.IO

The API client handles HTTP requests.

The socket client handles real-time events.

32. Redux Architecture

Redux Toolkit will be used for shared application state.

Possible state:

store
│
├── auth
├── users
├── conversations
├── messages
├── presence
└── notifications

The exact Redux architecture will be documented separately.

33. State Ownership

Not every piece of data belongs in Redux.

Example:

Temporary UI state:

isEmojiPickerOpen
isModalOpen
inputValue

can remain local to components.

Shared application state:

currentUser
activeConversation
messages
conversations
onlineUsers

may belong in Redux or an appropriate shared state layer.

34. Backend Directory Architecture

The backend will be organized approximately as:

server/
│
├── src/
│
├── config/
│
├── controllers/
│
├── models/
│
├── services/
│
├── routes/
│
├── sockets/
│
├── middlewares/
│
├── validators/
│
├── utils/
│
├── app.ts
└── server.ts

The exact responsibilities of every directory will be documented in:

docs/03-project-structure.md
35. Application Entry Points

The backend will have two major concepts:

Express Application
        +
HTTP Server
        +
Socket.IO

Conceptually:

Node Process
     │
     ▼
HTTP Server
     │
     ├── Express
     │
     └── Socket.IO

Socket.IO will share the underlying HTTP server.

This allows HTTP APIs and real-time communication to run together.

36. Why Socket.IO and Express Share a Server

The application needs both:

HTTP

and

WebSocket / Socket.IO

Instead of running completely separate backend applications initially, they will operate through the same Node.js server.

Conceptually:

                   Node.js
                      │
                HTTP Server
                 ┌────┴────┐
                 │         │
                 ▼         ▼
             Express    Socket.IO

This keeps the initial architecture simple.

37. Error Flow

Errors should move through a predictable architecture.

REST:

Controller
   ↓
Service Error
   ↓
Error Middleware
   ↓
HTTP Error Response
   ↓
Frontend

Socket:

Socket Handler
   ↓
Service Error
   ↓
Socket Error Handler
   ↓
Client Error Event

The exact error architecture will be documented later.

38. Authorization Flow

Authentication:

Who are you?

Authorization:

Are you allowed to perform this action?

Example:

User A
   ↓
Edit Message
   ↓
Is this User A's message?
   │
   ├── Yes → Allow
   │
   └── No  → Reject

Group:

User
 ↓
Remove Member
 ↓
Is user group admin?
 │
 ├── Yes → Allow
 └── No  → Reject
39. Security Boundary

The client cannot be trusted.

Anything coming from the frontend must be treated as untrusted input.

For example:

Frontend says:

"I am user A"

The server must not blindly trust it.

Instead:

Cookie
 ↓
JWT
 ↓
Server verification
 ↓
Authenticated User

Similarly:

Frontend says:

"I am admin"

The server must verify the actual database permissions.

40. Source of Truth

MongoDB will be the primary persistent source of truth for application data.

Examples:

Users
Messages
Conversations
Memberships
Read States

Socket.IO is not the database.

Socket.IO is the real-time communication mechanism.

This distinction is important:

MongoDB
    =
Persistent Data

Socket.IO
    =
Real-Time Transport
41. Failure Scenarios

The architecture should consider failures.

Database Failure
Message
   ↓
MongoDB unavailable
   ↓
Save fails
   ↓
Do not report successful message creation
Socket Disconnection
User
 ↓
Network failure
 ↓
Socket disconnects
 ↓
Client attempts reconnect
Duplicate Message

The system should eventually consider mechanisms that prevent accidental duplicate processing.

This becomes especially important when reconnection and retries are involved.

Unauthorized Request
Request
 ↓
Authentication/Authorization
 ↓
Rejected
 ↓
Error response
42. Initial Architecture vs Future Architecture

The initial system:

React
   │
   ▼
Node.js
   │
   ▼
MongoDB

As the application grows, additional infrastructure could be introduced:

React
   │
   ▼
Load Balancer
   │
   ├─────────────┐
   ▼             ▼
Server 1      Server 2
   │             │
   └──────┬──────┘
          │
        Redis
          │
       MongoDB

However, Redis and multiple backend instances are outside the initial implementation.

We will first understand the single-server architecture.

43. Architectural Principles

The project will follow these principles:

Separation of Concerns

Each layer should have a clear responsibility.

Route
  → routing

Controller
  → HTTP handling

Service
  → business logic

Model
  → database interaction

Socket Handler
  → real-time events
Single Responsibility

A module should have a clear primary responsibility.

Reusability

Business logic should not unnecessarily be duplicated between REST and Socket.IO.

Security by Server-Side Verification

The server must verify authentication and authorization.

Database as Source of Truth

Important persistent data should be stored in MongoDB.

Real-Time Events as Communication

Socket.IO should communicate changes rather than act as permanent storage.

44. Complete System Diagram

The final conceptual architecture is:

                                  ┌───────────────────────┐
                                  │      React Client     │
                                  │                       │
                                  │  Components           │
                                  │  Redux Toolkit        │
                                  │  API Client           │
                                  │  Socket Client        │
                                  └───────────┬───────────┘
                                              │
                           ┌──────────────────┴──────────────────┐
                           │                                     │
                        HTTP                                  Socket
                           │                                     │
                           ▼                                     ▼
                 ┌──────────────────┐                  ┌──────────────────┐
                 │     Express      │                  │     Socket.IO     │
                 │      Router      │                  │      Server       │
                 └────────┬─────────┘                  └────────┬─────────┘
                          │                                     │
                          ▼                                     ▼
                 ┌──────────────────┐                  ┌──────────────────┐
                 │   Middlewares    │                  │ Socket Handlers  │
                 └────────┬─────────┘                  └────────┬─────────┘
                          │                                     │
                          ▼                                     ▼
                 ┌──────────────────┐                  ┌──────────────────┐
                 │   Controllers    │                  │ Authentication   │
                 └────────┬─────────┘                  │ + Validation     │
                          │                            └────────┬─────────┘
                          ▼                                     │
                 ┌──────────────────────────────────────────────┘
                 │
                 ▼
          ┌─────────────────────┐
          │      Services       │
          │                     │
          │ Auth                │
          │ User                │
          │ Conversation        │
          │ Message             │
          │ Group               │
          │ Upload              │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │      Mongoose       │
          │       Models        │
          └──────────┬──────────┘
                     │
                     ▼
              ┌─────────────┐
              │   MongoDB   │
              └─────────────┘
45. Final Mental Model

The entire application can be remembered using this simple model:

                 FRONTEND
                    │
          ┌─────────┴─────────┐
          │                   │
       REST API           Socket.IO
          │                   │
          ▼                   ▼
       EXPRESS          SOCKET SERVER
          │                   │
          └─────────┬─────────┘
                    │
                 SERVICES
                    │
                 MODELS
                    │
                 MONGODB

And the most important distinction is:

REST API
    ↓
Request / Response

Socket.IO
    ↓
Real-Time Events

MongoDB
    ↓
Persistent Data

These three concepts form the foundation of the entire Chat Application.

46. Next Document

The next document is:

docs/03-project-structure.md

It will explain the actual folder and file structure in detail.

For every directory and important file, we will document:

Why it exists
What belongs inside it
What does not belong inside it
Which layer can communicate with which layer
Naming conventions
Import/dependency rules
How the structure changes as the application grows

After that, we will move toward:

HTTP
   ↓
WebSocket
   ↓
Socket.IO

The WebSocket documentation will be treated as a learning document, not merely a project reference.