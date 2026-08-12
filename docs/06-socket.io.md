# Socket Layer — Project Implementation Guide

> **Project:** Real-Time Chat Application
> **Document:** `socket.md`
> **Purpose:** Chat application ke Socket Layer ko zero se production-level architecture tak samajhna
> **Language:** Hinglish
> **Backend:** Node.js + Express.js
> **Database:** MongoDB
> **Real-Time:** WebSocket
> **Library:** `ws`

---

# Table of Contents

1. [Socket Layer Kya Hai?](#1-socket-layer-kya-hai)
2. [WebSocket Aur Socket Layer Mein Difference](#2-websocket-aur-socket-layer-mein-difference)
3. [Hamare Project Mein Socket Layer](#3-hamare-project-mein-socket-layer)
4. [Socket Architecture](#4-socket-architecture)
5. [Socket Server](#5-socket-server)
6. [Socket Connection](#6-socket-connection)
7. [Socket Object](#7-socket-object)
8. [Connection Manager](#8-connection-manager)
9. [User Aur Socket Mapping](#9-user-aur-socket-mapping)
10. [Multiple Connections](#10-multiple-connections)
11. [Socket Authentication](#11-socket-authentication)
12. [Socket Authorization](#12-socket-authorization)
13. [Socket State](#13-socket-state)
14. [Socket Events](#14-socket-events)
15. [Event Naming Convention](#15-event-naming-convention)
16. [Event Router](#16-event-router)
17. [Socket Handlers](#17-socket-handlers)
18. [Emit](#18-emit)
19. [Send](#19-send)
20. [Broadcast](#20-broadcast)
21. [Rooms](#21-rooms)
22. [Room Management](#22-room-management)
23. [Private Messaging](#23-private-messaging)
24. [Chat Events](#24-chat-events)
25. [Typing Events](#25-typing-events)
26. [Presence Events](#26-presence-events)
27. [Delivery Events](#27-delivery-events)
28. [Read Events](#28-read-events)
29. [Acknowledgements](#29-acknowledgements)
30. [Error Handling](#30-error-handling)
31. [Heartbeat](#31-heartbeat)
32. [Disconnect Handling](#32-disconnect-handling)
33. [Reconnection](#33-reconnection)
34. [Socket Utilities](#34-socket-utilities)
35. [MongoDB Integration](#35-mongodb-integration)
36. [Socket + REST](#36-socket--rest)
37. [Socket Security](#37-socket-security)
38. [Rate Limiting](#38-rate-limiting)
39. [Socket Validation](#39-socket-validation)
40. [Message Lifecycle](#40-message-lifecycle)
41. [Socket Testing](#41-socket-testing)
42. [Socket Debugging](#42-socket-debugging)
43. [Performance](#43-performance)
44. [Scaling](#44-scaling)
45. [Redis Integration](#45-redis-integration)
46. [Production Socket Architecture](#46-production-socket-architecture)
47. [Common Mistakes](#47-common-mistakes)
48. [Complete Socket Flow](#48-complete-socket-flow)
49. [Socket Development Roadmap](#49-socket-development-roadmap)
50. [Mastery Checklist](#50-mastery-checklist)

---

# 1. Socket Layer Kya Hai?

Sabse pehle ek important distinction:

> **WebSocket ek protocol hai. Socket Layer hamare application ka woh code hai jo WebSocket connection ko manage karta hai.**

Example:

```text
WebSocket
    ↓
Connection
    ↓
Socket Layer
    ↓
Application Events
    ↓
Chat Logic
```

Socket Layer decide karega:

* Kaun connect hua?
* Kaunsa user kis socket par hai?
* Kaunsa event aaya?
* Event ko kis handler ko bhejna hai?
* Kis user ko response bhejna hai?
* Kaunsa room join karna hai?
* User disconnect hua to kya karna hai?
* Heartbeat kaise manage karna hai?
* Authentication kaise hogi?

---

# 2. WebSocket Aur Socket Layer Mein Difference

Ye difference bahut important hai.

## WebSocket

WebSocket:

```text
Communication Protocol
```

Ye define karta hai:

```text
Client ↔ Server
```

real-time communication kaise hogi.

---

## Socket Layer

Socket Layer:

```text
Application Architecture
```

Ye decide karta hai:

```text
Connection
   ↓
Authentication
   ↓
Event
   ↓
Handler
   ↓
Business Logic
   ↓
Response
```

---

## Simple Example

WebSocket:

```text
"Message server tak pahucha do."
```

Socket Layer:

```text
"Ye message kis user ka hai?
Kis conversation ka hai?
Kya user authorized hai?
Message valid hai?
Database mein save karna hai?
Kisko notify karna hai?"
```

---

# 3. Hamare Project Mein Socket Layer

Hamare chat application mein socket layer ka main role:

```text
                   SOCKET LAYER
                        |
        +---------------+---------------+
        |               |               |
   Connection        Events         Connection
   Management        Routing        Cleanup
        |               |               |
 Authentication       Chat          Disconnect
        |            Typing          Presence
        |            Read/Send       Heartbeat
        +---------------+---------------+
                        |
                    Services
                        |
                     MongoDB
```

---

# 4. Socket Architecture

Recommended architecture:

```text
src/
│
├── websocket/
│   │
│   ├── websocket.server.js
│   ├── connection.handler.js
│   ├── socket.manager.js
│   ├── socket.auth.js
│   ├── socket.router.js
│   │
│   ├── handlers/
│   │   ├── chat.handler.js
│   │   ├── typing.handler.js
│   │   ├── presence.handler.js
│   │   ├── message.handler.js
│   │   └── conversation.handler.js
│   │
│   ├── rooms/
│   │   └── room.manager.js
│   │
│   └── utils/
│       ├── socket.send.js
│       ├── socket.broadcast.js
│       └── socket.error.js
```

Is structure ka goal hai:

> Socket related responsibilities ko cleanly separate rakhna.

---

# 5. Socket Server

WebSocket server hamare socket layer ka entry point hoga.

Concept:

```text
HTTP Server
     |
     +---- Express
     |
     +---- WebSocket Server
```

Example:

```javascript
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  server
});
```

Yahan `server` hamara HTTP server hai.

---

# 6. Socket Connection

Jab client connect karta hai:

```text
Client
   |
   | WebSocket Connection
   v
WebSocket Server
   |
   v
Connection Handler
```

Connection handler ka kaam:

```text
1. Connection receive
2. Authentication
3. User identify
4. Socket register
5. Event listeners attach
6. Presence update
```

---

# 7. Socket Object

`ws` library connection par ek WebSocket object provide karti hai.

Conceptually:

```javascript
socket
```

Isme useful information hoti hai:

```text
readyState
send()
close()
on()
```

Lekin ham application-specific information bhi attach kar sakte hain.

Conceptually:

```javascript
socket.userId = userId;
socket.connectionId = connectionId;
```

Ab:

```text
socket
 ├── userId
 ├── connectionId
 ├── readyState
 └── WebSocket methods
```

---

# 8. Connection Manager

Connection Manager socket layer ka extremely important component hoga.

Iska kaam:

```text
User ↔ Socket
```

mapping maintain karna.

Example:

```text
User A → Socket 1
User B → Socket 2
User C → Socket 3
```

---

## Basic Concept

```javascript
const connections = new Map();
```

Register:

```javascript
connections.set(userId, socket);
```

Get:

```javascript
connections.get(userId);
```

Remove:

```javascript
connections.delete(userId);
```

---

# 9. User Aur Socket Mapping

Suppose:

```text
userId = 101
socket = SocketA
```

Connection Manager:

```text
101 → SocketA
```

Message User 101 ko bhejna hai:

```text
userId
  ↓
Connection Manager
  ↓
SocketA
  ↓
send()
```

---

# 10. Multiple Connections

Real applications mein ek user ke multiple devices ho sakte hain.

Example:

```text
User A

Laptop
   ↓
Socket 1

Phone
   ↓
Socket 2

Tablet
   ↓
Socket 3
```

Isliye simple:

```javascript
Map<UserId, WebSocket>
```

kabhi-kabhi enough nahi hoga.

Better:

```text
Map<UserId, Set<WebSocket>>
```

Concept:

```text
User A
 ├── Socket 1
 ├── Socket 2
 └── Socket 3
```

---

# 11. Socket Authentication

Connection establish hote hi hume identify karna hai:

```text
Ye user kaun hai?
```

Authentication flow:

```text
Client
   |
   | WebSocket connection
   v
Socket Server
   |
   v
Authentication
   |
   +---- Invalid → Reject
   |
   +---- Valid
          |
          v
       userId
          |
          v
      Register
```

---

# 12. Socket Authorization

Authentication:

> Tum kaun ho?

Authorization:

> Tumhe ye kaam karne ki permission hai?

Example:

```text
User A
  ↓
conversation 123
```

Server check karega:

```text
Kya User A conversation 123 ka participant hai?
```

Agar nahi:

```text
FORBIDDEN
```

---

# 13. Socket State

Socket ke saath temporary state maintain kar sakte hain.

Example:

```javascript
socket.userId
socket.connectionId
socket.isAlive
socket.connectedAt
```

Conceptual state:

```text
Socket
│
├── userId
├── connectionId
├── connectedAt
├── isAlive
└── readyState
```

---

# 14. Socket Events

Client server ko structured events bhejega.

Example:

```json
{
  "type": "chat:send",
  "payload": {
    "conversationId": "123",
    "text": "Hello"
  }
}
```

Server ko event type milega:

```text
chat:send
```

Aur payload:

```text
conversationId
text
```

---

# 15. Event Naming Convention

Ham ek consistent convention follow karenge:

```text
domain:action
```

Examples:

```text
chat:send
chat:new

typing:start
typing:stop

message:delivered
message:read

conversation:join
conversation:leave

user:online
user:offline
```

---

# 16. Event Router

Incoming message:

```text
WebSocket
   ↓
JSON Parse
   ↓
Event Router
   ↓
Correct Handler
```

Example:

```javascript
switch (message.type) {
  case "chat:send":
    return handleChatSend(socket, message);

  case "typing:start":
    return handleTypingStart(socket, message);

  case "typing:stop":
    return handleTypingStop(socket, message);

  default:
    return handleUnknownEvent(socket);
}
```

---

# 17. Socket Handlers

Handlers ka kaam event-specific logic ko handle karna hai.

Example:

```text
chat:send
     ↓
chat.handler.js
```

```text
typing:start
     ↓
typing.handler.js
```

```text
user:online
     ↓
presence.handler.js
```

---

## Handler ka role

Handler:

```text
Receive Event
      ↓
Validate
      ↓
Authorize
      ↓
Call Service
      ↓
Send Response
```

Handler mein heavy business logic nahi bharna chahiye.

---

# 18. Emit

Hamare raw `ws` setup mein "emit" Socket.IO ka built-in method nahi hai.

`ws` mein generally:

```javascript
socket.send(...)
```

use hota hai.

Lekin application architecture mein hum helper bana sakte hain:

```javascript
emit(socket, event)
```

Example:

```javascript
emit(socket, {
  type: "chat:new",
  payload: message
});
```

Isse code clean ho jata hai.

---

# 19. Send

Basic send:

```javascript
socket.send(JSON.stringify(data));
```

Lekin repeated serialization avoid karne ke liye utility bana sakte hain.

Concept:

```javascript
send(socket, {
  type: "chat:new",
  payload: data
});
```

Utility:

```text
send()
 ├── Validate socket
 ├── Serialize data
 └── socket.send()
```

---

# 20. Broadcast

Broadcast ka matlab:

> Multiple sockets ko same event bhejna.

Example:

```text
Conversation
 ├── User A
 ├── User B
 └── User C
```

New message:

```text
User A
  ↓
Broadcast
  ↓
User B
User C
```

---

# 21. Rooms

Room ek logical group hai.

Example:

```text
conversation:123
```

Room ke members:

```text
User A
User B
User C
```

Room ka use:

```text
Group chat
Conversation
Live collaboration
Game lobby
```

---

# 22. Room Management

`ws` library mein Socket.IO jaisa built-in room system nahi hota.

Isliye hume khud room manager banana hoga.

Concept:

```text
Map<RoomId, Set<WebSocket>>
```

Example:

```text
room-123
 ├── Socket A
 ├── Socket B
 └── Socket C
```

---

# 23. Join Room

Client:

```json
{
  "type": "conversation:join",
  "payload": {
    "conversationId": "123"
  }
}
```

Server:

```text
Authenticate
    ↓
Authorize
    ↓
Join room
```

Room Manager:

```text
conversation:123
       ↓
Add socket
```

---

# 24. Leave Room

Client:

```json
{
  "type": "conversation:leave",
  "payload": {
    "conversationId": "123"
  }
}
```

Server:

```text
Remove socket
```

Important cleanup:

```text
Empty room
   ↓
Delete room
```

Memory leak avoid karne ke liye.

---

# 25. Private Messaging

Private message:

```text
User A
  |
  | chat:send
  v
Server
  |
  | find User B sockets
  v
User B
```

Flow:

```text
Receive
  ↓
Authenticate
  ↓
Validate
  ↓
Authorize conversation
  ↓
Save message
  ↓
Find recipient sockets
  ↓
Send event
```

---

# 26. Chat Events

Recommended chat events:

```text
chat:send
chat:new
chat:ack
chat:error
```

---

## `chat:send`

Client → Server

```json
{
  "type": "chat:send",
  "requestId": "req-1",
  "payload": {
    "conversationId": "conv-1",
    "text": "Hello"
  }
}
```

---

## `chat:new`

Server → Client

```json
{
  "type": "chat:new",
  "payload": {
    "id": "msg-1",
    "conversationId": "conv-1",
    "senderId": "user-1",
    "text": "Hello"
  }
}
```

---

# 27. Typing Events

Events:

```text
typing:start
typing:stop
```

Start:

```json
{
  "type": "typing:start",
  "payload": {
    "conversationId": "conv-1"
  }
}
```

Stop:

```json
{
  "type": "typing:stop",
  "payload": {
    "conversationId": "conv-1"
  }
}
```

---

# 28. Typing Event Rules

Typing event ko database mein save karne ki zarurat normally nahi hoti.

Because:

```text
Typing = temporary state
```

Message:

```text
Persistent state
```

Therefore:

```text
Typing → WebSocket only

Message → MongoDB + WebSocket
```

---

# 29. Presence Events

Presence:

```text
user:online
user:offline
```

Connection:

```text
Socket connected
      ↓
User online
```

Disconnect:

```text
Socket disconnected
      ↓
Check other sockets
      ↓
No active sockets?
      ↓
User offline
```

---

# 30. Multiple Device Presence

Suppose:

```text
User A

Socket 1 → Online
Socket 2 → Online
```

Socket 1 disconnect:

```text
Socket 1 ❌
Socket 2 ✅
```

User still online.

Only:

```text
Socket 1 ❌
Socket 2 ❌
```

ke baad:

```text
User offline
```

---

# 31. Delivery Events

Message lifecycle:

```text
sent
  ↓
delivered
  ↓
read
```

Event:

```text
message:delivered
```

Example:

```json
{
  "type": "message:delivered",
  "payload": {
    "messageId": "msg-123"
  }
}
```

---

# 32. Read Events

Event:

```text
message:read
```

Example:

```json
{
  "type": "message:read",
  "payload": {
    "messageId": "msg-123"
  }
}
```

Flow:

```text
Recipient reads
      ↓
message:read
      ↓
Server
      ↓
MongoDB update
      ↓
Notify sender
```

---

# 33. Acknowledgements

Client:

```text
chat:send
```

Server:

```text
chat:ack
```

Example:

```json
{
  "type": "chat:ack",
  "requestId": "req-123",
  "payload": {
    "messageId": "msg-123"
  }
}
```

`requestId` ka purpose:

```text
Client request
       ↓
requestId
       ↓
Server response
       ↓
same requestId
```

Client ko pata chalega:

> Ye response meri kis request ka hai?

---

# 34. Error Handling

Socket errors structured hone chahiye.

Example:

```json
{
  "type": "error",
  "requestId": "req-123",
  "payload": {
    "code": "FORBIDDEN",
    "message": "You are not a member of this conversation"
  }
}
```

---

# 35. Error Codes

Recommended:

```text
UNAUTHORIZED
FORBIDDEN
INVALID_EVENT
INVALID_PAYLOAD
NOT_FOUND
CONVERSATION_NOT_FOUND
MESSAGE_TOO_LONG
RATE_LIMITED
INTERNAL_ERROR
```

---

# 36. Heartbeat

Socket Manager ko dead connections detect karne ke liye heartbeat maintain karna chahiye.

Concept:

```text
Server
   |
   | ping
   v
Client
   |
   | pong
   v
Server
```

Socket state:

```text
socket.isAlive
```

---

# 37. Heartbeat Flow

```text
Every N seconds
      ↓
Ping clients
      ↓
Did client respond?
      |
    Yes → isAlive = true
      |
     No
      ↓
Terminate socket
```

---

# 38. Disconnect Handling

Disconnect hone par:

```text
Socket
  ↓
Remove from Connection Manager
  ↓
Remove from Rooms
  ↓
Update Presence
  ↓
Cleanup temporary state
```

Important:

> Disconnect cleanup socket layer ka mandatory responsibility hai.

---

# 39. Reconnection

Client disconnect:

```text
Connected
   ↓
Disconnected
   ↓
Retry
   ↓
Reconnect
```

Server ko reconnect ko new connection ki tarah treat karna chahiye:

```text
Authenticate
   ↓
Register
   ↓
Join required rooms
   ↓
Sync state
```

---

# 40. Socket Utilities

Socket utilities repeated logic ko centralize karengi.

Example:

```text
socket.send.js
socket.broadcast.js
socket.error.js
socket.close.js
```

---

## `send()`

```text
send(socket, event)
```

---

## `broadcast()`

```text
broadcast(sockets, event)
```

---

## `sendError()`

```text
sendError(socket, code, message)
```

---

# 41. MongoDB Integration

Socket handler ko directly MongoDB ke queries se bharna avoid karenge.

Bad:

```text
chat.handler.js
 ├── validate
 ├── authenticate
 ├── MongoDB query
 ├── MongoDB update
 ├── broadcast
 ├── notification
 └── logging
```

Better:

```text
Socket Handler
      ↓
Chat Service
      ↓
MongoDB
```

---

# 42. Socket + Service Architecture

Example:

```text
chat:send
    ↓
chat.handler
    ↓
chat.service
    ↓
message.model
    ↓
MongoDB
```

After save:

```text
chat.service
    ↓
handler
    ↓
socket manager
    ↓
recipient sockets
```

---

# 43. Socket + REST

Socket layer aur REST API ek dusre ke alternatives nahi hain.

Dono ka role:

```text
REST
 ├── Login
 ├── Register
 ├── Profile
 ├── Conversations
 └── Message History

WebSocket
 ├── New Messages
 ├── Typing
 ├── Presence
 ├── Delivery
 └── Read Receipts
```

---

# 44. Socket Security

Socket layer par:

```text
Authentication
Authorization
Validation
Rate limiting
Payload limits
Origin validation
WSS
Connection limits
```

implement karna chahiye.

---

# 45. Never Trust Client

Client ye bhej sakta hai:

```json
{
  "senderId": "admin"
}
```

Server ko ignore karna chahiye.

Correct:

```text
Authenticated socket
        ↓
socket.userId
```

Sender identity server-side authentication se derive hogi.

---

# 46. Rate Limiting

Socket-level rate limiting useful hai.

Examples:

```text
100 messages / minute
20 typing events / second
10 connection attempts / minute
```

Exact limits application ke use case ke according decide hongi.

---

# 47. Socket Validation

Incoming event:

```json
{
  "type": "chat:send",
  "payload": {
    "conversationId": "",
    "text": ""
  }
}
```

Validation:

```text
type valid?
payload object?
conversationId valid?
text present?
text length valid?
```

Invalid:

```text
error event
```

---

# 48. Message Lifecycle

Complete lifecycle:

```text
Client
  ↓
chat:send
  ↓
Socket Router
  ↓
Chat Handler
  ↓
Validation
  ↓
Authentication
  ↓
Authorization
  ↓
Chat Service
  ↓
MongoDB
  ↓
Message Created
  ↓
Socket Manager
  ↓
Recipient Sockets
  ↓
chat:new
  ↓
Recipient UI
```

---

# 49. Socket Testing

Test these scenarios:

## Connection

```text
Connect
Disconnect
Reconnect
```

## Authentication

```text
Valid token
Invalid token
Expired token
Missing authentication
```

## Messaging

```text
Send message
Receive message
Invalid message
Unauthorized conversation
```

## Presence

```text
Online
Offline
Multiple devices
```

## Reliability

```text
Network failure
Reconnect
Duplicate request
Missed messages
```

---

# 50. Socket Debugging

Debug logs useful hain:

```text
[SOCKET] connected
[SOCKET] authenticated
[SOCKET] registered
[SOCKET] event received
[SOCKET] handler executed
[SOCKET] message persisted
[SOCKET] event delivered
[SOCKET] disconnected
```

Production mein sensitive data log nahi karna.

Avoid logging:

```text
JWT
Passwords
Private message content
Refresh tokens
```

---

# 51. Performance

Socket layer ko efficient rakhne ke liye:

```text
Avoid unnecessary broadcasts
Use connection maps
Use room maps
Limit payload size
Debounce typing
Clean disconnected sockets
Use efficient JSON structures
Avoid unnecessary database queries
```

---

# 52. Connection Cleanup

Bad:

```text
connections
   ↓
Socket 1
Socket 2
Socket 3
Socket 4
...
```

Disconnected sockets remove nahi hue to:

```text
Memory leak
```

Good:

```text
disconnect
    ↓
cleanup
    ↓
remove socket
```

---

# 53. Scaling Problem

Single server:

```text
              Server
           /    |    \
         A      B      C
```

Multiple servers:

```text
             Load Balancer
              /         \
             /           \
        Server 1       Server 2
           |              |
        User A          User B
```

Agar User A ka socket Server 1 par hai aur User B Server 2 par hai:

```text
Server 1
   ↓
???
   ↓
Server 2
```

Communication mechanism chahiye.

---

# 54. Redis Integration

Redis Pub/Sub:

```text
Server 1
    |
    | publish
    v
  Redis
    |
    | subscribe
    v
Server 2
```

Server 2:

```text
User B socket
```

ko message send kar sakta hai.

---

# 55. Redis Responsibilities

Redis use kar sakte hain:

```text
Pub/Sub
Presence
Distributed rate limiting
Temporary connection state
Caching
```

MongoDB:

```text
Users
Messages
Conversations
Persistent state
```

---

# 56. Production Socket Architecture

```text
                         Internet
                            |
                            v
                      Load Balancer
                       /    |    \
                      /     |     \
                    WS1    WS2    WS3
                     \      |      /
                      \     |     /
                        Redis
                           |
                        MongoDB
```

Inside each server:

```text
WebSocket Server
      ↓
Connection Manager
      ↓
Socket Router
      ↓
Handlers
      ↓
Services
      ↓
MongoDB
```

---

# 57. Socket Manager Responsibilities

Socket Manager ko ye kaam handle karne chahiye:

```text
register()
unregister()

getUserSockets()
getSocket()

sendToUser()
sendToRoom()

joinRoom()
leaveRoom()

broadcast()
```

---

# 58. Connection Manager vs Room Manager

Ye dono separate concepts hain.

## Connection Manager

```text
User → Socket
```

## Room Manager

```text
Room → Sockets
```

Example:

```text
Connection Manager

User A → Socket 1
User B → Socket 2
```

Room Manager:

```text
Room 123
 ├── Socket 1
 └── Socket 2
```

---

# 59. Why Separate Managers?

Agar sab kuch ek hi file mein:

```text
socket.manager.js
```

rakhenge to eventually giant class/file ban sakti hai.

Better:

```text
connection.manager.js
room.manager.js
presence.manager.js
```

Large project mein responsibilities clearly separate karna easier hota hai.

---

# 60. Event Router vs Handler

Event Router:

> Event ko identify karta hai.

Handler:

> Event ko process karta hai.

Example:

```text
Incoming Event
      ↓
Router
      ↓
chat:send
      ↓
Chat Handler
```

---

# 61. Handler vs Service

Handler:

```text
Transport Layer
```

Service:

```text
Business Logic
```

Example:

```text
chat.handler
```

ka kaam:

```text
request receive
validate
service call
response
```

`chat.service`:

```text
create message
check conversation
save message
```

---

# 62. Socket Layer As Transport Layer

Architecture:

```text
            Transport
          /           \
       REST          WebSocket
        |               |
 Controllers         Handlers
        \               /
         \             /
            Services
               |
            MongoDB
```

Is architecture ka benefit:

> Business logic transport-independent ho sakta hai.

---

# 63. Socket Event Contract

Har event define hona chahiye:

```text
Event Name
Direction
Authentication
Payload
Validation
Response
Errors
```

Example:

```text
Event:
chat:send

Direction:
Client → Server

Auth:
Required

Payload:
conversationId
text

Response:
chat:ack

Broadcast:
chat:new
```

---

# 64. Example Event Documentation

## `chat:send`

### Direction

```text
Client → Server
```

### Authentication

```text
Required
```

### Payload

```json
{
  "conversationId": "conv-123",
  "text": "Hello"
}
```

### Success

```json
{
  "type": "chat:ack",
  "requestId": "req-1",
  "payload": {
    "messageId": "msg-1"
  }
}
```

### Broadcast

```text
chat:new
```

---

# 65. Socket Error Strategy

Three categories:

## Client Error

```text
Invalid payload
```

## Authorization Error

```text
Not allowed
```

## Server Error

```text
Database failure
```

Client ko safe error bhejna:

```json
{
  "type": "error",
  "payload": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong"
  }
}
```

Internal stack trace client ko nahi bhejna.

---

# 66. Graceful Shutdown

Server shutdown:

```text
SIGTERM
   ↓
Stop new connections
   ↓
Close existing sockets gracefully
   ↓
Cleanup managers
   ↓
Close MongoDB
   ↓
Close Redis
   ↓
Exit
```

---

# 67. Socket Observability

Production mein metrics:

```text
Active sockets
Sockets created
Sockets closed
Messages received
Messages sent
Errors
Reconnects
Average latency
Heartbeat failures
```

Track karna useful hai.

---

# 68. Message Latency

Important metric:

```text
message received
       ↓
database saved
       ↓
message delivered
```

Latency:

```text
deliveryTime - receiveTime
```

High latency ka reason ho sakta hai:

```text
Database slow
Redis slow
Server overloaded
Network latency
Large payload
```

---

# 69. Advanced: Idempotency

Client:

```text
chat:send
requestId = abc
```

Network failure.

Client retry:

```text
chat:send
requestId = abc
```

Server ko duplicate detect karna chahiye.

Concept:

```text
requestId
   ↓
Already processed?
   |
  Yes → existing result
   |
  No
   ↓
Process
```

---

# 70. Advanced: Ordering

Messages:

```text
A
B
C
```

Network:

```text
A
C
B
```

Agar client ko:

```text
A
C
B
```

receive ho gaya to UI ordering wrong ho sakti hai.

Possible solution:

```text
serverSequence
```

Example:

```text
A → 100
B → 101
C → 102
```

Client sequence ke according order kar sakta hai.

---

# 71. Advanced: Missed Events

Client disconnected:

```text
10:00 → Message A
10:01 → Message B
10:02 → disconnect
10:03 → Message C
10:04 → reconnect
```

Reconnect ke baad client ko:

```text
Message C
```

miss nahi karna chahiye.

Isliye:

```text
WebSocket reconnect
       ↓
REST sync
       ↓
last known message
       ↓
fetch missing messages
```

---

# 72. Advanced: Connection ID

User:

```text
user-123
```

Connections:

```text
conn-1
conn-2
conn-3
```

Har connection ka unique ID useful hai:

```text
Debugging
Multiple devices
Connection cleanup
Tracing
Metrics
```

---

# 73. Advanced: Room Authorization

Client:

```text
conversation:join
conversationId = 123
```

Server ko:

```text
User authenticated?
        ↓
Conversation exists?
        ↓
User participant?
        ↓
Join room
```

Blindly room join nahi karwana.

---

# 74. Advanced: Room Cleanup

Room:

```text
room-123
```

Members:

```text
Socket A
Socket B
```

A disconnect:

```text
Socket A removed
```

B disconnect:

```text
Room empty
```

Then:

```text
Delete room
```

---

# 75. Advanced: Temporary vs Persistent State

## Temporary

```text
Typing
Online presence
Socket connection
Room membership
Heartbeat state
```

## Persistent

```text
User
Conversation
Message
Read status
Message metadata
```

Ye distinction architecture ko clean rakhta hai.

---

# 76. Common Mistake: Handler Mein Everything

Avoid:

```text
chat.handler.js
```

mein:

```text
MongoDB
JWT
Validation
Socket management
Notifications
Business logic
```

sab kuch bhar dena.

Better:

```text
Handler
 ↓
Service
 ↓
Model
```

---

# 77. Common Mistake: One Socket Per User

Wrong assumption:

```text
User = one socket
```

Real world:

```text
User = multiple sockets
```

because:

```text
Laptop
Phone
Tablet
Browser tabs
```

---

# 78. Common Mistake: Rooms Without Authorization

Never:

```text
join room directly
```

without checking membership.

Correct:

```text
authenticate
 ↓
authorize
 ↓
join
```

---

# 79. Common Mistake: No Cleanup

Disconnect par cleanup mandatory:

```text
Connection Map
Room Map
Presence
Heartbeat
Temporary state
```

sab cleanup hone chahiye.

---

# 80. Common Mistake: WebSocket for Everything

Don't make:

```text
REST
   ↓
unused
```

A balanced application:

```text
REST + WebSocket
```

best fit ho sakta hai.

---

# 81. Complete Socket Flow

Ab complete architecture ek baar dekho:

```text
                         CLIENT
                            |
                            |
                    WebSocket Connect
                            |
                            v
                   WebSocket Server
                            |
                            v
                 Connection Handler
                            |
                            v
                    Authentication
                            |
                     +------+------+
                     |             |
                   Fail          Success
                     |             |
                   Close           v
                             Connection Manager
                                   |
                                   v
                              Event Router
                                   |
                    +--------------+--------------+
                    |              |              |
                  Chat           Typing        Presence
                    |              |              |
                    v              v              v
                Handler          Handler        Handler
                    |              |              |
                    +--------------+--------------+
                                   |
                                Services
                                   |
                              +----+----+
                              |         |
                           MongoDB    Redis
                              |
                              v
                         Persistent Data
```

---

# 82. Complete Chat Message Flow

```text
User A
  |
  | chat:send
  v
Socket Server
  |
  v
Event Router
  |
  v
Chat Handler
  |
  +--> Validate
  |
  +--> Authenticate
  |
  +--> Authorize
  |
  v
Chat Service
  |
  v
MongoDB
  |
  | message created
  v
Socket Manager
  |
  v
Find User B sockets
  |
  v
Send chat:new
  |
  v
User B
```

---

# 83. Complete Disconnect Flow

```text
Client
  |
  X
Disconnect
  |
  v
WebSocket Server
  |
  v
Connection Handler
  |
  v
Connection Manager
  |
  +--> Remove socket
  |
  +--> Remove rooms
  |
  +--> Update presence
  |
  +--> Cleanup state
  |
  v
Check remaining sockets
  |
  +---- Exists → User stays online
  |
  +---- None → User offline
```

---

# 84. Development Order

Hum socket layer ko randomly nahi banayenge.

Recommended order:

```text
01. WebSocket Server
        ↓
02. Connection Handler
        ↓
03. Socket Manager
        ↓
04. Authentication
        ↓
05. Event Router
        ↓
06. Chat Handler
        ↓
07. Private Messaging
        ↓
08. Rooms
        ↓
09. Typing
        ↓
10. Presence
        ↓
11. Delivery
        ↓
12. Read Receipts
        ↓
13. Acknowledgement
        ↓
14. Heartbeat
        ↓
15. Reconnection
        ↓
16. Validation
        ↓
17. Security
        ↓
18. Redis
        ↓
19. Scaling
```

---

# 85. Socket Layer Final Folder Structure

Project mature hone ke baad:

```text
src/
│
├── websocket/
│   │
│   ├── websocket.server.js
│   ├── connection.handler.js
│   ├── socket.manager.js
│   ├── room.manager.js
│   ├── presence.manager.js
│   ├── socket.auth.js
│   ├── socket.router.js
│   │
│   ├── handlers/
│   │   ├── chat.handler.js
│   │   ├── message.handler.js
│   │   ├── typing.handler.js
│   │   ├── presence.handler.js
│   │   └── conversation.handler.js
│   │
│   ├── events/
│   │   ├── chat.events.js
│   │   ├── message.events.js
│   │   ├── typing.events.js
│   │   └── presence.events.js
│   │
│   └── utils/
│       ├── send.js
│       ├── broadcast.js
│       ├── errors.js
│       └── heartbeat.js
│
├── controllers/
├── services/
├── models/
├── routes/
├── middleware/
├── validators/
├── config/
└── server.js
```

---

# 86. Socket Layer Responsibilities

Socket layer ka kaam:

```text
✓ Connection
✓ Authentication
✓ Event routing
✓ Socket management
✓ Room management
✓ Sending events
✓ Broadcasting
✓ Presence
✓ Heartbeat
✓ Disconnect cleanup
```

Socket layer ka kaam **nahi**:

```text
✗ Complex database business logic
✗ Authentication token generation
✗ Password hashing
✗ Huge business workflows
✗ Directly handling every database query
```

Ye responsibilities appropriate services/modules mein honi chahiye.

---

# 87. Golden Architecture Rule

Hamari application mein:

```text
Socket
   ↓
Handler
   ↓
Service
   ↓
Model
   ↓
MongoDB
```

Aur response:

```text
MongoDB
   ↓
Service
   ↓
Handler
   ↓
Socket Manager
   ↓
Client
```

Ye separation project ko maintainable rakhega.

---

# 88. Master Level Mental Model

Socket ko sirf:

```javascript
socket.send()
```

mat samajhna.

Real socket architecture:

```text
Connection
    ↓
Identity
    ↓
State
    ↓
Event
    ↓
Router
    ↓
Handler
    ↓
Authorization
    ↓
Service
    ↓
Persistence
    ↓
Socket Manager
    ↓
Room / User
    ↓
Delivery
    ↓
Acknowledgement
    ↓
Cleanup
```

Aur production:

```text
                 Load Balancer
                       |
              +--------+--------+
              |        |        |
             WS1      WS2      WS3
              |        |        |
              +--------+--------+
                       |
                     Redis
                       |
                    MongoDB
```

---

# 89. Socket Mastery Checklist

## Fundamentals

* [ ] Socket layer samajh gaya
* [ ] WebSocket aur Socket Layer ka difference samajh gaya
* [ ] Connection lifecycle samajh gaya
* [ ] Socket state samajh gaya

## Connection Management

* [ ] Connection Manager
* [ ] User → Socket mapping
* [ ] Multiple sockets per user
* [ ] Connection ID
* [ ] Cleanup

## Events

* [ ] Event naming
* [ ] Event router
* [ ] Event handlers
* [ ] Send
* [ ] Broadcast
* [ ] Error events
* [ ] Acknowledgements

## Rooms

* [ ] Room manager
* [ ] Join room
* [ ] Leave room
* [ ] Room broadcast
* [ ] Room cleanup
* [ ] Room authorization

## Chat

* [ ] Private messaging
* [ ] Group chat
* [ ] Typing indicator
* [ ] Online/offline
* [ ] Message delivery
* [ ] Read receipts

## Reliability

* [ ] Heartbeat
* [ ] Reconnection
* [ ] Retry
* [ ] Idempotency
* [ ] Ordering
* [ ] Missed message sync

## Security

* [ ] Authentication
* [ ] Authorization
* [ ] Validation
* [ ] Rate limiting
* [ ] Payload limits
* [ ] Origin validation
* [ ] WSS

## Database

* [ ] MongoDB integration
* [ ] Message persistence
* [ ] Conversation persistence
* [ ] Indexes
* [ ] Pagination

## Scaling

* [ ] Redis
* [ ] Pub/Sub
* [ ] Multiple WebSocket servers
* [ ] Load balancing
* [ ] Distributed presence

---

# 90. Final Goal

Is `socket.md` ko complete karne ke baad tumhe ye clear hona chahiye:

```text
WebSocket
   ↓
Socket Server
   ↓
Connection Handler
   ↓
Socket Manager
   ↓
Event Router
   ↓
Event Handler
   ↓
Service
   ↓
MongoDB
   ↓
Socket Manager
   ↓
User / Room
   ↓
Real-Time Event
```

Aur jab project production-level scale kare:

```text
Client
  |
  v
Load Balancer
  |
  +-----------------------------+
  |              |              |
  v              v              v
WS Server 1   WS Server 2   WS Server 3
  |              |              |
  +--------------+--------------+
                 |
               Redis
                 |
              MongoDB
```

**Core principle:**

> **WebSocket communication provide karta hai, Socket Layer connections aur events manage karta hai, Services business logic handle karti hain, aur MongoDB persistent data store karta hai.**

Isi separation ke through hamara chat application clean, scalable aur production-oriented banega.

---

# End

> **Next:** `models.md` → `routes.md` → `controllers.md` → `services.md` → `events.md` → implementation.
