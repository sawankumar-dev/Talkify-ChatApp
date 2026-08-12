# Mongoose — Complete Guide

> **Project:** Real-Time Chat Application
> **Database:** MongoDB
> **ODM:** Mongoose
> **Backend:** Node.js + Express.js
> **Real-Time:** WebSocket
> **Language:** Hinglish

---

# Table of Contents

1. [Mongoose Kya Hai](#1-mongoose-kya-hai)
2. [ODM Kya Hota Hai](#2-odm-kya-hota-hai)
3. [MongoDB vs Mongoose](#3-mongodb-vs-mongoose)
4. [Mongoose Architecture](#4-mongoose-architecture)
5. [Mongoose Install Karna](#5-mongoose-install-karna)
6. [MongoDB Connection](#6-mongodb-connection)
7. [Connection Lifecycle](#7-connection-lifecycle)
8. [Environment Variables](#8-environment-variables)
9. [Schema Kya Hai](#9-schema-kya-hai)
10. [Schema Create Karna](#10-schema-create-karna)
11. [Schema Types](#11-schema-types)
12. [String Options](#12-string-options)
13. [Number Options](#13-number-options)
14. [Boolean Options](#14-boolean-options)
15. [Date Type](#15-date-type)
16. [ObjectId](#16-objectid)
17. [Array](#17-array)
18. [Nested Objects](#18-nested-objects)
19. [Map](#19-map)
20. [Mixed](#20-mixed)
21. [Required](#21-required)
22. [Default Values](#22-default-values)
23. [Enums](#23-enums)
24. [Min and Max](#24-min-and-max)
25. [MinLength and MaxLength](#25-minlength-and-maxLength)
26. [Trim](#26-trim)
27. [Lowercase and Uppercase](#27-lowercase-and-uppercase)
28. [Timestamps](#28-timestamps)
29. [Schema Options](#29-schema-options)
30. [Model Kya Hai](#30-model-kya-hai)
31. [Model Create Karna](#31-model-create-karna)
32. [Collection Naming](#32-collection-naming)
33. [Documents](#33-documents)
34. [Create](#34-create)
35. [Find](#35-find)
36. [FindOne](#36-findone)
37. [FindById](#37-findbyid)
38. [Update](#38-update)
39. [Delete](#39-delete)
40. [Count](#40-count)
41. [Exists](#41-exists)
42. [Query Object](#42-query-object)
43. [Query Chaining](#43-query-chaining)
44. [Projection](#44-projection)
45. [Sorting](#45-sorting)
46. [Pagination](#46-pagination)
47. [Cursor Pagination](#47-cursor-pagination)
48. [Lean](#48-lean)
49. [Validation](#49-validation)
50. [Custom Validators](#50-custom-validators)
51. [Casting](#51-casting)
52. [Schema Methods](#52-schema-methods)
53. [Instance Methods](#53-instance-methods)
54. [Static Methods](#54-static-methods)
55. [Query Helpers](#55-query-helpers)
56. [Virtuals](#56-virtuals)
57. [Getters](#57-getters)
58. [Setters](#58-setters)
59. [Middleware](#59-middleware)
60. [Document Middleware](#60-document-middleware)
61. [Query Middleware](#61-query-middleware)
62. [Aggregate Middleware](#62-aggregate-middleware)
63. [Save Middleware](#63-save-middleware)
64. [Update Middleware](#64-update-middleware)
65. [Delete Middleware](#65-delete-middleware)
66. [Password Hashing](#66-password-hashing)
67. [References](#67-references)
68. [Populate](#68-populate)
69. [Nested Populate](#69-nested-populate)
70. [Populate Select](#70-populate-select)
71. [Populate Match](#71-populate-match)
72. [When Not to Populate](#72-when-not-to-populate)
73. [Indexes](#73-indexes)
74. [Single Index](#74-single-index)
75. [Compound Index](#75-compound-index)
76. [Unique Index](#76-unique-index)
77. [TTL Index](#77-ttl-index)
78. [Text Index](#78-text-index)
79. [Aggregation](#79-aggregation)
80. [Aggregation Pipeline](#80-aggregation-pipeline)
81. [Transactions](#81-transactions)
82. [Sessions](#82-sessions)
83. [Atomic Operations](#83-atomic-operations)
84. [Concurrency](#84-concurrency)
85. [Optimistic Concurrency](#85-optimistic-concurrency)
86. [Discriminators](#86-discriminators)
87. [Subdocuments](#87-subdocuments)
88. [Document Arrays](#88-document-arrays)
89. [Schema Composition](#89-schema-composition)
90. [Mongoose and TypeScript](#90-mongoose-and-typescript)
91. [Mongoose Error Handling](#91-mongoose-error-handling)
92. [Duplicate Key Errors](#92-duplicate-key-errors)
93. [Validation Errors](#93-validation-errors)
94. [Cast Errors](#94-cast-errors)
95. [Connection Errors](#95-connection-errors)
96. [Performance](#96-performance)
97. [N+1 Problem](#97-n1-problem)
98. [Security](#98-security)
99. [Chat App Models](#99-chat-app-models)
100. [User Model](#100-user-model)
101. [Conversation Model](#101-conversation-model)
102. [Conversation Member Model](#102-conversation-member-model)
103. [Message Model](#103-message-model)
104. [Attachment Model](#104-attachment-model)
105. [Notification Model](#105-notification-model)
106. [Block Model](#106-block-model)
107. [Reaction Model](#107-reaction-model)
108. [Message Persistence](#108-message-persistence)
109. [Mongoose + WebSocket](#109-mongoose--websocket)
110. [Production Architecture](#110-production-architecture)
111. [Common Mistakes](#111-common-mistakes)
112. [Mastery Checklist](#112-mastery-checklist)
113. [Final Mental Model](#113-final-mental-model)

---

# 1. Mongoose Kya Hai?

Mongoose ek **ODM (Object Document Mapper)** hai jo Node.js application ko MongoDB ke saath structured way mein work karne deta hai.

Simple architecture:

```text
Node.js Application
       |
       v
    Mongoose
       |
       v
    MongoDB
```

Mongoose MongoDB ke upar abstraction provide karta hai.

---

# 2. ODM Kya Hota Hai?

ODM ka full form:

> Object Document Mapper

Iska purpose application ke JavaScript objects ko database documents ke saath conveniently map karna hai.

Example:

```javascript
const user = {
  username: "sawan",
  email: "user@example.com"
};
```

Mongoose is data ko MongoDB document ke saath map karne mein help karta hai.

---

# 3. MongoDB vs Mongoose

MongoDB:

```text
Database
```

Mongoose:

```text
Application layer / ODM
```

Example:

```text
Express
   ↓
Service
   ↓
Mongoose Model
   ↓
MongoDB
```

Important:

> Mongoose database nahi hai.

MongoDB actual database hai.

---

# 4. Mongoose Architecture

Hamare project mein:

```text
HTTP Request
     |
     v
Controller
     |
     v
Service
     |
     v
Mongoose Model
     |
     v
MongoDB
```

WebSocket:

```text
WebSocket Event
      |
      v
Socket Handler
      |
      v
Service
      |
      v
Mongoose Model
      |
      v
MongoDB
```

Isse HTTP aur WebSocket dono same business logic reuse kar sakte hain.

---

# 5. Mongoose Install Karna

Install:

```bash
npm install mongoose
```

Development dependency nahi:

```text
mongoose
```

production dependency hai because backend runtime mein bhi required hai.

---

# 6. MongoDB Connection

Basic:

```javascript
import mongoose from "mongoose";

await mongoose.connect(
  process.env.MONGODB_URI
);
```

Connection ko ek dedicated module mein rakhna better hai.

Example structure:

```text
src/
└── config/
    └── database.js
```

---

# 7. Connection Lifecycle

Application lifecycle:

```text
Server Start
    |
    v
Connect MongoDB
    |
    +---- Failure ----> Stop / Retry
    |
    v
Start Application
```

Production mein blindly server ko database connection ke bina start nahi karna chahiye.

---

# 8. Environment Variables

Never:

```javascript
mongoose.connect(
  "mongodb://username:password@..."
);
```

Instead:

```env
MONGODB_URI=mongodb://localhost:27017/chat_app
```

Then:

```javascript
await mongoose.connect(
  process.env.MONGODB_URI
);
```

---

# 9. Schema Kya Hai?

Schema document ka expected structure define karta hai.

Example:

```javascript
const userSchema = new mongoose.Schema({
  username: String,
  email: String
});
```

Schema mein:

```text
Fields
Types
Validation
Defaults
Indexes
Middleware
Methods
Virtuals
```

define kiye ja sakte hain.

---

# 10. Schema Create Karna

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  }
});
```

---

# 11. Schema Types

Common types:

```text
String
Number
Boolean
Date
ObjectId
Array
Map
Mixed
Buffer
```

---

# 12. String Options

Example:

```javascript
username: {
  type: String,
  required: true,
  trim: true,
  minlength: 3,
  maxlength: 30
}
```

---

# 13. Number Options

```javascript
age: {
  type: Number,
  min: 13,
  max: 100
}
```

---

# 14. Boolean Options

```javascript
isVerified: {
  type: Boolean,
  default: false
}
```

---

# 15. Date Type

```javascript
lastSeenAt: {
  type: Date
}
```

Date values:

```javascript
new Date()
```

MongoDB ke Date type ke roop mein store hote hain.

---

# 16. ObjectId

Reference ke liye:

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

Meaning:

```text
userId
   |
   +----> User document
```

---

# 17. Array

Simple array:

```javascript
roles: {
  type: [String],
  default: []
}
```

Example:

```json
{
  "roles": [
    "user",
    "admin"
  ]
}
```

---

# 18. Nested Objects

```javascript
settings: {
  theme: {
    type: String,
    default: "light"
  },

  notifications: {
    type: Boolean,
    default: true
  }
}
```

---

# 19. Map

Dynamic key-value structure:

```javascript
metadata: {
  type: Map,
  of: String
}
```

Useful when keys dynamic hon.

---

# 20. Mixed

```javascript
metadata: {
  type: mongoose.Schema.Types.Mixed
}
```

Isme almost arbitrary data aa sakta hai.

But:

> Mixed type ka overuse schema safety ko weak kar sakta hai.

---

# 21. Required

```javascript
email: {
  type: String,
  required: true
}
```

Meaning:

```text
email missing
   ↓
Validation error
```

---

# 22. Default Values

```javascript
status: {
  type: String,
  default: "offline"
}
```

Document create hone par default value set ho sakti hai.

---

# 23. Enums

```javascript
type: {
  type: String,
  enum: [
    "direct",
    "group"
  ]
}
```

Allowed values:

```text
direct
group
```

---

# 24. Min and Max

```javascript
age: {
  type: Number,
  min: 13,
  max: 100
}
```

---

# 25. MinLength and MaxLength

```javascript
username: {
  type: String,
  minlength: 3,
  maxlength: 30
}
```

---

# 26. Trim

```javascript
username: {
  type: String,
  trim: true
}
```

Input:

```text
"  sawan  "
```

becomes:

```text
"sawan"
```

---

# 27. Lowercase and Uppercase

```javascript
email: {
  type: String,
  lowercase: true,
  trim: true
}
```

Email normalization ke liye useful.

---

# 28. Timestamps

```javascript
const userSchema = new mongoose.Schema(
  {
    username: String
  },
  {
    timestamps: true
  }
);
```

Mongoose automatically:

```text
createdAt
updatedAt
```

manage kar sakta hai.

---

# 29. Schema Options

Useful options:

```text
timestamps
strict
versionKey
toJSON
toObject
```

Example:

```javascript
const userSchema = new mongoose.Schema(
  {},
  {
    timestamps: true
  }
);
```

---

# 30. Model Kya Hai?

Model schema ko database collection ke saath connect karta hai.

```text
Schema
  ↓
Model
  ↓
Collection
```

---

# 31. Model Create Karna

```javascript
const userSchema = new mongoose.Schema({
  username: String
});

const User = mongoose.model(
  "User",
  userSchema
);
```

Ab:

```javascript
User.find();
```

use kar sakte ho.

---

# 32. Collection Naming

```javascript
mongoose.model("User", userSchema);
```

Mongoose generally model name ko pluralize karke collection name derive kar sakta hai.

Example:

```text
User
 ↓
users
```

Explicit collection name bhi define kiya ja sakta hai.

---

# 33. Documents

Model se create hua actual record:

```javascript
const user = new User({
  username: "sawan"
});
```

Then:

```javascript
await user.save();
```

---

# 34. Create

Shortcut:

```javascript
const user = await User.create({
  username: "sawan",
  email: "user@example.com"
});
```

---

# 35. Find

```javascript
const users = await User.find({
  isVerified: true
});
```

---

# 36. FindOne

```javascript
const user = await User.findOne({
  email: "user@example.com"
});
```

---

# 37. FindById

```javascript
const user = await User.findById(
  userId
);
```

Useful for ObjectId-based lookup.

---

# 38. Update

```javascript
await User.updateOne(
  { _id: userId },
  {
    $set: {
      bio: "Developer"
    }
  }
);
```

---

# 39. Delete

```javascript
await User.deleteOne({
  _id: userId
});
```

Soft-delete systems mein delete ke instead:

```text
deletedAt
```

use kiya ja sakta hai.

---

# 40. Count

```javascript
const count = await User.countDocuments({
  isVerified: true
});
```

---

# 41. Exists

```javascript
const exists = await User.exists({
  email
});
```

Useful when sirf existence check karna ho.

---

# 42. Query Object

Mongoose query:

```javascript
const query = User.find({
  isVerified: true
});
```

Query ko execute karne ke liye:

```javascript
await query;
```

ya:

```javascript
await query.exec();
```

---

# 43. Query Chaining

```javascript
const users = await User
  .find({
    isVerified: true
  })
  .select("username avatar")
  .sort({
    createdAt: -1
  })
  .limit(20)
  .lean();
```

Mongoose chaining extremely useful hai.

---

# 44. Projection

```javascript
const users = await User
  .find()
  .select("username avatar");
```

Sensitive fields exclude karne ke liye schema-level strategies bhi use kar sakte ho.

---

# 45. Sorting

```javascript
.sort({
  createdAt: -1
})
```

Chat:

```text
-1 = newest first
1  = oldest first
```

---

# 46. Pagination

Basic:

```javascript
const messages = await Message
  .find({
    conversationId
  })
  .sort({
    createdAt: -1
  })
  .skip(0)
  .limit(50);
```

Small datasets ke liye okay.

---

# 47. Cursor Pagination

Large chat history ke liye:

```text
before
after
```

cursor approach better hai.

Example:

```javascript
const messages = await Message
  .find({
    conversationId,
    createdAt: {
      $lt: cursorDate
    }
  })
  .sort({
    createdAt: -1
  })
  .limit(50);
```

Index:

```javascript
messageSchema.index({
  conversationId: 1,
  createdAt: -1
});
```

---

# 48. Lean

```javascript
const users = await User
  .find()
  .lean();
```

`lean()` plain objects return karne ke liye useful hai.

Use when:

```text
Read-only response
No document methods required
```

---

# 49. Validation

Mongoose schema-level validation provide karta hai.

Example:

```javascript
email: {
  type: String,
  required: true
}
```

But application mein generally multiple layers honge:

```text
Request Validation
       ↓
Business Validation
       ↓
Mongoose Validation
       ↓
MongoDB
```

---

# 50. Custom Validators

Example:

```javascript
username: {
  type: String,

  validate: {
    validator(value) {
      return /^[a-zA-Z0-9_]+$/.test(value);
    },

    message: "Invalid username"
  }
}
```

---

# 51. Casting

Mongoose values ko schema types mein cast kar sakta hai.

Example:

```javascript
age: {
  type: Number
}
```

Invalid value:

```text
"hello"
```

cast error generate kar sakti hai.

---

# 52. Schema Methods

Schema methods document-level behavior ke liye useful hain.

Example:

```javascript
userSchema.methods.getPublicProfile =
  function () {
    return {
      id: this._id,
      username: this.username
    };
  };
```

Then:

```javascript
user.getPublicProfile();
```

---

# 53. Instance Methods

Instance method individual document par available hota hai.

Example:

```javascript
user.comparePassword(password);
```

Useful for:

```text
Password comparison
Public profile conversion
Domain-specific document behavior
```

---

# 54. Static Methods

Model-level methods.

Example:

```javascript
userSchema.statics.findByEmail =
  function (email) {
    return this.findOne({ email });
  };
```

Then:

```javascript
User.findByEmail(email);
```

---

# 55. Query Helpers

Custom query chains:

```javascript
userSchema.query.active =
  function () {
    return this.where({
      status: "active"
    });
  };
```

Then:

```javascript
User.find().active();
```

Advanced projects mein useful ho sakta hai.

---

# 56. Virtuals

Virtual field database mein directly store nahi hota.

Example:

```javascript
userSchema.virtual("displayName")
  .get(function () {
    return this.username;
  });
```

Virtuals useful hain:

```text
Computed properties
Derived values
```

---

# 57. Getters

Getter output ko transform kar sakta hai.

Example use cases:

```text
Formatting
Normalization
Presentation
```

Sensitive data ke saath careful rehna.

---

# 58. Setters

Setter data save hone se pehle transform kar sakta hai.

Example:

```javascript
email: {
  type: String,
  set: value => value.trim().toLowerCase()
}
```

---

# 59. Middleware

Mongoose middleware ko hooks bhi kehte hain.

Basic lifecycle:

```text
Operation
   |
   v
pre middleware
   |
   v
Database operation
   |
   v
post middleware
```

---

# 60. Document Middleware

Document operations ke examples:

```text
save
validate
deleteOne
```

Example:

```javascript
userSchema.pre(
  "save",
  async function () {
    // logic
  }
);
```

---

# 61. Query Middleware

Query operations:

```text
find
findOne
findOneAndUpdate
```

Example:

```javascript
userSchema.pre(
  "find",
  function () {
    // modify query
  }
);
```

---

# 62. Aggregate Middleware

Aggregation ke liye middleware:

```javascript
userSchema.pre(
  "aggregate",
  function () {
    // modify pipeline
  }
);
```

Advanced filtering systems mein useful.

---

# 63. Save Middleware

```javascript
userSchema.pre(
  "save",
  async function () {
    // before save
  }
);
```

Important:

> `save` middleware aur `findOneAndUpdate` middleware same nahi hain.

Ye common source of bugs hai.

---

# 64. Update Middleware

Example:

```javascript
userSchema.pre(
  "findOneAndUpdate",
  function () {
    // update middleware
  }
);
```

Agar password update ho raha hai, to ensure karo ki required hashing logic actually execute ho.

---

# 65. Delete Middleware

Delete operations ke liye:

```javascript
pre("deleteOne")
post("deleteOne")
```

use cases:

```text
Cleanup
Audit
Related data handling
```

Lekin cascading behavior carefully design karo.

---

# 66. Password Hashing

Password plain text mein kabhi store nahi karna.

Wrong:

```json
{
  "password": "mypassword"
}
```

Correct concept:

```text
password
   ↓
hash
   ↓
passwordHash
```

Authentication service ya carefully designed model middleware mein hashing ki ja sakti hai.

Important:

> Password hashing aur login verification ko accidentally double-hash mat karna.

---

# 67. References

Example:

```javascript
senderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
```

Reference:

```text
Message
  |
  +── senderId
          |
          +── User
```

---

# 68. Populate

```javascript
const message = await Message
  .findById(messageId)
  .populate("senderId");
```

Result conceptually:

```text
Message
  |
  +── senderId
         |
         +── complete User
```

---

# 69. Nested Populate

Example:

```javascript
.populate({
  path: "conversationId",
  populate: {
    path: "ownerId"
  }
});
```

Powerful hai, but expensive queries se bachna hai.

---

# 70. Populate Select

Sirf required fields:

```javascript
.populate({
  path: "senderId",
  select: "username avatar"
});
```

Password hash return nahi karna.

---

# 71. Populate Match

Example:

```javascript
.populate({
  path: "senderId",
  match: {
    isVerified: true
  }
});
```

Useful in specific cases, but business rules ko populate behavior par blindly depend mat karo.

---

# 72. When Not to Populate

Har query mein:

```javascript
.populate(...)
```

mat lagao.

Avoid when:

```text
Large datasets
High-frequency queries
Deep nesting
Unnecessary fields
Real-time message streams
```

Alternative:

```text
Projection
Aggregation
Separate batch query
Denormalized summary
```

---

# 73. Indexes

Mongoose schema level par indexes define kar sakte ho.

```javascript
messageSchema.index({
  conversationId: 1,
  createdAt: -1
});
```

---

# 74. Single Index

```javascript
userSchema.index({
  email: 1
});
```

---

# 75. Compound Index

```javascript
messageSchema.index({
  conversationId: 1,
  createdAt: -1
});
```

Chat application ke liye extremely important.

---

# 76. Unique Index

```javascript
userSchema.index(
  {
    email: 1
  },
  {
    unique: true
  }
);
```

Important:

> `unique: true` validation rule nahi, primarily unique index behavior hai.

Duplicate key errors ko application mein handle karna chahiye.

---

# 77. TTL Index

Example session:

```javascript
sessionSchema.index(
  {
    expiresAt: 1
  },
  {
    expireAfterSeconds: 0
  }
);
```

Temporary documents ke liye useful.

---

# 78. Text Index

```javascript
messageSchema.index({
  content: "text"
});
```

Simple text search ke liye.

---

# 79. Aggregation

Mongoose MongoDB aggregation support karta hai:

```javascript
const result = await Message.aggregate([
  {
    $match: {
      conversationId
    }
  }
]);
```

---

# 80. Aggregation Pipeline

Typical:

```text
$match
  ↓
$sort
  ↓
$limit
  ↓
$lookup
  ↓
$project
```

Order performance ko affect kar sakta hai.

Generally filtering early is useful.

---

# 81. Transactions

Mongoose MongoDB transactions ke saath kaam kar sakta hai.

Concept:

```text
Session
  |
Transaction
  |
+----------------+
| Operation 1    |
| Operation 2    |
| Operation 3    |
+----------------+
  |
Commit / Abort
```

---

# 82. Sessions

Transaction:

```javascript
const session =
  await mongoose.startSession();
```

Then transaction:

```javascript
session.startTransaction();

try {
  // operations

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

# 83. Atomic Operations

Example:

```javascript
await ConversationMember.updateOne(
  {
    conversationId,
    userId
  },
  {
    $inc: {
      unreadCount: 1
    }
  }
);
```

Single-document atomic updates race conditions reduce karne mein help karte hain.

---

# 84. Concurrency

Real-time application mein multiple requests/events simultaneously aa sakte hain.

Example:

```text
User A → message
User B → message
User C → reaction
```

same time.

Database operations ko atomic aur predictable rakhna important hai.

---

# 85. Optimistic Concurrency

Multiple updates ke case mein versioning useful ho sakti hai.

Mongoose documents version keys use kar sakte hain.

Concept:

```text
Document version = 5

Client A → update
Client B → update

Version mismatch
      ↓
Conflict handling
```

Use case-dependent hai.

---

# 86. Discriminators

Agar same base structure ke multiple document types hon:

```text
Message
 ├── TextMessage
 ├── ImageMessage
 └── FileMessage
```

Mongoose discriminators useful ho sakte hain.

Lekin hamare chat app mein initially simple:

```text
type
content
attachments
```

approach enough ho sakti hai.

---

# 87. Subdocuments

Nested schema:

```javascript
const settingsSchema =
  new mongoose.Schema({
    theme: String,
    notifications: Boolean
  });
```

Then:

```javascript
const userSchema =
  new mongoose.Schema({
    settings: settingsSchema
  });
```

---

# 88. Document Arrays

Example:

```javascript
members: [
  {
    userId: mongoose.Schema.Types.ObjectId,
    role: String
  }
]
```

Small bounded arrays ke liye okay.

But chat group members potentially large hon to separate collection better ho sakti hai.

---

# 89. Schema Composition

Large project mein ek giant schema file avoid karo.

Better:

```text
models/
├── user.model.js
├── conversation.model.js
├── conversation-member.model.js
├── message.model.js
├── attachment.model.js
├── notification.model.js
├── block.model.js
└── reaction.model.js
```

Har model ki responsibility clear honi chahiye.

---

# 90. Mongoose and TypeScript

Agar TypeScript use kar rahe ho to:

```text
TypeScript Interface
       +
Mongoose Schema
       +
Mongoose Model
```

maintain kar sakte ho.

Important:

> TypeScript compile-time safety deta hai; MongoDB runtime database hai.

Dono ka role different hai.

---

# 91. Mongoose Error Handling

Important errors:

```text
ValidationError
CastError
MongoServerError
Duplicate key
Connection error
Timeout
```

Central error handler mein normalize karo.

---

# 92. Duplicate Key Errors

Unique email:

```text
email = user@example.com
```

duplicate insert:

```text
E11000 duplicate key
```

Application response:

```json
{
  "success": false,
  "message": "Email already registered"
}
```

Raw MongoDB error user ko return mat karo.

---

# 93. Validation Errors

Example:

```text
username missing
```

Mongoose:

```text
ValidationError
```

Service/controller layer mein API-friendly error mein convert karo.

---

# 94. Cast Errors

Example:

```javascript
User.findById("hello");
```

Agar valid ObjectId expected hai to cast error aa sakta hai.

Request validation layer mein IDs validate karna useful hai.

---

# 95. Connection Errors

Connection failure:

```text
Application
    |
    X
 MongoDB
```

Possible reasons:

```text
Wrong URI
Database down
Network issue
Authentication issue
Atlas network configuration
```

Application ko graceful behavior maintain karna chahiye.

---

# 96. Performance

Mongoose performance improve karne ke liye:

```text
lean()
projection
indexes
pagination
efficient queries
avoid unnecessary populate
batch operations
aggregation when appropriate
```

use karo.

---

# 97. N+1 Problem

Bad:

```text
100 messages
   ↓
100 sender queries
```

Better:

```text
Messages
   ↓
Batch sender lookup
```

ya:

```text
populate
```

ya:

```text
aggregation
```

depending on use case.

---

# 98. Security

Mongoose use karna automatically application secure nahi bana deta.

Important:

```text
Input validation
Authorization
Projection
Password hashing
Rate limiting
Safe errors
Environment secrets
Database access control
```

---

# 99. Chat App Models

Hamare project ke primary models:

```text
User
Session
Conversation
ConversationMember
Message
Attachment
Notification
Block
Reaction
```

---

# 100. User Model

Concept:

```javascript
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true,
      select: false
    },

    avatar: {
      type: String
    },

    bio: {
      type: String,
      maxlength: 160
    },

    status: {
      type: String,
      enum: [
        "online",
        "offline"
      ],
      default: "offline"
    }
  },
  {
    timestamps: true
  }
);
```

---

# 101. Conversation Model

```text
Conversation
```

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

Reference:

```javascript
ownerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
```

---

# 102. Conversation Member Model

```text
ConversationMember
```

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

Important compound index:

```javascript
conversationMemberSchema.index(
  {
    conversationId: 1,
    userId: 1
  },
  {
    unique: true
  }
);
```

---

# 103. Message Model

Concept:

```javascript
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: [
        "text",
        "image",
        "file",
        "system"
      ],
      default: "text"
    },

    content: {
      type: String
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },

    editedAt: Date,

    deletedAt: Date
  },
  {
    timestamps: true
  }
);
```

Important index:

```javascript
messageSchema.index({
  conversationId: 1,
  createdAt: -1
});
```

---

# 104. Attachment Model

```text
Attachment
```

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

File actual MongoDB document mein store karne ke bajay object storage use karna better architecture ho sakta hai.

---

# 105. Notification Model

```text
Notification
```

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

Index:

```javascript
notificationSchema.index({
  userId: 1,
  createdAt: -1
});
```

---

# 106. Block Model

```text
Block
```

Fields:

```text
_id
blockerId
blockedId
createdAt
```

Index:

```javascript
blockSchema.index(
  {
    blockerId: 1,
    blockedId: 1
  },
  {
    unique: true
  }
);
```

---

# 107. Reaction Model

```text
Reaction
```

Fields:

```text
_id
messageId
userId
emoji
createdAt
```

Example:

```text
Message
   |
   +── ❤️ by User A
   +── 😂 by User B
```

---

# 108. Message Persistence

Message send hone par:

```text
WebSocket
   |
   v
Authenticate
   |
   v
Authorize
   |
   v
Validate payload
   |
   v
Message Service
   |
   v
Message.create()
   |
   v
MongoDB
   |
   v
Success
```

---

# 109. Mongoose + WebSocket

WebSocket handler mein directly database logic bharna avoid karo.

Bad:

```text
socket handler
    |
    +── validation
    +── authorization
    +── MongoDB query
    +── message creation
    +── notification
    +── broadcast
```

Better:

```text
WebSocket Handler
       |
       v
Message Service
       |
       +── Message Model
       |
       +── Conversation Model
       |
       +── Notification Model
```

Isse architecture clean rahega.

---

# 110. Production Architecture

Final architecture:

```text
                 CLIENT
                    |
          +---------+---------+
          |                   |
         HTTP              WebSocket
          |                   |
          +---------+---------+
                    |
             Authentication
                    |
             Authorization
                    |
             Controller /
             Socket Handler
                    |
                    v
                Services
                    |
                    v
              Mongoose Models
                    |
                    v
                MongoDB
```

Model layer ka kaam:

```text
Database interaction
Schema definition
Validation
Indexes
Document behavior
```

Service layer ka kaam:

```text
Business logic
```

Controller ka kaam:

```text
HTTP input/output
```

Socket handler ka kaam:

```text
WebSocket input/output
```

---

# 111. Common Mistakes

## Mistake 1

Controller mein huge MongoDB queries likhna.

Better:

```text
Controller
   ↓
Service
   ↓
Model
```

---

## Mistake 2

Har jagah `populate()`.

Populate expensive ho sakta hai.

---

## Mistake 3

Messages ko array ke andar store karna.

Bad:

```json
{
  "messages": [
    {},
    {},
    {},
    {}
  ]
}
```

Chat application ke liye unbounded growth dangerous hai.

---

## Mistake 4

Index nahi lagana.

Example:

```text
conversationId
createdAt
```

par query ho rahi hai but index absent hai.

---

## Mistake 5

Har field par index.

Index bhi cost hai.

---

## Mistake 6

`skip()` se infinite pagination.

Large collections mein cursor pagination better.

---

## Mistake 7

Sensitive fields return karna.

Example:

```text
passwordHash
```

never expose.

---

## Mistake 8

Mongoose validation ko complete security samajhna.

Validation ≠ Authorization.

---

## Mistake 9

WebSocket handler mein database logic bhar dena.

Service layer use karo.

---

## Mistake 10

Database query ko business logic samajhna.

Example:

```text
Message create karna
```

sirf:

```javascript
Message.create()
```

nahi hai.

Business flow ho sakta hai:

```text
Check membership
      ↓
Check blocked user
      ↓
Validate message
      ↓
Create message
      ↓
Update conversation
      ↓
Create notification
      ↓
Broadcast event
```

---

# 112. Mastery Checklist

## Fundamentals

* [ ] Mongoose kya hai
* [ ] ODM kya hai
* [ ] MongoDB vs Mongoose
* [ ] Connection
* [ ] Schema
* [ ] Model
* [ ] Document

## Schema

* [ ] String
* [ ] Number
* [ ] Boolean
* [ ] Date
* [ ] ObjectId
* [ ] Array
* [ ] Map
* [ ] Mixed
* [ ] Defaults
* [ ] Required
* [ ] Enum
* [ ] Validation
* [ ] Timestamps

## Queries

* [ ] find
* [ ] findOne
* [ ] findById
* [ ] create
* [ ] updateOne
* [ ] findOneAndUpdate
* [ ] deleteOne
* [ ] countDocuments
* [ ] exists

## Query Optimization

* [ ] Projection
* [ ] Sort
* [ ] Limit
* [ ] Pagination
* [ ] Cursor pagination
* [ ] Lean
* [ ] Indexes

## Advanced

* [ ] Methods
* [ ] Statics
* [ ] Query helpers
* [ ] Virtuals
* [ ] Getters
* [ ] Setters
* [ ] Middleware
* [ ] Populate
* [ ] Aggregation
* [ ] Transactions
* [ ] Sessions
* [ ] Atomic operations
* [ ] Optimistic concurrency
* [ ] Discriminators

## Production

* [ ] Error handling
* [ ] Duplicate key handling
* [ ] Validation errors
* [ ] Cast errors
* [ ] Connection handling
* [ ] Security
* [ ] Performance
* [ ] Monitoring
* [ ] Backups

---

# 113. Final Mental Model

Mongoose ko ek layer ki tarah samjho:

```text
                     APPLICATION
                          |
              +-----------+-----------+
              |                       |
             HTTP                 WebSocket
              |                       |
              +-----------+-----------+
                          |
                    Business Logic
                          |
                       Services
                          |
                     Mongoose
                          |
          +---------------+---------------+
          |               |               |
       Schema          Model          Queries
          |               |               |
          +---------------+---------------+
                          |
                       MongoDB
                          |
                     Collections
                          |
                      Documents
```

Sabse important distinction:

```text
MongoDB
   =
Database

Mongoose
   =
Node.js application aur MongoDB ke beech
ODM layer
```

Aur hamare chat app mein:

```text
WebSocket
    =
Real-time communication

Mongoose
    =
MongoDB interaction

MongoDB
    =
Permanent data storage

Service
    =
Business logic

Controller
    =
HTTP communication

Socket Handler
    =
WebSocket communication
```

---

# Final Rule

> **Mongoose ko sirf `Model.find()` aur `Model.create()` ki library mat samajhna.**

Professional application mein Mongoose ka role hai:

```text
Schema Design
      +
Validation
      +
Indexes
      +
Document Behavior
      +
Queries
      +
Relationships
      +
Transactions
      +
Performance
      +
Database Abstraction
```

Aur hamare project mein iska final flow hoga:

```text
                    USER
                     |
              HTTP / WebSocket
                     |
                     v
            Controller / Socket
                     |
                     v
                  Service
                     |
          +----------+----------+
          |                     |
      Validation           Authorization
          |                     |
          +----------+----------+
                     |
                     v
              Mongoose Model
                     |
                     v
                  MongoDB
                     |
                     v
               Persistence
                     |
                     v
              Real-Time Event
                     |
                     v
                   USER
```

**Yahi hamare Real-Time Chat Application ka database interaction foundation hai.**
