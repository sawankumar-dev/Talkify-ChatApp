# Presence System

> **Project:** Real-Time Chat Application
> **Purpose:** User ke online/offline/away/last-seen status ko real-time manage karna
> **Backend:** Node.js + Express.js
> **Database:** MongoDB + Mongoose
> **Real-Time:** WebSocket
> **Authentication:** JWT

---

# Table of Contents

1. [Presence System Kya Hai](#1-presence-system-kya-hai)
2. [Presence vs Last Seen](#2-presence-vs-last-seen)
3. [Presence States](#3-presence-states)
4. [Basic Presence Architecture](#4-basic-presence-architecture)
5. [Connection Flow](#5-connection-flow)
6. [Authentication Flow](#6-authentication-flow)
7. [Online User Flow](#7-online-user-flow)
8. [Offline User Flow](#8-offline-user-flow)
9. [Disconnect Problem](#9-disconnect-problem)
10. [Heartbeat](#10-heartbeat)
11. [Heartbeat Flow](#11-heartbeat-flow)
12. [Ghost Users](#12-ghost-users)
13. [Reconnect Flow](#13-reconnect-flow)
14. [Presence Events](#14-presence-events)
15. [Presence Subscribe](#15-presence-subscribe)
16. [Presence Unsubscribe](#16-presence-unsubscribe)
17. [Presence Broadcasting](#17-presence-broadcasting)
18. [Personal Presence Room](#18-personal-presence-room)
19. [Multiple Devices](#19-multiple-devices)
20. [Multiple Tabs](#20-multiple-tabs)
21. [Away Status](#21-away-status)
22. [Last Seen](#22-last-seen)
23. [MongoDB Design](#23-mongodb-design)
24. [What Should Be Stored](#24-what-should-be-stored)
25. [What Should NOT Be Stored](#25-what-should-not-be-stored)
26. [Presence Manager](#26-presence-manager)
27. [Socket Registry](#27-socket-registry)
28. [Presence State Calculation](#28-presence-state-calculation)
29. [Friend/Conversation Presence](#29-friendconversation-presence)
30. [Privacy](#30-privacy)
31. [Security](#31-security)
32. [Failure Scenarios](#32-failure-scenarios)
33. [Race Conditions](#33-race-conditions)
34. [Scaling](#34-scaling)
35. [Redis Future Architecture](#35-redis-future-architecture)
36. [Complete Presence Flow](#36-complete-presence-flow)
37. [Debugging](#37-debugging)
38. [Implementation Rules](#38-implementation-rules)
39. [Final Mental Model](#39-final-mental-model)

---

# 1. Presence System Kya Hai

Presence ka simple meaning hai:

> **User is waqt available hai ya nahi?**

Chat application mein usually hum dikhate hain:

```text
● Online
○ Offline

Last seen 5 minutes ago
```

Advanced systems:

```text
Online
Away
Busy
Do Not Disturb
Invisible
Offline
```

Hamare initial project mein hum simple rakhenge:

```text
online
offline
away
```

---

# 2. Presence vs Last Seen

Dono same cheez nahi hain.

## Presence

Current state:

```text
online
```

## Last Seen

User last time kab active tha:

```text
lastSeenAt:
2026-08-11T10:30:00.000Z
```

Example:

```text
Rahul
● Online
```

Offline:

```text
Rahul
Last seen 10 minutes ago
```

---

# 3. Presence States

Initial version:

```text
ONLINE
OFFLINE
AWAY
```

---

## 3.1 Online

User ke paas active WebSocket connection hai.

```text
User
 |
 | WebSocket
 v
Server
```

---

## 3.2 Offline

User ke paas koi active connection nahi hai.

```text
User
 |
 X
Server
```

---

## 3.3 Away

User connected hai lekin kuch time se active nahi hai.

Example:

```text
Connected
   |
   | no activity
   v
AWAY
```

---

# 4. Basic Presence Architecture

```text
                  CLIENT
                     |
                     | WebSocket
                     v
              SOCKET SERVER
                     |
                     v
              PRESENCE MANAGER
                     |
          +----------+----------+
          |                     |
          v                     v
   Active Connections        MongoDB
          |                     |
          v                     v
     Online State           Last Seen
```

Important:

> **Real-time presence ke liye har heartbeat par MongoDB update karna avoid karenge.**

---

# 5. Connection Flow

User app open karta hai:

```text
Client
  |
  | WebSocket connect
  v
Socket Server
  |
  | authenticate
  v
Presence Manager
  |
  | register socket
  v
User = ONLINE
```

---

# 5.1 Complete Connection Flow

```text
                   Client
                     |
                     | connect
                     v
              WebSocket Server
                     |
                     v
              Authentication
                     |
                 +---+---+
                 |       |
               FAIL     SUCCESS
                 |       |
                 v       v
               Reject  Register
                         |
                         v
                  Presence Manager
                         |
                         v
                       ONLINE
                         |
                         v
                  presence:update
```

---

# 6. Authentication Flow

Presence system mein authentication mandatory hai.

Server ko pata hona chahiye:

```text
Ye socket kis user ka hai?
```

Example:

```text
socket.userId
```

Authentication successful hone ke baad:

```text
socket.user = authenticatedUser
```

---

# 6.1 Why Authentication First?

Galat architecture:

```text
Socket connect
   ↓
User online
```

Problem:

Server ko pata hi nahi user kaun hai.

Correct:

```text
Socket connect
   ↓
Authenticate
   ↓
Identify user
   ↓
Mark online
```

---

# 7. Online User Flow

Suppose Rahul app open karta hai.

```text
Rahul
  |
  | WebSocket connection
  v
Server
  |
  | userId = Rahul
  v
Presence Manager
  |
  v
ONLINE
```

Then:

```text
presence:update
```

broadcast kiya ja sakta hai.

Payload:

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

# 8. Offline User Flow

User disconnect karta hai.

```text
User
  |
  X
Socket
  |
  v
Server
  |
  v
Presence Manager
  |
  v
No active sockets?
  |
  v
OFFLINE
```

Then:

```text
lastSeenAt = currentTime
```

set kiya ja sakta hai.

---

# 8.1 Offline Event

```text
presence:update
```

```json
{
  "event": "presence:update",
  "data": {
    "userId": "USER_ID",
    "status": "offline",
    "lastSeenAt": "2026-08-11T10:30:00.000Z"
  }
}
```

---

# 9. Disconnect Problem

WebSocket disconnect always clean nahi hota.

Example:

```text
Laptop
   |
   X Wi-Fi suddenly gone
   |
Server
```

Server ko instantly reliable information nahi mil sakti.

Possible causes:

```text
Wi-Fi loss
Mobile network switch
Browser crash
Laptop sleep
Battery shutdown
Server restart
Network timeout
```

Isliye sirf:

```text
disconnect
```

event par depend karna risky hai.

---

# 10. Heartbeat

Heartbeat connection alive hai ya nahi check karne ka mechanism hai.

Concept:

```text
Client
  |
  | ping
  v
Server
  |
  | pong
  v
Client
```

Ya WebSocket protocol ka built-in ping/pong mechanism use kiya ja sakta hai.

---

# 10.1 Why Heartbeat?

Imagine:

```text
User still shown:
ONLINE

Actually:
Internet disconnected
```

Heartbeat server ko detect karne mein help karta hai:

```text
No heartbeat
     ↓
Connection suspicious
     ↓
Terminate socket
     ↓
Presence update
```

---

# 11. Heartbeat Flow

```text
             CLIENT
                |
                | ping
                v
             SERVER
                |
                | pong
                v
             CLIENT
```

Repeated:

```text
0 sec
 ↓
ping
 ↓
pong

30 sec
 ↓
ping
 ↓
pong
```

Exact interval implementation par depend karega.

---

# 11.1 Server-Side Heartbeat

Server track kar sakta hai:

```text
lastHeartbeatAt
```

Example:

```text
lastHeartbeatAt:
10:30:00
```

Agar expected window mein heartbeat nahi mila:

```text
Connection dead
```

---

# 12. Ghost Users

Ghost user:

> User actual mein offline hai, lekin application usko online dikha rahi hai.

Example:

```text
Rahul
● Online

Actually:
Rahul ka Wi-Fi 5 minutes pehle disconnect ho chuka hai.
```

Cause:

```text
disconnect event delayed
heartbeat missing
server failure
network partition
```

Solution:

```text
Heartbeat
+
Connection timeout
+
Disconnect handling
```

---

# 13. Reconnect Flow

Network wapas aaya:

```text
OFFLINE
   |
   | reconnect
   v
WebSocket
   |
   v
Authenticate
   |
   v
Register
   |
   v
ONLINE
```

Then:

```text
presence:update
```

---

# 13.1 Reconnect Example

```text
ONLINE
  |
  X Network failure
  |
  v
OFFLINE
  |
  | reconnect
  v
ONLINE
```

Client ko apne subscribed users ki updated presence mil sakti hai.

---

# 14. Presence Events

Recommended events:

```text
presence:update
presence:subscribe
presence:unsubscribe
```

---

# 14.1 `presence:update`

### Direction

```text
SERVER → CLIENT
```

Payload:

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

# 14.2 `presence:subscribe`

### Direction

```text
CLIENT → SERVER
```

Payload:

```json
{
  "userIds": [
    "USER_1",
    "USER_2",
    "USER_3"
  ]
}
```

Purpose:

Client batata hai:

> "Mujhe in users ki presence updates chahiye."

---

# 14.3 `presence:unsubscribe`

### Direction

```text
CLIENT → SERVER
```

Payload:

```json
{
  "userIds": [
    "USER_1"
  ]
}
```

---

# 15. Presence Subscribe

Suppose user ki chat list mein:

```text
Rahul
Aman
Rohit
Priya
```

Frontend ko in users ka status chahiye.

```text
Client
  |
  | presence:subscribe
  |
  +-- Rahul
  +-- Aman
  +-- Rohit
  +-- Priya
```

Server current status return/broadcast kar sakta hai.

Example:

```json
{
  "userId": "RAHUL_ID",
  "status": "online"
}
```

---

# 15.1 Why Subscribe?

Agar application mein:

```text
1 million users
```

hain to har user ke status updates har client ko bhejna impossible/inefficient hai.

Instead:

```text
User only subscribes to relevant users.
```

---

# 16. Presence Unsubscribe

Chat close:

```text
Chat with Rahul
```

to Rahul ki presence ki zarurat nahi ho sakti.

Client:

```text
presence:unsubscribe
```

send kar sakta hai.

---

# 17. Presence Broadcasting

Presence event har user ko broadcast nahi karna chahiye.

Bad:

```text
Rahul online
   ↓
Every connected user
```

Better:

```text
Rahul online
   ↓
Users who care about Rahul
```

"Care" ka meaning:

```text
friends
conversation members
subscribers
contacts
```

---

# 17.1 Conversation-Based Presence

Suppose:

```text
Conversation A
├── Rahul
├── Sawan
└── Aman
```

Rahul online hua.

Event:

```text
presence:update
```

sirf relevant users ko bheja ja sakta hai.

---

# 18. Personal Presence Room

Har authenticated user ka ek personal room ho sakta hai:

```text
user:<userId>
```

Example:

```text
user:64abc123
```

Benefits:

```text
Direct notifications
Presence updates
Multi-device sync
Personal events
```

---

# 18.1 Example

Rahul ke:

```text
Desktop
Mobile
Tablet
```

teen sockets hain.

Sab same room:

```text
user:rahul
├── desktop socket
├── mobile socket
└── tablet socket
```

Server:

```text
user:rahul
```

room ko event bhej sakta hai.

---

# 19. Multiple Devices

Ye bahut important hai.

Suppose user:

```text
Mobile
+
Laptop
```

dono par logged in hai.

Connections:

```text
Rahul
 |
 +--- Mobile Socket
 |
 +--- Laptop Socket
```

Ab laptop disconnect ho gaya.

Kya Rahul offline hai?

**Nahi.**

Mobile abhi connected hai.

Therefore:

```text
1 socket disconnect
≠
user offline
```

---

# 19.1 Correct Presence Calculation

```text
Active sockets > 0
        |
        v
     ONLINE
```

```text
Active sockets = 0
        |
        v
     OFFLINE
```

---

# 19.2 Example

Initially:

```text
Rahul
Sockets = 2
Status = ONLINE
```

Laptop disconnect:

```text
Sockets = 1
Status = ONLINE
```

Mobile disconnect:

```text
Sockets = 0
Status = OFFLINE
```

---

# 20. Multiple Tabs

Browser mein user same website multiple tabs mein open kar sakta hai.

```text
Chrome Tab 1
Chrome Tab 2
Chrome Tab 3
```

Each tab separate WebSocket connection ho sakta hai.

```text
User
 |
 +--- Socket 1
 +--- Socket 2
 +--- Socket 3
```

Same rule:

```text
activeSockets > 0
```

means:

```text
ONLINE
```

---

# 20.1 Why This Matters?

Agar hum blindly:

```text
socket disconnect
↓
offline
```

kar denge, to:

```text
Tab 1 closes
↓
User becomes offline
```

while:

```text
Tab 2 still connected
```

Ye wrong hai.

---

# 21. Away Status

Away ka meaning:

> User connected hai, lekin kuch time se interaction nahi hua.

Example:

```text
ONLINE
   |
   | 5 min inactivity
   v
AWAY
```

Activity:

```text
mouse movement
keyboard
message send
chat interaction
```

ke basis par reset kiya ja sakta hai.

---

# 21.1 Away Flow

```text
ONLINE
  |
  | no activity
  v
AWAY
  |
  | activity
  v
ONLINE
```

---

# 21.2 Server vs Client Away

Away detection client-side easier ho sakta hai:

```text
Client
  |
  | activity timer
  v
Send presence update
```

Lekin client ko blindly trust nahi karna chahiye.

Server authoritative state maintain kare.

---

# 22. Last Seen

Offline hone ke time:

```text
lastSeenAt
```

update kiya ja sakta hai.

Example:

```json
{
  "status": "offline",
  "lastSeenAt": "2026-08-11T10:45:00.000Z"
}
```

Frontend:

```text
Last seen 5 minutes ago
```

calculate karega.

---

# 22.1 Last Seen Kab Update Karein?

Har heartbeat par:

```text
NO
```

Har mouse movement:

```text
NO
```

Recommended:

```text
User actually transitions to offline
```

tab update karo.

---

# 22.2 Why?

Agar 100,000 users hain aur heartbeat every 30 seconds:

```text
100,000 / 30 sec
```

bahut saare unnecessary database writes generate kar sakte hain.

Presence ka volatile state memory/Redis mein rakhna better hai.

---

# 23. MongoDB Design

User model mein:

```javascript
presence: {
  status: {
    type: String,
    enum: ["online", "offline", "away"],
    default: "offline"
  },

  lastSeenAt: {
    type: Date,
    default: null
  }
}
```

Lekin real-time active socket tracking MongoDB mein continuously nahi karna.

---

# 23.1 Better Separation

Persistent user data:

```text
MongoDB
   |
   +--- lastSeenAt
   +--- presence preferences
```

Volatile connection state:

```text
Memory / Redis
   |
   +--- socketId
   +--- connection count
   +--- heartbeat
```

---

# 24. What Should Be Stored

MongoDB mein useful:

```text
lastSeenAt
presence visibility settings
possibly manually selected status
```

---

# 24.1 What Should NOT Be Stored Frequently

Avoid:

```text
heartbeat every 10 seconds
socket connect every second
mouse movement
typing state
```

MongoDB ko real-time event stream ki tarah use nahi karna.

---

# 25. Presence Manager

Dedicated service:

```text
presence.manager.js
```

Responsibilities:

```text
Register connection
Remove connection
Get user status
Track sockets
Update last seen
Handle heartbeat state
Broadcast presence
```

---

# 25.1 Example Responsibilities

```text
registerSocket(userId, socketId)

removeSocket(userId, socketId)

getPresence(userId)

getOnlineUsers()

updateActivity(userId)

setAway(userId)

setOffline(userId)
```

---

# 26. Socket Registry

Simple single-server implementation mein memory structure use kar sakte hain.

Concept:

```text
Map<userId, Set<socketId>>
```

Example:

```text
User A
  |
  +--- socket-1
  +--- socket-2

User B
  |
  +--- socket-3
```

---

# 26.1 Why Set?

Same socket ID duplicate nahi hona chahiye.

```text
Set
```

naturally uniqueness maintain karta hai.

---

# 26.2 Example State

```text
userSockets = {

  userA: {
    socket1,
    socket2
  },

  userB: {
    socket3
  }

}
```

---

# 27. Presence State Calculation

Core formula:

```text
activeSockets(user) > 0
        ?
     ONLINE
        :
     OFFLINE
```

Away:

```text
activeSockets > 0
AND
inactivity > threshold
```

---

# 27.1 State Machine

```text
              connect
                |
                v
             ONLINE
             /    \
            /      \
     inactivity    disconnect
          |           |
          v           v
         AWAY       OFFLINE
          |
       activity
          |
          v
        ONLINE
```

---

# 28. Friend/Conversation Presence

Chat application mein mostly humein sirf relevant users ka presence chahiye.

Example:

```text
My Conversations

Rahul     ● Online
Aman      ○ Offline
Rohit     ● Online
Priya     ○ Away
```

Frontend:

```text
presence:subscribe
```

mein relevant user IDs bhej sakta hai.

---

# 28.1 Initial Presence Fetch

WebSocket event updates enough nahi hote.

Suppose user subscribe karta hai:

```text
Rahul
Aman
Rohit
```

Server ko current states provide karne honge:

```json
{
  "users": [
    {
      "userId": "RAHUL",
      "status": "online"
    },
    {
      "userId": "AMAN",
      "status": "offline"
    }
  ]
}
```

Then future changes:

```text
presence:update
```

se aayenge.

---

# 29. Privacy

Users ko presence hide karne ka option future mein diya ja sakta hai.

Example:

```text
Settings

☑ Show Online Status
☑ Show Last Seen
```

Agar user disable kare:

```text
showOnlineStatus = false
```

to server ko uski actual state sab users ko reveal nahi karni chahiye.

---

# 29.1 Privacy Rule

Presence information bhi user data hai.

Never assume:

```text
"Everyone should know everyone is online."
```

Access rules define karo.

---

# 30. Security

Client ye payload bhej sakta hai:

```json
{
  "userId": "SOMEONE_ELSE",
  "status": "online"
}
```

Server ko trust nahi karna.

Bad:

```text
Client says:
"I'm online."
```

Correct:

```text
WebSocket authenticated
       ↓
socket.userId
       ↓
Server calculates state
```

---

# 30.1 Presence Must Be Server Authoritative

Client:

```text
"I am online"
```

Server:

```text
"Let me verify your connection."
```

Actual presence server decide karega.

---

# 31. Failure Scenarios

## Scenario 1 — Wi-Fi Lost

```text
ONLINE
   |
   X
Wi-Fi lost
   |
   v
Heartbeat fails
   |
   v
Socket closed
   |
   v
OFFLINE
```

---

## Scenario 2 — Browser Crashes

```text
Browser
   |
   X
Crash
   |
   v
Heartbeat stops
   |
   v
Timeout
   |
   v
OFFLINE
```

---

## Scenario 3 — Mobile Background

Mobile browser/app background mein ja sakta hai.

Connection:

```text
Active
   ↓
Background
   ↓
Network restricted
```

Server ko eventually connection dead detect karna hoga.

---

## Scenario 4 — Server Restart

Server restart:

```text
All sockets
   |
   X
Disconnected
```

Users temporarily:

```text
OFFLINE
```

phir clients reconnect:

```text
Reconnect
   ↓
ONLINE
```

---

# 32. Race Conditions

Presence mein race conditions common hain.

Example:

```text
Socket A disconnect
Socket B connect
```

Almost same time.

Agar operations wrong order mein hue:

```text
B connects
↓
ONLINE

A disconnect handler runs
↓
OFFLINE
```

Actual:

```text
Socket B still active
```

but user incorrectly offline.

---

# 32.1 Solution

State calculate karo:

```text
After every register/remove:

activeSocketCount
```

Then:

```text
count > 0
→ ONLINE
```

Not:

```text
disconnect event
→ OFFLINE
```

---

# 33. Scaling

Single Node.js server:

```text
                Server
                  |
        +---------+---------+
        |                   |
     Socket A            Socket B
```

Memory registry kaam karega.

But multiple servers:

```text
             Load Balancer
              /          \
             /            \
        Server A        Server B
          |                |
       User X            User Y
```

Ab Server A ko nahi pata:

```text
User Y Server B par online hai.
```

---

# 33.1 Problem

User X:

```text
Server A
```

User Y:

```text
Server B
```

User Y online hota hai.

Server B ko event pata hai.

Lekin Server A ke connected users ko update kaise milega?

---

# 34. Redis Future Architecture

Large-scale architecture:

```text
                   Load Balancer
                  /             \
                 v               v
             Server A        Server B
                 \               /
                  \             /
                    Redis
                      |
                      v
                   MongoDB
```

Redis:

```text
Fast shared state
Pub/Sub
Presence
Socket coordination
```

MongoDB:

```text
Persistent data
Last seen
Users
Messages
```

---

# 34.1 Important Separation

```text
MongoDB
=
Permanent / persistent data
```

```text
Redis
=
Fast / temporary / shared state
```

---

# 35. Complete Presence Flow

```text
                         CLIENT
                           |
                           | WebSocket Connect
                           v
                    SOCKET SERVER
                           |
                           v
                    AUTHENTICATION
                           |
                           v
                    PRESENCE MANAGER
                           |
                           v
                  Register Socket ID
                           |
                           v
                   Active Socket Count
                           |
                     +-----+-----+
                     |           |
                    >0          0
                     |           |
                     v           v
                   ONLINE      OFFLINE
                     |           |
                     v           v
              presence:update  lastSeenAt
                     |
                     v
               Relevant Users
```

---

# 36. Complete Online → Offline → Online Flow

```text
                    User Opens App
                          |
                          v
                    WebSocket Connect
                          |
                          v
                     Authenticate
                          |
                          v
                    Register Socket
                          |
                          v
                        ONLINE
                          |
                          v
                   presence:update
                          |
                          |
                  User using app
                          |
                          v
                      HEARTBEAT
                          |
                          v
                     Connection
                          |
                    Network Failure
                          |
                          X
                          |
                          v
                  Heartbeat Timeout
                          |
                          v
                   Remove Socket
                          |
                          v
                Active Sockets = 0
                          |
                          v
                       OFFLINE
                          |
                          v
                    lastSeenAt
                          |
                          |
                    Network Returns
                          |
                          v
                       RECONNECT
                          |
                          v
                     Authenticate
                          |
                          v
                   Register Socket
                          |
                          v
                        ONLINE
```

---

# 37. Debugging

Presence wrong dikhe to ye sequence check karo:

```text
1. WebSocket connected?
2. Authentication successful?
3. socket.userId available?
4. Socket registry mein user registered?
5. Multiple sockets correctly tracked?
6. Heartbeat working?
7. Disconnect handler working?
8. Active socket count correct?
9. Presence state calculated correctly?
10. presence:update emitted?
11. Receiver subscribed?
12. Privacy rules blocking event?
```

---

# 37.1 Useful Development Logs

```text
[SOCKET] connected socket-123
[AUTH] user=abc authenticated
[PRESENCE] user=abc registered socket-123
[PRESENCE] user=abc status=online
[PRESENCE] heartbeat user=abc
[PRESENCE] socket-123 disconnected
[PRESENCE] user=abc activeSockets=0
[PRESENCE] user=abc status=offline
```

Production mein sensitive information aur excessive heartbeat logs avoid karo.

---

# 38. Implementation Rules

## Rule 1

> **Authentication ke bina presence calculate mat karo.**

---

## Rule 2

> **`disconnect` ka matlab automatically offline nahi hai.**

Multiple devices/tabs check karo.

---

## Rule 3

> **Presence ka source of truth active connections hone chahiye.**

```text
activeSockets > 0
→ online
```

---

## Rule 4

> **Heartbeat use karo.**

Network failures clean disconnect nahi dete.

---

## Rule 5

> **Har heartbeat MongoDB mein save mat karo.**

---

## Rule 6

> **Last seen ko persistent data ki tarah treat karo.**

---

## Rule 7

> **Typing aur presence ko message data se separate rakho.**

---

## Rule 8

> **Relevant users ko hi presence updates bhejo.**

---

## Rule 9

> **Multiple devices ko first-class scenario samjho.**

---

## Rule 10

> **Single-server aur multi-server architecture alag socho.**

Single server:

```text
Memory
```

Multiple servers:

```text
Redis
```

---

# 39. Final Mental Model

Presence system ko bas ye diagram yaad rakh:

```text
                     USER
                       |
                       | Connect
                       v
                 WebSocket
                       |
                       v
                Authentication
                       |
                       v
               Presence Manager
                       |
                       v
               Active Socket Registry
                       |
              +--------+--------+
              |                 |
          sockets > 0       sockets = 0
              |                 |
              v                 v
           ONLINE             OFFLINE
              |                 |
              |                 v
              |            lastSeenAt
              |
              v
          HEARTBEAT
              |
       +------+------+
       |             |
     Alive         Timeout
       |             |
       v             v
    ONLINE        Disconnect
                     |
                     v
              Check other sockets
                     |
              +------+------+
              |             |
            > 0            0
              |             |
           ONLINE        OFFLINE
```

---

# One-Line Summary

```text
WebSocket Connection + Authentication + Active Socket Tracking + Heartbeat + Disconnect Handling = Presence System
```

> **Sabse important baat:** Presence ko sirf `online/offline` boolean mat samajhna. Real chat app mein presence actually **connection state + multiple sockets + heartbeat + last seen + reconnect + privacy + distributed state** ka combination hai.
