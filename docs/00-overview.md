# 💬 Chat Application — Project Overview

## 1. Project Introduction

This project is a real-time chat application built to understand how modern messaging applications work internally.

The application will allow users to:

* Create an account
* Login and logout
* Search for other users
* Start private conversations
* Send and receive messages in real time
* See online/offline status
* See typing indicators
* See message delivery/read status
* Create group conversations
* Send images/files
* Edit and delete messages
* Manage group members

The project is intentionally being built from the ground up so that every major part of the system can be understood rather than simply copied from a tutorial.

---

# 2. Main Goal

The main goal is not just to create a working chat application.

The goal is to understand:

1. How a frontend communicates with a backend
2. How REST APIs work
3. How WebSocket communication works
4. How Socket.IO provides real-time communication
5. How authentication works
6. How MongoDB stores application data
7. How relationships are represented in MongoDB
8. How messages are created, stored and delivered
9. How online/offline presence works
10. How typing indicators work
11. How read receipts work
12. How frontend state is managed
13. How a real-world application is structured
14. How the complete application is deployed

---

# 3. Technology Stack

## Frontend

### React

React will be used to build the user interface.

Responsibilities:

* Rendering UI
* Managing components
* Displaying conversations
* Displaying messages
* Handling user interaction
* Connecting to the backend
* Connecting to Socket.IO

---

### TypeScript

TypeScript will provide static typing for the frontend.

It will help us define types for:

* Users
* Messages
* Conversations
* API responses
* Socket events
* Redux state
* Component props

---

### Redux Toolkit

Redux Toolkit will manage application-level state.

Potential state:

```text
auth
users
conversations
messages
presence
notifications
```

Not everything will be stored in Redux.

Local UI state will remain inside React components when appropriate.

---

### Socket.IO Client

The frontend will use Socket.IO Client to establish a real-time connection with the backend.

It will be responsible for:

* Receiving new messages
* Sending messages
* Typing indicators
* Online/offline updates
* Read receipts
* Real-time message updates
* Reconnection

---

# 4. Backend

## Node.js

Node.js will run the backend server.

It allows JavaScript/TypeScript code to run outside the browser.

---

## Express.js

Express will handle HTTP requests.

Examples:

```text
POST /api/auth/login
GET  /api/users
GET  /api/conversations
GET  /api/conversations/:id/messages
```

Express will primarily handle our REST API.

---

## TypeScript

The backend will also use TypeScript.

It will provide types for:

* Controllers
* Services
* Models
* Request/Response
* Socket events
* Database data
* Application errors

---

## Socket.IO

Socket.IO will handle real-time communication.

Examples:

```text
send_message
new_message

typing_start
typing_stop

message_read

user_online
user_offline
```

The REST API and Socket.IO will work together rather than replacing one another.

---

# 5. Database

## MongoDB

MongoDB will be our primary database.

We are intentionally using MongoDB for this project instead of PostgreSQL.

MongoDB will store:

* Users
* Conversations
* Conversation members
* Messages
* Message read information
* Refresh tokens

---

## Mongoose

Mongoose will be used as the ODM layer between Node.js and MongoDB.

It will help us define:

* Schemas
* Models
* Validation
* Relationships/references
* Queries
* Middleware

---

# 6. Authentication

The application will use:

```text
JWT
+
HTTP-only Cookies
```

Authentication flow:

```text
User
 ↓
Register
 ↓
Password hashing
 ↓
MongoDB
```

Login:

```text
User
 ↓
Login
 ↓
Verify password
 ↓
Generate tokens
 ↓
Set HTTP-only cookies
 ↓
Authenticated session
```

The authentication system will later be documented in detail in:

```text
docs/08-authentication.md
```

---

# 7. REST API vs Real-Time Communication

One of the most important concepts in this project is understanding why we need both REST APIs and Socket.IO.

## REST API

REST APIs will be used for operations such as:

```text
Register
Login
Get profile
Search users
Get conversations
Get old messages
Create group
Update profile
Upload files
```

Example:

```text
GET /api/conversations
```

The client asks the server for data and receives a response.

---

## Real-Time Communication

Socket.IO will be used when the server needs to communicate with connected clients immediately.

Example:

```text
User A sends message
        ↓
Socket.IO Server
        ↓
User B receives message
```

User B does not need to continuously request:

```text
"Is there a new message?"
```

The server can push the event directly.

---

# 8. High-Level Architecture

The application will have four major parts:

```text
┌───────────────────────┐
│       React App       │
│     TypeScript        │
└───────────┬───────────┘
            │
       HTTP / REST
            │
            ▼
┌───────────────────────┐
│    Express Server     │
│       Node.js         │
└───────────┬───────────┘
            │
            ▼
       ┌─────────┐
       │ MongoDB │
       └─────────┘
```

Real-time communication will be added alongside the REST API:

```text
                  HTTP
React ─────────────────────► Express
 │                              │
 │                              │
 │                              ▼
 │                           MongoDB
 │
 │
 │ Socket.IO
 ▼
Socket.IO Server
```

More complete architecture:

```text
                    ┌────────────────────┐
                    │      React         │
                    │    TypeScript      │
                    └─────────┬──────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
              REST API                Socket.IO
                 │                         │
                 ▼                         ▼
        ┌─────────────────────────────────────┐
        │        Node.js Backend              │
        │                                     │
        │  Express + Socket.IO + TypeScript   │
        └──────────────────┬──────────────────┘
                           │
                           ▼
                    ┌────────────┐
                    │  MongoDB   │
                    │ + Mongoose │
                    └────────────┘
```

---

# 9. Core Application Modules

The backend will be divided into modules.

## Authentication Module

Responsible for:

* Registration
* Login
* Logout
* Token refresh
* Current user
* Password handling

---

## User Module

Responsible for:

* User profile
* User search
* Avatar
* Bio
* Online status
* Last seen

---

## Conversation Module

Responsible for:

* Creating conversations
* Fetching conversations
* Conversation members
* Private conversations
* Group conversations

---

## Message Module

Responsible for:

* Creating messages
* Fetching messages
* Editing messages
* Deleting messages
* Message ownership
* Message types

---

## Group Module

Responsible for:

* Creating groups
* Adding members
* Removing members
* Leaving groups
* Group administrators
* Group information

---

## Real-Time Module

Responsible for:

* Socket connections
* Rooms
* New messages
* Typing indicators
* Online status
* Read receipts
* Reconnection

---

## Upload Module

Responsible for:

* Profile pictures
* Chat images
* Files

---

# 10. Main Data Models

The initial database design will contain six major models:

```text
User
Conversation
ConversationMember
Message
MessageRead
RefreshToken
```

High-level relationship:

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Conversation   Message
 │              │
 ▼              ▼
Members        Sender
```

A detailed database design will be documented separately in:

```text
docs/10-database-design.md
```

---

# 11. Main Features

## Phase 1 — Authentication

* Register
* Login
* Logout
* Refresh authentication
* Current user

---

## Phase 2 — Users

* User profile
* Search users
* Update profile
* Avatar

---

## Phase 3 — Private Chat

* Create private conversation
* Send messages
* Receive messages
* Message history

---

## Phase 4 — Real-Time Features

* Real-time messages
* Typing indicator
* Online status
* Offline status
* Last seen
* Message delivered
* Message read

---

## Phase 5 — Message Features

* Edit message
* Delete message
* Reply to message
* Message reactions

---

## Phase 6 — Group Chat

* Create group
* Add members
* Remove members
* Leave group
* Group admin
* Change member roles

---

## Phase 7 — Media

* Upload image
* Send image
* Send file
* Profile avatar

---

# 12. Communication Model

The application will use two communication mechanisms.

## Request/Response

Used when the client needs to ask the server for something.

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

---

## Persistent Real-Time Connection

Used when both sides need to communicate in real time.

```text
Client
  ═══════════════════
       Socket
  ═══════════════════
Server
```

Both systems will coexist.

---

# 13. Example: Opening a Chat

When a user opens a conversation:

```text
React
 ↓
GET /api/conversations/:id
 ↓
Express
 ↓
Conversation Controller
 ↓
Conversation Service
 ↓
MongoDB
 ↓
Conversation data
 ↓
React
```

After opening the conversation, the client can join the corresponding Socket.IO room.

```text
Client
   │
   │ join_conversation
   ▼
Socket Server
   │
   ▼
Conversation Room
```

---

# 14. Example: Sending a Message

Suppose User A sends:

```text
"Hello!"
```

The flow will eventually look like:

```text
User A
   │
   │ send_message
   ▼
Socket.IO Server
   │
   ▼
Validate message
   │
   ▼
Message Service
   │
   ▼
MongoDB
   │
   ▼
Message saved
   │
   ▼
Conversation Room
   │
   ▼
User B
```

The frontend will then update the chat UI.

A detailed version of this flow will be documented in:

```text
docs/16-message-flow.md
```

---

# 15. Socket.IO Rooms

Every conversation can have its own Socket.IO room.

Example:

```text
conversation:abc123
```

If User A and User B are members of that conversation:

```text
             conversation:abc123
                  │
          ┌───────┴───────┐
          │               │
        User A          User B
```

A message can then be emitted to that room.

This becomes especially useful for group conversations.

---

# 16. Security Principles

The application will follow basic security practices.

We will cover:

* Password hashing
* JWT security
* HTTP-only cookies
* CORS
* Input validation
* Authorization
* Rate limiting
* NoSQL injection prevention
* XSS considerations
* Secure file uploads
* Message ownership checks
* Group permission checks

Security will be documented separately in:

```text
docs/22-security.md
```

---

# 17. Backend Architecture

The backend will follow this general flow:

```text
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
```

For real-time operations:

```text
Socket Event
   ↓
Socket Handler
   ↓
Authentication
   ↓
Validation
   ↓
Service
   ↓
Model
   ↓
MongoDB
   ↓
Socket Event
```

The purpose of this separation is to prevent controllers and socket handlers from becoming huge and difficult to maintain.

---

# 18. Frontend Architecture

The frontend will be organized around features.

Example:

```text
src/
├── components/
├── pages/
├── features/
│   ├── auth/
│   ├── users/
│   ├── conversations/
│   └── messages/
│
├── store/
├── services/
├── hooks/
├── sockets/
├── types/
└── utils/
```

The exact structure will be finalized in:

```text
docs/24-frontend-architecture.md
```

---

# 19. Development Philosophy

This project will follow one important rule:

> Understand first, implement second.

For every major technology, we will first understand the concept.

For example:

```text
HTTP
 ↓
Request / Response
 ↓
Real-Time Communication
 ↓
WebSocket
 ↓
Socket.IO
 ↓
Rooms
 ↓
Events
 ↓
Chat
```

We will not simply copy Socket.IO code without understanding what it is doing.

---

# 20. Learning Order

The project will be developed in the following order:

```text
01. Project Requirements
        ↓
02. HTTP Fundamentals
        ↓
03. WebSocket Fundamentals
        ↓
04. Socket.IO
        ↓
05. Real-Time Architecture
        ↓
06. MongoDB + Mongoose
        ↓
07. Authentication
        ↓
08. REST API
        ↓
09. Socket Events
        ↓
10. Private Chat
        ↓
11. Presence System
        ↓
12. Typing Indicator
        ↓
13. Read Receipts
        ↓
14. Group Chat
        ↓
15. Media Upload
        ↓
16. React Frontend
        ↓
17. Redux Toolkit
        ↓
18. Integration
        ↓
19. Testing
        ↓
20. Deployment
```

---

# 21. Documentation Map

The complete documentation will be divided into these sections:

```text
00-overview.md
    ↓
01-requirements.md
    ↓
02-architecture.md
    ↓
03-project-structure.md
    ↓
04-http-basics.md
    ↓
05-websocket.md
    ↓
06-socket-io.md
    ↓
07-realtime-architecture.md
    ↓
08-authentication.md
    ↓
09-authorization.md
    ↓
10-database-design.md
    ↓
11-mongodb.md
    ↓
12-mongoose.md
    ↓
13-api-design.md
    ↓
14-api-reference.md
    ↓
15-socket-events.md
    ↓
16-message-flow.md
    ↓
17-presence-system.md
    ↓
18-typing-system.md
    ↓
19-read-receipts.md
    ↓
20-error-handling.md
    ↓
21-validation.md
    ↓
22-security.md
    ↓
23-file-upload.md
    ↓
24-frontend-architecture.md
    ↓
25-redux-architecture.md
    ↓
26-chat-ui.md
    ↓
27-testing.md
    ↓
28-debugging.md
    ↓
29-deployment.md
    ↓
30-roadmap.md
```

---

# 22. Final Project Goal

At the end of this project, the application should provide a complete real-time messaging experience.

The final architecture should look approximately like:

```text
                         ┌──────────────────┐
                         │   React Client   │
                         │    TypeScript    │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                 REST API                  Socket.IO
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────▼────────┐
                         │   Node Server   │
                         │                 │
                         │    Express      │
                         │    Socket.IO    │
                         │    Services     │
                         │    Controllers  │
                         └────────┬────────┘
                                  │
                           ┌──────▼──────┐
                           │   Mongoose  │
                           └──────┬──────┘
                                  │
                           ┌──────▼──────┐
                           │   MongoDB    │
                           └─────────────┘
```

The finished project should not only work; its architecture, data flow, API design, socket events, security decisions, and major implementation choices should all be understandable from the documentation.
