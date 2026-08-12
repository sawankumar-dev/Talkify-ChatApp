# Database Design

> **Project:** Real-Time Chat Application
> **Document:** `database-design.md`
> **Database:** MongoDB
> **ODM:** Mongoose
> **Backend:** Node.js + Express.js
> **Real-Time:** WebSocket
> **Language:** Hinglish

---

# Table of Contents

1. [Database Design Ka Purpose](#1-database-design-ka-purpose)
2. [MongoDB Kyun?](#2-mongodb-kyun)
3. [Database Ki Responsibility](#3-database-ki-responsibility)
4. [High-Level Data Architecture](#4-high-level-data-architecture)
5. [Collections Overview](#5-collections-overview)
6. [Core Collections](#6-core-collections)
7. [User Collection](#7-user-collection)
8. [Session Collection](#8-session-collection)
9. [Conversation Collection](#9-conversation-collection)
10. [ConversationMember Collection](#10-conversationmember-collection)
11. [Message Collection](#11-message-collection)
12. [Attachment Collection](#12-attachment-collection)
13. [Notification Collection](#13-notification-collection)
14. [Block Collection](#14-block-collection)
15. [Reaction Collection](#15-reaction-collection)
16. [Read Receipt Design](#16-read-receipt-design)
17. [Relationships](#17-relationships)
18. [Embedding vs Referencing](#18-embedding-vs-referencing)
19. [Why Messages Are Separate](#19-why-messages-are-separate)
20. [Conversation Membership Design](#20-conversation-membership-design)
21. [Direct Chat Design](#21-direct-chat-design)
22. [Group Chat Design](#22-group-chat-design)
23. [Message Types](#23-message-types)
24. [Message Status](#24-message-status)
25. [Message Editing](#25-message-editing)
26. [Message Deletion](#26-message-deletion)
27. [Replies and Threads](#27-replies-and-threads)
28. [Reactions](#28-reactions)
29. [Attachments](#29-attachments)
30. [Read Receipts](#30-read-receipts)
31. [Unread Messages](#31-unread-messages)
32. [Last Message](#32-last-message)
33. [Online Presence](#33-online-presence)
34. [Typing State](#34-typing-state)
35. [Notifications](#35-notifications)
36. [Blocking](#36-blocking)
37. [Soft Delete](#37-soft-delete)
38. [Timestamps](#38-timestamps)
39. [MongoDB ObjectId](#39-mongodb-objectid)
40. [Indexes](#40-indexes)
41. [Compound Indexes](#41-compound-indexes)
42. [Unique Constraints](#42-unique-constraints)
43. [Query Patterns](#43-query-patterns)
44. [Message Pagination](#44-message-pagination)
45. [Cursor Pagination](#45-cursor-pagination)
46. [Conversation Pagination](#46-conversation-pagination)
47. [MongoDB Aggregation](#47-mongodb-aggregation)
48. [Transactions](#48-transactions)
49. [Atomic Operations](#49-atomic-operations)
50. [Concurrency](#50-concurrency)
51. [Data Consistency](#51-data-consistency)
52. [Denormalization](#52-denormalization)
53. [Data Duplication](#53-data-duplication)
54. [Performance](#54-performance)
55. [Large Collections](#55-large-collections)
56. [Message Retention](#56-message-retention)
57. [TTL Indexes](#57-ttl-indexes)
58. [Database Security](#58-database-security)
59. [Sensitive Data](#59-sensitive-data)
60. [Validation](#60-validation)
61. [Schema Versioning](#61-schema-versioning)
62. [Migration Strategy](#62-migration-strategy)
63. [Backup Strategy](#63-backup-strategy)
64. [Development Database](#64-development-database)
65. [Production Database](#65-production-database)
66. [Final Database Architecture](#66-final-database-architecture)
67. [Database Checklist](#67-database-checklist)
68. [Final Mental Model](#68-final-mental-model)

---

# 1. Database Design Ka Purpose

Database ka kaam sirf data save karna nahi hai.

Database ko support karna hai:

```text
Users
Conversations
Messages
Members
Attachments
Notifications
Read Receipts
Reactions
Blocks
Sessions
```

Aur importantly:

```text
Authentication
Authorization
Real-Time Messaging
Message History
Pagination
Search
Notifications
```

---

# 2. MongoDB Kyun?

Is project mein MongoDB use karne ke reasons:

```text
Flexible document model
Fast development
Good Node.js ecosystem
Mongoose support
Easy JSON-like data representation
Good fit for chat/message data
```

Chat application mein message data naturally document-oriented hota hai.

Example:

```json
{
  "content": "Hello bro",
  "senderId": "...",
  "conversationId": "..."
}
```

---

# 3. Database Ki Responsibility

Database ko ye decide nahi karna:

```text
"User ko message bhejne ki permission hai ya nahi?"
```

Ye authorization/service layer ka kaam hai.

Database ka kaam:

```text
Store
Retrieve
Update
Delete
Index
Query
Maintain data consistency
```

Architecture:

```text
Client
   ↓
Controller
   ↓
Service
   ↓
Authorization
   ↓
Database
```

---

# 4. High-Level Data Architecture

```text
                         DATABASE
                            |
        +-------------------+-------------------+
        |                   |                   |
       USER             CONVERSATION          MESSAGE
        |                   |                   |
        |                   |                   |
     SESSION        CONVERSATION_MEMBER       |
                            |                  |
                            +--------+---------+
                                     |
                                ATTACHMENT
                                     |
                                  REACTION
```

---

# 5. Collections Overview

Initial application mein ye collections rahengi:

```text
users
sessions
conversations
conversation_members
messages
attachments
notifications
blocks
reactions
```

Optional future collections:

```text
message_reads
audit_logs
reports
refresh_tokens
device_sessions
```

---

# 6. Core Collections

Sabse important:

```text
users
conversations
conversation_members
messages
```

Ye chat application ka foundation hain.

---

# 7. User Collection

Collection:

```text
users
```

Purpose:

```text
User identity
Profile
Authentication-related information
Account status
```

Conceptual structure:

```text
User
├── _id
├── username
├── email
├── passwordHash
├── avatar
├── bio
├── status
├── isVerified
├── createdAt
└── updatedAt
```

Example:

```json
{
  "_id": "ObjectId",
  "username": "sawan",
  "email": "user@example.com",
  "passwordHash": "...",
  "avatar": "...",
  "bio": "Developer",
  "status": "active",
  "isVerified": true
}
```

---

# 8. Session Collection

Collection:

```text
sessions
```

Purpose:

```text
Login sessions
Device information
Session revocation
Refresh token/session tracking
```

Concept:

```text
Session
├── userId
├── tokenHash
├── device
├── ip
├── userAgent
├── expiresAt
├── revokedAt
└── createdAt
```

---

# 9. Conversation Collection

Collection:

```text
conversations
```

Conversation types:

```text
direct
group
```

Concept:

```text
Conversation
├── _id
├── type
├── name
├── avatar
├── description
├── ownerId
├── lastMessageId
├── createdAt
└── updatedAt
```

---

# 10. ConversationMember Collection

Collection:

```text
conversation_members
```

Ye authorization ke liye extremely important collection hai.

Concept:

```text
ConversationMember
├── _id
├── conversationId
├── userId
├── role
├── joinedAt
├── mutedAt
└── leftAt
```

Relationship:

```text
User
   |
   +---- ConversationMember
                    |
                    +---- Conversation
```

---

# 11. Message Collection

Collection:

```text
messages
```

Concept:

```text
Message
├── _id
├── conversationId
├── senderId
├── type
├── content
├── replyTo
├── attachments
├── editedAt
├── deletedAt
├── createdAt
└── updatedAt
```

Example:

```json
{
  "_id": "ObjectId",
  "conversationId": "ObjectId",
  "senderId": "ObjectId",
  "type": "text",
  "content": "Hello bro",
  "createdAt": "..."
}
```

---

# 12. Attachment Collection

Collection:

```text
attachments
```

Use:

```text
Images
Videos
Documents
Audio
Files
```

Concept:

```text
Attachment
├── _id
├── messageId
├── uploaderId
├── type
├── url
├── filename
├── mimeType
├── size
└── createdAt
```

Large binary files MongoDB documents mein unnecessarily store nahi karenge.

Storage service:

```text
Object Storage
      |
      v
Attachment URL
      |
      v
MongoDB
```

---

# 13. Notification Collection

Collection:

```text
notifications
```

Example:

```text
Notification
├── _id
├── userId
├── type
├── actorId
├── conversationId
├── messageId
├── readAt
└── createdAt
```

Examples:

```text
New message
Mention
Group invitation
Added to group
Removed from group
```

---

# 14. Block Collection

Collection:

```text
blocks
```

Concept:

```text
Block
├── _id
├── blockerId
├── blockedId
└── createdAt
```

Example:

```text
User A
   |
   | blocks
   v
User B
```

---

# 15. Reaction Collection

Collection:

```text
reactions
```

Concept:

```text
Reaction
├── _id
├── messageId
├── userId
├── emoji
└── createdAt
```

Example:

```text
Message
   |
   +── ❤️ User A
   +── 😂 User B
   +── 👍 User C
```

---

# 16. Read Receipt Design

Read status ko initially message document mein huge array ke form mein store karna avoid karenge.

Instead, conversation/member level par last-read pointer rakh sakte hain.

Example:

```text
ConversationMember
├── lastReadMessageId
└── lastReadAt
```

This is much more scalable.

---

# 17. Relationships

Main relationships:

```text
User
 |
 +---- Session
 |
 +---- ConversationMember
 |
 +---- Message
 |
 +---- Notification
 |
 +---- Block
 |
 +---- Reaction
```

Conversation:

```text
Conversation
 |
 +---- ConversationMember
 |
 +---- Message
```

Message:

```text
Message
 |
 +---- Attachment
 |
 +---- Reaction
 |
 +---- Reply
```

---

# 18. Embedding vs Referencing

MongoDB mein important decision:

```text
Embed
OR
Reference
```

Embedding:

```json
{
  "user": {
    "name": "Sawan",
    "avatar": "..."
  }
}
```

Referencing:

```json
{
  "userId": "ObjectId"
}
```

---

# 19. Kab Embed Karein?

Embed when:

```text
Data small
Data tightly coupled
Data usually together read hota hai
Child independently query nahi hota
```

Example:

```text
Small configuration
```

---

# 20. Kab Reference Karein?

Reference when:

```text
Data large
Data frequently changes
Data independently accessed
One-to-many relationship large hai
```

Chat messages ke liye referencing better hai.

---

# 21. Why Messages Are Separate

Wrong architecture:

```text
Conversation
  |
  +── messages: [
        1,
        2,
        3,
        ...
        100000
      ]
```

Problem:

```text
Huge document
Slow updates
Document growth
Pagination complexity
16MB BSON document limit
```

Correct:

```text
Conversation
      |
      +---- Message
      +---- Message
      +---- Message
```

---

# 22. Conversation Membership Design

Membership ko separate collection rakhne ka reason:

```text
Conversation
```

mein thousands of members ho sakte hain.

Separate collection:

```text
conversation_members
```

better queryability provide karti hai.

Example:

```text
conversationId + userId
```

par index.

---

# 23. Direct Chat Design

Direct chat mein exactly do users:

```text
User A
User B
```

Conversation:

```json
{
  "type": "direct"
}
```

Members:

```text
ConversationMember
├── A
└── B
```

---

# 24. Prevent Duplicate Direct Chats

Important.

Same users ke beech multiple direct conversations accidentally create nahi honi chahiye.

Logical unique key:

```text
min(userA, userB)
max(userA, userB)
```

Example:

```text
A + B
```

same as:

```text
B + A
```

Implementation strategy project ke scale ke according define karenge.

---

# 25. Group Chat Design

Group:

```text
Conversation
├── type = group
├── name
├── ownerId
└── avatar
```

Members:

```text
conversation_members
├── owner
├── admin
├── member
└── member
```

Messages:

```text
messages
├── conversationId
├── senderId
└── content
```

---

# 26. Message Types

Initial types:

```text
text
image
video
audio
file
system
```

Future:

```text
poll
location
contact
sticker
voice
```

---

# 27. Message Schema Concept

```json
{
  "conversationId": "ObjectId",
  "senderId": "ObjectId",
  "type": "text",
  "content": "Hello",
  "replyTo": null,
  "createdAt": "..."
}
```

---

# 28. Message Status

Message lifecycle:

```text
created
   ↓
sent
   ↓
delivered
   ↓
read
```

Real-time events:

```text
message:sent
message:delivered
message:read
```

Database mein har status ko har message ke andar giant array ke form mein store karna avoid karenge.

---

# 29. Message Editing

Fields:

```text
editedAt
```

Example:

```json
{
  "content": "Updated message",
  "editedAt": "2026-08-11T..."
}
```

Optional:

```text
editHistory
```

future feature ho sakta hai.

---

# 30. Message Deletion

Hard delete:

```text
Document completely removed
```

Soft delete:

```json
{
  "deletedAt": "...",
  "content": null
}
```

Chat applications mein soft deletion generally more useful hoti hai.

---

# 31. Deleted Message Representation

Client ko:

```text
"This message was deleted"
```

dikhaya ja sakta hai.

Database:

```text
deletedAt
deletedBy
```

optional fields.

---

# 32. Replies

Message:

```text
Message A
```

reply:

```text
Message B
replyTo = Message A
```

Schema:

```json
{
  "replyTo": "ObjectId"
}
```

---

# 33. Threads

Future thread support:

```text
Message
   |
   +── replies
```

Large replies ko embedded array mein store nahi karna.

Instead:

```text
messages.replyTo
```

reference.

Query:

```text
Find messages
where replyTo = parentMessageId
```

---

# 34. Reactions

Example:

```text
Message
   |
   +── ❤️ User A
   +── ❤️ User B
   +── 😂 User C
```

Separate collection:

```text
reactions
```

Important unique constraint:

```text
messageId + userId + emoji
```

ya product requirement ke according:

```text
messageId + userId
```

if one reaction per user is allowed.

---

# 35. Attachments

Message:

```text
Message
  |
  +── Attachment
```

Attachment metadata:

```text
filename
mimeType
size
url
storageKey
```

Actual file:

```text
Object Storage
```

MongoDB:

```text
Metadata only
```

---

# 36. File Upload Flow

```text
Client
  |
  v
Upload API
  |
  v
Storage
  |
  v
File URL
  |
  v
Create Message
  |
  v
MongoDB
```

---

# 37. Read Receipts

Simple scalable strategy:

```text
ConversationMember
├── lastReadMessageId
└── lastReadAt
```

Example:

```text
User A
Conversation 123
lastReadMessageId = Message 500
```

Then unread messages:

```text
Messages after Message 500
```

---

# 38. Unread Messages

Instead of every message mein:

```text
readBy: [...]
```

huge array rakhna, member-level pointer use kar sakte hain.

Concept:

```text
lastReadMessageId
```

Then:

```text
Unread = messages after lastReadMessageId
```

---

# 39. Unread Count

Potential query:

```text
messages
conversationId = X
createdAt > lastReadAt
senderId != currentUser
```

Production optimization ke liye counters maintain kiye ja sakte hain.

---

# 40. Last Message

Conversation list mein har conversation ka last message chahiye.

Har baar:

```text
Find latest message
```

karna expensive ho sakta hai.

Isliye Conversation mein denormalized field:

```text
lastMessageId
lastMessageAt
```

rakhna useful hai.

---

# 41. Denormalized Last Message

Architecture:

```text
Conversation
├── lastMessageId
└── lastMessageAt
```

Message create:

```text
Create Message
     ↓
Update Conversation
     ↓
lastMessageId
```

---

# 42. Why Denormalization?

MongoDB mein related data ko kabhi-kabhi duplicate karna performance improve karta hai.

Example:

```text
Conversation
lastMessage
```

instead of every conversation list request par:

```text
Aggregation
+
Lookup
+
Sort
```

---

# 43. Online Presence

Online state ko MongoDB mein primary real-time source nahi banana chahiye.

Presence best handled via:

```text
WebSocket server
```

Example:

```text
socket connected
   ↓
online
```

```text
socket disconnected
   ↓
offline
```

Database mein optional:

```text
lastSeenAt
```

store kar sakte hain.

---

# 44. Typing State

Typing state:

```text
typing:start
typing:stop
```

mostly in-memory/WebSocket state hona chahiye.

MongoDB mein:

```text
DO NOT store every typing event
```

---

# 45. Notifications

Notification types:

```text
message
mention
group_invite
group_added
group_removed
role_changed
```

Read state:

```text
readAt
```

Unread:

```text
readAt = null
```

---

# 46. Notification Cleanup

Old notifications ko eventually:

```text
archive
```

ya:

```text
delete
```

kiya ja sakta hai.

TTL indexes future mein useful ho sakte hain.

---

# 47. Blocking

Block document:

```json
{
  "blockerId": "A",
  "blockedId": "B",
  "createdAt": "..."
}
```

Unique index:

```text
blockerId + blockedId
```

---

# 48. Blocking Authorization

Message send se pehle:

```text
Is sender blocked?
```

check.

Direct chat:

```text
A → B
```

allowed/denied according to block policy.

---

# 49. Soft Delete

Soft delete ka matlab:

```text
Document database se immediately remove nahi hota.
```

Example:

```json
{
  "deletedAt": "2026-08-11T..."
}
```

Advantages:

```text
Audit
Recovery
References preserve
Moderation
Consistency
```

---

# 50. Soft Delete Query

Normal query:

```text
deletedAt: null
```

Deleted data:

```text
deletedAt: { $ne: null }
```

---

# 51. Timestamps

Important collections mein:

```text
createdAt
updatedAt
```

automatically maintain karenge.

Messages:

```text
createdAt
editedAt
deletedAt
```

---

# 52. MongoDB ObjectId

MongoDB default:

```text
ObjectId
```

Use karenge.

Example:

```text
665f...
```

Relations:

```text
userId
conversationId
messageId
```

ObjectId references honge.

---

# 53. Indexes

Indexes queries ko fast banate hain.

Without index:

```text
MongoDB
   ↓
Scan many documents
```

With index:

```text
MongoDB
   ↓
Index
   ↓
Relevant documents
```

---

# 54. User Indexes

Likely indexes:

```text
email
username
```

Email:

```text
unique: true
```

Username uniqueness product requirement ke according.

---

# 55. Conversation Member Indexes

Most important:

```text
conversationId + userId
```

Purpose:

```text
Is user member of conversation?
```

Very frequent authorization query.

---

# 56. Message Indexes

Most important:

```text
conversationId + createdAt
```

Purpose:

```text
Get conversation messages
sorted by time
```

---

# 57. Sender Index

Possible:

```text
senderId + createdAt
```

Useful for:

```text
User's messages
Moderation
Search
Analytics
```

Only add indexes that real query patterns require.

---

# 58. Compound Indexes

Example:

```text
conversationId: 1
createdAt: -1
```

This supports:

```text
Find messages for conversation
sort newest first
```

---

# 59. Unique Constraints

Examples:

```text
users.email
```

and:

```text
conversation_members.conversationId + userId
```

This prevents duplicate membership.

---

# 60. Query Patterns

Database design query patterns se driven hona chahiye.

Common queries:

```text
Get user
Get conversations
Get members
Get messages
Get latest messages
Check membership
Get unread messages
Get notifications
Get reactions
Check block
```

---

# 61. Query — Get User

```text
users.findOne({
    _id: userId
})
```

---

# 62. Query — Check Membership

Concept:

```text
conversation_members.findOne({
    conversationId,
    userId,
    leftAt: null
})
```

Ye authorization ka core query hai.

---

# 63. Query — Get Messages

Concept:

```text
messages
  .find({ conversationId })
  .sort({ createdAt: -1 })
  .limit(50)
```

Production mein cursor pagination better hai.

---

# 64. Message Pagination

Messages potentially millions tak ho sakte hain.

Never:

```text
GET all messages
```

Instead:

```text
GET latest 50
```

Then:

```text
Load older
```

---

# 65. Cursor Pagination

Recommended.

Example:

```text
GET /conversations/:id/messages?before=<messageId>
```

Flow:

```text
Latest 50
    ↓
Oldest message ID
    ↓
Request older
    ↓
Next 50
```

---

# 66. Why Cursor Pagination?

Offset:

```text
skip(100000)
```

large datasets par inefficient ho sakta hai.

Cursor:

```text
createdAt < cursor
```

more scalable approach hai.

---

# 67. Message Cursor

Possible cursor:

```text
createdAt
+
_id
```

Compound sorting ambiguity avoid karne ke liye `_id` tie-breaker useful hai.

---

# 68. Conversation Pagination

User ke hundreds/thousands conversations ho sakte hain.

Use:

```text
limit
cursor
```

Example:

```text
GET /conversations?limit=20&cursor=...
```

---

# 69. MongoDB Aggregation

Aggregation useful hai:

```text
Conversation list
Unread counts
Search
Statistics
```

Example:

```text
$match
   ↓
$sort
   ↓
$lookup
   ↓
$limit
```

---

# 70. Aggregation Overuse

Har query ko aggregation banana zaruri nahi.

Simple query:

```text
find()
```

enough ho to aggregation avoid karo.

Goal:

```text
Readable
Fast
Maintainable
```

---

# 71. Transactions

MongoDB transactions tab useful hain jab multiple documents/collections ko atomic consistency ke saath update karna ho.

Example:

```text
Transfer ownership
```

Possible operations:

```text
Old owner → member
New owner → owner
Conversation ownerId → new owner
```

Ye coordinated operation hai.

---

# 72. Transactions vs Single Document Atomicity

MongoDB single-document updates atomic hote hain.

Agar kaam ek document mein safely ho raha hai:

```text
No transaction needed
```

Multi-document consistency required ho:

```text
Transaction consider karo
```

---

# 73. Atomic Operations

Useful MongoDB operators:

```text
$set
$unset
$inc
$push
$pull
$addToSet
```

Example:

```text
$inc
```

unread counter update ke liye useful ho sakta hai.

---

# 74. Concurrency

Chat app mein concurrent operations common hain:

```text
Two messages at same time
Two admins changing roles
User leaving while message arrives
Multiple reactions
```

Database operations ko race conditions ke against design karna hoga.

---

# 75. Unique Index + Concurrency

Example:

```text
User A adds User B
```

same time:

```text
User C also adds User B
```

Unique membership index:

```text
conversationId + userId
```

duplicate membership prevent karne mein help karega.

---

# 76. Data Consistency

Important invariants:

```text
A conversation member should exist only once.
A message must belong to a conversation.
A message sender must be a valid user.
A reaction should follow reaction uniqueness policy.
A conversation owner should satisfy ownership rules.
```

---

# 77. Denormalization

MongoDB mein controlled denormalization useful hai.

Example:

```text
Conversation
├── lastMessageId
├── lastMessageAt
```

Potentially:

```text
lastMessagePreview
```

bhi store kar sakte hain.

---

# 78. Denormalization Trade-Off

Benefit:

```text
Fast reads
```

Cost:

```text
Duplicate data
Consistency maintenance
More writes
```

Rule:

> Performance ke liye duplicate karo, lekin source of truth clear rakho.

---

# 79. Source of Truth

Example:

```text
Message.content
```

source of truth hai.

Agar:

```text
Conversation.lastMessagePreview
```

same content rakhta hai, wo denormalized copy hai.

Message edit hone par:

```text
lastMessagePreview
```

update karna padega if it represents current content.

---

# 80. Performance

Performance principles:

```text
Proper indexes
Cursor pagination
Small documents
Avoid huge arrays
Avoid unnecessary population
Avoid N+1 queries
Use projections
Use lean queries where appropriate
```

---

# 81. Avoid N+1 Queries

Bad:

```text
Get 50 messages
   ↓
50 user queries
```

Instead:

```text
Aggregation
populate
batch query
```

use kar sakte hain.

---

# 82. Projection

Agar sirf:

```text
username
avatar
```

chahiye to full user document fetch mat karo.

Concept:

```text
select:
username
avatar
```

Less data transfer.

---

# 83. `lean()` in Mongoose

Read-only queries mein Mongoose document methods ki need nahi ho to:

```text
lean()
```

performance improve kar sakta hai.

Use carefully.

---

# 84. Large Collections

Messages collection sabse rapidly grow karegi.

Example:

```text
1,000 users
10,000 users
1M messages
100M messages
```

Isliye:

```text
Indexes
Pagination
Archival
Retention
Monitoring
```

important hain.

---

# 85. Message Retention

Future feature:

```text
Messages expire after 30 days
```

ya:

```text
Delete after 1 year
```

Retention policy product requirement par depend karegi.

---

# 86. TTL Indexes

MongoDB TTL index automatically documents expire kar sakta hai.

Useful for:

```text
Temporary sessions
Temporary tokens
Temporary data
Expiring notifications
```

Messages par TTL tabhi use karo jab product explicitly message expiration require karta ho.

---

# 87. Database Security

MongoDB ko publicly expose mat karo.

Architecture:

```text
Internet
   |
   v
Backend Server
   |
   v
Private MongoDB
```

Database credentials environment variables mein.

---

# 88. Sensitive Data

Never store:

```text
Plain password
Raw refresh token
Unnecessary payment data
Sensitive secrets
```

Password:

```text
passwordHash
```

Token:

```text
hashed token
```

where applicable.

---

# 89. Validation

Validation multiple layers par ho sakti hai.

```text
Client validation
       ↓
API validation
       ↓
Mongoose validation
       ↓
Database
```

Client validation UX ke liye.

Backend validation security ke liye mandatory.

---

# 90. Mongoose Schema Validation

Examples:

```text
required
enum
minLength
maxLength
match
unique indexes
```

Example message type:

```text
enum:
text
image
video
audio
file
system
```

---

# 91. Schema Versioning

Future mein schema change hoga.

Example:

```text
v1
v2
v3
```

Migration strategy document karna important hai.

---

# 92. Migration Strategy

Potential migration:

```text
Old field
    ↓
Read old + new
    ↓
Backfill data
    ↓
Switch writes
    ↓
Remove old field
```

Production database mein direct destructive changes avoid karo.

---

# 93. Backup Strategy

Production mein:

```text
Regular backups
Point-in-time recovery
Backup verification
Restore testing
```

important hain.

Backup exists karna enough nahi.

Restore bhi test hona chahiye.

---

# 94. Development Database

Development:

```text
chat_app_dev
```

Testing:

```text
chat_app_test
```

Production:

```text
chat_app_prod
```

Separate environments rakhna better.

---

# 95. Environment Configuration

Concept:

```text
MONGODB_URI
```

Example:

```text
mongodb://localhost:27017/chat_app
```

Production credentials code mein hardcode nahi karni.

---

# 96. Final Collection Architecture

```text
users
│
├── sessions
│
├── conversation_members
│
├── messages
│
├── notifications
│
├── blocks
│
└── reactions


conversations
│
├── conversation_members
│
└── messages


messages
│
├── attachments
│
├── reactions
│
└── replies
```

---

# 97. Final Relationship Diagram

```text
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          v                v                v
      Sessions       Conversation       Blocks
                           │
                           │
                           v
                ConversationMember
                           │
                           v
                     Conversation
                           │
                           v
                        Message
                     /     |      \
                    /      |       \
                   v       v        v
             Attachment Reaction  Reply
```

---

# 98. Complete Data Flow — Sending Message

```text
Client
  |
  v
WebSocket
  |
  v
Authentication
  |
  v
Authorization
  |
  v
ConversationMember Check
  |
  v
Message Validation
  |
  v
Create Message
  |
  v
Update Conversation
  |
  +── lastMessageId
  +── lastMessageAt
  |
  v
Broadcast
  |
  v
Recipients
```

---

# 99. Complete Data Flow — Read Message

```text
Client
  |
  v
message:read
  |
  v
Authentication
  |
  v
Conversation Membership
  |
  v
Update ConversationMember
  |
  +── lastReadMessageId
  +── lastReadAt
  |
  v
Unread count changes
```

---

# 100. Complete Data Flow — Add Member

```text
Client
  |
  v
HTTP / WebSocket
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Conversation
  |
  v
Check existing membership
  |
  v
Create ConversationMember
  |
  v
Notification
  |
  v
WebSocket Event
```

---

# 101. Database Design Principles

## Principle 1

> **Data access patterns ko samajh kar schema design karo.**

## Principle 2

> **Messages ko conversation document ke andar giant array mat banao.**

## Principle 3

> **Large one-to-many relationships ko reference karo.**

## Principle 4

> **Frequently queried fields par indexes lagao.**

## Principle 5

> **Authorization ke liye ConversationMember ko carefully design karo.**

## Principle 6

> **Pagination mandatory hai.**

## Principle 7

> **Client input ko database mein blindly save mat karo.**

## Principle 8

> **Denormalization controlled honi chahiye.**

## Principle 9

> **Presence aur typing ko MongoDB mein unnecessarily store mat karo.**

## Principle 10

> **Database ko application ke query patterns ke around design karo.**

---

# 102. Database Checklist

## Users

* [ ] User schema
* [ ] Email uniqueness
* [ ] Username strategy
* [ ] Password hash
* [ ] Account status
* [ ] Verification status

## Sessions

* [ ] Session model
* [ ] Token strategy
* [ ] Expiration
* [ ] Revocation
* [ ] TTL index

## Conversations

* [ ] Direct chat
* [ ] Group chat
* [ ] Owner
* [ ] Last message
* [ ] Timestamps

## Members

* [ ] User reference
* [ ] Conversation reference
* [ ] Role
* [ ] Joined timestamp
* [ ] Leave/remove state
* [ ] Unique compound index

## Messages

* [ ] Sender
* [ ] Conversation
* [ ] Content
* [ ] Type
* [ ] Reply
* [ ] Edit
* [ ] Delete
* [ ] Timestamp
* [ ] Pagination index

## Attachments

* [ ] File metadata
* [ ] Storage URL
* [ ] MIME type
* [ ] Size

## Reactions

* [ ] Message reference
* [ ] User reference
* [ ] Emoji
* [ ] Unique strategy

## Notifications

* [ ] Recipient
* [ ] Actor
* [ ] Type
* [ ] Read state
* [ ] Expiration strategy

## Blocks

* [ ] Blocker
* [ ] Blocked user
* [ ] Unique compound index

## Performance

* [ ] Indexes
* [ ] Cursor pagination
* [ ] Projection
* [ ] Avoid N+1
* [ ] Avoid huge documents
* [ ] Query monitoring

---

# 103. Final Mental Model

Database ko ek **city** ki tarah imagine karo.

```text
Users
  ↓
People

Conversations
  ↓
Chat rooms

ConversationMembers
  ↓
Room membership cards

Messages
  ↓
Letters/messages inside rooms

Attachments
  ↓
Files stored elsewhere

Reactions
  ↓
Responses to messages

Notifications
  ↓
Alerts

Blocks
  ↓
Restrictions
```

Aur sabse important relationship:

```text
                 USER
                  |
                  v
          CONVERSATION MEMBER
                  |
                  v
            CONVERSATION
                  |
                  v
               MESSAGE
```

Ye hamare poore chat application ka database backbone hai.

---

# 104. Final Architecture

```text
                         MongoDB
                            |
        +-------------------+-------------------+
        |                   |                   |
       USERS          CONVERSATIONS          MESSAGES
        |                   |                   |
        |                   |                   |
    SESSIONS        CONVERSATION_MEMBERS      |
        |                   |                  |
        |                   +--------+---------+
        |                            |
        v                            v
   NOTIFICATIONS                 ATTACHMENTS
        |
        v
      BLOCKS
        |
        v
     REACTIONS
```

Application layers:

```text
                    CLIENT
                       |
              +--------+--------+
              |                 |
             HTTP          WebSocket
              |                 |
              +--------+--------+
                       |
                Authentication
                       |
                Authorization
                       |
                    Service
                       |
                    Mongoose
                       |
                    MongoDB
```

---

# End

## Next Recommended Document

```text
api-design.md
```

Isme ab hum actual API contract design karenge:

```text
Authentication APIs
User APIs
Conversation APIs
Member APIs
Message APIs
Notification APIs
Block APIs
Upload APIs
HTTP status codes
Request body
Response body
Error format
Pagination
Cursor
Validation
WebSocket events ke API-style contracts
```

Uske baad **models → services → controllers → routes → WebSocket events** ko isi database design ke basis par implementation mein le jayenge.
