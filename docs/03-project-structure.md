# 💬 Chat Application — Project Structure

> **Purpose:** This document defines the complete folder and file structure of the Chat Application and explains the responsibility of every important part of the project.

---

## 1. Overview

The project is divided into two major applications:

```text
chat-app/
│
├── client/       # React frontend
├── server/       # Node.js backend
├── docs/         # Project documentation
└── README.md
```

The architecture follows a separation-of-concerns approach.

```text
Frontend
   │
   │ HTTP / Socket.IO
   ▼
Backend
   │
   ▼
Database
```

The `client` and `server` are independent applications that communicate with each other through defined interfaces.

---

# 2. Complete Project Structure

The initial project structure will look like this:

```text
chat-app/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── conversations/
│   │   │   └── messages/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── docs/
│   ├── 00-overview.md
│   ├── 01-requirements.md
│   ├── 02-architecture.md
│   ├── 03-project-structure.md
│   ├── 04-http-basics.md
│   ├── 05-websocket.md
│   ├── 06-socket-io.md
│   ├── 07-realtime-architecture.md
│   ├── 08-authentication.md
│   ├── 09-authorization.md
│   ├── 10-database-design.md
│   ├── 11-mongodb.md
│   ├── 12-mongoose.md
│   ├── 13-api-design.md
│   ├── 14-api-reference.md
│   ├── 15-socket-events.md
│   ├── 16-message-flow.md
│   ├── 17-presence-system.md
│   ├── 18-typing-system.md
│   ├── 19-read-receipts.md
│   ├── 20-error-handling.md
│   ├── 21-validation.md
│   ├── 22-security.md
│   ├── 23-file-upload.md
│   ├── 24-frontend-architecture.md
│   ├── 25-redux-architecture.md
│   ├── 26-chat-ui.md
│   ├── 27-testing.md
│   ├── 28-debugging.md
│   ├── 29-deployment.md
│   └── 30-roadmap.md
│
└── README.md
```

---

# 3. Root Directory

The root directory contains the major parts of the project.

```text
chat-app/
├── client/
├── server/
├── docs/
└── README.md
```

## `client/`

Contains the React frontend.

## `server/`

Contains the Node.js backend.

## `docs/`

Contains all technical documentation.

## `README.md`

Provides a high-level introduction to the project.

The root README should help a new developer understand:

* What the project is
* What technologies are used
* How to run it
* Main features
* Project structure
* Links to detailed documentation

---

# 4. Client Structure

The frontend will use React + TypeScript.

```text
client/
│
├── public/
├── src/
├── package.json
└── tsconfig.json
```

---

# 5. `client/public/`

The `public` directory contains static files that do not need to be processed by the React build system.

Possible files:

```text
public/
├── favicon.ico
└── ...
```

Static assets that belong to specific React features should generally live inside `src/assets/`.

---

# 6. `client/src/`

This is the main source directory of the frontend.

```text
src/
├── assets/
├── components/
├── features/
├── hooks/
├── layouts/
├── pages/
├── services/
├── sockets/
├── store/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

---

# 7. `components/`

Contains reusable UI components.

Examples:

```text
components/
├── Button.tsx
├── Input.tsx
├── Avatar.tsx
├── Modal.tsx
├── Loader.tsx
└── ErrorMessage.tsx
```

A component belongs here when it is:

* Reusable
* Not tied strongly to one feature
* Primarily responsible for UI

### Example

An `Avatar` component may be used in:

* User profile
* Conversation list
* Chat header
* Message list

Therefore it can live in:

```text
components/Avatar.tsx
```

---

# 8. `features/`

Feature-specific code belongs here.

```text
features/
├── auth/
├── users/
├── conversations/
└── messages/
```

This is different from `components/`.

A feature may contain:

* Components
* Redux slice
* API functions
* Types
* Feature-specific hooks
* Utilities

Example:

```text
features/
└── auth/
    ├── authSlice.ts
    ├── authApi.ts
    ├── authTypes.ts
    └── components/
```

This approach keeps related code together.

---

# 9. `features/auth/`

Responsible for authentication-related frontend logic.

Possible contents:

```text
auth/
├── authSlice.ts
├── authApi.ts
├── authTypes.ts
└── components/
```

Responsibilities include:

* Login
* Registration
* Logout
* Current user
* Authentication state

---

# 10. `features/users/`

Responsible for user-related frontend functionality.

Examples:

```text
users/
├── userApi.ts
├── userTypes.ts
└── components/
```

Responsibilities:

* User search
* User profile
* Profile updates
* User information

---

# 11. `features/conversations/`

Responsible for conversation-related functionality.

Possible contents:

```text
conversations/
├── conversationSlice.ts
├── conversationApi.ts
├── conversationTypes.ts
└── components/
```

Responsibilities:

* Conversation list
* Active conversation
* Creating conversations
* Group conversations

---

# 12. `features/messages/`

Responsible for message-related functionality.

Possible contents:

```text
messages/
├── messageSlice.ts
├── messageApi.ts
├── messageTypes.ts
└── components/
```

Responsibilities:

* Messages
* Sending messages
* Editing messages
* Deleting messages
* Message state
* Message-related UI

---

# 13. `hooks/`

Contains reusable React hooks.

Examples:

```text
hooks/
├── useAuth.ts
├── useSocket.ts
├── useDebounce.ts
└── useInfiniteScroll.ts
```

A hook should contain reusable React-related logic.

For example:

```ts
const { user, isAuthenticated } = useAuth();
```

---

# 14. `layouts/`

Contains application-level layouts.

Examples:

```text
layouts/
├── AuthLayout.tsx
├── ChatLayout.tsx
└── DashboardLayout.tsx
```

A layout defines the general structure around pages.

For example:

```text
ChatLayout
├── Sidebar
├── ChatHeader
├── ChatWindow
└── MessageInput
```

---

# 15. `pages/`

Contains route-level pages.

Examples:

```text
pages/
├── LoginPage.tsx
├── RegisterPage.tsx
├── ChatPage.tsx
├── ProfilePage.tsx
└── NotFoundPage.tsx
```

A page represents a complete screen.

---

# 16. `services/`

Contains communication logic with external systems.

Examples:

```text
services/
├── apiClient.ts
└── authApi.ts
```

The API client will handle HTTP communication.

Example:

```text
React
  ↓
apiClient
  ↓
Express API
```

Business logic should not be placed here.

The frontend service layer is responsible primarily for communicating with the backend.

---

# 17. `sockets/`

Contains Socket.IO client configuration and event handling.

Possible structure:

```text
sockets/
├── socket.ts
├── socketEvents.ts
└── socketHandlers.ts
```

Responsibilities include:

* Creating socket connection
* Connecting/disconnecting
* Emitting events
* Listening to events
* Handling reconnection

Example:

```text
React
  ↓
Socket Client
  ↓
Socket.IO Server
```

---

# 18. `store/`

Contains Redux Toolkit configuration.

Possible structure:

```text
store/
├── store.ts
├── hooks.ts
└── rootReducer.ts
```

The store will combine application state.

Example:

```text
store
├── auth
├── conversations
├── messages
└── users
```

---

# 19. `types/`

Contains shared frontend TypeScript types.

Examples:

```text
types/
├── user.ts
├── message.ts
├── conversation.ts
├── api.ts
└── socket.ts
```

Example:

```ts
interface User {
  id: string;
  username: string;
  avatar?: string;
}
```

Types help keep the frontend predictable.

---

# 20. `utils/`

Contains small reusable utility functions.

Examples:

```text
utils/
├── formatDate.ts
├── formatMessageTime.ts
└── storage.ts
```

Utilities should generally be:

* Small
* Reusable
* Independent
* Easy to test

---

# 21. `App.tsx`

`App.tsx` is the main React application component.

It may contain:

* Router
* Application providers
* Main layout
* Route configuration

Conceptually:

```text
main.tsx
   ↓
App.tsx
   ↓
Router
   ↓
Pages
```

---

# 22. `main.tsx`

This is the frontend entry point.

Conceptually:

```text
main.tsx
   ↓
React
   ↓
App
   ↓
Application
```

Redux Provider and other global providers may be initialized here.

---

# 23. Server Structure

The backend will use Node.js + Express + TypeScript + Socket.IO.

```text
server/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── validators/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── .env
```

---

# 24. `config/`

Contains application configuration.

Example:

```text
config/
├── db.ts
└── env.ts
```

## `db.ts`

Responsible for connecting to MongoDB.

Conceptually:

```text
Application
   ↓
Database Config
   ↓
MongoDB
```

## `env.ts`

Responsible for reading and validating environment variables.

Examples:

```text
PORT
MONGODB_URI
JWT_SECRET
JWT_REFRESH_SECRET
CLIENT_URL
```

Secrets should not be hardcoded into source code.

---

# 25. `controllers/`

Contains HTTP controllers.

```text
controllers/
├── auth.controller.ts
├── user.controller.ts
├── conversation.controller.ts
├── message.controller.ts
├── group.controller.ts
└── upload.controller.ts
```

Controllers handle the HTTP layer.

Example:

```text
Request
   ↓
Controller
   ↓
Service
```

Controllers should not contain large business operations.

---

# 26. `middlewares/`

Contains Express middleware.

```text
middlewares/
├── auth.middleware.ts
├── validate.middleware.ts
├── upload.middleware.ts
└── error.middleware.ts
```

Responsibilities:

### `auth.middleware.ts`

Authenticates requests.

### `validate.middleware.ts`

Validates request data.

### `upload.middleware.ts`

Processes file uploads.

### `error.middleware.ts`

Handles application errors.

---

# 27. `models/`

Contains Mongoose models.

Initial models:

```text
models/
├── user.model.ts
├── conversation.model.ts
├── conversationMember.model.ts
├── message.model.ts
├── messageRead.model.ts
└── refreshToken.model.ts
```

Models define the application's database structure.

Conceptually:

```text
Service
   ↓
Model
   ↓
MongoDB
```

---

# 28. `routes/`

Contains Express routes.

```text
routes/
├── auth.routes.ts
├── user.routes.ts
├── conversation.routes.ts
├── message.routes.ts
├── group.routes.ts
└── upload.routes.ts
```

Routes define the API surface.

Example:

```text
POST /api/auth/login
```

will eventually connect to:

```text
auth.routes.ts
       ↓
auth.controller.ts
```

---

# 29. `services/`

Contains business logic.

```text
services/
├── auth.service.ts
├── user.service.ts
├── conversation.service.ts
├── message.service.ts
├── group.service.ts
└── upload.service.ts
```

This is one of the most important backend directories.

Example:

```text
Controller
    ↓
messageService.sendMessage()
    ↓
Message Model
```

---

# 30. `sockets/`

Contains Socket.IO server-side code.

Possible structure:

```text
sockets/
├── socket.ts
├── connection.socket.ts
├── message.socket.ts
├── typing.socket.ts
└── presence.socket.ts
```

Responsibilities:

### `socket.ts`

Initializes Socket.IO.

### `connection.socket.ts`

Handles connection/disconnection.

### `message.socket.ts`

Handles message events.

### `typing.socket.ts`

Handles typing events.

### `presence.socket.ts`

Handles online/offline events.

---

# 31. `validators/`

Contains input validation schemas.

```text
validators/
├── auth.validator.ts
├── user.validator.ts
├── conversation.validator.ts
├── message.validator.ts
└── group.validator.ts
```

We will use Zod for request validation.

Example:

```text
Request
   ↓
Zod Schema
   ↓
Valid?
 ┌─┴─┐
Yes  No
 │    │
 ▼    ▼
Next Error
```

---

# 32. `utils/`

Contains reusable backend utilities.

Possible files:

```text
utils/
├── apiError.ts
├── asyncHandler.ts
├── cookies.ts
├── jwt.ts
├── password.ts
└── logger.ts
```

These utilities should remain generic enough to be reused across features.

---

# 33. `app.ts`

`app.ts` creates and configures the Express application.

Its responsibilities include:

* Creating Express app
* Registering middleware
* Registering routes
* Configuring CORS
* Configuring parsers
* Registering error middleware

Conceptually:

```text
app.ts
│
├── Express
├── CORS
├── JSON Parser
├── Routes
└── Error Middleware
```

`app.ts` should not be responsible for starting the server.

---

# 34. `server.ts`

`server.ts` is responsible for starting the actual server.

It will eventually connect:

```text
Node.js
   ↓
HTTP Server
   ├── Express
   └── Socket.IO
```

This separation is useful because Socket.IO needs access to the underlying HTTP server.

---

# 35. Why Separate `app.ts` and `server.ts`?

Instead of putting everything inside one file:

```text
server.ts
├── Express
├── Middleware
├── Routes
├── Database
├── Socket.IO
└── Listen
```

we separate responsibilities:

```text
app.ts
   ↓
Express Application

server.ts
   ↓
HTTP Server
   ↓
Socket.IO
   ↓
Listen
```

This makes the application easier to test and maintain.

---

# 36. Backend Dependency Direction

The backend should generally follow this direction:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
Database
```

The reverse should generally be avoided.

For example:

```text
Model
  ❌ should not import Controller
```

and:

```text
Service
  ❌ should not depend on Route
```

This keeps the architecture predictable.

---

# 37. Socket Dependency Direction

Socket code follows a similar pattern:

```text
Socket Handler
      ↓
Service
      ↓
Model
      ↓
MongoDB
```

Example:

```text
message.socket.ts
        ↓
message.service.ts
        ↓
message.model.ts
        ↓
MongoDB
```

A socket handler should not contain all database/business logic itself.

---

# 38. Shared Service Layer

REST and Socket.IO may use the same service.

For example:

```text
                 ┌──────────────────────┐
                 │  message.service.ts  │
                 └──────────▲───────────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  │                   │
          message.controller    message.socket
```

This prevents duplication.

---

# 39. What Should NOT Go Where?

This is an important rule.

| Code                      | Location       |
| ------------------------- | -------------- |
| API endpoint definition   | `routes/`      |
| HTTP request handling     | `controllers/` |
| Business logic            | `services/`    |
| MongoDB schema/model      | `models/`      |
| Input validation          | `validators/`  |
| Authentication middleware | `middlewares/` |
| Socket events             | `sockets/`     |
| Generic helper            | `utils/`       |
| Database connection       | `config/`      |
| Express configuration     | `app.ts`       |
| Server startup            | `server.ts`    |

---

# 40. Example: Login Feature

The complete structure for login will look like:

```text
POST /api/auth/login
        │
        ▼
auth.routes.ts
        │
        ▼
auth.controller.ts
        │
        ▼
auth.service.ts
        │
        ├── User Model
        │
        ├── Password Utility
        │
        └── JWT Utility
        │
        ▼
MongoDB
```

This makes the responsibility of each file clear.

---

# 41. Example: Send Message

Real-time message architecture:

```text
Socket Client
      │
      │ send_message
      ▼
message.socket.ts
      │
      ▼
message.service.ts
      │
      ├── Validate conversation
      ├── Verify membership
      ├── Create message
      │
      ▼
message.model.ts
      │
      ▼
MongoDB
      │
      ▼
message.socket.ts
      │
      ▼
new_message
      │
      ▼
Conversation Room
```

---

# 42. Naming Conventions

We will use predictable naming conventions.

## Files

Use:

```text
kebab-case
```

or the established project convention consistently.

For this project, backend files will use descriptive names such as:

```text
auth.controller.ts
message.service.ts
user.model.ts
```

---

## Components

React components use PascalCase:

```text
ChatWindow.tsx
MessageBubble.tsx
UserAvatar.tsx
```

---

## Functions

Functions use camelCase:

```ts
getUserById()
sendMessage()
createConversation()
```

---

## Classes

If classes are required:

```ts
MessageService
AuthService
```

However, the project will primarily use functions/modules unless a class provides a clear benefit.

---

# 43. Feature vs Layer Organization

There are two common backend structures.

### Layer-based

```text
controllers/
services/
models/
routes/
```

### Feature-based

```text
auth/
users/
messages/
conversations/
```

For this project, we will initially use a **layered structure** because it makes the architecture easier to learn.

Later, if the application becomes large, we can evaluate a feature-based structure.

---

# 44. Environment Variables

The backend will use environment variables for configuration.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret

JWT_REFRESH_SECRET=your_refresh_token_secret

CLIENT_URL=http://localhost:5173
```

These values must not be committed to Git.

The `.env` file should be included in `.gitignore`.

---

# 45. `.gitignore`

The project should ignore:

```text
node_modules/
.env
dist/
build/
coverage/
```

The exact `.gitignore` will be created when project setup begins.

---

# 46. Documentation Structure

All project documentation lives inside:

```text
docs/
```

The numbering represents the learning/development order.

```text
00-overview.md
01-requirements.md
02-architecture.md
03-project-structure.md
04-http-basics.md
05-websocket.md
06-socket-io.md
...
```

This allows the documentation to be read sequentially.

---

# 47. Dependency Rules

The project should follow these rules.

### Rule 1

Routes should call controllers.

```text
Route → Controller
```

### Rule 2

Controllers should call services.

```text
Controller → Service
```

### Rule 3

Services should interact with models.

```text
Service → Model
```

### Rule 4

Socket handlers should call services.

```text
Socket Handler → Service
```

### Rule 5

Models should not depend on controllers.

```text
Model → ❌ Controller
```

### Rule 6

Business logic should not be duplicated unnecessarily.

---

# 48. Final Backend Structure

The final backend structure will initially be:

```text
server/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.ts
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── conversation.controller.ts
│   │   ├── message.controller.ts
│   │   ├── group.controller.ts
│   │   └── upload.controller.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── conversation.model.ts
│   │   ├── conversationMember.model.ts
│   │   ├── message.model.ts
│   │   ├── messageRead.model.ts
│   │   └── refreshToken.model.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── conversation.routes.ts
│   │   ├── message.routes.ts
│   │   ├── group.routes.ts
│   │   └── upload.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── conversation.service.ts
│   │   ├── message.service.ts
│   │   ├── group.service.ts
│   │   └── upload.service.ts
│   │
│   ├── sockets/
│   │   ├── socket.ts
│   │   ├── connection.socket.ts
│   │   ├── message.socket.ts
│   │   ├── typing.socket.ts
│   │   └── presence.socket.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── conversation.validator.ts
│   │   ├── message.validator.ts
│   │   └── group.validator.ts
│   │
│   ├── utils/
│   │   ├── apiError.ts
│   │   ├── asyncHandler.ts
│   │   ├── cookies.ts
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── logger.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── .env
```

---

# 49. Final Frontend Structure

```text
client/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx
│   │   └── Loader.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── conversations/
│   │   └── messages/
│   │
│   ├── hooks/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │   └── apiClient.ts
│   │
│   ├── sockets/
│   │   ├── socket.ts
│   │   ├── socketEvents.ts
│   │   └── socketHandlers.ts
│   │
│   ├── store/
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── rootReducer.ts
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── tsconfig.json
```

---

# 50. Architecture Summary

The project follows this fundamental structure:

```text
                    CLIENT
                      │
          ┌───────────┴───────────┐
          │                       │
       REST API              Socket.IO
          │                       │
          ▼                       ▼
      EXPRESS              SOCKET HANDLERS
          │                       │
          │                       │
          └──────────┬────────────┘
                     ▼
                 SERVICES
                     │
                     ▼
                  MODELS
                     │
                     ▼
                  MONGODB
```

The most important dependency rule is:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

and:

```text
Socket Events
  ↓
Socket Handlers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

This separation keeps the application maintainable, testable, and easier to understand.

---

## Next Document

The next document is:

```text
docs/04-http-basics.md
```

Before learning WebSocket, we will first understand HTTP properly.

The learning sequence will be:

```text
HTTP
 ↓
Request
 ↓
Response
 ↓
Methods
 ↓
Headers
 ↓
Cookies
 ↓
Status Codes
 ↓
REST API
 ↓
HTTP limitations for real-time communication
 ↓
WebSocket
```

Understanding this foundation will make `05-websocket.md` much easier to understand.
