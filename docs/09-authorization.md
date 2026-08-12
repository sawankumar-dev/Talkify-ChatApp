# Authorization

> **Project:** Real-Time Chat Application
> **Document:** `authorization.md`
> **Purpose:** Authenticated users ko resources aur actions ki permission securely manage karna
> **Stack:** Node.js + Express.js + MongoDB + JWT + WebSocket
> **Language:** Hinglish

---

# Table of Contents

1. [Authorization Kya Hai?](#1-authorization-kya-hai)
2. [Authentication vs Authorization](#2-authentication-vs-authorization)
3. [Authorization Ka Core Concept](#3-authorization-ka-core-concept)
4. [Authorization Request Model](#4-authorization-request-model)
5. [Hamare Chat App Mein Authorization](#5-hamare-chat-app-mein-authorization)
6. [Authorization Layers](#6-authorization-layers)
7. [User Identity](#7-user-identity)
8. [Resource](#8-resource)
9. [Action](#9-action)
10. [Permission](#10-permission)
11. [Role](#11-role)
12. [RBAC](#12-rbac)
13. [ABAC](#13-abac)
14. [Ownership-Based Authorization](#14-ownership-based-authorization)
15. [Conversation-Based Authorization](#15-conversation-based-authorization)
16. [Message Authorization](#16-message-authorization)
17. [Direct Chat Authorization](#17-direct-chat-authorization)
18. [Group Chat Authorization](#18-group-chat-authorization)
19. [Group Roles](#19-group-roles)
20. [Admin Authorization](#20-admin-authorization)
21. [Moderator Authorization](#21-moderator-authorization)
22. [Permission Matrix](#22-permission-matrix)
23. [HTTP Authorization](#23-http-authorization)
24. [WebSocket Authorization](#24-websocket-authorization)
25. [Authorization Middleware](#25-authorization-middleware)
26. [Resource-Level Authorization](#26-resource-level-authorization)
27. [Route-Level Authorization](#27-route-level-authorization)
28. [Service-Level Authorization](#28-service-level-authorization)
29. [Authorization Flow](#29-authorization-flow)
30. [Conversation Membership](#30-conversation-membership)
31. [Member Roles](#31-member-roles)
32. [Join Conversation](#32-join-conversation)
33. [Leave Conversation](#33-leave-conversation)
34. [Add Member](#34-add-member)
35. [Remove Member](#35-remove-member)
36. [Change Member Role](#36-change-member-role)
37. [Send Message Authorization](#37-send-message-authorization)
38. [Edit Message Authorization](#38-edit-message-authorization)
39. [Delete Message Authorization](#39-delete-message-authorization)
40. [Read Message Authorization](#40-read-message-authorization)
41. [Typing Authorization](#41-typing-authorization)
42. [Presence Authorization](#42-presence-authorization)
43. [WebSocket Event Authorization](#43-websocket-event-authorization)
44. [Room Authorization](#44-room-authorization)
45. [Preventing IDOR](#45-preventing-idor)
46. [Never Trust Client](#46-never-trust-client)
47. [Authorization Errors](#47-authorization-errors)
48. [403 vs 404](#48-403-vs-404)
49. [Authorization + MongoDB](#49-authorization--mongodb)
50. [Authorization Data Model](#50-authorization-data-model)
51. [Authorization Services](#51-authorization-services)
52. [Authorization Middleware Structure](#52-authorization-middleware-structure)
53. [Policy-Based Authorization](#53-policy-based-authorization)
54. [Permission Constants](#54-permission-constants)
55. [Permission Checking](#55-permission-checking)
56. [Role Hierarchy](#56-role-hierarchy)
57. [Privilege Escalation](#57-privilege-escalation)
58. [Least Privilege](#58-least-privilege)
59. [Deny by Default](#59-deny-by-default)
60. [Defense in Depth](#60-defense-in-depth)
61. [Authorization Caching](#61-authorization-caching)
62. [Authorization Race Conditions](#62-authorization-race-conditions)
63. [Revoked Membership](#63-revoked-membership)
64. [Deleted User](#64-deleted-user)
65. [Blocked User](#65-blocked-user)
66. [Conversation Ownership](#66-conversation-ownership)
67. [System Messages](#67-system-messages)
68. [Authorization Audit Logs](#68-authorization-audit-logs)
69. [Common Mistakes](#69-common-mistakes)
70. [Security Rules](#70-security-rules)
71. [Implementation Order](#71-implementation-order)
72. [Authorization Checklist](#72-authorization-checklist)
73. [Final Mental Model](#73-final-mental-model)

---

# 1. Authorization Kya Hai?

Authorization ka simple meaning:

> **"Authenticated user ko kya karne ki permission hai?"**

Example:

```text
User A authenticated hai.
```

Ye authentication hai.

Ab:

```text
Kya User A Conversation #123 ko read kar sakta hai?
```

Ye authorization hai.

---

# 2. Authentication vs Authorization

Yaad rakhne ka easiest way:

```text
Authentication
      ↓
Tum kaun ho?

Authorization
      ↓
Tum kya kar sakte ho?
```

Example:

```text
Login
  ↓
Authentication
  ↓
"Sawan"

Conversation #123
  ↓
Authorization
  ↓
"Sawan member hai?"
```

---

# 3. Authorization Ka Core Concept

Har protected action ko roughly is formula se samjho:

```text
Identity
   +
Resource
   +
Action
   +
Policy
   =
Authorization Decision
```

Example:

```text
User A
  +
Conversation 123
  +
SEND_MESSAGE
  +
Member?
  =
ALLOW / DENY
```

---

# 4. Authorization Request Model

Authorization ke time server ko ye information chahiye:

```text
Subject
Resource
Action
Context
```

Example:

```text
Subject:
User A

Resource:
Message 123

Action:
DELETE

Context:
Message kis user ne create ki?
Conversation ka member kaun hai?
```

---

# 5. Hamare Chat App Mein Authorization

Chat application mein major resources:

```text
User
Conversation
Conversation Member
Message
Attachment
Notification
Session
```

Actions:

```text
READ
CREATE
UPDATE
DELETE
JOIN
LEAVE
ADD_MEMBER
REMOVE_MEMBER
CHANGE_ROLE
SEND_MESSAGE
EDIT_MESSAGE
DELETE_MESSAGE
```

---

# 6. Authorization Layers

Hamara authorization system multiple layers ka hoga:

```text
             Authorization
                    |
        +-----------+-----------+
        |           |           |
      Route       Resource     Action
        |           |           |
        +-----------+-----------+
                    |
                  Policy
                    |
                  Result
```

---

# 7. User Identity

Authentication ke baad server ko user identity milti hai.

HTTP:

```text
req.user.id
```

WebSocket:

```text
socket.user.id
```

Ye identity server-side authentication se aani chahiye.

---

# 8. Resource

Resource matlab jis cheez par action perform ho raha hai.

Example:

```text
Conversation
Message
User
Session
```

Example:

```text
DELETE /messages/123
```

Resource:

```text
Message #123
```

---

# 9. Action

Action batata hai user kya karna chahta hai.

Examples:

```text
READ
CREATE
UPDATE
DELETE
```

Chat-specific:

```text
SEND_MESSAGE
EDIT_MESSAGE
DELETE_MESSAGE
ADD_MEMBER
REMOVE_MEMBER
```

---

# 10. Permission

Permission ka matlab:

> Kisi particular action ko perform karne ki ability.

Example:

```text
MESSAGE_READ
MESSAGE_SEND
MESSAGE_EDIT
MESSAGE_DELETE
```

Conversation:

```text
CONVERSATION_READ
CONVERSATION_UPDATE
CONVERSATION_DELETE
```

---

# 11. Role

Role permissions ka logical group hai.

Example:

```text
member
moderator
admin
```

Agar:

```text
moderator
```

ke paas:

```text
DELETE_MESSAGE
REMOVE_MEMBER
```

permissions hain, to role ke through ye permissions apply ho sakti hain.

---

# 12. RBAC

RBAC:

> Role-Based Access Control

Architecture:

```text
User
  ↓
Role
  ↓
Permissions
  ↓
Actions
```

Example:

```text
User
 ↓
Moderator
 ↓
DELETE_MESSAGE
 ↓
Allowed
```

---

# 13. ABAC

ABAC:

> Attribute-Based Access Control

Ismein sirf role nahi, attributes bhi consider hote hain.

Example:

```text
User role = member
Message author = current user
Conversation membership = true
Message age < allowed window
```

Then:

```text
EDIT_MESSAGE = ALLOW
```

ABAC chat applications mein kaafi useful hai.

---

# 14. Ownership-Based Authorization

Simple rule:

> Jo resource tumne create kiya hai, usko tum modify/delete kar sakte ho.

Example:

```text
Message
   |
   +── authorId = User A
```

User A:

```text
EDIT → Allowed
DELETE → Allowed
```

User B:

```text
EDIT → Denied
DELETE → Denied
```

Exception:

```text
Moderator / Admin
```

policy ke according override kar sakte hain.

---

# 15. Conversation-Based Authorization

Chat application mein sabse important authorization rule:

> User conversation ka member hai ya nahi?

Example:

```text
Conversation #100

Members:
A
B
C
```

User D:

```text
Conversation #100
```

access:

```text
DENY
```

---

# 16. Message Authorization

Message access directly message ID se decide nahi hoga.

Server check karega:

```text
Current User
      ↓
Message
      ↓
Conversation
      ↓
Conversation Membership
```

Flow:

```text
User A
  |
  v
Message #123
  |
  v
Conversation #456
  |
  v
Is User A member?
  |
 +----+
 |    |
Yes   No
 |     |
Allow Deny
```

---

# 17. Direct Chat Authorization

Direct conversation:

```text
User A
   |
   | Direct Chat
   |
User B
```

Only:

```text
A
B
```

access kar sakte hain.

User C:

```text
DENY
```

---

# 18. Group Chat Authorization

Group:

```text
Group #1

Owner
 └── A

Members
 ├── B
 ├── C
 └── D
```

Permissions role ke according differ karengi.

---

# 19. Group Roles

Recommended initial roles:

```text
owner
admin
member
```

Optional:

```text
moderator
```

---

# 20. Owner

Owner ke paas highest group-level permissions:

```text
UPDATE_GROUP
DELETE_GROUP
ADD_MEMBER
REMOVE_MEMBER
CHANGE_ROLE
```

Exact permissions project policy par depend karengi.

---

# 21. Admin

Admin:

```text
ADD_MEMBER
REMOVE_MEMBER
DELETE_MESSAGE
CHANGE_MEMBER_SETTINGS
```

Lekin:

```text
DELETE_GROUP
TRANSFER_OWNERSHIP
```

jaise actions owner-only ho sakte hain.

---

# 22. Member

Normal member:

```text
READ_CONVERSATION
SEND_MESSAGE
EDIT_OWN_MESSAGE
DELETE_OWN_MESSAGE
LEAVE_CONVERSATION
```

---

# 23. Permission Matrix

Example:

| Action                 | Owner |   Admin | Member |
| ---------------------- | ----: | ------: | -----: |
| Read messages          |     ✅ |       ✅ |      ✅ |
| Send message           |     ✅ |       ✅ |      ✅ |
| Edit own message       |     ✅ |       ✅ |      ✅ |
| Delete own message     |     ✅ |       ✅ |      ✅ |
| Delete others' message |     ✅ |       ✅ |      ❌ |
| Add member             |     ✅ |       ✅ |      ❌ |
| Remove member          |     ✅ |       ✅ |      ❌ |
| Change member role     |     ✅ | Limited |      ❌ |
| Update group           |     ✅ | Limited |      ❌ |
| Delete group           |     ✅ |       ❌ |      ❌ |
| Transfer ownership     |     ✅ |       ❌ |      ❌ |

> Ye starting policy hai. Implementation ke time exact rules ko project requirements ke according lock karenge.

---

# 24. HTTP Authorization

HTTP request:

```text
Client
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Controller
```

Example:

```text
DELETE /api/messages/123
```

Server:

```text
1. User authenticated?
2. Message exists?
3. User conversation member?
4. User message author hai?
5. Moderator permission hai?
6. Delete allowed?
```

---

# 25. WebSocket Authorization

WebSocket:

```text
Socket Connection
      ↓
Authentication
      ↓
Event
      ↓
Authorization
      ↓
Handler
```

Example:

```text
chat:send
```

Server:

```text
socket.user
   ↓
conversationId
   ↓
membership check
   ↓
allow
```

---

# 26. Authorization Middleware

HTTP authorization middleware:

```text
authorization.middleware.js
```

Responsibilities:

```text
Check role
Check permission
Check resource access
```

Lekin resource-specific logic ko unnecessarily generic middleware mein bharna avoid karenge.

---

# 27. Resource-Level Authorization

Example:

```text
DELETE /messages/123
```

Sirf ye check:

```text
User authenticated?
```

enough nahi.

Resource:

```text
Message #123
```

ko load karke check:

```text
message.authorId === req.user.id
```

ya:

```text
user has moderator permission
```

---

# 28. Route-Level Authorization

Route-level example:

```text
POST /groups/:id/members
```

Required:

```text
Authentication
+
Group membership
+
ADD_MEMBER permission
```

Flow:

```text
Route
 ↓
authenticate
 ↓
authorize
 ↓
controller
```

---

# 29. Service-Level Authorization

Authorization ko service layer mein bhi enforce karna useful hai.

Example:

```text
messageService.deleteMessage()
```

Service check kare:

```text
Can user delete this message?
```

Iska fayda:

Agar future mein:

```text
HTTP
WebSocket
Background Job
```

same service use karein, authorization accidentally bypass nahi hoti.

---

# 30. Authorization Flow

Complete:

```text
Request
  |
  v
Authentication
  |
  v
User Identity
  |
  v
Resource Load
  |
  v
Authorization Policy
  |
  +---- DENY
  |      |
  |     403
  |
  +---- ALLOW
          |
          v
        Action
```

---

# 31. Conversation Membership

Conversation membership central authorization data hai.

Conceptual:

```text
Conversation
   |
   +── members
          |
          +── userId
          +── role
          +── joinedAt
```

Example:

```json
{
  "userId": "user123",
  "role": "member",
  "joinedAt": "..."
}
```

---

# 32. Membership Check

Conceptual logic:

```text
Is user member of conversation?

YES → Continue
NO  → Reject
```

MongoDB query conceptually:

```text
conversationId = requested conversation
AND
member.userId = current user
```

---

# 33. Join Conversation

User kisi conversation ko join karna chahta hai.

Server:

```text
Authenticated?
      ↓
Conversation exists?
      ↓
Already member?
      ↓
Invite required?
      ↓
Allowed?
```

Agar public conversation:

```text
JOIN → Allowed
```

Agar private:

```text
Invitation → Required
```

---

# 34. Leave Conversation

Normal member:

```text
LEAVE
```

Allowed.

Owner:

```text
LEAVE
```

problem create kar sakta hai.

Possible policy:

```text
Owner must transfer ownership
before leaving.
```

---

# 35. Add Member

Request:

```text
POST /conversations/:id/members
```

Authorization:

```text
Authenticated?
   ↓
Conversation member?
   ↓
Has ADD_MEMBER permission?
   ↓
Target user valid?
   ↓
Already member?
```

---

# 36. Remove Member

Important:

```text
User A
```

kisi random user ko remove nahi kar sakta.

Check:

```text
Requester role
Target role
Conversation policy
```

Example:

```text
Admin → remove member
Admin → cannot remove owner
```

---

# 37. Change Member Role

Example:

```text
PATCH /conversations/:id/members/:userId
```

Request:

```json
{
  "role": "admin"
}
```

Authorization:

```text
Requester allowed?
Target member exists?
Role transition allowed?
```

---

# 38. Role Escalation

Critical security issue:

```text
Member
  ↓
Change own role
  ↓
Admin
```

Never allow this.

Server ko role transition validate karna chahiye.

---

# 39. Send Message Authorization

Event:

```text
chat:send
```

Payload:

```json
{
  "conversationId": "123",
  "content": "Hello"
}
```

Server:

```text
socket.user.id
      ↓
conversationId
      ↓
membership check
      ↓
blocked/muted?
      ↓
payload validation
      ↓
SEND_MESSAGE permission
      ↓
Create Message
```

---

# 40. Edit Message Authorization

Possible policy:

```text
Author
```

apna message edit kar sakta hai.

Example:

```text
message.authorId === user.id
```

Then:

```text
ALLOW
```

Moderator:

```text
ALLOW
```

if moderation policy allows.

---

# 41. Delete Message Authorization

Possible rules:

```text
Author → Delete own message
Moderator → Delete any message
Admin → Delete any message
Member → Cannot delete others' message
```

---

# 42. Read Message Authorization

User message read kar sakta hai only if:

```text
User belongs to conversation
```

Important:

```text
GET /messages/:id
```

par bhi membership check hona chahiye.

---

# 43. Typing Authorization

Event:

```text
typing:start
```

Payload:

```json
{
  "conversationId": "123"
}
```

Server ko:

```text
socket.user
```

se identity leni chahiye.

Client se:

```json
{
  "userId": "someone-else"
}
```

trust nahi karna.

---

# 44. Presence Authorization

Presence:

```text
online
offline
lastSeen
typing
```

Privacy rules ho sakte hain.

Example:

```text
Blocked user
```

ko presence information nahi deni.

---

# 45. WebSocket Event Authorization

Har sensitive event ko classify karo:

| Event          | Authentication |           Authorization |
| -------------- | -------------: | ----------------------: |
| `chat:send`    |            Yes |     Conversation member |
| `chat:edit`    |            Yes | Message owner/moderator |
| `chat:delete`  |            Yes |         Owner/moderator |
| `chat:typing`  |            Yes |     Conversation member |
| `chat:read`    |            Yes |     Conversation member |
| `group:add`    |            Yes |             Admin/Owner |
| `group:remove` |            Yes |             Admin/Owner |
| `group:role`   |            Yes |      Owner/Admin policy |

---

# 46. Room Authorization

WebSocket rooms useful hain:

```text
conversation:123
```

Lekin room join karna authorization ke baad hona chahiye.

Wrong:

```text
Client says:
join conversation:123

Server:
socket.join("conversation:123")
```

Correct:

```text
Client
  ↓
conversationId
  ↓
Authenticate
  ↓
Check membership
  ↓
Allowed?
  ↓
socket.join(room)
```

---

# 47. Room ≠ Permission

Important:

> Socket room mein hona automatically permission proof nahi hai.

Room state aur authorization policy separate concepts hain.

Example:

```text
socket.join("conversation:123")
```

ke baad bhi server ko sensitive operations par policy enforce karni chahiye.

---

# 48. Preventing IDOR

IDOR:

> Insecure Direct Object Reference

Example vulnerable API:

```text
GET /messages/123
```

User A:

```text
GET /messages/123
```

Server sirf message ID check kare.

Agar message User B ki private conversation ka hai:

```text
DATA LEAK
```

---

# 49. IDOR Protection

Correct:

```text
messageId
   ↓
Find message
   ↓
Find conversation
   ↓
Check membership
   ↓
Allow / Deny
```

---

# 50. Never Trust Client

Client:

```json
{
  "userId": "admin123",
  "role": "admin"
}
```

Server:

```text
IGNORE
```

Identity:

```text
req.user.id
socket.user.id
```

Role:

```text
MongoDB / trusted server state
```

---

# 51. Authorization Errors

### `401 Unauthorized`

User authenticated nahi hai.

### `403 Forbidden`

User authenticated hai but permission nahi.

Example:

```text
Member trying to delete another member's message
```

---

# 52. 403 vs 404

Kabhi-kabhi security ke liye server resource existence hide kar sakta hai.

Example:

```text
GET /private-conversation/123
```

Agar user member nahi:

```text
404
```

return karna possible hai, taaki attacker ko ye confirm na ho ki resource exist karta hai.

Policy endpoint ke sensitivity ke according decide karni chahiye.

---

# 53. Authorization + MongoDB

Authorization queries ko database level par bhi efficiently enforce kar sakte hain.

Instead of:

```text
Find message
   ↓
Check membership
```

kabhi-kabhi query directly scoped resource fetch kar sakti hai.

Concept:

```text
Find message
WHERE messageId = X
AND conversation.members contains currentUser
```

Isse unauthorized resource accidentally return hone ka risk reduce hota hai.

---

# 54. Authorization Data Model

Basic:

```text
User
Conversation
ConversationMember
Message
Session
```

Relationship:

```text
User
 |
 +---- ConversationMember
              |
              v
        Conversation
              |
              v
           Message
```

---

# 55. ConversationMember

Recommended concept:

```text
ConversationMember
├── conversationId
├── userId
├── role
├── joinedAt
├── mutedAt
└── leftAt
```

Is model ka advantage:

Authorization queries clean ho jati hain.

---

# 56. Authorization Services

Recommended:

```text
authorization.service.js
```

Methods:

```text
isConversationMember()
getConversationMember()
hasConversationPermission()
canReadConversation()
canSendMessage()
canEditMessage()
canDeleteMessage()
canAddMember()
canRemoveMember()
canChangeRole()
```

---

# 57. Authorization Middleware Structure

Example structure:

```text
middleware/
│
├── auth.middleware.js
└── authorization.middleware.js
```

Generic checks:

```text
requireRole()
requirePermission()
```

Resource-specific checks:

```text
canAccessConversation()
canEditMessage()
```

service/policy layer mein rakhna cleaner ho sakta hai.

---

# 58. Policy-Based Authorization

Authorization rules ko central policies mein rakhna useful hai.

Example:

```text
message.policy.js
conversation.policy.js
member.policy.js
```

Architecture:

```text
Controller
   ↓
Policy
   ↓
Service
```

---

# 59. Permission Constants

Permissions strings ko scattered code mein manually likhne ke bajay constants use karna better hai.

Concept:

```text
CONVERSATION_READ
CONVERSATION_UPDATE
CONVERSATION_DELETE

MESSAGE_READ
MESSAGE_SEND
MESSAGE_EDIT
MESSAGE_DELETE

MEMBER_ADD
MEMBER_REMOVE
MEMBER_ROLE_UPDATE
```

---

# 60. Permission Checking

Conceptual:

```text
hasPermission(
    user,
    permission,
    resource
)
```

Result:

```text
true
```

or:

```text
false
```

But resource-specific rules ke liye sirf role check enough nahi hota.

---

# 61. Role Hierarchy

Simple hierarchy:

```text
OWNER
  ↓
ADMIN
  ↓
MODERATOR
  ↓
MEMBER
```

Lekin blindly numeric hierarchy use karna dangerous ho sakta hai.

Example:

```text
Admin > Member
```

ka matlab ye nahi ki admin automatically:

```text
DELETE_GROUP
```

kar sakta hai.

Permissions explicitly define karna better hai.

---

# 62. Privilege Escalation

Privilege escalation:

> Low-privilege user ka high-privilege permission obtain karna.

Example:

```text
Member
  ↓
PATCH /members/me
  ↓
role = owner
```

Ye catastrophic vulnerability hai.

Server ko target role aur requester permissions dono validate karne chahiye.

---

# 63. Least Privilege

Principle:

> User ko sirf utni permissions do jitni uske kaam ke liye required hain.

Example:

```text
Member
```

ko:

```text
SEND_MESSAGE
```

ki permission hai.

Usko:

```text
DELETE_GROUP
```

ki zarurat nahi.

---

# 64. Deny by Default

Unknown action:

```text
ALLOW?
```

Default answer:

```text
NO
```

Architecture:

```text
No matching policy
       ↓
DENY
```

Ye secure authorization ka fundamental rule hai.

---

# 65. Defense in Depth

Authorization ek single middleware par depend nahi hona chahiye.

Layers:

```text
Authentication
      ↓
Route Protection
      ↓
Resource Authorization
      ↓
Service Authorization
      ↓
Database Scoping
```

Agar ek layer miss ho jaye to doosri layer damage prevent kar sakti hai.

---

# 66. Authorization Caching

Large application mein authorization checks frequently run ho sakte hain.

Example:

```text
User A
Conversation 123
```

membership baar-baar check hoti hai.

Caching possible hai:

```text
userId + conversationId
        ↓
membership cache
```

Lekin cache invalidation carefully handle karni hogi.

---

# 67. Authorization Cache Risk

Suppose:

```text
User A
```

group se remove ho gaya.

Cache abhi bhi:

```text
MEMBER = true
```

dikha rahi hai.

To unauthorized access mil sakta hai.

Therefore membership change ke time:

```text
Invalidate cache
```

zaruri hai.

---

# 68. Authorization Race Conditions

Example:

```text
User A is member
```

same time:

```text
Admin removes User A
```

aur User A:

```text
send message
```

kar deta hai.

Server ko critical operation ke moment par authoritative state verify karni chahiye.

---

# 69. Revoked Membership

Membership:

```text
ACTIVE
```

se:

```text
LEFT
```

ya:

```text
REMOVED
```

ho sakti hai.

Example:

```text
Member removed
    ↓
Future requests denied
    ↓
Socket disconnected from room
```

---

# 70. Deleted User

User delete hone par:

```text
Active Sessions
      ↓
Revoke
```

WebSocket:

```text
Disconnect
```

Conversation membership:

```text
Policy ke according remove/anonymize
```

Messages:

```text
Delete / anonymize / retain
```

project policy par depend karega.

---

# 71. Blocked User

Suppose:

```text
User A blocks User B
```

Potential effects:

```text
B cannot DM A
B cannot see A's presence
B cannot send messages to A
```

Exact rules product requirements se define karenge.

---

# 72. Conversation Ownership

Conversation:

```text
Owner
```

ke paas special authority ho sakti hai.

Example:

```text
DELETE_CONVERSATION
TRANSFER_OWNERSHIP
CHANGE_GROUP_SETTINGS
```

Ownership transfer:

```text
Owner A
   ↓
Transfer ownership
   ↓
Owner B
```

Server ko atomic/consistent update ensure karna chahiye.

---

# 73. System Messages

Group action ke baad system message:

```text
"Sawan added Rahul"
```

generate ho sakta hai.

Lekin client ko system message create karne ki permission nahi deni.

Server:

```text
Authorized action
      ↓
Server creates system message
```

---

# 74. Authorization Audit Logs

Sensitive actions log kiye ja sakte hain:

```text
Role changed
Member removed
Message deleted
Conversation deleted
Ownership transferred
```

Audit log:

```text
actorId
action
resourceType
resourceId
timestamp
result
```

Sensitive data ko unnecessarily log nahi karna.

---

# 75. Authorization Decision Logging

Development:

```text
User A
DELETE_MESSAGE
Message 123
DENIED
```

Production mein logging privacy/security requirements ke according carefully configure karni chahiye.

---

# 76. Common Mistake — Client Role

Wrong:

```json
{
  "role": "admin"
}
```

Client se role lekar:

```text
if role === "admin"
```

authorization karna.

Never.

Correct:

```text
Authenticated User
      ↓
Server-side session/user state
      ↓
Role
      ↓
Permission
```

---

# 77. Common Mistake — Only Checking User ID

Wrong:

```text
if (message.authorId === userId)
```

Har action ke liye enough nahi.

Example moderator:

```text
Moderator can delete others' messages
```

So policy:

```text
Owner
OR
Moderator Permission
```

---

# 78. Common Mistake — Room Join Without Authorization

Wrong:

```text
socket.on("join", ({ conversationId }) => {
    socket.join(conversationId);
});
```

Correct architecture:

```text
Authenticate
   ↓
Validate conversationId
   ↓
Check membership
   ↓
Check status
   ↓
Join room
```

---

# 79. Common Mistake — Only HTTP Authorization

Sirf API secure karna enough nahi.

Agar WebSocket event:

```text
chat:delete
```

authorization ke bina execute ho raha hai, attacker HTTP restrictions bypass kar sakta hai.

Therefore:

```text
HTTP Authorization
+
WebSocket Authorization
```

dono required.

---

# 80. Common Mistake — Authorization Only at Frontend

Frontend:

```text
Hide Delete Button
```

security nahi hai.

Attacker manually request send kar sakta hai.

Frontend authorization:

```text
UX
```

Server authorization:

```text
SECURITY
```

---

# 81. Frontend vs Backend Authorization

Frontend:

```text
Can I show this button?
```

Backend:

```text
Can I actually allow this operation?
```

Backend final authority hai.

---

# 82. Authorization Decision Tree

Har sensitive operation:

```text
                 Request
                    |
                    v
             Authenticated?
               /         \
             No           Yes
             |             |
            401            v
                     Resource Exists?
                       /        \
                     No          Yes
                     |            |
                    404           v
                          Permission?
                            /      \
                          No        Yes
                          |          |
                         403         v
                                  Execute
```

---

# 83. Chat Message Authorization Tree

```text
SEND MESSAGE
      |
      v
Authenticated?
      |
      v
Conversation exists?
      |
      v
User member?
      |
      v
User blocked/muted?
      |
      v
Payload valid?
      |
      v
Send permission?
      |
      v
CREATE MESSAGE
```

---

# 84. Delete Message Authorization Tree

```text
DELETE MESSAGE
      |
      v
Authenticated?
      |
      v
Message exists?
      |
      v
Conversation accessible?
      |
      v
Message author?
      |
      +------ YES → Allow
      |
      NO
      |
      v
Moderator/Admin?
      |
      +------ YES → Allow
      |
      NO
      |
     DENY
```

---

# 85. Group Member Authorization Tree

```text
ADD MEMBER
    |
    v
Authenticated?
    |
    v
Conversation exists?
    |
    v
Requester member?
    |
    v
Requester has ADD_MEMBER?
    |
    v
Target valid?
    |
    v
Target already member?
    |
    v
ADD MEMBER
```

---

# 86. Authorization Architecture

Final architecture:

```text
                       CLIENT
                      /      \
                     /        \
                  HTTP      WebSocket
                   |             |
                   v             v
             Authentication  Authentication
                   |             |
                   v             v
              User Identity  socket.user
                   |             |
                   +------+------+
                          |
                          v
                    Authorization
                          |
             +------------+------------+
             |            |            |
           Role        Resource      Action
             |            |            |
             +------------+------------+
                          |
                          v
                       Policy
                          |
                   +------+------+
                   |             |
                 DENY          ALLOW
                   |             |
                  403            v
                              Service
                                 |
                                 v
                              MongoDB
```

---

# 87. Authorization Module Structure

Recommended structure:

```text
src/
│
├── modules/
│   │
│   ├── auth/
│   │
│   ├── conversations/
│   │   ├── conversation.controller.js
│   │   ├── conversation.service.js
│   │   ├── conversation.policy.js
│   │   └── conversation.routes.js
│   │
│   ├── messages/
│   │   ├── message.controller.js
│   │   ├── message.service.js
│   │   ├── message.policy.js
│   │   └── message.routes.js
│   │
│   └── members/
│       ├── member.service.js
│       └── member.policy.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── authorization.middleware.js
│
└── utils/
    └── permissions.js
```

---

# 88. Recommended Policy Files

```text
conversation.policy.js
message.policy.js
member.policy.js
user.policy.js
```

Purpose:

```text
Who can do what?
```

---

# 89. Recommended Authorization Service

```text
authorization.service.js
```

Responsibilities:

```text
checkConversationAccess()
checkConversationMembership()
checkMessageAccess()
checkMessageOwnership()
checkPermission()
checkRole()
```

---

# 90. Recommended Permission Groups

```text
CONVERSATION
├── READ
├── UPDATE
├── DELETE
└── MANAGE

MESSAGE
├── READ
├── SEND
├── EDIT
└── DELETE

MEMBER
├── ADD
├── REMOVE
├── READ
└── CHANGE_ROLE

GROUP
├── UPDATE
├── DELETE
└── TRANSFER_OWNERSHIP
```

---

# 91. Authorization Constants

Conceptually:

```text
CONVERSATION_READ
CONVERSATION_UPDATE
CONVERSATION_DELETE

MESSAGE_READ
MESSAGE_SEND
MESSAGE_EDIT
MESSAGE_DELETE

MEMBER_ADD
MEMBER_REMOVE
MEMBER_ROLE_UPDATE

GROUP_UPDATE
GROUP_DELETE
GROUP_TRANSFER_OWNERSHIP
```

---

# 92. Policy Example — Message

Conceptual logic:

```text
canEditMessage(user, message)

    ↓

Is user authenticated?
    ↓
Does message exist?
    ↓
Is user member of conversation?
    ↓
Is user message author?
    ↓
Is edit still allowed?
    ↓
ALLOW / DENY
```

---

# 93. Policy Example — Delete

```text
canDeleteMessage(user, message)

    ↓

Author?
  ├── YES → ALLOW
  |
  NO
  |
  v
Moderator permission?
  ├── YES → ALLOW
  |
  NO
  |
 DENY
```

---

# 94. Policy Example — Add Member

```text
canAddMember(user, conversation)

    ↓

Conversation member?
    ↓
Role?
    ↓
Permission?
    ↓
Conversation status?
    ↓
ALLOW / DENY
```

---

# 95. Authorization + WebSocket Architecture

```text
WebSocket
    |
    v
Authentication
    |
    v
socket.user
    |
    v
Event
    |
    v
Payload Validation
    |
    v
Resource Lookup
    |
    v
Authorization Policy
    |
    +------ DENY
    |
    v
Service
    |
    v
MongoDB
    |
    v
Broadcast
```

---

# 96. Why Authorization Should Be Centralized

Agar authorization har controller mein manually likhoge:

```text
controller A
controller B
controller C
socket A
socket B
```

to rules inconsistent ho sakte hain.

Central policies:

```text
message.policy
conversation.policy
member.policy
```

maintain karna easier banata hai.

---

# 97. But Don't Over-Abtract

Har cheez ko:

```text
generic authorize()
```

mein convert karna bhi galat ho sakta hai.

Complex resource-specific rules ko readable rakho.

Better:

```text
canDeleteMessage()
```

than:

```text
authorize(
  "MESSAGE",
  "DELETE",
  weirdOptions...
)
```

jab rule complicated ho.

---

# 98. Authorization Performance

High traffic application mein:

```text
Every message
Every event
Every request
```

membership checks database hit create kar sakte hain.

Optimization:

```text
Indexes
Efficient queries
Caching
Connection-level context
Batching
```

Lekin security ke badle performance optimize nahi karni.

---

# 99. MongoDB Indexes

Authorization queries ke liye indexes important hain.

Examples conceptually:

```text
ConversationMember:
conversationId + userId
```

Messages:

```text
conversationId + createdAt
```

Users:

```text
email
```

Exact indexes actual schema ke according define honge.

---

# 100. Authorization Consistency

Important:

```text
HTTP
WebSocket
Background jobs
```

sabko same authorization rules follow karne chahiye.

Example:

```text
canDeleteMessage()
```

policy ko multiple entry points use kar sakte hain.

---

# 101. Authorization + Background Jobs

Suppose:

```text
Message deletion job
```

background worker execute karta hai.

Worker ko normal user authorization blindly apply karne ki zarurat nahi ho sakti, because worker trusted system component hai.

Lekin:

```text
Who requested this operation?
Why?
```

audit/context maintain karna useful hai.

---

# 102. System vs User Authorization

Do types samjho:

```text
User Authorization
```

and:

```text
System Authorization
```

Example:

```text
User → Delete Message
```

versus:

```text
System → Delete expired messages
```

Dono policies different ho sakti hain.

---

# 103. Authorization and Privacy

Authorization sirf actions ke liye nahi.

Data visibility bhi authorization hai.

Examples:

```text
Last seen
Online status
Profile
Conversation metadata
Message content
```

Har resource ki visibility define karni hogi.

---

# 104. Privacy Rules

Example:

```text
User A blocks User B
```

Then:

```text
B → A profile?
B → A presence?
B → A DM?
```

policy define karegi.

Authorization system ko privacy rules ke saath integrate karna hoga.

---

# 105. Security Principle

Never assume:

```text
"Frontend ne button hide kar diya hai."
```

isliye:

```text
user authorized hai.
```

Always:

```text
Server decides.
```

---

# 106. Implementation Order

Authorization implementation:

## Step 1

```text
ConversationMember model
```

## Step 2

```text
Roles
```

## Step 3

```text
Permissions
```

## Step 4

```text
Conversation membership service
```

## Step 5

```text
Conversation policy
```

## Step 6

```text
Message policy
```

## Step 7

```text
HTTP authorization
```

## Step 8

```text
WebSocket authorization
```

## Step 9

```text
Room authorization
```

## Step 10

```text
Admin/moderator permissions
```

## Step 11

```text
Blocking/muting
```

## Step 12

```text
Audit logging
```

## Step 13

```text
Authorization tests
```

---

# 107. Authorization Testing

Har policy ke tests hone chahiye.

Example:

```text
Member can send message
Member cannot delete another user's message
Owner can delete conversation
Admin can remove member
Member cannot remove member
Non-member cannot read conversation
Removed member cannot send message
Blocked user cannot send DM
```

---

# 108. Authorization Test Matrix

| Scenario                            | Expected |
| ----------------------------------- | -------- |
| Unauthenticated user → private chat | DENY     |
| Member → read chat                  | ALLOW    |
| Member → send message               | ALLOW    |
| Member → delete own message         | ALLOW    |
| Member → delete other's message     | DENY     |
| Moderator → delete other's message  | ALLOW    |
| Member → add member                 | DENY     |
| Admin → add member                  | ALLOW    |
| Admin → delete group                | DENY     |
| Owner → delete group                | ALLOW    |
| Removed member → send message       | DENY     |
| Non-member → join private room      | DENY     |

---

# 109. Authorization Checklist

## Authentication

* [ ] User identity verified
* [ ] Token/session valid
* [ ] Session active

## Conversation

* [ ] Conversation exists
* [ ] User membership checked
* [ ] Membership status checked
* [ ] Role checked

## Message

* [ ] Message exists
* [ ] Conversation relationship checked
* [ ] User membership checked
* [ ] Ownership checked
* [ ] Moderator/admin permission checked

## Members

* [ ] Requester role checked
* [ ] Target user checked
* [ ] Target role checked
* [ ] Role escalation prevented

## WebSocket

* [ ] Connection authenticated
* [ ] Event authenticated
* [ ] Payload validated
* [ ] Resource authorization checked
* [ ] Room join authorized
* [ ] Sensitive events authorized

## Security

* [ ] Deny by default
* [ ] Least privilege
* [ ] No client-side trust
* [ ] IDOR protection
* [ ] Rate limiting
* [ ] Audit logging
* [ ] Authorization tests

---

# 110. Final Mental Model

Authorization ko is formula se yaad rakho:

```text
              WHO?
               |
               v
             User
               |
               +
             WHAT?
               |
               v
             Action
               |
               +
             WHICH?
               |
               v
            Resource
               |
               +
             RULE?
               |
               v
             Policy
               |
          +----+----+
          |         |
        ALLOW      DENY
          |         |
          v         v
       Execute     403
```

---

# 111. Chat Application Final Model

```text
                         USER
                           |
                    Authentication
                           |
                           v
                    User Identity
                           |
                           v
                    Authorization
                           |
              +------------+------------+
              |            |            |
           Role        Membership    Ownership
              |            |            |
              +------------+------------+
                           |
                           v
                         Policy
                           |
              +------------+------------+
              |                         |
            DENY                       ALLOW
              |                         |
             403                        v
                                  Action Execute
```

---

# 112. HTTP Final Flow

```text
Request
  |
  v
Authentication
  |
  v
req.user
  |
  v
Resource
  |
  v
Authorization Policy
  |
  +------ DENY → 403
  |
  v
Controller
  |
  v
Service
  |
  v
MongoDB
```

---

# 113. WebSocket Final Flow

```text
WebSocket Connection
       |
       v
Authentication
       |
       v
socket.user
       |
       v
Event
       |
       v
Payload Validation
       |
       v
Resource Authorization
       |
       +------ DENY
       |
       v
Handler
       |
       v
Service
       |
       v
MongoDB
       |
       v
Broadcast
```

---

# 114. Golden Rules

## Rule 1

> **Frontend permission security nahi hai. Backend final authority hai.**

## Rule 2

> **Authentication ke baad authorization mandatory hai.**

## Rule 3

> **Client ke userId, role ya permissions par trust mat karo.**

## Rule 4

> **Conversation membership chat application ka primary authorization mechanism hai.**

## Rule 5

> **Room join karna authorization ke baad hi hona chahiye.**

## Rule 6

> **Har sensitive WebSocket event ko authorize karo.**

## Rule 7

> **Ownership aur role dono ko consider karo.**

## Rule 8

> **Default decision DENY hona chahiye.**

## Rule 9

> **Least privilege follow karo.**

## Rule 10

> **Authorization ko HTTP aur WebSocket dono paths mein consistently enforce karo.**

---

# End

## Next Recommended Document

```text
data-model.md
```

Iske andar hum actual MongoDB database ka complete design karenge:

```text
User
Session
Conversation
ConversationMember
Message
Attachment
Notification
Block
```

Aur phir:

```text
Relationships
Indexes
Embedded vs Referenced Documents
MongoDB Schema Design
Query Patterns
Pagination
Message Storage
Conversation Storage
Data Consistency
Soft Delete
Timestamps
```

sab detail mein design karenge.
