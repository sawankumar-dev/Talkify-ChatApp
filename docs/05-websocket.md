# ⚡ WebSocket Mastery — Zero to Advanced

> **Project:** Real-Time Chat Application
> **Document:** `05-websocket.md`
> **Level:** Beginner → Advanced → Production
> **Goal:** WebSocket ko itna deeply samajhna ki Socket.IO, real-time chat, presence, typing indicators, notifications aur scalable real-time systems ko confidently design kiya ja sake.

---

# 📚 Table of Contents

1. [WebSocket Kya Hai?](#1-websocket-kya-hai)
2. [Real-Time Communication Kya Hai?](#2-real-time-communication-kya-hai)
3. [HTTP Se Problem Kya Hai?](#3-http-se-problem-kya-hai)
4. [Polling](#4-polling)
5. [Long Polling](#5-long-polling)
6. [WebSocket Ki Need](#6-websocket-ki-need)
7. [WebSocket Ka Core Idea](#7-websocket-ka-core-idea)
8. [WebSocket vs HTTP](#8-websocket-vs-http)
9. [WebSocket vs TCP](#9-websocket-vs-tcp)
10. [WebSocket vs Socket.IO](#10-websocket-vs-socketio)
11. [WebSocket Architecture](#11-websocket-architecture)
12. [WebSocket Connection Lifecycle](#12-websocket-connection-lifecycle)
13. [WebSocket Handshake](#13-websocket-handshake)
14. [HTTP Upgrade](#14-http-upgrade)
15. [Sec-WebSocket-Key](#15-sec-websocket-key)
16. [Sec-WebSocket-Accept](#16-sec-websocket-accept)
17. [WebSocket URL](#17-websocket-url)
18. [ws and wss](#18-ws-and-wss)
19. [Browser WebSocket API](#19-browser-websocket-api)
20. [Creating a WebSocket Connection](#20-creating-a-websocket-connection)
21. [open Event](#21-open-event)
22. [message Event](#22-message-event)
23. [error Event](#23-error-event)
24. [close Event](#24-close-event)
25. [Sending Data](#25-sending-data)
26. [Receiving Data](#26-receiving-data)
27. [Text Messages](#27-text-messages)
28. [JSON Messages](#28-json-messages)
29. [Binary Data](#29-binary-data)
30. [ArrayBuffer](#30-arraybuffer)
31. [Blob](#31-blob)
32. [WebSocket readyState](#32-websocket-readystate)
33. [WebSocket close](#33-websocket-close)
34. [Close Codes](#34-close-codes)
35. [Ping and Pong](#35-ping-and-pong)
36. [Heartbeats](#36-heartbeats)
37. [Dead Connections](#37-dead-connections)
38. [Half-Open Connections](#38-half-open-connections)
39. [Connection Timeout](#39-connection-timeout)
40. [Reconnection](#40-reconnection)
41. [Exponential Backoff](#41-exponential-backoff)
42. [Backpressure](#42-backpressure)
43. [Message Ordering](#43-message-ordering)
44. [Message Delivery](#44-message-delivery)
45. [At-Most-Once Delivery](#45-at-most-once-delivery)
46. [At-Least-Once Delivery](#46-at-least-once-delivery)
47. [Exactly-Once Semantics](#47-exactly-once-semantics)
48. [Message IDs](#48-message-ids)
49. [Idempotency](#49-idempotency)
50. [Authentication](#50-authentication)
51. [Authorization](#51-authorization)
52. [Cookies with WebSocket](#52-cookies-with-websocket)
53. [WebSocket Security](#53-websocket-security)
54. [Origin Validation](#54-origin-validation)
55. [CSRF Considerations](#55-csrf-considerations)
56. [Rate Limiting](#56-rate-limiting)
57. [Input Validation](#57-input-validation)
58. [Message Size Limits](#58-message-size-limits)
59. [Connection Limits](#59-connection-limits)
60. [Broadcasting](#60-broadcasting)
61. [Rooms](#61-rooms)
62. [Presence](#62-presence)
63. [Typing Indicators](#63-typing-indicators)
64. [Read Receipts](#64-read-receipts)
65. [Notifications](#65-notifications)
66. [WebSocket and MongoDB](#66-websocket-and-mongodb)
67. [WebSocket and HTTP Together](#67-websocket-and-http-together)
68. [Chat Message Architecture](#68-chat-message-architecture)
69. [Optimistic UI](#69-optimistic-ui)
70. [Message Acknowledgement](#70-message-acknowledgement)
71. [Connection Recovery](#71-connection-recovery)
72. [Offline Messages](#72-offline-messages)
73. [Scaling WebSocket](#73-scaling-websocket)
74. [Multiple Server Problem](#74-multiple-server-problem)
75. [Pub/Sub](#75-pubsub)
76. [Sticky Sessions](#76-sticky-sessions)
77. [Load Balancer](#77-load-balancer)
78. [WebSocket Behind Reverse Proxy](#78-websocket-behind-reverse-proxy)
79. [Horizontal Scaling](#79-horizontal-scaling)
80. [Memory Management](#80-memory-management)
81. [Connection Cleanup](#81-connection-cleanup)
82. [Observability](#82-observability)
83. [Logging](#83-logging)
84. [Metrics](#84-metrics)
85. [Debugging](#85-debugging)
86. [Common WebSocket Errors](#86-common-websocket-errors)
87. [Common Architecture Mistakes](#87-common-architecture-mistakes)
88. [Production Checklist](#88-production-checklist)
89. [WebSocket Mental Model](#89-websocket-mental-model)
90. [Mastery Checklist](#90-mastery-checklist)

---

# 1. WebSocket Kya Hai?

WebSocket ek communication protocol hai jo client aur server ke beech **persistent, two-way communication channel** establish karta hai.

Simple language mein:

> HTTP mein client request karta hai aur server response deta hai.

Lekin WebSocket connection establish hone ke baad:

> **Client bhi kabhi bhi message bhej sakta hai aur server bhi kabhi bhi message bhej sakta hai.**

Example:

```text
HTTP

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

WebSocket:

```text
Client
  │
  │◄──────────────►│
  │                │
  │  Persistent    │
  │  Connection    │
  │                │
  │◄──────────────►│
  │                │
Server
```

Yahi real-time communication ki foundation hai.

---

# 2. Real-Time Communication Kya Hai?

Real-time ka matlab hai:

> Data available hote hi doosri side tak minimum practical delay ke saath pahunchana.

Example:

User A:

```text
"Hello"
```

send karta hai.

User B ko manually refresh nahi karna padta.

```text
User A
  │
  │ Hello
  ▼
Server
  │
  │ Hello
  ▼
User B
```

Isi type ka system hum apni chat application mein banayenge.

---

# 3. HTTP Se Problem Kya Hai?

HTTP request/response model mein server normally client ko tab tak data nahi bhejta jab tak client request na kare.

Example:

```text
Client
  │
  │ Anything new?
  ▼
Server
  │
  │ No
  ▼
Client
```

Phir:

```text
Client
  │
  │ Anything new?
  ▼
Server
  │
  │ No
  ▼
Client
```

Aur phir:

```text
Client
  │
  │ Anything new?
  ▼
Server
  │
  │ YES!
  ▼
Client
```

Ye approach inefficient ho sakti hai.

---

# 4. Polling

Polling mein client fixed interval par server se poochta rehta hai:

> "Kuch naya hai?"

Example:

```text
Every 1 second:

Client → Server
Client ← Server

Client → Server
Client ← Server

Client → Server
Client ← Server
```

Agar 10,000 users hain to bahut saare unnecessary requests ho sakte hain.

---

# 5. Long Polling

Long polling mein client request bhejta hai aur server response immediately nahi deta.

Server wait karta hai.

```text
Client
  │
  │ Request
  ▼
Server
  │
  │ wait...
  │
  │ wait...
  │
  │ New message!
  ▼
Client
```

Phir client dobara request karta hai.

Ye polling se better ho sakta hai, lekin still request lifecycle based hai.

---

# 6. WebSocket Ki Need

Chat application mein humein chahiye:

```text
Instant messages
Typing indicators
Online status
Read receipts
Notifications
Live updates
```

Har event ke liye client ko repeatedly request karna ideal nahi hai.

Humein ek persistent connection chahiye.

Yahi WebSocket provide karta hai.

---

# 7. WebSocket Ka Core Idea

WebSocket ka core idea:

```text
Connection establish karo
        ↓
Connection open rakho
        ↓
Client ↔ Server freely communicate karein
        ↓
Kaam complete hone par connection close karo
```

Example:

```text
Browser
   │
   │ Connect
   ▼
WebSocket Server
   │
   │ Connection remains open
   │
   ├──────────────► Message
   │
   ◄────────────── Message
   │
   ├──────────────► Typing
   │
   ◄────────────── Read Receipt
   │
   ▼
Close
```

---

# 8. WebSocket vs HTTP

| Feature                  | HTTP                      | WebSocket              |
| ------------------------ | ------------------------- | ---------------------- |
| Communication            | Request/Response          | Two-way                |
| Connection               | Usually request lifecycle | Persistent             |
| Server can initiate data | Normally no               | Yes                    |
| Real-time                | Not native                | Yes                    |
| Typical use              | REST APIs                 | Chat/live systems      |
| Connection               | Repeated requests         | Long-lived             |
| Overhead                 | Request/response headers  | Lower after connection |

Important:

> WebSocket HTTP ka replacement nahi hai.

Dono ko ek application mein saath use kiya ja sakta hai.

---

# 9. WebSocket vs TCP

Ye distinction bahut important hai.

TCP ek **transport-layer protocol** hai.

WebSocket ek **application-layer protocol** hai.

Conceptually:

```text
Application
     │
 WebSocket
     │
    TCP
     │
    IP
     │
 Network
```

TCP ka kaam reliable byte stream provide karna hai.

WebSocket TCP ke upar message-oriented communication ka protocol provide karta hai.

---

# 10. WebSocket vs Socket.IO

Ye confusion bilkul nahi hona chahiye.

```text
WebSocket
   ↓
Protocol / Web API

Socket.IO
   ↓
Real-time communication library
```

Socket.IO mein features milte hain jaise:

* Event-based API
* Reconnection
* Rooms
* Namespaces
* Acknowledgements
* Broadcasting
* Fallback transports

Isliye:

> **Socket.IO aur WebSocket same cheez nahi hain.**

---

# 11. WebSocket Architecture

Basic architecture:

```text
┌────────────────┐
│    Browser     │
│                │
│ WebSocket API  │
└───────┬────────┘
        │
        │ WebSocket
        │ Connection
        ▼
┌────────────────┐
│ WebSocket      │
│ Server         │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Application    │
│ Logic          │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ MongoDB        │
└────────────────┘
```

---

# 12. WebSocket Connection Lifecycle

Ek WebSocket connection ke major states:

```text
CONNECTING
    ↓
OPEN
    ↓
COMMUNICATION
    ↓
CLOSING
    ↓
CLOSED
```

Detailed:

```text
Client
  │
  │ Handshake
  ▼
Server
  │
  │ Accept
  ▼
OPEN
  │
  ├── Send
  ├── Receive
  ├── Send
  └── Receive
  │
  ▼
CLOSE
```

---

# 13. WebSocket Handshake

WebSocket connection normally HTTP-based handshake se start hota hai.

Client server ko request bhejta hai:

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: random-value
Sec-WebSocket-Version: 13
```

Server agar accept karta hai:

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: generated-value
```

Ab connection WebSocket protocol mein switch ho jata hai.

---

# 14. HTTP Upgrade

Handshake ka central concept:

```http
Upgrade: websocket
```

Client basically server se keh raha hai:

> "Kya hum current HTTP connection ko WebSocket protocol mein upgrade kar sakte hain?"

Server:

```http
101 Switching Protocols
```

return karke agree karta hai.

---

# 15. `101 Switching Protocols`

`101` status code ka meaning:

> Server client ke protocol switch request ko accept kar raha hai.

Flow:

```text
HTTP
 │
 │ Upgrade request
 ▼
Server
 │
 │ 101 Switching Protocols
 ▼
WebSocket
```

Ye HTTP aur WebSocket ke relation ko samajhne ke liye extremely important concept hai.

---

# 16. `Sec-WebSocket-Key`

Client handshake mein ek random value bhejta hai:

```http
Sec-WebSocket-Key: ...
```

Ye server ko protocol handshake validate karne mein help karti hai.

Server is value ko WebSocket protocol ke defined process ke through process karta hai aur `Sec-WebSocket-Accept` generate karta hai.

---

# 17. `Sec-WebSocket-Accept`

Server response mein:

```http
Sec-WebSocket-Accept: ...
```

bhejta hai.

Ye handshake validation ka part hai.

Important:

> Ye user authentication token nahi hai.

Authentication alag concern hai.

---

# 18. WebSocket URL

WebSocket URLs ke liye:

```text
ws://
```

aur secure version:

```text
wss://
```

use hota hai.

Example:

```text
ws://localhost:5000
```

Production:

```text
wss://chat.example.com
```

---

# 19. `ws` and `wss`

Simple comparison:

| Scheme   | Meaning          | Security              |
| -------- | ---------------- | --------------------- |
| `ws://`  | WebSocket        | Unencrypted transport |
| `wss://` | WebSocket Secure | TLS encrypted         |

Production mein generally:

```text
wss://
```

use karna chahiye.

---

# 20. Browser WebSocket API

Browser mein native WebSocket API available hoti hai.

Basic shape:

```javascript
const socket = new WebSocket(
  "ws://localhost:5000"
);
```

Ab:

```text
socket
```

WebSocket connection ko represent karta hai.

---

# 21. Creating a WebSocket Connection

Example:

```javascript
const socket = new WebSocket(
  "ws://localhost:5000"
);
```

Connection initially:

```text
CONNECTING
```

state mein ho sakta hai.

Server accept karne ke baad:

```text
OPEN
```

ho jata hai.

---

# 22. `open` Event

Connection successfully establish hone par:

```javascript
socket.addEventListener("open", () => {
  console.log("Connected");
});
```

Iska matlab:

> Ab hum data send kar sakte hain.

---

# 23. `message` Event

Server se message aane par:

```javascript
socket.addEventListener("message", (event) => {
  console.log(event.data);
});
```

Example:

```text
Server
  │
  │ "Hello"
  ▼
Browser
  │
  ▼
message event
```

---

# 24. `error` Event

Connection mein error hone par:

```javascript
socket.addEventListener("error", (error) => {
  console.error(error);
});
```

Important:

> Error event aur close event alag concepts hain.

Error ke baad connection close bhi ho sakta hai.

---

# 25. `close` Event

Connection close hone par:

```javascript
socket.addEventListener("close", (event) => {
  console.log(event.code);
  console.log(event.reason);
});
```

Useful information:

```text
code
reason
wasClean
```

---

# 26. Sending Data

Connection open hone ke baad:

```javascript
socket.send("Hello");
```

Example:

```javascript
socket.addEventListener("open", () => {
  socket.send("Hello Server");
});
```

Important:

> `send()` connection open hone se pehle safely use nahi kiya ja sakta.

---

# 27. Receiving Data

Server se:

```text
Hello Client
```

aata hai.

Browser:

```javascript
socket.addEventListener("message", (event) => {
  console.log(event.data);
});
```

`event.data` received data hota hai.

---

# 28. Text Messages

WebSocket text data bhej sakta hai.

Example:

```javascript
socket.send("Hello");
```

Server ko text message receive hoga.

---

# 29. JSON Messages

Real applications mein hum usually structured messages bhejna chahenge.

Example:

```javascript
socket.send(
  JSON.stringify({
    type: "message",
    text: "Hello"
  })
);
```

Server receive karega:

```text
{
  "type": "message",
  "text": "Hello"
}
```

---

# 30. JSON Parse

Received JSON:

```javascript
socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  console.log(data.type);
});
```

Typical flow:

```text
Object
  ↓
JSON.stringify()
  ↓
String
  ↓
WebSocket
  ↓
JSON.parse()
  ↓
Object
```

---

# 31. Message Envelope

Production application mein raw text ke bajaye structured message envelope useful hota hai.

Example:

```json
{
  "type": "chat.message",
  "requestId": "req_123",
  "payload": {
    "conversationId": "conv_123",
    "text": "Hello"
  }
}
```

Isse server ko pata chal sakta hai:

```text
type
 ↓
Kis event ka message hai?

payload
 ↓
Us event ka actual data
```

---

# 32. Event Types

Chat app mein examples:

```text
message.send
message.new
message.read
message.delete

typing.start
typing.stop

presence.online
presence.offline

conversation.join
conversation.leave
```

Ye naming convention Socket.IO mein bhi useful rahega.

---

# 33. Binary Data

WebSocket sirf text tak limited nahi hai.

Binary data bhi send kiya ja sakta hai.

Useful for:

* Images
* Audio
* Video
* Files
* Binary protocols

Lekin chat application mein large file transfers ko separate HTTP upload system se handle karna often better architecture hota hai.

---

# 34. ArrayBuffer

Browser WebSocket binary data ko `ArrayBuffer` ke form mein handle kar sakta hai.

Conceptually:

```text
Binary Data
    ↓
ArrayBuffer
    ↓
Application processing
```

---

# 35. Blob

Browser binary response ko `Blob` ke form mein bhi handle kar sakta hai.

Example:

```javascript
socket.binaryType = "blob";
```

Use-case:

```text
Server
  ↓
Binary data
  ↓
Blob
  ↓
Browser
```

---

# 36. WebSocket `readyState`

WebSocket ke four important states hote hain:

```text
CONNECTING = 0
OPEN       = 1
CLOSING    = 2
CLOSED     = 3
```

Conceptually:

```text
0 → Connecting
1 → Open
2 → Closing
3 → Closed
```

Example:

```javascript
if (socket.readyState === WebSocket.OPEN) {
  socket.send("Hello");
}
```

---

# 37. WebSocket Close

Connection close karne ke liye:

```javascript
socket.close();
```

Optional close code aur reason:

```javascript
socket.close(
  1000,
  "User logged out"
);
```

---

# 38. Close Codes

Important close codes:

| Code | Meaning                     |
| ---: | --------------------------- |
| 1000 | Normal Closure              |
| 1001 | Going Away                  |
| 1002 | Protocol Error              |
| 1003 | Unsupported Data            |
| 1007 | Invalid Payload             |
| 1008 | Policy Violation            |
| 1009 | Message Too Big             |
| 1011 | Unexpected Server Condition |

Application-specific close codes usually:

```text
4000–4999
```

range mein use kiye ja sakte hain, depending on implementation.

---

# 39. Ping and Pong

WebSocket protocol control frames mein:

```text
Ping
Pong
```

important hain.

Conceptually:

```text
Client
  │
  │ Ping
  ▼
Server
  │
  │ Pong
  ▼
Client
```

Ye connection liveness check karne mein useful hote hain.

---

# 40. Heartbeats

Real production systems mein humein pata hona chahiye:

> Connection actually alive hai ya sirf TCP/socket state mein open dikh raha hai?

Heartbeat mechanism help karta hai.

Conceptually:

```text
Server
  │
  │ Ping
  ▼
Client
  │
  │ Pong
  ▼
Server
```

Agar expected response nahi aata:

```text
Connection
    ↓
Possibly dead
    ↓
Terminate
```

---

# 41. Dead Connections

Network failures interesting problem create kar sakte hain.

For example:

```text
Client
  │
  │ WebSocket OPEN
  │
  X
Network disappears
```

Application ko immediately pata nahi chal sakta ki remote peer actually unavailable hai.

Isliye:

* Heartbeats
* Timeouts
* TCP behavior
* Application-level detection

important ho jate hain.

---

# 42. Half-Open Connections

Ek side ko lag sakta hai:

```text
Connection = OPEN
```

lekin doosri side actually reachable nahi ho.

Is type ki state ko detect karne ke liye heartbeat/timeout strategies use ki ja sakti hain.

---

# 43. Connection Timeout

Connection establish karte waqt timeout useful hai.

Example:

```text
Connect
  ↓
Wait
  ↓
Timeout
  ↓
Connection failed
```

Client UX:

```text
Connecting...
```

ke baad:

```text
Unable to connect
Retrying...
```

---

# 44. Reconnection

Real-world networks unstable hote hain.

Connection close ho sakta hai because:

* Wi-Fi lost
* Mobile network changed
* Server restart
* Laptop sleep
* Proxy timeout
* Load balancer reset

Isliye client ko reconnect strategy chahiye.

```text
Connected
   ↓
Disconnected
   ↓
Retry
   ↓
Connected
```

---

# 45. Exponential Backoff

Agar server unavailable hai to client immediately continuously reconnect nahi karna chahiye.

Bad:

```text
retry
retry
retry
retry
retry
retry
```

Better:

```text
1 sec
2 sec
4 sec
8 sec
16 sec
...
```

Isse server par unnecessary pressure reduce hota hai.

---

# 46. Jitter

Agar millions clients same time reconnect karein:

```text
Server down
   ↓
Server comes back
   ↓
Millions reconnect simultaneously
```

Ye **thundering herd** problem create kar sakta hai.

Random jitter add karke retry timing spread ki ja sakti hai.

Conceptually:

```text
base delay + random jitter
```

---

# 47. Backpressure

Backpressure ka matlab:

> Producer data faster produce kar raha hai than consumer process kar pa raha hai.

Example:

```text
Producer
  │
  │ 10,000 messages/sec
  ▼
Consumer
  │
  │ can process 1,000/sec
```

Queue grow karegi.

WebSocket applications mein:

* Slow clients
* Large messages
* High-frequency events

backpressure issues create kar sakte hain.

---

# 48. Slow Client Problem

Suppose server:

```text
100 messages/sec
```

bhejna chahta hai.

Client sirf:

```text
10 messages/sec
```

process kar pa raha hai.

To:

```text
Server
  ↓↓↓↓↓↓↓↓↓
Network
  ↓
Slow Client
```

buffer/memory pressure ho sakta hai.

Production system ko:

* message limits
* queue limits
* disconnect policies
* batching
* throttling

consider karna pad sakta hai.

---

# 49. Message Ordering

Chat application mein message order important hai.

Suppose:

```text
Message A
Message B
Message C
```

User ko:

```text
A
B
C
```

dikhna chahiye.

Lekin distributed systems mein ordering automatically globally guaranteed nahi hoti.

---

# 50. Message IDs

Har message ko unique ID dena useful hai.

Example:

```json
{
  "messageId": "msg_123",
  "conversationId": "conv_123",
  "senderId": "user_1",
  "text": "Hello"
}
```

Message ID help karta hai:

* Deduplication
* Acknowledgement
* Retry
* Tracking
* Debugging

---

# 51. Message Delivery

Real-time systems mein delivery semantics important hain.

Common models:

```text
At-most-once
At-least-once
Exactly-once
```

---

# 52. At-Most-Once Delivery

Meaning:

> Message zero ya one time deliver ho sakta hai.

Failure:

```text
Message
  ↓
Network failure
  ↓
Lost
```

Retry nahi kiya.

Benefit:

* Simple
* No duplicate handling

Problem:

* Message loss possible

---

# 53. At-Least-Once Delivery

Meaning:

> Message eventually deliver karne ki koshish hogi, lekin duplicate aa sakta hai.

Example:

```text
Message
  ↓
Server
  ↓
Client
  X
ACK lost
  ↓
Server retries
  ↓
Client receives again
```

Client ko duplicate detect karna padega.

---

# 54. Exactly-Once Semantics

Exactly-once ka claim distributed systems mein deceptively difficult hai.

Network unreliable hai.

Process crash ho sakta hai.

ACK lost ho sakta hai.

Isliye practical systems often use:

```text
At-least-once delivery
+
Idempotency
+
Unique message IDs
```

to achieve **effectively-once processing** for important operations.

---

# 55. Idempotency

Suppose client same message request dobara bhej deta hai:

```text
requestId = req_123
```

Server check kar sakta hai:

```text
Already processed req_123?
```

Agar yes:

```text
Don't create duplicate.
Return previous result.
```

---

# 56. Message Acknowledgement

Client message send karta hai:

```json
{
  "type": "message.send",
  "requestId": "req_123",
  "payload": {
    "conversationId": "conv_1",
    "text": "Hello"
  }
}
```

Server process karta hai:

```text
MongoDB
   ↓
Message created
```

Server acknowledgement bhej sakta hai:

```json
{
  "type": "message.ack",
  "requestId": "req_123",
  "payload": {
    "messageId": "msg_123"
  }
}
```

Client ko pata chal gaya:

> Message successfully processed.

---

# 57. Chat Message Architecture

Hamari application mein conceptual flow:

```text
User A
  │
  │ Send message
  ▼
WebSocket Server
  │
  ├── Authenticate
  ├── Authorize
  ├── Validate
  ├── Persist
  └── Broadcast
  │
  ├───────────────► User A
  │
  └───────────────► User B
```

---

# 58. Important Rule: Persist Before Broadcast

A reliable chat architecture mein generally:

```text
Receive message
      ↓
Validate
      ↓
Authorize
      ↓
Save to MongoDB
      ↓
Broadcast event
```

Why?

Agar pehle broadcast kar diya:

```text
Broadcast
   ↓
MongoDB save failed
```

to users ko aisa message dikh sakta hai jo database mein exist hi nahi karta.

---

# 59. MongoDB and WebSocket

WebSocket khud data persist nahi karta.

WebSocket:

```text
Communication
```

MongoDB:

```text
Persistence
```

Isliye:

```text
WebSocket
    ↓
Message received
    ↓
Service
    ↓
MongoDB
```

---

# 60. WebSocket and HTTP Together

Hamari architecture:

```text
                 Chat App
                    │
          ┌─────────┴─────────┐
          │                   │
         HTTP              WebSocket
          │                   │
          ▼                   ▼
      Express API        Real-time Server
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                 Services
                    │
                    ▼
                 MongoDB
```

HTTP:

```text
Login
Register
Profile
Search
History
Upload
```

WebSocket:

```text
Message events
Typing
Presence
Read receipts
Notifications
```

---

# 61. Broadcasting

Broadcasting ka matlab:

> Ek event ko multiple connected clients tak bhejna.

Example:

```text
Server
  │
  ├──────► User A
  ├──────► User B
  ├──────► User C
  └──────► User D
```

Chat room ke context mein:

```text
Conversation #123
      │
      ├── User A
      ├── User B
      └── User C
```

New message:

```text
Server
  │
  ├──► A
  ├──► B
  └──► C
```

---

# 62. Rooms

Chat application mein rooms extremely useful hain.

Example:

```text
Room: conversation_123
```

Members:

```text
User A
User B
User C
```

Server event:

```text
send to conversation_123
```

sirf us conversation ke users ko receive hoga.

---

# 63. Presence

Presence ka matlab:

```text
Online
Offline
Away
```

Example:

```text
User A connected
      ↓
presence.online
      ↓
Friends receive update
```

---

# 64. Presence Is Not Just a Boolean

Production system mein:

```text
online = true
```

rakhna enough nahi ho sakta.

User ke multiple connections ho sakte hain:

```text
Laptop
Phone
Tablet
```

Example:

```text
User A
 ├── Laptop connection
 └── Mobile connection
```

Laptop disconnect hua:

```text
One connection gone
```

User necessarily offline nahi hua.

Correct model:

```text
activeConnections = 1
```

Tabhi:

```text
activeConnections = 0
```

hone par offline mark karo.

---

# 65. Typing Indicators

Typing event generally high-frequency hota hai.

Example:

```text
typing.start
typing.stop
```

Important:

> Har keystroke par database write nahi karna chahiye.

Bad:

```text
H → DB
He → DB
Hel → DB
Hell → DB
Hello → DB
```

Better:

```text
typing.start
   ↓
debounce/throttle
   ↓
typing.stop
```

Typing indicators ephemeral events hain.

---

# 66. Read Receipts

Example:

```text
message.sent
message.delivered
message.read
```

Conceptually:

```text
Sent
 ↓
Delivered
 ↓
Read
```

Read state ko MongoDB mein persist kiya ja sakta hai, depending on product requirements.

---

# 67. Notifications

Real-time notification:

```json
{
  "type": "notification.new",
  "payload": {
    "title": "New Message",
    "conversationId": "conv_123"
  }
}
```

WebSocket connected user ko immediately notify kar sakta hai.

Offline users ke liye:

* database persistence
* push notification
* email
* later sync

alag mechanisms ho sakte hain.

---

# 68. Authentication with WebSocket

WebSocket connection ko authenticate karna important hai.

Possible mechanisms:

```text
Cookie
Token
Session
Handshake authentication
```

Hamari application mein HTTP authentication aur WebSocket authentication ko consistent rakhna important hoga.

---

# 69. Cookies with WebSocket

Agar browser aur server same appropriate site context mein hain, WebSocket handshake mein cookies automatically participate kar sakti hain according to browser cookie rules.

Conceptually:

```text
Browser
  │
  │ WebSocket handshake
  │ Cookie
  ▼
Server
  │
  │ Verify authentication
  ▼
WebSocket connection
```

---

# 70. Authentication ≠ Authorization

Connection authenticated hone ka matlab ye nahi:

> User har conversation access kar sakta hai.

Example:

```text
User authenticated
        ↓
Join conversation 123
        ↓
Is user member of conversation 123?
        ↓
YES → allow
NO  → reject
```

Ye authorization hai.

---

# 71. WebSocket Security

Real-time connections ko secure karna equally important hai.

Important areas:

```text
Authentication
Authorization
Origin validation
Input validation
Rate limiting
Message size limits
Connection limits
Abuse detection
TLS
```

---

# 72. Origin Validation

Browser WebSocket handshake mein `Origin` header important security signal ho sakta hai.

Server trusted origins define kar sakta hai:

```text
https://chat.example.com
```

Unknown origins ko reject kiya ja sakta hai according to application security requirements.

---

# 73. CSRF Considerations

Agar authentication cookies ke through ho rahi hai, WebSocket handshake security ko casually ignore nahi karna chahiye.

Especially:

```text
Cookie-based authentication
+
Browser
+
Cross-origin connection
```

ke case mein origin validation aur proper cookie configuration important hai.

---

# 74. Input Validation

Never trust WebSocket messages.

Client send kar sakta hai:

```json
{
  "type": "message.send",
  "payload": {
    "text": "..."
  }
}
```

Server ko validate karna chahiye:

```text
type valid?
payload object?
conversationId valid?
text string?
text length allowed?
user authorized?
```

---

# 75. Message Size Limits

Malicious client bahut large message bhej sakta hai.

Example:

```text
1 KB
10 KB
100 KB
10 MB
100 MB
```

Application ko appropriate maximum message size define karna chahiye.

For example:

```text
Chat text:
reasonable size limit

Files:
HTTP upload system
```

---

# 76. Connection Limits

Ek user:

```text
10,000 WebSocket connections
```

open karne ki koshish kare to problem ho sakti hai.

System ko consider karna chahiye:

```text
Per-user connection limit
Per-IP rate limit
Authentication rate limit
Server-wide connection capacity
```

---

# 77. WebSocket vs HTTP File Upload

Large files ke liye generally:

```text
HTTP Upload
    ↓
Storage
    ↓
WebSocket Event
```

better pattern ho sakta hai.

Example:

```text
User uploads image
       ↓
POST /api/uploads
       ↓
Storage
       ↓
Image URL
       ↓
WebSocket message
       ↓
Other user
```

Instead of sending giant files through the real-time message channel.

---

# 78. Optimistic UI

Chat application mein user message type karta hai:

```text
Hello
```

Send press karte hi UI immediately message dikha sakti hai:

```text
Hello   Sending...
```

Server confirms:

```text
Hello   Sent
```

Flow:

```text
User
 ↓
UI immediately updates
 ↓
WebSocket send
 ↓
Server
 ↓
MongoDB
 ↓
ACK
 ↓
UI confirmed
```

Isse application fast feel hoti hai.

---

# 79. Message States

A message ke states ho sakte hain:

```text
sending
sent
delivered
read
failed
```

Example:

```text
Hello    sending...
Hello    sent
Hello    delivered
Hello    read
```

Ye states UI ko rich experience provide karte hain.

---

# 80. Connection Recovery

Suppose:

```text
User chatting
     ↓
Internet disconnected
     ↓
WebSocket closed
```

Reconnect ke baad client ko ye jaanana padega:

> Disconnect ke time kya miss hua?

Solution:

```text
Last received message ID
```

store kar sakte hain.

Reconnect:

```text
I have received up to:
msg_100
```

Server:

```text
Give me messages after msg_100
```

Then:

```text
msg_101
msg_102
msg_103
```

sync ho sakte hain.

---

# 81. Offline Messages

User offline hai.

User B message send karta hai.

```text
User B
  │
  │ message
  ▼
Server
  │
  ▼
MongoDB
```

User A offline hone ki wajah se WebSocket event receive nahi karta.

Later:

```text
User A connects
       ↓
HTTP / sync
       ↓
MongoDB
       ↓
Missed messages
```

Isliye database source of truth hona chahiye.

---

# 82. WebSocket Is Not Your Database

Ye rule yaad rakho:

> **Socket connection temporary hai. Database permanent state rakhta hai.**

Connection close ho gaya:

```text
WebSocket ❌
```

Data:

```text
MongoDB ✅
```

rehna chahiye.

---

# 83. Multiple Server Problem

Ab maan lo hamara server ek nahi hai.

```text
          Load Balancer
          /           \
         /             \
    Server A         Server B
```

User A connected:

```text
Server A
```

User B connected:

```text
Server B
```

User A message send karta hai.

Server A ko User B tak event pahunchana hai.

Problem:

```text
Server A
   X
Server B
```

Server A ke local memory mein User B ki connection information nahi hai.

---

# 84. Horizontal Scaling

Multiple instances:

```text
          Load Balancer
         /      |      \
        /       |       \
      S1       S2       S3
```

WebSocket connections distributed hain.

Ab servers ko ek doosre ke saath events share karne pad sakte hain.

---

# 85. Pub/Sub

Pub/Sub ka concept:

```text
Publisher
    ↓
Message Broker
    ↓
Subscribers
```

Example:

```text
Server A
   │
   │ publish
   ▼
Redis
   │
   ├────► Server B
   └────► Server C
```

Server B aur C relevant connected clients ko event forward kar sakte hain.

---

# 86. Sticky Sessions

Some architectures use sticky sessions.

Meaning:

> Same client ko repeatedly same server instance par route karne ki koshish.

Example:

```text
User A
  ↓
Load Balancer
  ↓
Server A
```

Future connections/requests:

```text
User A
  ↓
Server A
```

But sticky sessions alone distributed real-time state problem ka complete solution nahi hain.

---

# 87. Better Scalable Model

Large systems mein:

```text
Client
  │
  ▼
Load Balancer
  │
  ├── Server A
  ├── Server B
  └── Server C
        │
        ▼
     Pub/Sub
        │
        ▼
   Shared State
```

Application requirements ke according Redis jaise infrastructure components use kiye ja sakte hain.

---

# 88. Load Balancer

Production WebSocket deployment mein load balancer ko WebSocket upgrade support karna chahiye.

Conceptually:

```text
Browser
  │
  │ WSS
  ▼
Load Balancer
  │
  │ Upgrade
  ▼
WebSocket Server
```

Misconfiguration se handshake fail ho sakta hai.

---

# 89. Reverse Proxy

Nginx jaise reverse proxy ke through:

```text
Internet
   │
   ▼
Nginx
   │
   ├── HTTP → Express
   │
   └── WebSocket → WebSocket Server
```

WebSocket upgrade headers correctly forward karna important hota hai.

---

# 90. Connection Cleanup

Connection close hone par server ko cleanup karna chahiye.

Example:

```text
socket
   ↓
user mapping
   ↓
room membership
   ↓
presence state
```

Disconnect:

```text
socket disconnected
       ↓
remove socket
       ↓
update presence
       ↓
leave rooms
       ↓
cleanup memory
```

---

# 91. Memory Management

Agar server memory mein:

```text
socket → user
socket → room
socket → metadata
```

store karta hai, to disconnected sockets ko remove karna important hai.

Otherwise:

```text
Connections increase
       ↓
Memory increases
       ↓
Memory leak
       ↓
Server crash
```

---

# 92. Observability

Production real-time systems mein sirf logs enough nahi hote.

Important metrics:

```text
Active connections
Connection rate
Disconnect rate
Messages/sec
Message latency
Error rate
Reconnect rate
Memory usage
CPU usage
Event loop lag
```

---

# 93. Logging

Useful log:

```text
2026-08-11
user=123
event=message.send
conversation=456
message=789
```

Avoid logging sensitive information such as:

```text
passwords
tokens
private secrets
```

---

# 94. Message Latency

Real-time system mein latency important metric hai.

Example:

```text
Client sends at:
10:00:00.000

Server receives:
10:00:00.050

Other client receives:
10:00:00.080
```

Approximate delivery latency:

```text
80ms
```

Message timestamps and IDs debugging ke liye useful hote hain.

---

# 95. Common WebSocket Errors

Common problems:

### Connection refused

```text
Server running nahi hai
```

### Wrong URL

```text
ws://localhost:5000
```

but server actually:

```text
ws://localhost:4000
```

### HTTPS page + insecure WebSocket

```text
https://
```

page se:

```text
ws://
```

use karna browser security issue create kar sakta hai.

Use:

```text
wss://
```

in secure production contexts.

---

# 96. Handshake Failure

Agar handshake correctly configured nahi hai:

```text
HTTP 400
404
426
502
```

jaise errors context ke according appear ho sakte hain.

Debug:

```text
URL
Port
Proxy
Upgrade headers
Server support
TLS
Origin
Authentication
```

---

# 97. Sending Before Open

Bad:

```javascript
const socket = new WebSocket(url);

socket.send("Hello");
```

Connection abhi:

```text
CONNECTING
```

mein ho sakti hai.

Better:

```javascript
socket.addEventListener("open", () => {
  socket.send("Hello");
});
```

---

# 98. JSON Parse Failure

Agar server sends:

```text
Hello
```

aur client blindly:

```javascript
JSON.parse(event.data);
```

kare:

```text
SyntaxError
```

aa sakta hai.

Message protocol clearly define karo.

---

# 99. Common Architecture Mistakes

## Mistake 1 — Everything Through WebSocket

Har operation ko WebSocket se karna:

```text
Login
Search
Upload
History
Settings
```

zaroori nahi.

HTTP + WebSocket hybrid architecture often cleaner hoti hai.

---

## Mistake 2 — Database Mein Typing Indicator Save Karna

Typing events high-frequency hote hain.

Avoid unnecessary database writes.

---

## Mistake 3 — Authentication Skip Karna

WebSocket connection open ho gaya iska matlab:

```text
User trusted
```

nahi hota.

---

## Mistake 4 — Authorization Skip Karna

Authenticated user ko har room join karne dena dangerous hai.

---

## Mistake 5 — No Message IDs

Without IDs:

* deduplication difficult
* retries difficult
* debugging difficult
* acknowledgements difficult

---

## Mistake 6 — No Reconnection Strategy

Network disconnect normal hai.

---

## Mistake 7 — No Heartbeat

Dead connections detect karna difficult ho sakta hai.

---

## Mistake 8 — No Limits

Unlimited:

```text
connections
messages
payload size
events
```

dangerous hai.

---

# 100. Production WebSocket Architecture

A mature architecture kuch aisi ho sakti hai:

```text
                         INTERNET
                            │
                            ▼
                     ┌────────────┐
                     │   Client   │
                     └─────┬──────┘
                           │
                    ┌──────┴──────┐
                    │             │
                  HTTPS          WSS
                    │             │
                    ▼             ▼
                ┌─────────────────────┐
                │    Load Balancer    │
                └──────────┬──────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
           ┌───────────┐       ┌───────────┐
           │ Server A  │       │ Server B  │
           └─────┬─────┘       └─────┬─────┘
                 │                   │
                 └─────────┬─────────┘
                           │
                        Pub/Sub
                           │
                           ▼
                      ┌─────────┐
                      │ MongoDB │
                      └─────────┘
```

---

# 101. Our Chat Application Architecture

Hum initially unnecessarily complex infrastructure nahi banayenge.

Development architecture:

```text
                    React
                      │
            ┌─────────┴─────────┐
            │                   │
           HTTP              WebSocket
            │                   │
            ▼                   ▼
        Express API        Socket Server
            │                   │
            └─────────┬─────────┘
                      │
                   Services
                      │
                      ▼
                   MongoDB
```

Later:

```text
Redis / PubSub
Load Balancer
Multiple Servers
```

add karke scale karenge.

---

# 102. Recommended Chat Message Flow

User message:

```text
User types message
       ↓
Client validates basic UI state
       ↓
Generate requestId
       ↓
WebSocket send
       ↓
Server authenticates
       ↓
Server authorizes
       ↓
Server validates
       ↓
MongoDB save
       ↓
Server sends ACK
       ↓
Server broadcasts message
       ↓
Recipients update UI
```

---

# 103. Recommended Message Format

A generic event envelope:

```json
{
  "type": "message.send",
  "requestId": "req_123",
  "payload": {
    "conversationId": "conv_123",
    "text": "Hello"
  }
}
```

Server response:

```json
{
  "type": "message.ack",
  "requestId": "req_123",
  "payload": {
    "messageId": "msg_123",
    "status": "accepted"
  }
}
```

Broadcast:

```json
{
  "type": "message.new",
  "payload": {
    "messageId": "msg_123",
    "conversationId": "conv_123",
    "senderId": "user_1",
    "text": "Hello"
  }
}
```

---

# 104. Event-Based Thinking

Real-time applications ko events ke form mein sochna bahut useful hai.

Instead of:

```text
Do something
```

think:

```text
Something happened
```

Examples:

```text
user.connected
user.disconnected

message.sent
message.created
message.read

typing.started
typing.stopped

conversation.created
conversation.updated
```

---

# 105. Command vs Event

Ye advanced but important distinction hai.

### Command

Client server ko instruction de raha hai:

```text
message.send
```

Meaning:

> Please send this message.

### Event

Server bata raha hai:

```text
message.created
```

Meaning:

> A new message has been created.

Conceptually:

```text
COMMAND
Client → Server

EVENT
Server → Clients
```

---

# 106. Why This Separation Helps

Agar client directly:

```text
message.created
```

send kare, semantics confusing ho sakti hai.

Better:

```text
Client
  ↓
message.send
  ↓
Server
  ↓
Database
  ↓
message.created
  ↓
Clients
```

Server authoritative source ban jata hai.

---

# 107. Server as Source of Truth

Client keh sakta hai:

```text
message.send
```

Lekin server decide karega:

```text
Valid?
Authenticated?
Authorized?
Persisted?
```

Then server event generate karega:

```text
message.created
```

Ye reliable architecture banata hai.

---

# 108. WebSocket State vs Application State

Ye dono alag hain.

### Connection State

```text
CONNECTING
OPEN
CLOSING
CLOSED
```

### Application State

```text
authenticated user
current conversation
online status
typing status
last message
unread count
```

WebSocket connection state ko application state ke saath mix nahi karna chahiye.

---

# 109. Connection Identity

Server ko connection ko user se associate karna padta hai.

Conceptually:

```text
socketId
   ↓
userId
```

Example:

```text
socket_abc → user_123
```

Ek user ke multiple sockets:

```text
user_123
   ├── socket_abc
   ├── socket_def
   └── socket_xyz
```

---

# 110. Conversation Membership

Message receive karte waqt:

```text
conversationId
```

milta hai.

Server ko verify karna chahiye:

```text
Is user member of this conversation?
```

Only then:

```text
process message
```

---

# 111. Security Flow

Complete secure message flow:

```text
WebSocket Message
       ↓
Parse
       ↓
Schema Validation
       ↓
Authentication
       ↓
Authorization
       ↓
Rate Limit
       ↓
Business Logic
       ↓
MongoDB
       ↓
Broadcast
```

Ye production-grade thinking hai.

---

# 112. Reconnection + Synchronization

Suppose:

```text
Last message received = 100
```

Connection lost.

After reconnect:

```text
Client → Server
lastMessageId = 100
```

Server:

```text
Find messages after 100
```

returns:

```text
101
102
103
104
```

Client sync kar leta hai.

---

# 113. Why Database Matters for Recovery

Agar message sirf WebSocket memory mein tha:

```text
Server crashes
   ↓
Message lost
```

Agar MongoDB mein persist hai:

```text
Server crashes
   ↓
Restart
   ↓
MongoDB still has message
```

Isliye persistent state database mein rakho.

---

# 114. WebSocket and Transactions

Suppose message create karte waqt multiple database operations hain:

```text
Create message
Update conversation
Update unread count
```

Data consistency requirements ke according transaction strategy decide karni pad sakti hai.

WebSocket itself transaction mechanism nahi hai.

Database/service layer ko consistency handle karni hoti hai.

---

# 115. Ordering Strategy

Distributed systems mein global ordering difficult ho sakti hai.

Chat conversation ke liye useful fields:

```text
messageId
createdAt
sequenceNumber
```

Depending on requirements, server-generated ordering metadata use kiya ja sakta hai.

---

# 116. Sequence Numbers

Conceptually:

```text
Conversation 123

1 → Hello
2 → How are you?
3 → Fine
4 → Good
```

Agar client ke paas:

```text
lastSequence = 2
```

to next expected:

```text
3
```

hai.

Gap detect ho sakta hai:

```text
2 → 5
```

means:

```text
3,4 missing
```

Then synchronization trigger ki ja sakti hai.

---

# 117. Heartbeat vs Message Activity

Ek active chat message send hona connection activity ka signal ho sakta hai, but application-level message activity ko heartbeat ka complete replacement nahi samajhna chahiye.

Heartbeat ka purpose specifically connection liveness check karna hai.

---

# 118. Throttling

High-frequency events:

```text
typing
cursor movement
presence
```

ko throttle/debounce karna useful hai.

Example:

```text
User types 20 keys/sec
```

Har key:

```text
WebSocket event
```

bhejne ke bajaye:

```text
typing.start
```

aur:

```text
typing.stop
```

send karna better ho sakta hai.

---

# 119. Debouncing

Debounce ka idea:

```text
User typing
User typing
User typing
User typing
        ↓
wait
        ↓
typing stopped
```

Useful for:

```text
typing.stop
search
UI events
```

---

# 120. Throttling

Throttle ka idea:

> Event ko maximum fixed frequency par process karo.

Example:

```text
100 events/sec
```

ko:

```text
10 events/sec
```

tak limit karna.

Useful for:

```text
cursor
presence
high-frequency telemetry
```

---

# 121. WebSocket Protocol vs Application Protocol

Ye advanced distinction yaad rakho.

WebSocket protocol define karta hai:

```text
connection
frames
text
binary
ping
pong
close
```

Lekin hamara application protocol define karega:

```text
message.send
message.created
typing.start
typing.stop
presence.online
```

So:

```text
WebSocket
    ↓
Transport mechanism

Our message protocol
    ↓
Application semantics
```

---

# 122. WebSocket Frames

WebSocket internally data ko frames mein transfer karta hai.

Conceptually:

```text
WebSocket Frame
│
├── FIN
├── Opcode
├── Mask
├── Payload Length
└── Payload
```

Important:

> Browser developer ke roop mein usually tumhe manually frames construct nahi karne padte.

Library/browser WebSocket API ye handle karti hai.

Lekin protocol ko deeply samajhne ke liye frames ka concept important hai.

---

# 123. Frame Opcodes

Common WebSocket opcodes:

```text
0x0 → Continuation
0x1 → Text
0x2 → Binary
0x8 → Close
0x9 → Ping
0xA → Pong
```

Ye low-level protocol details hain.

---

# 124. Fragmentation

Large message ko multiple frames mein fragment kiya ja sakta hai.

Conceptually:

```text
Message
   ↓
Frame 1
Frame 2
Frame 3
   ↓
Reassembled Message
```

Most application developers ko manually fragmentation handle nahi karni padti.

---

# 125. Masking

Client-to-server WebSocket frames browser context mein masking rules follow karte hain.

Purpose protocol security considerations ka part hai.

Server-to-client frames normally same masking behavior use nahi karte.

Important:

> Masking encryption nahi hai.

Encryption ke liye:

```text
wss://
```

use hota hai.

---

# 126. Compression

WebSocket extensions compression support kar sakti hain.

Example:

```text
permessage-deflate
```

Compression bandwidth reduce kar sakti hai.

Lekin compression:

* CPU cost
* memory
* security considerations

introduce kar sakti hai.

Isliye production mein blindly enable nahi karna chahiye.

---

# 127. WebSocket over TLS

Secure architecture:

```text
Browser
   │
   │ WSS
   ▼
TLS
   │
   ▼
WebSocket
   │
   ▼
Application
```

TLS protects data in transit.

---

# 128. WebSocket and Authentication Expiry

JWT/session expire ho sakti hai while socket remains connected.

Example:

```text
Socket connected
      ↓
Token expires
      ↓
Connection still physically alive
```

Application ko decide karna hota hai:

* disconnect user
* re-authenticate
* refresh credentials
* restrict events

Authentication lifecycle carefully design karo.

---

# 129. Token Refresh

Agar HTTP authentication refresh token model use kar raha hai:

```text
Access token expired
       ↓
HTTP refresh endpoint
       ↓
New access token
       ↓
WebSocket authentication state update
```

Exact implementation architecture ke according decide hogi.

---

# 130. Per-Event Authorization

Connection authenticated hone ke baad bhi har event automatically allowed nahi hona chahiye.

Example:

```text
Connected user
     ↓
message.send
     ↓
Check conversation membership
     ↓
Allowed?
```

Similarly:

```text
admin.deleteMessage
```

ke liye role/permission check ho sakta hai.

---

# 131. Error Events

Application protocol mein structured errors define karna useful hai.

Example:

```json
{
  "type": "error",
  "requestId": "req_123",
  "error": {
    "code": "NOT_CONVERSATION_MEMBER",
    "message": "You cannot send messages to this conversation."
  }
}
```

Client predictable handling kar sakta hai.

---

# 132. Request IDs

Request ID:

```text
req_123
```

help karta hai:

```text
Client request
      ↓
Server logs
      ↓
Database operation
      ↓
ACK
```

Sabko correlate karne mein.

Debugging ke liye extremely useful.

---

# 133. Correlation IDs

Large distributed systems mein:

```text
HTTP request
   ↓
Service A
   ↓
Service B
   ↓
Database
```

same correlation ID carry kar sakta hai.

Example:

```text
trace_123
```

Isse distributed debugging easier hoti hai.

---

# 134. Testing WebSocket

Testing layers:

```text
Unit Tests
Integration Tests
WebSocket Protocol Tests
Authentication Tests
Authorization Tests
Reconnect Tests
Load Tests
Failure Tests
```

Important scenarios:

```text
connect
disconnect
reconnect
invalid auth
invalid event
unauthorized room
duplicate message
large payload
slow client
```

---

# 135. Load Testing

Real-time server ke liye sirf:

```text
10 users
```

test karna enough nahi hai.

Load test:

```text
100 connections
1,000 connections
10,000 connections
```

depending on infrastructure.

Measure:

```text
CPU
Memory
Latency
Messages/sec
Disconnects
Errors
```

---

# 136. Failure Testing

Production-ready system ke liye failures simulate karo:

```text
Internet disconnect
Server restart
Database unavailable
Pub/Sub unavailable
Proxy timeout
Client sleep
Duplicate event
Invalid event
Expired authentication
```

System ko graceful behavior define karna chahiye.

---

# 137. WebSocket Master Mental Model

Agar tum WebSocket ko truly samajhna chahte ho, is chain ko yaad rakho:

```text
HTTP
 ↓
Upgrade
 ↓
101 Switching Protocols
 ↓
WebSocket Connection
 ↓
Frames
 ↓
Messages
 ↓
Application Events
 ↓
Authentication
 ↓
Authorization
 ↓
Persistence
 ↓
Broadcast
 ↓
Acknowledgement
 ↓
Reconnect
 ↓
Synchronization
 ↓
Scaling
```

Ye WebSocket ka complete journey hai.

---

# 138. Our Chat Application Event Architecture

Hum eventually kuch is type ke events design karenge:

```text
AUTH
├── session.authenticate
└── session.refresh

CONVERSATION
├── conversation.join
├── conversation.leave
└── conversation.updated

MESSAGE
├── message.send
├── message.created
├── message.ack
├── message.read
├── message.deleted
└── message.failed

TYPING
├── typing.start
└── typing.stop

PRESENCE
├── presence.online
├── presence.offline
└── presence.update

SYSTEM
├── connection.ready
├── error
└── heartbeat
```

Exact event names implementation ke time finalize karenge.

---

# 139. HTTP + WebSocket + MongoDB Final Architecture

```text
                         ┌──────────────┐
                         │ React Client │
                         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                  HTTPS                    WSS
                    │                       │
                    ▼                       ▼
             ┌──────────────┐       ┌──────────────┐
             │ Express API  │       │ WebSocket    │
             │              │       │ Server       │
             └──────┬───────┘       └──────┬───────┘
                    │                      │
                    └──────────┬───────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   Services  │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   MongoDB   │
                        └─────────────┘
```

---

# 140. Development Strategy

Hum WebSocket ko directly huge chat system ke saath nahi banayenge.

Learning order:

```text
01
Basic WebSocket connection
       ↓
02
Client → Server message
       ↓
03
Server → Client message
       ↓
04
JSON events
       ↓
05
Multiple clients
       ↓
06
Broadcast
       ↓
07
Rooms
       ↓
08
Authentication
       ↓
09
MongoDB persistence
       ↓
10
Chat messages
       ↓
11
Typing indicator
       ↓
12
Presence
       ↓
13
Read receipts
       ↓
14
Reconnect
       ↓
15
Message acknowledgement
       ↓
16
Offline synchronization
       ↓
17
Production hardening
```

---

# 141. WebSocket Golden Rules

### Rule 1

> WebSocket is a communication channel, not a database.

### Rule 2

> Authenticate connections.

### Rule 3

> Authorize every sensitive operation.

### Rule 4

> Validate every incoming message.

### Rule 5

> Persist important data.

### Rule 6

> Use unique message IDs.

### Rule 7

> Design for reconnects.

### Rule 8

> Detect dead connections.

### Rule 9

> Limit message size and frequency.

### Rule 10

> Don't assume one server forever.

### Rule 11

> Keep HTTP and WebSocket responsibilities clear.

### Rule 12

> Treat the server as the authority for important state.

---

# 142. WebSocket Mastery Checklist

## Beginner

* [ ] WebSocket kya hai?
* [ ] Real-time communication kya hai?
* [ ] Polling kya hai?
* [ ] Long polling kya hai?
* [ ] HTTP vs WebSocket
* [ ] WebSocket URL
* [ ] `ws://`
* [ ] `wss://`

---

## Intermediate

* [ ] WebSocket handshake
* [ ] HTTP Upgrade
* [ ] 101 Switching Protocols
* [ ] Browser WebSocket API
* [ ] `open`
* [ ] `message`
* [ ] `error`
* [ ] `close`
* [ ] `send()`
* [ ] `readyState`
* [ ] close codes
* [ ] JSON messages

---

## Advanced

* [ ] Ping/Pong
* [ ] Heartbeats
* [ ] Dead connections
* [ ] Reconnection
* [ ] Exponential backoff
* [ ] Jitter
* [ ] Backpressure
* [ ] Message ordering
* [ ] Message IDs
* [ ] Delivery semantics
* [ ] ACKs
* [ ] Idempotency
* [ ] Connection recovery

---

## Security

* [ ] Authentication
* [ ] Authorization
* [ ] Origin validation
* [ ] CSRF considerations
* [ ] Input validation
* [ ] Message limits
* [ ] Connection limits
* [ ] Rate limiting
* [ ] TLS / WSS

---

## Architecture

* [ ] Broadcasting
* [ ] Rooms
* [ ] Presence
* [ ] Typing indicators
* [ ] Read receipts
* [ ] Notifications
* [ ] MongoDB persistence
* [ ] HTTP + WebSocket hybrid architecture
* [ ] Offline synchronization
* [ ] Optimistic UI

---

## Production

* [ ] Reverse proxy
* [ ] Load balancer
* [ ] Horizontal scaling
* [ ] Sticky sessions
* [ ] Pub/Sub
* [ ] Connection cleanup
* [ ] Memory management
* [ ] Logging
* [ ] Metrics
* [ ] Load testing
* [ ] Failure testing
* [ ] Monitoring

---

# 143. Final WebSocket Mental Model

Bhai agar WebSocket ka pura concept ek diagram mein samajhna ho, to ye hai:

```text
                         CLIENT
                           │
                           │
                    HTTP Handshake
                           │
                           ▼
                    ┌─────────────┐
                    │   SERVER    │
                    └──────┬──────┘
                           │
                    101 Switching
                    Protocols
                           │
                           ▼
                  ┌─────────────────┐
                  │ WebSocket Open  │
                  └────────┬────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Client → Server           Server → Client
              │                         │
              ▼                         ▼
       Application Events       Application Events
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                     Authentication
                           │
                           ▼
                     Authorization
                           │
                           ▼
                      Validation
                           │
                           ▼
                       Services
                           │
                           ▼
                        MongoDB
                           │
                           ▼
                       Broadcast
                           │
                           ▼
                       Clients
                           │
                           ▼
                      ACK / Sync
                           │
                           ▼
                     Reconnection
                           │
                           ▼
                     Connection
                       Closed
```

---

# 🧠 The One-Line Definition

Agar koi tumse pooche:

> **WebSocket kya hai?**

To tum simple language mein bol sakte ho:

> **WebSocket ek persistent, full-duplex communication protocol hai jo client aur server ke beech ek long-lived connection establish karta hai, jiske baad dono sides independently data exchange kar sakti hain.**

Aur chat application ke context mein:

> **HTTP humare application ka request/response system handle karega, jabki WebSocket real-time events ko deliver karega. MongoDB permanent application state store karega.**

---

# 🚀 Next Document

Ab WebSocket ka theory foundation complete ho gaya.

Next:

```text
docs/06-socket-io.md
```

Usme hum seekhenge:

```text
WebSocket
    ↓
Socket.IO kyun?
    ↓
Socket.IO architecture
    ↓
Socket.IO Server
    ↓
Socket.IO Client
    ↓
Connection
    ↓
Events
    ↓
emit()
    ↓
on()
    ↓
once()
    ↓
broadcast
    ↓
rooms
    ↓
namespaces
    ↓
acknowledgements
    ↓
middleware
    ↓
authentication
    ↓
reconnection
    ↓
connection state recovery
    ↓
error handling
    ↓
MongoDB integration
    ↓
Real Chat Engine
```

Uske baad hum **theory se actual implementation** ki taraf jayenge.
