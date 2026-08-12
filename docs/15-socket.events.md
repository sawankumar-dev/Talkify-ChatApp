# Socket Events

> **Project:** Real-Time Chat Application
> **Transport:** WebSocket
> **Protocol:** WebSocket
> **Authentication:** JWT / Session-based authentication
> **Database:** MongoDB + Mongoose
> **API Version:** `v1`

---

# Table of Contents

1. [Socket Events Kya Hain](#1-socket-events-kya-hain)
2. [Event Naming Convention](#2-event-naming-convention)
3. [Event Direction](#3-event-direction)
4. [Socket Lifecycle](#4-socket-lifecycle)
5. [Connection Events](#5-connection-events)
6. [Authentication Events](#6-authentication-events)
7. [Conversation Events](#7-conversation-events)
8. [Message Events](#8-message-events)
9. [Typing Events](#9-typing-events)
10. [Presence Events](#10-presence-events)
11. [Read Receipt Events](#11-read-receipt-events)
12. [Delivery Events](#12-delivery-events)
13. [Reaction Events](#13-reaction-events)
14. [Notification Events](#14-notification-events)
15. [Message Edit Events](#15-message-edit-events)
16. [Message Delete Events](#16-message-delete-events)
17. [Member Events](#17-member-events)
18. [Error Events](#18-error-events)
19. [Acknowledgements](#19-acknowledgements)
20. [Event Payload Standards](#20-event-payload-standards)
21. [Message Lifecycle](#21-message-lifecycle)
22. [Typing Lifecycle](#22-typing-lifecycle)
23. [Presence Lifecycle](#23-presence-lifecycle)
24. [Reconnect Strategy](#24-reconnect-strategy)
25. [Duplicate Events](#25-duplicate-events)
26. [Ordering](#26-ordering)
27. [Security](#27-security)
28. [Event Handler Architecture](#28-event-handler-architecture)
29. [Complete Event Map](#29-complete-event-map)

---

# 1. Socket Events Kya Hain

WebSocket mein client aur server continuously connected reh sakte hain.

HTTP:

```text
Client
  |
  | Request
  v
Server
  |
  | Response
  v
Client
```

WebSocket:

```text
Client <=================> Server
        persistent
        connection
```

Is connection par dono sides events send kar sakti hain.

Example:

```text
Client
  |
  | message:send
  v
Server
  |
  | message:new
  v
Other Client
```

---

# 2. Event Naming Convention

Events ko predictable naming convention follow karna chahiye.

Recommended format:

```text
resource:action
```

Examples:

```text
message:send
message:new
message:edit
message:delete

typing:start
typing:stop

conversation:join
conversation:leave

reaction:add
reaction:remove
```

---

# 3. Event Direction

Har event ki direction clearly define karenge.

## Client → Server

```text
C → S
```

Example:

```text
message:send
```

---

## Server → Client

```text
S → C
```

Example:

```text
message:new
```

---

## Bidirectional

Kuch systems mein same event name dono sides par use ho sakta hai, lekin hamare project mein unnecessary ambiguity avoid karenge.

---

# 4. Socket Lifecycle

Complete lifecycle:

```text
Client
   |
   | connect
   v
Socket Server
   |
   | authenticate
   v
Authenticated Socket
   |
   | join rooms
   v
Ready
   |
   | events
   v
Active Connection
   |
   | disconnect
   v
Offline / Reconnect
```

---

# 5. Connection Events

## `connection`

### Direction

```text
S → Internal
```

Ye server-side lifecycle event hai.

Triggered when:

```text
Client successfully connects
```

Server:

```text
1. Authenticate
2. Attach user
3. Register socket
4. Join personal room
5. Update presence
6. Prepare event handlers
```

---

# 5.1 `socket:ready`

### Direction

```text
S → C
```

Authentication successful hone ke baad server client ko ready event send kar sakta hai.

### Payload

```json
{
  "event": "socket:ready",
  "data": {
    "userId": "USER_ID",
    "socketId": "SOCKET_ID"
  }
}
```

---

# 5.2 `socket:error`

### Direction

```text
S → C
```

General socket error.

### Payload

```json
{
  "event": "socket:error",
  "error": {
    "code": "SOCKET_ERROR",
    "message": "Something went wrong"
  }
}
```

---

# 5.3 `disconnect`

### Direction

```text
C ↔ S
```

Triggered when connection closes.

Possible reasons:

```text
transport close
transport error
client disconnect
server disconnect
network failure
```

Server ko:

```text
1. Socket remove
2. Presence update
3. Cleanup rooms/resources
```

karna hoga.

---

# 6. Authentication Events

Normally authentication connection establish hone ke time middleware mein hogi.

Concept:

```text
Client
   |
   | WebSocket Handshake
   |
   v
Auth Middleware
   |
   +---- invalid → reject
   |
   +---- valid → connection
```

Isliye authentication ko normal message event ke roop mein treat karna zaroori nahi.

---

# 6.1 `auth:error`

### Direction

```text
S → C
```

### Payload

```json
{
  "event": "auth:error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication failed"
  }
}
```

---

# 7. Conversation Events

Conversation rooms WebSocket architecture mein extremely important hain.

Example:

```text
Conversation A
    |
    +-- User 1
    +-- User 2
    +-- User 3
```

Server room:

```text
conversation:<conversationId>
```

Example:

```text
conversation:65abc123
```

---

# 7.1 `conversation:join`

### Direction

```text
C → S
```

### Purpose

Client conversation room join karna chahta hai.

### Payload

```json
{
  "conversationId": "CONVERSATION_ID"
}
```

### Server Validation

```text
1. User authenticated?
2. Conversation exists?
3. User member hai?
4. User blocked hai?
5. Join allowed hai?
```

### Success ACK

```json
{
  "success": true,
  "conversationId": "CONVERSATION_ID"
}
```

---

# 7.2 `conversation:joined`

### Direction

```text
S → C
```

### Payload

```json
{
  "event": "conversation:joined",
  "data": {
    "conversationId": "CONVERSATION_ID"
  }
}
```

---

# 7.3 `conversation:leave`

### Direction

```text
C → S
```

### Payload

```json
{
  "conversationId": "CONVERSATION_ID"
}
```

---

# 7.4 `conversation:left`

### Direction

```text
S → C
```

```json
{
  "event": "conversation:left",
  "data": {
    "conversationId": "CONVERSATION_ID"
  }
}
```

---

# 8. Message Events

Messages hamare WebSocket system ka core hain.

Main events:

```text
message:send
message:new
message:delivered
message:read
message:edit
message:delete
```

---

# 8.1 `message:send`

### Direction

```text
C → S
```

### Purpose

Client new message send karta hai.

### Payload

```json
{
  "conversationId": "CONVERSATION_ID",
  "clientMessageId": "CLIENT_GENERATED_ID",
  "type": "text",
  "content": "Hello bro!"
}
```

---

# 8.2 Client Message ID

`clientMessageId` extremely important hai.

Example:

```text
clientMessageId:
"msg-client-12345"
```

Purpose:

```text
Network timeout
     ↓
Client retry
     ↓
Same message again
```

Duplicate prevent karne ke liye client-generated unique ID use kar sakte hain.

---

# 8.3 Server Processing

`message:send` receive hone par:

```text
Socket
  ↓
Authenticate
  ↓
Validate payload
  ↓
Check conversation
  ↓
Check membership
  ↓
Check block
  ↓
Check duplicate
  ↓
Save MongoDB
  ↓
Emit message:new
```

---

# 8.4 `message:sent`

### Direction

```text
S → C
```

Sender ko confirmation.

### Payload

```json
{
  "event": "message:sent",
  "data": {
    "clientMessageId": "CLIENT_ID",
    "message": {
      "id": "MESSAGE_ID",
      "conversationId": "CONVERSATION_ID",
      "senderId": "USER_ID",
      "content": "Hello bro!",
      "createdAt": "2026-08-11T10:00:00.000Z"
    }
  }
}
```

---

# 8.5 `message:new`

### Direction

```text
S → C
```

Conversation ke other connected members ko new message.

### Payload

```json
{
  "event": "message:new",
  "data": {
    "message": {
      "id": "MESSAGE_ID",
      "conversationId": "CONVERSATION_ID",
      "senderId": "USER_ID",
      "type": "text",
      "content": "Hello bro!",
      "createdAt": "2026-08-11T10:00:00.000Z"
    }
  }
}
```

---

# 8.6 `message:delivered`

### Direction

```text
C → S
```

Client server ko batata hai ki message receive ho gaya.

### Payload

```json
{
  "conversationId": "CONVERSATION_ID",
  "messageId": "MESSAGE_ID"
}
```

---

# 8.7 `message:delivery-updated`

### Direction

```text
S → C
```

### Payload

```json
{
  "event": "message:delivery-updated",
  "data": {
    "messageId": "MESSAGE_ID",
    "userId": "USER_ID",
    "status": "delivered"
  }
}
```

---

# 9. Typing Events

Typing indicators ko database mein persist karne ki zarurat normally nahi hoti.

Events:

```text
typing:start
typing:stop
```

---

# 9.1 `typing:start`

### Direction

```text
C → S
```

### Payload

```json
{
  "conversationId": "CONVERSATION_ID"
}
```

Server:

```text
Authenticate
 ↓
Check membership
 ↓
Broadcast
```

---

# 9.2 `typing:user-started`

### Direction

```text
S → C
```

### Payload

```json
{
  "event": "typing:user-started",
  "data": {
    "conversationId": "CONVERSATION_ID",
    "userId": "USER_ID"
  }
}
```

---

# 9.3 `typing:stop`

### Direction

```text
C → S
```

```json
{
  "conversationId": "CONVERSATION_ID"
}
```

---

# 9.4 `typing:user-stopped`

### Direction

```text
S → C
```

```json
{
  "event": "typing:user-stopped",
  "data": {
    "conversationId": "CONVERSATION_ID",
    "userId": "USER_ID"
  }
}
```

---

# 10. Presence Events

Presence ka matlab:

```text
Online
Offline
Away
Busy
```

---

# 10.1 `presence:update`

### Direction

```text
S → C
```

### Payload

```json
{
  "event": "presence:update",
  "data": {
    "userId": "USER_ID",
    "status": "online"
  }
}
```

---

# 10.2 `presence:subscribe`

### Direction

```text
C → S
```

### Payload

```json
{
  "userIds": [
    "USER_ID_1",
    "USER_ID_2"
  ]
}
```

Client specific users ka presence subscribe kar sakta hai.

---

# 10.3 `presence:unsubscribe`

### Direction

```text
C → S
```

```json
{
  "userIds": [
    "USER_ID_1"
  ]
}
```

---

# 11. Read Receipt Events

Read receipt:

```text
User ne message actually dekh liya
```

---

# 11.1 `message:read`

### Direction

```text
C → S
```

### Payload

```json
{
  "conversationId": "CONVERSATION_ID",
  "messageId": "MESSAGE_ID"
}
```

Server:

```text
1. Authenticate
2. Verify membership
3. Update read state
4. Notify sender
```

---

# 11.2 `message:read-updated`

### Direction

```text
S → C
```

```json
{
  "event": "message:read-updated",
  "data": {
    "conversationId": "CONVERSATION_ID",
    "messageId": "MESSAGE_ID",
    "userId": "USER_ID",
    "readAt": "2026-08-11T10:05:00.000Z"
  }
}
```

---

# 12. Delivery Events

Message states:

```text
sent
  ↓
delivered
  ↓
read
```

Concept:

```text
Client A
   |
   | message
   v
Server
   |
   | persisted
   v
MongoDB
   |
   | message:new
   v
Client B
   |
   | delivered
   v
Server
   |
   | delivery update
   v
Client A
```

---

# 13. Reaction Events

---

# 13.1 `reaction:add`

### Direction

```text
C → S
```

### Payload

```json
{
  "messageId": "MESSAGE_ID",
  "emoji": "❤️"
}
```

Server:

```text
Validate
 ↓
Authorize
 ↓
Save reaction
 ↓
Broadcast
```

---

# 13.2 `reaction:added`

### Direction

```text
S → C
```

```json
{
  "event": "reaction:added",
  "data": {
    "messageId": "MESSAGE_ID",
    "userId": "USER_ID",
    "emoji": "❤️"
  }
}
```

---

# 13.3 `reaction:remove`

### Direction

```text
C → S
```

```json
{
  "messageId": "MESSAGE_ID",
  "emoji": "❤️"
}
```

---

# 13.4 `reaction:removed`

### Direction

```text
S → C
```

```json
{
  "event": "reaction:removed",
  "data": {
    "messageId": "MESSAGE_ID",
    "userId": "USER_ID",
    "emoji": "❤️"
  }
}
```

---

# 14. Notification Events

Notifications jo live update honi chahiye unhe WebSocket se push kiya ja sakta hai.

---

# 14.1 `notification:new`

### Direction

```text
S → C
```

### Payload

```json
{
  "event": "notification:new",
  "data": {
    "notification": {
      "id": "NOTIFICATION_ID",
      "type": "message",
      "message": "New message"
    }
  }
}
```

---

# 15. Message Edit Events

---

# 15.1 `message:edit`

### Direction

```text
C → S
```

### Payload

```json
{
  "messageId": "MESSAGE_ID",
  "content": "Updated message"
}
```

Server:

```text
Authenticate
 ↓
Find message
 ↓
Check owner
 ↓
Update MongoDB
 ↓
Broadcast
```

---

# 15.2 `message:edited`

### Direction

```text
S → C
```

```json
{
  "event": "message:edited",
  "data": {
    "messageId": "MESSAGE_ID",
    "conversationId": "CONVERSATION_ID",
    "content": "Updated message",
    "editedAt": "2026-08-11T10:10:00.000Z"
  }
}
```

---

# 16. Message Delete Events

---

# 16.1 `message:delete`

### Direction

```text
C → S
```

```json
{
  "messageId": "MESSAGE_ID"
}
```

---

# 16.2 `message:deleted`

### Direction

```text
S → C
```

```json
{
  "event": "message:deleted",
  "data": {
    "messageId": "MESSAGE_ID",
    "conversationId": "CONVERSATION_ID",
    "deletedAt": "2026-08-11T10:15:00.000Z"
  }
}
```

---

# 17. Member Events

Group chats mein members add/remove/promote ho sakte hain.

---

# 17.1 `member:added`

### Direction

```text
S → C
```

```json
{
  "event": "member:added",
  "data": {
    "conversationId": "CONVERSATION_ID",
    "userId": "USER_ID"
  }
}
```

---

# 17.2 `member:removed`

### Direction

```text
S → C
```

```json
{
  "event": "member:removed",
  "data": {
    "conversationId": "CONVERSATION_ID",
    "userId": "USER_ID"
  }
}
```

---

# 17.3 `member:role-updated`

### Direction

```text
S → C
```

```json
{
  "event": "member:role-updated",
  "data": {
    "conversationId": "CONVERSATION_ID",
    "userId": "USER_ID",
    "role": "admin"
  }
}
```

---

# 18. Error Events

Socket errors ko consistent format mein bhejna hai.

---

## `error`

### Direction

```text
S → C
```

```json
{
  "event": "error",
  "error": {
    "code": "FORBIDDEN",
    "message": "You cannot perform this action"
  }
}
```

---

## Common Socket Errors

```text
SOCKET_UNAUTHORIZED
INVALID_PAYLOAD
INVALID_EVENT
CONVERSATION_NOT_FOUND
NOT_A_MEMBER
FORBIDDEN
MESSAGE_NOT_FOUND
MESSAGE_EDIT_FORBIDDEN
MESSAGE_DELETE_FORBIDDEN
USER_BLOCKED
DUPLICATE_MESSAGE
RATE_LIMITED
INTERNAL_ERROR
```

---

# 19. Acknowledgements

WebSocket events mein ACK ka use bahut useful hai.

Client:

```text
message:send
```

Server:

```text
ACK
```

Example:

```javascript
socket.emit(
  "message:send",
  payload,
  (response) => {
    // response
  }
);
```

Success:

```json
{
  "success": true,
  "messageId": "MESSAGE_ID"
}
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "Message content is required"
  }
}
```

---

# 19.1 ACK Kab Use Karein?

ACK useful hai:

```text
message:send
conversation:join
conversation:leave
message:read
reaction:add
reaction:remove
```

Typing jaise ephemeral events mein ACK generally unnecessary hai.

---

# 20. Event Payload Standards

Har client → server event ka predictable structure hona chahiye.

Example:

```json
{
  "conversationId": "CONVERSATION_ID",
  "messageId": "MESSAGE_ID"
}
```

Optional metadata:

```json
{
  "clientMessageId": "CLIENT_ID"
}
```

---

# 20.1 IDs

IDs string format mein transmit honge:

```json
{
  "userId": "64abc...",
  "messageId": "64def..."
}
```

MongoDB ObjectId internally use ho sakta hai.

---

# 20.2 Timestamps

ISO 8601:

```text
2026-08-11T10:15:00.000Z
```

Client ko local timezone conversion frontend par karni chahiye.

---

# 20.3 Event Envelope

Large/complex system mein event envelope useful ho sakta hai:

```json
{
  "event": "message:new",
  "requestId": "REQUEST_ID",
  "timestamp": "2026-08-11T10:15:00.000Z",
  "data": {}
}
```

---

# 21. Message Lifecycle

Complete lifecycle:

```text
                message:send
Client A ─────────────────────> Server
                                  |
                                  v
                              Validate
                                  |
                                  v
                            Authorization
                                  |
                                  v
                              MongoDB
                                  |
                     +------------+------------+
                     |                         |
                     v                         v
              message:sent              message:new
                     |                         |
                     v                         v
                 Client A                  Client B
                                               |
                                               v
                                      message:delivered
                                               |
                                               v
                                            Server
                                               |
                                               v
                                  message:delivery-updated
                                               |
                                               v
                                          Client A
```

Read:

```text
Client B
   |
   | message:read
   v
Server
   |
   v
MongoDB
   |
   v
Client A
```

---

# 22. Typing Lifecycle

```text
User starts typing
        |
        v
typing:start
        |
        v
Server
        |
        v
typing:user-started
        |
        v
Other users
```

Stop:

```text
User stops typing
        |
        v
typing:stop
        |
        v
Server
        |
        v
typing:user-stopped
```

---

# 22.1 Typing Optimization

Typing events bahut frequently fire ho sakte hain.

Bad:

```text
Every keystroke
↓
WebSocket event
```

Better:

```text
Typing starts
↓
Send typing:start

Wait / debounce

Typing stops
↓
Send typing:stop
```

Frontend par debounce/throttle use karna important hai.

---

# 23. Presence Lifecycle

Connection:

```text
User connects
    ↓
online
    ↓
presence:update
```

Disconnect:

```text
Socket disconnect
    ↓
Grace period
    ↓
offline
    ↓
presence:update
```

Grace period useful hai because mobile/network connections temporary drop ho sakte hain.

---

# 24. Reconnect Strategy

Network failure:

```text
Client
  |
  X connection lost
  |
  v
Reconnect
```

Client should:

```text
1. Reconnect
2. Re-authenticate if required
3. Restore subscriptions
4. Rejoin conversations
5. Sync missed data
```

Important:

> Reconnection ke baad sirf rooms rejoin karna enough nahi hai. Client ko missed messages bhi synchronize karne honge.

Example:

```text
Last known message
       ↓
messageId = 500
       ↓
Reconnect
       ↓
Server/HTTP sync
       ↓
Messages 501–510
```

---

# 25. Duplicate Events

Network retry ke wajah se duplicate message aa sakta hai.

Solution:

```text
clientMessageId
```

Example:

```json
{
  "clientMessageId": "mobile-abc-123",
  "content": "Hello"
}
```

Server:

```text
clientMessageId already processed?
        |
     +--+--+
     |     |
    Yes    No
     |      |
 Return    Save
 existing   |
 message    v
          Broadcast
```

---

# 26. Event Ordering

Messages order important hai.

Example:

```text
Message A
Message B
Message C
```

Network theoretically:

```text
A
C
B
```

arrive kar sakta hai.

Therefore server-generated:

```text
createdAt
```

and/or sequence number useful ho sakta hai.

Example:

```json
{
  "messageId": "MESSAGE_ID",
  "sequence": 501
}
```

Client sequence ke basis par ordering maintain kar sakta hai.

---

# 27. Security

WebSocket HTTP se automatically secure nahi ho jata.

Same security principles apply:

```text
Authenticate
     ↓
Validate
     ↓
Authorize
     ↓
Rate Limit
     ↓
Process
```

---

## 27.1 Never Trust Socket Payload

Bad:

```javascript
socket.on("message:delete", ({ messageId }) => {
  Message.deleteOne({ _id: messageId });
});
```

Problem:

```text
Any authenticated user
       ↓
Any message delete
```

Correct architecture:

```text
messageId
   ↓
Find message
   ↓
Find conversation
   ↓
Check user
   ↓
Check ownership/permission
   ↓
Delete
```

---

# 27.2 Room Authorization

Client:

```text
conversation:join
```

Server must verify:

```text
Is user actually a member?
```

Never allow:

```text
Client says:
"I am member of conversation X"
```

Server must check database/business state.

---

# 27.3 Rate Limiting

Potential abuse:

```text
message:send
typing:start
reaction:add
```

per-user/per-socket limits consider karne chahiye.

---

# 28. Event Handler Architecture

Recommended structure:

```text
src/
│
├── sockets/
│   │
│   ├── index.js
│   ├── socket.middleware.js
│   │
│   ├── handlers/
│   │   ├── connection.handler.js
│   │   ├── message.handler.js
│   │   ├── typing.handler.js
│   │   ├── presence.handler.js
│   │   ├── reaction.handler.js
│   │   └── conversation.handler.js
│   │
│   └── events/
│       └── socket.events.js
```

---

# 28.1 Event Constants

Event names ko hardcode karne ke bajay central constants useful hain.

Concept:

```javascript
const SOCKET_EVENTS = {
  MESSAGE_SEND: "message:send",
  MESSAGE_NEW: "message:new",
  MESSAGE_EDIT: "message:edit",
  MESSAGE_DELETE: "message:delete",

  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",

  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave"
};
```

Benefit:

```text
Typo ↓
Consistency ↑
Refactoring easier
```

---

# 28.2 Handler Responsibility

Handler ka kaam:

```text
Receive event
    ↓
Validate input
    ↓
Call service
    ↓
Emit event
    ↓
ACK
```

Handler ke andar giant business logic nahi.

---

# 28.3 Service Responsibility

Service:

```text
message.service.js
```

handle kare:

```text
Create message
Edit message
Delete message
Validate membership
Check permissions
Persist data
```

HTTP aur WebSocket dono same service use kar sakte hain.

```text
             +--> HTTP Controller
             |
Message      |
Service <----+
             |
             +--> Socket Handler
```

---

# 29. Complete Event Map

## Connection

```text
connection
disconnect
socket:ready
socket:error
```

---

## Authentication

```text
auth:error
```

---

## Conversations

```text
conversation:join
conversation:joined
conversation:leave
conversation:left
```

---

## Messages

```text
message:send
message:sent
message:new
message:delivered
message:delivery-updated
message:read
message:read-updated
message:edit
message:edited
message:delete
message:deleted
```

---

## Typing

```text
typing:start
typing:user-started
typing:stop
typing:user-stopped
```

---

## Presence

```text
presence:update
presence:subscribe
presence:unsubscribe
```

---

## Reactions

```text
reaction:add
reaction:added
reaction:remove
reaction:removed
```

---

## Notifications

```text
notification:new
```

---

## Members

```text
member:added
member:removed
member:role-updated
```

---

# Event Flow Summary

## Send Message

```text
C
 |
 | message:send
 v
S
 |
 | validate
 | authorize
 | persist
 |
 +----> message:sent ----> Sender
 |
 +----> message:new ----> Receivers
```

---

## Typing

```text
C
 |
 | typing:start
 v
S
 |
 | typing:user-started
 v
Other Clients
```

---

## Read Receipt

```text
C
 |
 | message:read
 v
S
 |
 | persist read state
 |
 | message:read-updated
 v
Sender
```

---

## Reaction

```text
C
 |
 | reaction:add
 v
S
 |
 | persist
 |
 | reaction:added
 v
Conversation Members
```

---

# Golden Rules

## Rule 1

> **Client event kabhi blindly trust nahi karna.**

---

## Rule 2

> **Every protected event must be authenticated.**

---

## Rule 3

> **Authentication ke baad authorization mandatory hai.**

---

## Rule 4

> **Business logic handlers mein nahi, service layer mein rakho.**

---

## Rule 5

> **Typing aur presence ephemeral data hain; unnecessary database writes avoid karo.**

---

## Rule 6

> **Messages persistent data hain; MongoDB mein save karo.**

---

## Rule 7

> **Every important mutation ke liye ACK useful hai.**

---

## Rule 8

> **Duplicate messages ke liye `clientMessageId` use karo.**

---

## Rule 9

> **Reconnect ke baad missed data synchronize karo.**

---

## Rule 10

> **Event names centralized constants se manage karo.**

---

# Final Mental Model

```text
                         WebSocket
                            |
                            v
                     Socket Middleware
                            |
                     Authentication
                            |
                            v
                      Event Handler
                            |
                     Validation
                            |
                     Authorization
                            |
                            v
                         Service
                            |
                +-----------+-----------+
                |                       |
                v                       v
             MongoDB              Event Emitter
                                        |
                         +--------------+--------------+
                         |              |              |
                         v              v              v
                     Sender         Receiver       Other Users
```

Aur sabse important architecture:

```text
                    BUSINESS LOGIC
                         |
              +----------+----------+
              |                     |
              v                     v
        REST Controller       Socket Handler
              |                     |
              +----------+----------+
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

> **HTTP aur WebSocket sirf communication ke different channels hain. Business rules ek hi jagah — Service Layer — mein rehne chahiye.**
