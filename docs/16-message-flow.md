# Message Flow

> **Project:** Real-Time Chat Application
> **Purpose:** Message ke complete lifecycle ko samajhna
> **Backend:** Node.js + Express.js
> **Database:** MongoDB + Mongoose
> **Real-Time:** WebSocket
> **Authentication:** JWT + HTTP-only Cookies

---

# Table of Contents

* [1. Message Flow Kya Hai](#1-message-flow-kya-hai)
* [2. Complete Message Lifecycle](#2-complete-message-lifecycle)
* [3. User Message Type Karta Hai](#3-user-message-type-karta-hai)
* [4. Client Message Create Karta Hai](#4-client-message-create-karta-hai)
* [5. WebSocket Par Message Send](#5-websocket-par-message-send)
* [6. Server Message Receive Karta Hai](#6-server-message-receive-karta-hai)
* [7. Authentication](#7-authentication)
* [8. Validation](#8-validation)
* [9. Authorization](#9-authorization)
* [10. Duplicate Message Protection](#10-duplicate-message-protection)
* [11. Message MongoDB Mein Save](#11-message-mongodb-mein-save)
* [12. Sender Ko Confirmation](#12-sender-ko-confirmation)
* [13. Receiver Ko Message](#13-receiver-ko-message)
* [14. Delivery Receipt](#14-delivery-receipt)
* [15. Read Receipt](#15-read-receipt)
* [16. Complete Message Lifecycle Diagram](#16-complete-message-lifecycle-diagram)
* [17. Message States](#17-message-states)
* [18. Offline User Flow](#18-offline-user-flow)
* [19. Reconnection Flow](#19-reconnection-flow)
* [20. Duplicate Message Flow](#20-duplicate-message-flow)
* [21. Message Ordering](#21-message-ordering)
* [22. Message Edit Flow](#22-message-edit-flow)
* [23. Message Delete Flow](#23-message-delete-flow)
* [24. Failed Message Flow](#24-failed-message-flow)
* [25. Retry Flow](#25-retry-flow)
* [26. File Message Flow](#26-file-message-flow)
* [27. Group Chat Flow](#27-group-chat-flow)
* [28. Security Flow](#28-security-flow)
* [29. Backend Architecture](#29-backend-architecture)
* [30. Debugging Flow](#30-debugging-flow)
* [31. Golden Rules](#31-golden-rules)

---

# 1. Message Flow Kya Hai

Message flow ka matlab hai:

> **User ke message type karne se lekar message ke receiver tak pahunchne, database mein save hone, delivered hone aur read hone tak ka complete process.**

Example:

```text
User A
  |
  | "Hello bro!"
  v
Frontend
  |
  | WebSocket
  v
Backend
  |
  | Validate
  | Authenticate
  | Authorize
  v
MongoDB
  |
  v
Backend
  |
  +----------+
  |          |
  v          v
User A     User B
```

---

# 2. Complete Message Lifecycle

Ek message ka ideal lifecycle:

```text
COMPOSED
   ↓
SENDING
   ↓
SENT
   ↓
DELIVERED
   ↓
READ
```

Agar problem aaye:

```text
SENDING
   ↓
FAILED
   ↓
RETRY
   ↓
SENT
```

---

# 3. User Message Type Karta Hai

Sabse pehle user frontend par message type karta hai.

Example:

```text
┌─────────────────────────────┐
│ Chat with Rahul             │
├─────────────────────────────┤
│ Rahul: Hello                │
│ You: Hi bro                 │
│                             │
│ You: How are you?           │
│                             │
├─────────────────────────────┤
│ Type a message...     [Send]│
└─────────────────────────────┘
```

Abhi tak:

```text
MongoDB
   ↓
No new message
```

Message sirf frontend input state mein hai.

---

# 4. Client Message Create Karta Hai

Send button press karne par frontend ek temporary message object create karta hai.

Example:

```json
{
  "clientMessageId": "client-abc-123",
  "conversationId": "conversation-123",
  "type": "text",
  "content": "How are you?"
}
```

Yahan:

```text
clientMessageId
```

bahut important hai.

---

# 4.1 Client Message ID

Client apne side se unique ID generate karega.

Example:

```text
clientMessageId
=
"01JABCXYZ123"
```

Iska purpose:

```text
Retry
Duplicate prevention
Message tracking
Optimistic UI
```

---

# 5. WebSocket Par Message Send

Frontend:

```text
message:send
```

event emit karega.

Payload:

```json
{
  "conversationId": "CONVERSATION_ID",
  "clientMessageId": "CLIENT_MESSAGE_ID",
  "type": "text",
  "content": "How are you?"
}
```

Flow:

```text
Frontend
   |
   | message:send
   v
WebSocket Server
```

---

# 5.1 HTTP vs WebSocket

Message sending ke liye hamara primary flow:

```text
WebSocket
```

hoga.

HTTP:

```text
POST /conversations/:conversationId/messages
```

fallback/testing/history-related operations ke liye useful ho sakta hai.

---

# 6. Server Message Receive Karta Hai

Socket handler event receive karega:

```text
message:send
```

Architecture:

```text
Socket
  ↓
Event Handler
  ↓
Message Service
```

Handler ko directly MongoDB query nahi karni chahiye.

Bad:

```text
Socket Handler
     ↓
MongoDB
```

Better:

```text
Socket Handler
     ↓
Service
     ↓
Repository / Mongoose
     ↓
MongoDB
```

---

# 7. Authentication

Server ko sabse pehle check karna hai:

```text
Kya socket authenticated hai?
```

Flow:

```text
message:send
      ↓
Socket Authentication
      ↓
Authenticated?
   /       \
 No         Yes
 |           |
Error       Continue
```

Agar authentication fail:

```json
{
  "success": false,
  "error": {
    "code": "SOCKET_UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

# 8. Validation

Authentication ke baad payload validate hoga.

Expected:

```json
{
  "conversationId": "CONVERSATION_ID",
  "clientMessageId": "CLIENT_MESSAGE_ID",
  "type": "text",
  "content": "Hello"
}
```

Check:

```text
conversationId exists?
clientMessageId valid?
type valid?
content exists?
content length allowed?
```

---

# 8.1 Invalid Payload

Example:

```json
{
  "conversationId": "",
  "content": ""
}
```

Server:

```text
Validation Failed
      ↓
Do not save
      ↓
Send error ACK
```

---

# 8.2 Validation Error

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

# 9. Authorization

Valid payload ka matlab ye nahi ki user action kar sakta hai.

Server ko check karna hai:

```text
Is user a member of this conversation?
```

Flow:

```text
Authenticated User
        ↓
Conversation
        ↓
Membership Check
        ↓
     +--+--+
     |     |
    No    Yes
     |     |
   Reject Continue
```

---

# 9.1 Example Attack

User malicious payload bhej sakta hai:

```json
{
  "conversationId": "SOMEONE_ELSES_CHAT",
  "content": "Hack!"
}
```

Server ko kabhi trust nahi karna:

```text
"Client ne conversationId diya hai,
to user member hi hoga."
```

Instead:

```text
MongoDB
   ↓
Find membership
   ↓
User belongs?
```

---

# 10. Duplicate Message Protection

Network issues ki wajah se client same message multiple times send kar sakta hai.

Example:

```text
Client
   |
   | message:send
   X Network timeout
   |
   | retry
   v
Server
```

Server ko dono requests mil sakti hain.

Agar `clientMessageId` check nahi kiya:

```text
MongoDB

Message 1
Message 1 duplicate
```

---

# 10.1 Duplicate Prevention

Server:

```text
clientMessageId
      ↓
Already exists?
    /      \
  Yes       No
   |         |
Return      Save
existing
message
```

Database mein unique constraint/index strategy use ki ja sakti hai.

---

# 11. Message MongoDB Mein Save

Validation aur authorization successful hone ke baad:

```text
Message Service
      ↓
Mongoose
      ↓
MongoDB
```

Example document:

```json
{
  "_id": "MESSAGE_ID",
  "conversation": "CONVERSATION_ID",
  "sender": "USER_ID",
  "type": "text",
  "content": "How are you?",
  "clientMessageId": "CLIENT_MESSAGE_ID",
  "createdAt": "2026-08-11T10:00:00.000Z"
}
```

---

# 11.1 Why Save Before Broadcast?

Recommended flow:

```text
Receive
  ↓
Validate
  ↓
Authorize
  ↓
Save
  ↓
Broadcast
```

Not:

```text
Receive
  ↓
Broadcast
  ↓
Save
```

Reason:

Agar MongoDB save fail ho gaya aur message pehle broadcast kar diya:

```text
Receiver:
"Message aa gaya!"

Database:
"Message saved hi nahi hua."
```

System inconsistent ho jayega.

---

# 12. Sender Ko Confirmation

Database save successful hone ke baad sender ko:

```text
message:sent
```

event milega.

Example:

```json
{
  "event": "message:sent",
  "data": {
    "clientMessageId": "client-abc-123",
    "message": {
      "id": "MESSAGE_ID",
      "conversationId": "CONVERSATION_ID",
      "senderId": "USER_ID",
      "type": "text",
      "content": "How are you?",
      "createdAt": "2026-08-11T10:00:00.000Z"
    }
  }
}
```

---

# 12.1 Optimistic UI

Frontend message send karte hi temporary message dikha sakta hai:

```text
You:
How are you?   ⏳
```

Server confirmation:

```text
How are you?   ✓
```

Delivered:

```text
How are you?   ✓✓
```

Read:

```text
How are you?   ✓✓ Read
```

---

# 13. Receiver Ko Message

Server conversation room ke members ko:

```text
message:new
```

broadcast karega.

Flow:

```text
MongoDB
   ↓
Message Service
   ↓
Socket Server
   ↓
Conversation Room
   ↓
Connected Members
```

---

# 13.1 Conversation Room

Example:

```text
conversation:123
```

Room:

```text
conversation:123
│
├── Socket A
├── Socket B
└── Socket C
```

Message:

```text
message:new
```

room ke members ko send ho sakta hai.

---

# 14. Delivery Receipt

Receiver ke client ko message mil gaya.

Client:

```text
message:delivered
```

server ko send karega.

Payload:

```json
{
  "conversationId": "CONVERSATION_ID",
  "messageId": "MESSAGE_ID"
}
```

---

# 14.1 Delivery Flow

```text
Server
  |
  | message:new
  v
Receiver
  |
  | message:delivered
  v
Server
  |
  | update delivery state
  v
MongoDB
```

---

# 14.2 Sender Notification

Server sender ko:

```text
message:delivery-updated
```

bhejega.

```json
{
  "event": "message:delivery-updated",
  "data": {
    "messageId": "MESSAGE_ID",
    "userId": "RECEIVER_ID",
    "status": "delivered"
  }
}
```

---

# 15. Read Receipt

Receiver ne message actually screen par dekh liya.

Client:

```text
message:read
```

bhejega.

Payload:

```json
{
  "conversationId": "CONVERSATION_ID",
  "messageId": "MESSAGE_ID"
}
```

---

# 15.1 Read Flow

```text
Receiver
   |
   | message:read
   v
Server
   |
   | Authorization
   v
MongoDB
   |
   | Update read state
   v
Server
   |
   | message:read-updated
   v
Sender
```

---

# 16. Complete Message Lifecycle Diagram

```text
                         USER A
                           |
                           | Type
                           v
                    Frontend Input
                           |
                           | Send
                           v
                    Create Client ID
                           |
                           v
                     message:send
                           |
                           v
                  ┌─────────────────┐
                  │ WebSocket Server│
                  └────────┬────────┘
                           |
                           v
                    Authentication
                           |
                           v
                       Validation
                           |
                           v
                      Authorization
                           |
                           v
                  Duplicate Check
                           |
                           v
                     Message Service
                           |
                           v
                        Mongoose
                           |
                           v
                        MongoDB
                           |
                           v
                     message:sent
                           |
                           v
                        USER A
                           
                           +
                           
                    message:new
                           |
                           v
                        USER B
                           |
                           | Receive
                           v
                  message:delivered
                           |
                           v
                        Server
                           |
                           v
                        MongoDB
                           |
                           v
                  delivery-updated
                           |
                           v
                        USER A
                           
                           +
                           
                    message:read
                           |
                           v
                        Server
                           |
                           v
                        MongoDB
                           |
                           v
                  message:read-updated
                           |
                           v
                        USER A
```

---

# 17. Message States

Frontend state:

```text
sending
sent
delivered
read
failed
```

Example:

```text
sending
   ↓
sent
   ↓
delivered
   ↓
read
```

Failure:

```text
sending
   ↓
failed
   ↓
retry
```

---

# 17.1 `sending`

Message client ne create kar diya hai.

```text
Status:
SENDING
```

---

# 17.2 `sent`

Server ne message successfully persist kar diya.

```text
Status:
SENT
```

---

# 17.3 `delivered`

Receiver ke active client ne message receive kar liya.

```text
Status:
DELIVERED
```

---

# 17.4 `read`

Receiver ne message read kar liya.

```text
Status:
READ
```

---

# 18. Offline User Flow

Important:

> WebSocket sirf connected users ko real-time message deliver karta hai.

Agar User B offline hai:

```text
User A
  |
  | message
  v
Server
  |
  v
MongoDB
  |
  X User B offline
```

Message lose nahi hona chahiye.

MongoDB mein message saved hai.

---

# 18.1 User B Reconnect Karta Hai

```text
User B
  |
  | connect
  v
WebSocket Server
  |
  | authenticate
  v
Server
  |
  | sync
  v
MongoDB
```

Client missing messages fetch karega.

Example:

```http
GET /api/v1/conversations/:conversationId/messages
```

---

# 18.2 Offline Flow

```text
                    User A
                       |
                       | send
                       v
                    Server
                       |
                       v
                    MongoDB
                       |
                       X
                  User B Offline
                       |
                       |
                 Later reconnect
                       |
                       v
                  User B Socket
                       |
                       v
                Fetch missed data
                       |
                       v
                    MongoDB
                       |
                       v
                  User B Client
```

---

# 19. Reconnection Flow

Network temporarily disconnect:

```text
Connected
   |
   X
Disconnected
   |
   v
Reconnect Attempt
   |
   v
Connected
```

Reconnect ke baad:

```text
1. Authenticate
2. Restore socket state
3. Join required rooms
4. Determine last known message
5. Sync missed messages
6. Update presence
```

---

# 19.1 Last Known Message

Client maintain kar sakta hai:

```text
lastMessageId
```

Example:

```text
Last seen:
MESSAGE_500
```

Reconnect:

```text
Give me messages after MESSAGE_500
```

Server:

```text
MESSAGE_501
MESSAGE_502
MESSAGE_503
```

return karega.

---

# 20. Duplicate Message Flow

Suppose:

```text
Client
  |
  | message:send
  v
Server
  |
  | saves
  v
MongoDB
  |
  X ACK lost
  |
Client thinks:
"Message send nahi hua"
  |
  | retry
  v
Server
```

Server:

```text
clientMessageId already exists
```

So:

```text
DO NOT create another message
```

Instead:

```text
Return existing message
```

---

# 20.1 Duplicate Protection Diagram

```text
message:send
      |
      v
clientMessageId
      |
      v
MongoDB lookup
      |
   +--+--+
   |     |
Exists  New
   |     |
Return  Create
existing  |
message   v
        Broadcast
```

---

# 21. Message Ordering

Suppose user sends:

```text
A
B
C
D
```

Server ko ideally:

```text
A → B → C → D
```

order maintain karna hai.

Database:

```text
createdAt
```

use kar sakta hai.

High-scale architecture mein:

```text
sequence number
```

bhi use kar sakte hain.

Example:

```json
{
  "messageId": "MESSAGE_ID",
  "sequence": 105
}
```

---

# 21.1 Why Ordering Matters?

Imagine:

```text
Message A:
"Where are you?"

Message B:
"I am coming."
```

Agar B pehle aa gaya:

```text
I am coming.
Where are you?
```

conversation confusing ho jayegi.

---

# 22. Message Edit Flow

User apna message edit karta hai.

```text
Client
  |
  | message:edit
  v
Server
  |
  | authenticate
  v
Authorization
  |
  | Is owner?
  v
Message Service
  |
  v
MongoDB
  |
  v
message:edited
  |
  v
Conversation Members
```

Payload:

```json
{
  "messageId": "MESSAGE_ID",
  "content": "Updated content"
}
```

---

# 22.1 Edit Authorization

Normally:

```text
Message sender
```

hi edit kar sakta hai.

Check:

```text
message.sender === req.user.id
```

or equivalent service-level authorization.

---

# 23. Message Delete Flow

```text
Client
  |
  | message:delete
  v
Server
  |
  | authenticate
  |
  | authorize
  v
Message Service
  |
  v
MongoDB
  |
  v
message:deleted
  |
  v
Conversation Room
```

---

# 23.1 Soft Delete

Recommended:

```text
deletedAt
```

instead of immediately removing the document.

Example:

```json
{
  "_id": "MESSAGE_ID",
  "content": null,
  "deletedAt": "2026-08-11T10:30:00.000Z"
}
```

Frontend:

```text
This message was deleted
```

show kar sakta hai.

---

# 24. Failed Message Flow

Failure possibilities:

```text
Network failure
Authentication failure
Validation failure
Authorization failure
Database failure
Rate limit
Server error
```

Flow:

```text
SENDING
   |
   v
Error
   |
   v
FAILED
```

Frontend:

```text
How are you?   ⚠️
               Retry
```

---

# 24.1 Server Error

Example:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Unable to send message"
  }
}
```

Frontend:

```text
message.status = "failed"
```

---

# 25. Retry Flow

User Retry button press karta hai:

```text
FAILED
  |
  | Retry
  v
SENDING
  |
  v
message:send
```

Important:

Same `clientMessageId` ko intelligently reuse karna chahiye ya retry semantics clearly define karni chahiye.

Agar server ne already save kar liya tha aur ACK lost hua:

```text
Retry
  ↓
Duplicate check
  ↓
Existing message
  ↓
Return existing message
```

---

# 26. File Message Flow

Text message:

```text
message:send
```

File message ka flow thoda different ho sakta hai.

Recommended:

```text
1. Upload file
2. Receive attachment ID
3. Send message containing attachment ID
```

Flow:

```text
Client
  |
  | HTTP upload
  v
Attachment Service
  |
  v
Storage
  |
  v
attachmentId
  |
  | message:send
  v
WebSocket
  |
  v
Message Service
  |
  v
MongoDB
```

Example message:

```json
{
  "type": "image",
  "content": "",
  "attachments": [
    {
      "id": "ATTACHMENT_ID"
    }
  ]
}
```

---

# 27. Group Chat Flow

Suppose:

```text
Group
├── User A
├── User B
├── User C
└── User D
```

User A sends:

```text
Hello everyone!
```

Flow:

```text
User A
  |
  | message:send
  v
Server
  |
  v
MongoDB
  |
  v
Group Room
  |
  +----> User B
  |
  +----> User C
  |
  +----> User D
```

Each connected member ko message mil sakta hai.

---

# 27.1 Group Delivery

Har receiver ka delivery state independently track karna pad sakta hai.

Example:

```text
Message 100

User B → delivered
User C → delivered
User D → offline
```

Later:

```text
User D → delivered
```

---

# 27.2 Group Read

```text
User B → read
User C → read
User D → unread
```

Large groups mein read receipts ka data model carefully design karna hoga.

---

# 28. Security Flow

Complete secure message flow:

```text
message:send
     |
     v
Socket Authentication
     |
     v
Payload Validation
     |
     v
Conversation Exists?
     |
     v
User Is Member?
     |
     v
User Blocked?
     |
     v
Rate Limit
     |
     v
Duplicate Check
     |
     v
Persist
     |
     v
Broadcast
```

---

# 28.1 Never Do This

```text
Client
  |
  | message
  v
Broadcast
  |
  v
MongoDB
```

Because authorization aur persistence ke bina broadcast unsafe hai.

---

# 29. Backend Architecture

Complete backend flow:

```text
                       CLIENT
                         |
                         |
                    WebSocket
                         |
                         v
                Socket Middleware
                         |
                         v
                  Event Handler
                         |
                         v
                   Message Service
                         |
              +----------+----------+
              |                     |
              v                     v
          Mongoose              Event Logic
              |                     |
              v                     v
           MongoDB              Socket Rooms
                                    |
                         +----------+----------+
                         |          |          |
                         v          v          v
                       User A     User B     User C
```

---

# 29.1 Important Separation

### Socket Handler

Responsible for:

```text
Receive event
Validate input
Call service
Emit result
ACK
```

### Service

Responsible for:

```text
Business logic
Authorization rules
Message creation
Message update
Message deletion
```

### Mongoose Model

Responsible for:

```text
Database schema
Indexes
Persistence
Queries
```

---

# 30. Debugging Flow

Agar message receiver tak nahi pahunch raha:

```text
Step 1
Client ne message:send emit kiya?
        |
        v
Step 2
Server ne event receive kiya?
        |
        v
Step 3
Authentication successful?
        |
        v
Step 4
Payload valid?
        |
        v
Step 5
User conversation member hai?
        |
        v
Step 6
MongoDB save hua?
        |
        v
Step 7
message:sent emit hua?
        |
        v
Step 8
message:new emit hua?
        |
        v
Step 9
Receiver correct room mein hai?
        |
        v
Step 10
Receiver event listen kar raha hai?
```

---

# 30.1 Debug Logs

Development mein temporary logs useful hain:

```text
[SOCKET] message:send
[AUTH] user authenticated
[VALIDATION] payload valid
[AUTHORIZATION] member verified
[MESSAGE] saving
[DATABASE] message created
[SOCKET] message:sent
[SOCKET] message:new
```

Production mein sensitive data log nahi karna.

---

# 31. Golden Rules

## Rule 1

> **Message ko broadcast karne se pehle validate karo.**

---

## Rule 2

> **Authentication aur authorization alag concepts hain.**

Authentication:

```text
Who are you?
```

Authorization:

```text
What are you allowed to do?
```

---

## Rule 3

> **Message ko persist karne ke baad broadcast karna safer hai.**

```text
Validate
 ↓
Authorize
 ↓
Persist
 ↓
Broadcast
```

---

## Rule 4

> **`clientMessageId` duplicate prevention ke liye important hai.**

---

## Rule 5

> **Typing ko unnecessarily database mein save mat karo.**

---

## Rule 6

> **Presence ko bhi ephemeral state ki tarah treat karo.**

---

## Rule 7

> **Offline users ke messages MongoDB mein safe hone chahiye.**

---

## Rule 8

> **Reconnect ka matlab sirf socket reconnect nahi hai.**

Reconnect ke baad:

```text
Authenticate
↓
Restore rooms
↓
Sync missed messages
↓
Restore state
```

---

## Rule 9

> **Socket handler ko business-logic dump mat banao.**

Use:

```text
Handler
  ↓
Service
  ↓
Mongoose
```

---

## Rule 10

> **WebSocket real-time delivery ka mechanism hai, database nahi.**

Database:

```text
MongoDB
```

Real-time transport:

```text
WebSocket
```

---

# Final Mental Model

Ek message ko bas itna yaad rakh:

```text
                 USER
                  |
                  | Type
                  v
              FRONTEND
                  |
                  | message:send
                  v
            WEBSOCKET SERVER
                  |
          +-------+-------+
          |               |
          v               v
    Authentication    Validation
          |               |
          +-------+-------+
                  |
                  v
             Authorization
                  |
                  v
          Duplicate Check
                  |
                  v
             MESSAGE SERVICE
                  |
                  v
               MONGODB
                  |
          +-------+-------+
          |               |
          v               v
    message:sent     message:new
          |               |
          v               v
       SENDER          RECEIVER
                          |
                          | delivered
                          v
                       SERVER
                          |
                          | read
                          v
                       SERVER
                          |
                          v
                  message:read-updated
                          |
                          v
                       SENDER
```

---

# One-Line Summary

```text
Client → WebSocket → Auth → Validation → Authorization → Service → MongoDB → Broadcast → Delivery → Read
```

> **Ye hamare chat application ka core message pipeline hai. Agar ye flow crystal clear ho gaya, to actual WebSocket message implementation samajhna kaafi easy ho jayega.**
