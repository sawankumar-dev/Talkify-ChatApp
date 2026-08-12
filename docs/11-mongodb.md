# MongoDB — Complete Guide

> **Project:** Real-Time Chat Application
> **Database:** MongoDB
> **ODM:** Mongoose
> **Backend:** Node.js + Express.js
> **Real-Time:** WebSocket
> **Language:** Hinglish

---

# Table of Contents

1. [MongoDB Kya Hai](#1-mongodb-kya-hai)
2. [MongoDB Kyun Use Kar Rahe Hain](#2-mongodb-kyun-use-kar-rahe-hain)
3. [SQL vs MongoDB](#3-sql-vs-mongodb)
4. [MongoDB Architecture](#4-mongodb-architecture)
5. [Database](#5-database)
6. [Collection](#6-collection)
7. [Document](#7-document)
8. [Field](#8-field)
9. [BSON](#9-bson)
10. [ObjectId](#10-objectid)
11. [MongoDB Installation](#11-mongodb-installation)
12. [MongoDB Compass](#12-mongodb-compass)
13. [MongoDB Shell](#13-mongodb-shell)
14. [MongoDB Atlas](#14-mongodb-atlas)
15. [Database Create Karna](#15-database-create-karna)
16. [Collection Create Karna](#16-collection-create-karna)
17. [Documents Insert Karna](#17-documents-insert-karna)
18. [Documents Read Karna](#18-documents-read-karna)
19. [Documents Update Karna](#19-documents-update-karna)
20. [Documents Delete Karna](#20-documents-delete-karna)
21. [CRUD Mental Model](#21-crud-mental-model)
22. [Query Operators](#22-query-operators)
23. [Comparison Operators](#23-comparison-operators)
24. [Logical Operators](#24-logical-operators)
25. [Array Operators](#25-array-operators)
26. [Element Operators](#26-element-operators)
27. [Update Operators](#27-update-operators)
28. [Projection](#28-projection)
29. [Sorting](#29-sorting)
30. [Limit](#30-limit)
31. [Skip](#31-skip)
32. [Pagination](#32-pagination)
33. [Cursor Pagination](#33-cursor-pagination)
34. [Indexes](#34-indexes)
35. [Single Field Index](#35-single-field-index)
36. [Compound Index](#36-compound-index)
37. [Unique Index](#37-unique-index)
38. [TTL Index](#38-ttl-index)
39. [Text Index](#39-text-index)
40. [Index Strategy](#40-index-strategy)
41. [Aggregation](#41-aggregation)
42. [Aggregation Pipeline](#42-aggregation-pipeline)
43. [$match](#43-match)
44. [$project](#44-project)
45. [$sort](#45-sort)
46. [$limit](#46-limit)
47. [$skip](#47-skip)
48. [$group](#48-group)
49. [$lookup](#49-lookup)
50. [$unwind](#50-unwind)
51. [Aggregation in Chat App](#51-aggregation-in-chat-app)
52. [Embedding](#52-embedding)
53. [Referencing](#53-referencing)
54. [Embedding vs Referencing](#54-embedding-vs-referencing)
55. [Schema Design](#55-schema-design)
56. [Relationships](#56-relationships)
57. [One-to-One](#57-one-to-one)
58. [One-to-Many](#58-one-to-many)
59. [Many-to-Many](#59-many-to-many)
60. [MongoDB Atomicity](#60-mongodb-atomicity)
61. [Atomic Operators](#61-atomic-operators)
62. [Transactions](#62-transactions)
63. [Concurrency](#63-concurrency)
64. [MongoDB Performance](#64-mongodb-performance)
65. [N+1 Problem](#65-n1-problem)
66. [Large Collections](#66-large-collections)
67. [MongoDB Security](#67-mongodb-security)
68. [Backups](#68-backups)
69. [MongoDB Monitoring](#69-mongodb-monitoring)
70. [MongoDB with Node.js](#70-mongodb-with-nodejs)
71. [Mongoose](#71-mongoose)
72. [MongoDB Driver vs Mongoose](#72-mongodb-driver-vs-mongoose)
73. [Mongoose Connection](#73-mongoose-connection)
74. [Mongoose Schema](#74-mongoose-schema)
75. [Mongoose Model](#75-mongoose-model)
76. [Mongoose Validation](#76-mongoose-validation)
77. [Mongoose Middleware](#77-mongoose-middleware)
78. [Mongoose Populate](#78-mongoose-populate)
79. [Mongoose Lean](#79-mongoose-lean)
80. [Mongoose Query Methods](#80-mongoose-query-methods)
81. [Chat App Database](#81-chat-app-database)
82. [Users Collection](#82-users-collection)
83. [Conversations Collection](#83-conversations-collection)
84. [Conversation Members](#84-conversation-members)
85. [Messages Collection](#85-messages-collection)
86. [Attachments](#86-attachments)
87. [Notifications](#87-notifications)
88. [Blocks](#88-blocks)
89. [Reactions](#89-reactions)
90. [Message Query Strategy](#90-message-query-strategy)
91. [Unread Messages](#91-unread-messages)
92. [Last Message](#92-last-message)
93. [Search](#93-search)
94. [MongoDB + WebSocket](#94-mongodb--websocket)
95. [Message Persistence Flow](#95-message-persistence-flow)
96. [Offline User Flow](#96-offline-user-flow)
97. [Database Errors](#97-database-errors)
98. [Production Checklist](#98-production-checklist)
99. [MongoDB Mastery Checklist](#99-mongodb-mastery-checklist)
100. [Final Mental Model](#100-final-mental-model)

---

# 1. MongoDB Kya Hai?

MongoDB ek **NoSQL document database** hai.

SQL databases mein data generally tables aur rows mein hota hai.

MongoDB mein data:

```text
Database
   ↓
Collection
   ↓
Document
   ↓
Fields
```

Example:

```json
{
  "_id": "ObjectId",
  "username": "sawan",
  "email": "user@example.com"
}
```

Is document ko relational database ki row ke roughly equivalent samajh sakte ho.

Lekin MongoDB aur SQL exactly same nahi hain.

---

# 2. MongoDB Kyun Use Kar Rahe Hain?

Hamare chat application mein MongoDB useful hai because:

```text
Flexible document model
Easy Node.js integration
Mongoose ecosystem
Fast development
Good support for large message collections
Easy JSON-like data handling
```

Lekin MongoDB ko sirf "fast database" samajhna galat hai.

Real reason:

> Application ke data access patterns ke according MongoDB ka document model achha fit ho sakta hai.

---

# 3. SQL vs MongoDB

Basic mapping:

| SQL         | MongoDB                       |
| ----------- | ----------------------------- |
| Database    | Database                      |
| Table       | Collection                    |
| Row         | Document                      |
| Column      | Field                         |
| Primary Key | `_id`                         |
| JOIN        | `$lookup` / application logic |
| Index       | Index                         |
| Transaction | Transaction                   |

Example SQL:

```text
users
--------------------
id
name
email
```

MongoDB:

```json
{
  "_id": "...",
  "name": "Sawan",
  "email": "user@example.com"
}
```

---

# 4. MongoDB Architecture

High-level:

```text
Application
     |
     v
MongoDB Driver / Mongoose
     |
     v
MongoDB Server
     |
     +── Database
           |
           +── Collection
                 |
                 +── Documents
```

---

# 5. Database

Database ek logical container hai.

Example:

```text
chat_app
```

Iske andar:

```text
users
messages
conversations
sessions
```

collections ho sakti hain.

---

# 6. Collection

Collection documents ka group hai.

Example:

```text
users
```

Collection ko SQL table ke similar samajh sakte ho.

Lekin MongoDB collection ke documents necessarily exact same shape ke hone zaruri nahi.

---

# 7. Document

Document MongoDB ka fundamental data unit hai.

Example:

```json
{
  "_id": "ObjectId",
  "name": "Sawan",
  "age": 20
}
```

Document BSON format mein store hota hai.

---

# 8. Field

Document ke andar har property field hai.

```json
{
  "name": "Sawan",
  "age": 20
}
```

Fields:

```text
name
age
```

---

# 9. BSON

MongoDB internally BSON use karta hai.

BSON:

> Binary JSON

BSON JSON jaisa dikhta hai but additional data types support karta hai.

Examples:

```text
ObjectId
Date
Decimal128
Binary
```

---

# 10. ObjectId

MongoDB default `_id` ke liye ObjectId use kar sakta hai.

Example:

```text
665f8f0c...
```

ObjectId unique identifier hai.

Relationships mein:

```text
userId
conversationId
messageId
```

ObjectId references use karenge.

---

# 11. MongoDB Installation

Development ke liye MongoDB local machine par install kar sakte ho.

Architecture:

```text
Your PC
  |
  +── Node.js
  |
  +── MongoDB
  |
  +── MongoDB Compass
```

---

# 12. MongoDB Compass

MongoDB Compass GUI hai.

Isse:

```text
Databases
Collections
Documents
Indexes
Queries
Aggregation
```

visual interface se manage kar sakte ho.

Learning ke time Compass bahut useful hai.

---

# 13. MongoDB Shell

MongoDB Shell:

```text
mongosh
```

Command-line interface provide karta hai.

Example:

```text
mongosh
```

Then:

```text
show dbs
```

---

# 14. MongoDB Atlas

MongoDB Atlas cloud-hosted MongoDB service hai.

Architecture:

```text
Your App
   |
 Internet
   |
MongoDB Atlas
```

Local development:

```text
localhost
```

Production:

```text
MongoDB Atlas
```

use kiya ja sakta hai.

---

# 15. Database Create Karna

MongoDB mein database generally tab persist hota hai jab usmein data create hota hai.

Shell:

```javascript
use chat_app
```

Then document insert:

```javascript
db.users.insertOne({
  username: "sawan"
})
```

---

# 16. Collection Create Karna

Explicitly:

```javascript
db.createCollection("users")
```

Ya directly:

```javascript
db.users.insertOne({
  username: "sawan"
})
```

MongoDB collection create kar sakta hai.

---

# 17. Documents Insert Karna

## `insertOne()`

```javascript
db.users.insertOne({
  username: "sawan",
  email: "user@example.com"
})
```

## `insertMany()`

```javascript
db.users.insertMany([
  {
    username: "sawan"
  },
  {
    username: "rahul"
  }
])
```

---

# 18. Documents Read Karna

All:

```javascript
db.users.find()
```

One:

```javascript
db.users.findOne({
  username: "sawan"
})
```

Specific:

```javascript
db.users.find({
  username: "sawan"
})
```

---

# 19. Documents Update Karna

```javascript
db.users.updateOne(
  { username: "sawan" },
  {
    $set: {
      bio: "Developer"
    }
  }
)
```

Multiple:

```javascript
db.users.updateMany(
  { status: "inactive" },
  {
    $set: {
      archived: true
    }
  }
)
```

---

# 20. Documents Delete Karna

One:

```javascript
db.users.deleteOne({
  username: "sawan"
})
```

Many:

```javascript
db.users.deleteMany({
  status: "deleted"
})
```

Production applications mein hard delete carefully use karo.

---

# 21. CRUD Mental Model

MongoDB CRUD:

```text
Create
  ↓
insertOne / insertMany

Read
  ↓
find / findOne

Update
  ↓
updateOne / updateMany

Delete
  ↓
deleteOne / deleteMany
```

---

# 22. Query Operators

Operators query ko powerful banate hain.

Example:

```javascript
{
  age: {
    $gt: 18
  }
}
```

Meaning:

```text
age > 18
```

---

# 23. Comparison Operators

Important:

```text
$eq
$ne
$gt
$gte
$lt
$lte
$in
$nin
```

Example:

```javascript
db.users.find({
  age: {
    $gte: 18
  }
})
```

---

# 24. Logical Operators

Important:

```text
$and
$or
$not
$nor
```

Example:

```javascript
db.users.find({
  $or: [
    { username: "sawan" },
    { email: "user@example.com" }
  ]
})
```

---

# 25. Array Operators

Important:

```text
$in
$nin
$all
$elemMatch
$size
```

Example:

```javascript
db.users.find({
  roles: {
    $in: ["admin"]
  }
})
```

---

# 26. Element Operators

```text
$exists
$type
```

Example:

```javascript
db.users.find({
  avatar: {
    $exists: true
  }
})
```

---

# 27. Update Operators

Most important:

```text
$set
$unset
$inc
$push
$pull
$addToSet
```

Example:

```javascript
db.users.updateOne(
  { _id: userId },
  {
    $set: {
      bio: "Full Stack Developer"
    }
  }
)
```

---

# 28. Projection

Projection ka matlab:

> Kaunse fields return karne hain.

Example:

```javascript
db.users.find(
  {},
  {
    username: 1,
    avatar: 1
  }
)
```

Password hash jaise sensitive fields ko response se exclude karna important hai.

---

# 29. Sorting

Ascending:

```javascript
.sort({
  createdAt: 1
})
```

Descending:

```javascript
.sort({
  createdAt: -1
})
```

Chat messages usually:

```text
createdAt: -1
```

se newest first fetch kiye ja sakte hain.

---

# 30. Limit

```javascript
db.messages
  .find({
    conversationId
  })
  .limit(50)
```

Meaning:

```text
Maximum 50 documents
```

---

# 31. Skip

```javascript
db.messages
  .find()
  .skip(50)
  .limit(50)
```

Lekin huge datasets mein large `skip()` pagination ke liye ideal nahi hota.

---

# 32. Pagination

Bad:

```text
GET /messages
```

aur saare messages return kar dena.

Better:

```text
GET /messages?limit=50
```

Aur older messages cursor ke through fetch karo.

---

# 33. Cursor Pagination

Example:

```text
GET /messages?before=<messageId>
```

Query concept:

```javascript
{
  conversationId,
  createdAt: {
    $lt: cursorDate
  }
}
```

Large chat history ke liye cursor pagination recommended approach hai.

---

# 34. Indexes

Index database query ko fast kar sakta hai.

Example:

```javascript
db.messages.createIndex({
  conversationId: 1,
  createdAt: -1
})
```

Ye hamare chat app ka very important index hai.

---

# 35. Single Field Index

Example:

```javascript
db.users.createIndex({
  email: 1
})
```

Query:

```javascript
db.users.find({
  email: "user@example.com"
})
```

Index lookup fast bana sakta hai.

---

# 36. Compound Index

Multiple fields:

```javascript
db.messages.createIndex({
  conversationId: 1,
  createdAt: -1
})
```

Order important hota hai.

Index design query patterns ke according hona chahiye.

---

# 37. Unique Index

Example:

```javascript
db.users.createIndex(
  {
    email: 1
  },
  {
    unique: true
  }
)
```

Ab duplicate email allowed nahi hoga.

---

# 38. TTL Index

TTL:

> Time To Live

Example temporary session:

```javascript
db.sessions.createIndex(
  {
    expiresAt: 1
  },
  {
    expireAfterSeconds: 0
  }
)
```

MongoDB expiry ke baad document remove kar sakta hai.

---

# 39. Text Index

Text search ke liye:

```javascript
db.messages.createIndex({
  content: "text"
})
```

Then:

```javascript
db.messages.find({
  $text: {
    $search: "hello"
  }
})
```

Large-scale production search ke liye dedicated search technology consider ki ja sakti hai.

---

# 40. Index Strategy

Rule:

> Har field par index mat lagao.

Index:

```text
Reads fast
```

but:

```text
Writes expensive
Storage increase
Memory usage
```

hota hai.

Index only based on real queries.

---

# 41. Aggregation

Aggregation MongoDB ka powerful data-processing system hai.

Example:

```text
Documents
   ↓
Pipeline
   ↓
Transform
   ↓
Result
```

---

# 42. Aggregation Pipeline

Example:

```javascript
db.messages.aggregate([
  {
    $match: {
      conversationId
    }
  },
  {
    $sort: {
      createdAt: -1
    }
  },
  {
    $limit: 50
  }
])
```

---

# 43. `$match`

Filtering.

```javascript
{
  $match: {
    type: "text"
  }
}
```

SQL:

```text
WHERE
```

ke roughly equivalent.

---

# 44. `$project`

Fields select/transform karne ke liye.

```javascript
{
  $project: {
    content: 1,
    senderId: 1
  }
}
```

---

# 45. `$sort`

```javascript
{
  $sort: {
    createdAt: -1
  }
}
```

---

# 46. `$limit`

```javascript
{
  $limit: 50
}
```

---

# 47. `$group`

Grouping.

Example:

```javascript
{
  $group: {
    _id: "$senderId",
    count: {
      $sum: 1
    }
  }
}
```

Meaning:

```text
Har sender ke messages count karo.
```

---

# 48. `$lookup`

MongoDB ka join-like operation.

Example:

```javascript
{
  $lookup: {
    from: "users",
    localField: "senderId",
    foreignField: "_id",
    as: "sender"
  }
}
```

Use carefully.

Har query mein `$lookup` karna required nahi.

---

# 49. `$unwind`

Array ko individual documents mein expand karta hai.

Example:

```javascript
{
  $unwind: "$sender"
}
```

Useful when `$lookup` ke baad array result ko process karna ho.

---

# 50. Aggregation Example

Conversation ke messages ke saath sender information:

```javascript
db.messages.aggregate([
  {
    $match: {
      conversationId
    }
  },
  {
    $sort: {
      createdAt: -1
    }
  },
  {
    $limit: 50
  },
  {
    $lookup: {
      from: "users",
      localField: "senderId",
      foreignField: "_id",
      as: "sender"
    }
  }
])
```

---

# 51. Aggregation in Chat App

Potential uses:

```text
Conversation list
Unread count
Message search
Message analytics
User message statistics
Group member statistics
```

Simple queries ko unnecessarily aggregation mein convert mat karo.

---

# 52. Embedding

Example:

```json
{
  "username": "sawan",
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

`settings` user document ke andar embedded hai.

---

# 53. Referencing

Example:

```json
{
  "conversationId": "ObjectId",
  "senderId": "ObjectId"
}
```

Yahan related documents separate collections mein hain.

---

# 54. Embedding vs Referencing

### Embed

Use when:

```text
Small
Tightly related
Usually together fetched
```

### Reference

Use when:

```text
Large
Frequently queried independently
Potentially unbounded
Frequently changing
```

Messages:

```text
Reference
```

better.

---

# 55. Schema Design

MongoDB schema design ka core question:

> Data ko kaise store karna hai taaki application ke common queries efficient ho?

Example:

```text
Get conversation messages
```

ke liye:

```text
conversationId + createdAt
```

index important hai.

---

# 56. Relationships

MongoDB relational database nahi hai, but relationships model kar sakta hai.

Types:

```text
One-to-One
One-to-Many
Many-to-Many
```

---

# 57. One-to-One

Example:

```text
User
  |
  +── Profile
```

Small profile tightly coupled ho to embed kar sakte ho.

---

# 58. One-to-Many

Example:

```text
Conversation
   |
   +── Message
   +── Message
   +── Message
```

Messages large/unbounded hain.

Isliye separate collection.

---

# 59. Many-to-Many

Example:

```text
Users
   ↕
Conversations
```

Ek user multiple conversations mein.

Ek conversation multiple users ke saath.

Isliye:

```text
conversation_members
```

collection.

---

# 60. MongoDB Atomicity

MongoDB single-document writes atomic hote hain.

Example:

```javascript
db.users.updateOne(
  { _id: userId },
  {
    $set: {
      bio: "Developer"
    }
  }
)
```

Operation atomic hai.

---

# 61. Atomic Operators

Important:

```text
$inc
$set
$unset
$push
$pull
$addToSet
```

Example unread counter:

```javascript
{
  $inc: {
    unreadCount: 1
  }
}
```

---

# 62. Transactions

Multiple documents ko coordinated way mein update karna ho to transactions useful hain.

Example:

```text
Conversation ownership transfer
```

Flow:

```text
Start Transaction
   ↓
Update old owner
   ↓
Update new owner
   ↓
Update conversation
   ↓
Commit
```

Failure:

```text
Rollback
```

---

# 63. Concurrency

Chat applications mein concurrent operations normal hain.

Example:

```text
User A sends message
User B sends message
```

same time.

MongoDB + application logic ko race conditions consider karni hongi.

---

# 64. MongoDB Performance

Performance ke main pillars:

```text
Good schema
Good indexes
Good queries
Pagination
Projection
Avoid unnecessary joins
Avoid giant documents
Avoid N+1
```

---

# 65. N+1 Problem

Bad:

```text
Get 100 messages
     ↓
100 separate user queries
```

Total:

```text
101 queries
```

Better:

```text
Batch query
```

or:

```text
populate
```

or:

```text
aggregation
```

depending on use case.

---

# 66. Large Collections

Messages collection rapidly grow karegi.

Example:

```text
messages
├── 1M
├── 10M
├── 100M
└── ...
```

Therefore:

```text
Index
Pagination
Retention
Archival
Monitoring
```

important hain.

---

# 67. MongoDB Security

Never expose database directly:

```text
Internet
   X
MongoDB
```

Correct:

```text
Internet
   ↓
Backend
   ↓
MongoDB
```

---

# 68. Backups

Production:

```text
Regular backup
Point-in-time recovery
Restore testing
Monitoring
```

required.

---

# 69. MongoDB Monitoring

Monitor:

```text
CPU
Memory
Disk
Connections
Query performance
Index usage
Slow queries
Database size
```

---

# 70. MongoDB with Node.js

Node.js MongoDB ecosystem mein do main approaches:

```text
MongoDB Native Driver
Mongoose
```

Hamare project mein:

```text
Mongoose
```

use karenge.

---

# 71. Mongoose

Mongoose MongoDB ke liye ODM hai.

ODM:

> Object Document Mapper

Mongoose provide karta hai:

```text
Schema
Models
Validation
Middleware
Populate
Query helpers
Hooks
```

---

# 72. MongoDB Driver vs Mongoose

Native driver:

```text
More direct
More control
Less abstraction
```

Mongoose:

```text
Schema
Validation
Models
Middleware
Developer-friendly API
```

Learning project mein Mongoose useful rahega.

---

# 73. Mongoose Connection

Architecture:

```text
Node.js
   |
Mongoose
   |
MongoDB
```

Connection startup par establish hogi.

Concept:

```javascript
await mongoose.connect(process.env.MONGODB_URI);
```

---

# 74. Mongoose Schema

Example:

```javascript
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
```

---

# 75. Mongoose Model

Schema se model:

```javascript
const User = mongoose.model(
  "User",
  userSchema
);
```

Ab:

```javascript
User.find()
```

etc. use kar sakte ho.

---

# 76. Mongoose Validation

Example:

```javascript
username: {
  type: String,
  required: true,
  minlength: 3,
  maxlength: 30
}
```

But remember:

> Mongoose validation authorization ka replacement nahi hai.

---

# 77. Mongoose Middleware

Middleware/hooks:

```text
pre
post
```

Example use cases:

```text
Password hashing
Audit
Normalization
Derived data
```

Password hashing ke liye careful design zaruri hai.

---

# 78. Mongoose Populate

Reference:

```javascript
senderId
```

populate:

```javascript
.populate("senderId")
```

Conceptually:

```text
Message
  ↓
senderId
  ↓
User
```

But populate ko blindly har query mein use nahi karna.

---

# 79. Mongoose Lean

Read-only queries:

```javascript
const users = await User
  .find()
  .lean();
```

`lean()` plain JavaScript objects return kar sakta hai.

Use when Mongoose document methods ki requirement nahi hai.

---

# 80. Mongoose Query Methods

Important:

```text
find()
findOne()
findById()
create()
updateOne()
updateMany()
findOneAndUpdate()
deleteOne()
deleteMany()
countDocuments()
exists()
aggregate()
```

---

# 81. Chat App Database

Hamari database:

```text
chat_app
```

Collections:

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

---

# 82. Users Collection

Concept:

```text
users
```

Fields:

```text
_id
username
email
passwordHash
avatar
bio
status
isVerified
createdAt
updatedAt
```

---

# 83. Conversations Collection

Fields:

```text
_id
type
name
avatar
description
ownerId
lastMessageId
lastMessageAt
createdAt
updatedAt
```

Types:

```text
direct
group
```

---

# 84. Conversation Members

Fields:

```text
_id
conversationId
userId
role
joinedAt
leftAt
lastReadMessageId
lastReadAt
mutedAt
createdAt
updatedAt
```

Important index:

```text
conversationId + userId
```

---

# 85. Messages Collection

Fields:

```text
_id
conversationId
senderId
type
content
replyTo
editedAt
deletedAt
createdAt
updatedAt
```

Index:

```text
conversationId + createdAt
```

---

# 86. Attachments

Fields:

```text
_id
messageId
uploaderId
type
url
storageKey
filename
mimeType
size
createdAt
```

Actual file:

```text
Object Storage
```

MongoDB:

```text
Metadata
```

---

# 87. Notifications

Fields:

```text
_id
userId
actorId
type
conversationId
messageId
readAt
createdAt
```

---

# 88. Blocks

Fields:

```text
_id
blockerId
blockedId
createdAt
```

Index:

```text
blockerId + blockedId
```

---

# 89. Reactions

Fields:

```text
_id
messageId
userId
emoji
createdAt
```

Unique strategy:

```text
messageId + userId + emoji
```

or:

```text
messageId + userId
```

depending on product rules.

---

# 90. Message Query Strategy

Most common query:

```text
Conversation ke messages lao.
```

Query:

```javascript
Message
  .find({
    conversationId
  })
  .sort({
    createdAt: -1
  })
  .limit(50);
```

Index:

```text
conversationId + createdAt
```

---

# 91. Unread Messages

Member:

```text
lastReadMessageId
```

store karega.

Example:

```text
User A
lastReadMessageId = 500
```

Then messages:

```text
501
502
503
```

unread ho sakte hain.

---

# 92. Last Message

Conversation:

```text
lastMessageId
lastMessageAt
```

store karegi.

Message create hone par:

```text
Create Message
      ↓
Update Conversation
      ↓
lastMessageId
lastMessageAt
```

---

# 93. Search

Basic MongoDB text search:

```javascript
db.messages.find({
  $text: {
    $search: "hello"
  }
})
```

But advanced production search ke liye:

```text
Dedicated Search Engine
```

consider kiya ja sakta hai.

---

# 94. MongoDB + WebSocket

Important:

> WebSocket MongoDB ka replacement nahi hai.

WebSocket:

```text
Real-time communication
```

MongoDB:

```text
Persistent storage
```

Architecture:

```text
Client
  |
WebSocket
  |
Server
  |
MongoDB
```

---

# 95. Message Persistence Flow

User message send karta hai:

```text
Client
   |
   v
WebSocket
   |
   v
Authenticate
   |
   v
Authorize
   |
   v
Validate
   |
   v
MongoDB
   |
   v
Message Created
   |
   v
Broadcast
```

Important:

> Message successfully persist hone ke baad broadcast strategy define karna safer hota hai.

---

# 96. Offline User Flow

User offline hai:

```text
Sender
  |
WebSocket
  |
Server
  |
MongoDB
```

Message database mein save.

Receiver later online:

```text
Connect
  |
Authenticate
  |
Fetch unread/history
  |
Receive messages
```

---

# 97. Database Errors

Common errors:

```text
Connection failed
Duplicate key
Validation error
Cast error
Timeout
Transaction error
```

Application ko database errors ko safe API errors mein convert karna chahiye.

Never raw database error user ko expose mat karo.

---

# 98. Production Checklist

## Connection

* [ ] Environment variable
* [ ] Connection retry strategy
* [ ] Graceful shutdown

## Schema

* [ ] Validation
* [ ] Required fields
* [ ] Correct references
* [ ] Timestamps

## Index

* [ ] User email
* [ ] Conversation membership
* [ ] Messages
* [ ] Notifications
* [ ] Blocks
* [ ] Reactions

## Performance

* [ ] Cursor pagination
* [ ] Projection
* [ ] Avoid N+1
* [ ] Avoid giant documents
* [ ] Query monitoring

## Security

* [ ] Strong credentials
* [ ] Database not publicly exposed unnecessarily
* [ ] Authentication
* [ ] Authorization
* [ ] Input validation
* [ ] Sensitive field protection

## Reliability

* [ ] Backups
* [ ] Restore testing
* [ ] Monitoring
* [ ] Error handling

---

# 99. MongoDB Mastery Checklist

MongoDB ko genuinely strong karne ke liye tumhe ye concepts samajhne chahiye:

## Fundamentals

* [ ] MongoDB kya hai
* [ ] NoSQL kya hai
* [ ] Database
* [ ] Collection
* [ ] Document
* [ ] BSON
* [ ] ObjectId

## CRUD

* [ ] insertOne
* [ ] insertMany
* [ ] find
* [ ] findOne
* [ ] updateOne
* [ ] updateMany
* [ ] deleteOne
* [ ] deleteMany

## Queries

* [ ] Comparison operators
* [ ] Logical operators
* [ ] Array operators
* [ ] Element operators
* [ ] Projection
* [ ] Sorting
* [ ] Limit
* [ ] Pagination

## Indexes

* [ ] Single indexes
* [ ] Compound indexes
* [ ] Unique indexes
* [ ] TTL indexes
* [ ] Text indexes
* [ ] Index analysis

## Aggregation

* [ ] Pipeline
* [ ] `$match`
* [ ] `$project`
* [ ] `$sort`
* [ ] `$limit`
* [ ] `$skip`
* [ ] `$group`
* [ ] `$lookup`
* [ ] `$unwind`

## Architecture

* [ ] Embedding
* [ ] Referencing
* [ ] Denormalization
* [ ] Relationships
* [ ] Schema design
* [ ] Query-driven design

## Advanced

* [ ] Transactions
* [ ] Atomic operations
* [ ] Concurrency
* [ ] Performance
* [ ] Large collections
* [ ] Backup
* [ ] Monitoring
* [ ] Security

## Mongoose

* [ ] Connection
* [ ] Schema
* [ ] Model
* [ ] Validation
* [ ] Middleware
* [ ] Populate
* [ ] Lean
* [ ] Queries
* [ ] Indexes

---

# 100. Final Mental Model

MongoDB ko is tarah imagine karo:

```text
                         MongoDB
                            |
                       DATABASE
                            |
                         chat_app
                            |
        +-------------------+-------------------+
        |                   |                   |
       USERS          CONVERSATIONS          MESSAGES
        |                   |                   |
        |                   |                   |
    SESSIONS        CONVERSATION_MEMBERS       |
                            |                  |
                            +--------+---------+
                                     |
                         +-----------+-----------+
                         |           |           |
                    ATTACHMENTS  REACTIONS   REPLIES
```

Aur application architecture:

```text
                         CLIENT
                            |
                  +---------+---------+
                  |                   |
                 HTTP             WebSocket
                  |                   |
                  +---------+---------+
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

# Most Important Rules

### Rule 1

> MongoDB ko SQL ki tarah blindly design mat karo.

### Rule 2

> Schema ko queries ke around design karo.

### Rule 3

> Messages ko conversation ke andar giant array mat rakho.

### Rule 4

> Large/unbounded data ko reference karo.

### Rule 5

> Frequently queried fields par proper indexes lagao.

### Rule 6

> Large datasets ke liye cursor pagination use karo.

### Rule 7

> Har field par index mat lagao.

### Rule 8

> WebSocket aur MongoDB ke roles alag hain.

```text
WebSocket = Real-time
MongoDB   = Persistence
```

### Rule 9

> Authentication aur authorization database ka replacement nahi hain.

### Rule 10

> Database design ka final goal hai:

```text
Correctness
+
Performance
+
Scalability
+
Maintainability
```

---

# End

## Next Recommended Documents

Database ke baad implementation ko samajhne ke liye recommended order:

```text
1. models.md
2. services.md
3. api-design.md
4. websocket-events.md
5. error-handling.md
6. validation.md
7. testing.md
```

Phir actual implementation:

```text
MongoDB Connection
        ↓
Mongoose Schemas
        ↓
Models
        ↓
Services
        ↓
Controllers
        ↓
HTTP Routes
        ↓
WebSocket Handlers
        ↓
Real-Time Chat
```

Ab hamare project ka database sirf "MongoDB use karenge" level par nahi hai — **hume pata hai ki data kya hoga, kaha store hoga, kis relation mein hoga, kis query ke liye kaunsa index lagega, aur WebSocket ke saath persistence kaise work karegi.**
