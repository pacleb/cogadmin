# Architecture & System Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSERS                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │            React Frontend (port 3000)                   │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │         React Components & State Management       │   │ │
│  │  │  - Login/Register Pages                          │   │ │
│  │  │  - Dashboard & Task Board                        │   │ │
│  │  │  - Team Management                              │   │ │
│  │  │  - Task Details & Comments                      │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                      ↓ ↑                                  │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │         Service Layer                            │   │ │
│  │  │  - API Client (Axios)                           │   │ │
│  │  │  - WebSocket Client (Socket.io)                 │   │ │
│  │  │  - Authentication Context                       │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────┬─────────────────────────────────┬─────────────┘
               │ HTTP/REST                       │ WebSocket
               ↓                                 ↓
┌──────────────────────────────────────────────────────────────┐
│                  Backend Server (port 5000)                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          Express.js Server with Socket.io              │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────┐   │ │
│  │  │         API Routes & Handlers                  │   │ │
│  │  │  - /api/auth - Authentication                 │   │ │
│  │  │  - /api/tasks - Task Management               │   │ │
│  │  │  - /api/teams - Team Management               │   │ │
│  │  │  - /api/users - User Operations               │   │ │
│  │  └────────────────────────────────────────────────┘   │ │
│  │                      ↓                                   │ │
│  │  ┌────────────────────────────────────────────────┐   │ │
│  │  │      Middleware & Business Logic               │   │ │
│  │  │  - Authentication Verification                │   │ │
│  │  │  - Request Validation                         │   │ │
│  │  │  - Error Handling                             │   │ │
│  │  │  - Logging                                    │   │ │
│  │  └────────────────────────────────────────────────┘   │ │
│  │                      ↓                                   │ │
│  │  ┌────────────────────────────────────────────────┐   │ │
│  │  │      WebSocket Event Handlers                  │   │ │
│  │  │  - Real-time Task Updates                     │   │ │
│  │  │  - Team Room Management                       │   │ │
│  │  │  - User Presence Tracking                     │   │ │
│  │  │  - Comment Broadcasting                       │   │ │
│  │  └────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                      ↓                                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         Data Access Layer (Knex.js)                    │ │
│  │  - Connection Management                              │ │
│  │  - Query Building                                     │ │
│  │  - Migration System                                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL
                       ↓
┌──────────────────────────────────────────────────────────────┐
│         PostgreSQL Database (port 5432)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database Schema                         │  │
│  │                                                      │  │
│  │  Tables:                                            │  │
│  │  - users (id, email, password, name, avatar)       │  │
│  │  - teams (id, name, description, created_by)       │  │
│  │  - team_members (id, team_id, user_id, role)       │  │
│  │  - tasks (id, title, team_id, status, priority)    │  │
│  │  - task_assignments (id, task_id, user_id)         │  │
│  │  - task_comments (id, task_id, user_id, content)   │  │
│  │  - activity_logs (id, team_id, action, entity)     │  │
│  │                                                      │  │
│  │  Indexes on:                                        │  │
│  │  - users(email) - unique                            │  │
│  │  - tasks(team_id, status)                           │  │
│  │  - task_assignments(task_id, user_id)               │  │
│  │  - team_members(team_id, user_id)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Task Creation Flow

```
User Creates Task
       ↓
Frontend Form Submit
       ↓
POST /api/tasks with JWT
       ↓
Backend Auth Middleware (verify token)
       ↓
Task Route Handler
       ↓
Database Insert (Knex.js)
       ↓
Response with Task Data
       ↓
Frontend Updates State
       ↓
WebSocket emit task-created
       ↓
All Team Members Receive Update
       ↓
Real-time UI Update for All Users
```

### Real-Time Update Flow

```
User A Updates Task
       ↓
PUT /api/tasks/:id
       ↓
Backend Updates Database
       ↓
Response Sent
       ↓
emit task-updated via WebSocket
       ↓
Socket.io Broadcasts to Team Room
       ↓
User A receives update
User B receives update
User C receives update
       ↓
All UIs Update Simultaneously
```

## Authentication Flow

```
1. User Submits Login
        ↓
2. Frontend POST /api/auth/login
   {email, password}
        ↓
3. Backend Validates Credentials
        ↓
4. Compare Password Hash (bcryptjs)
        ↓
5. Generate JWT Token
   jwt.sign({ userId }, secret, { expiresIn: '7d' })
        ↓
6. Return Token to Frontend
        ↓
7. Frontend Stores in localStorage
        ↓
8. Configure Axios Interceptor
        ↓
9. All Future Requests Include:
   Authorization: Bearer <token>
        ↓
10. Backend Verifies Token on Every Protected Route
        ↓
11. Extract userId from Token
        ↓
12. Attach User to Request Context
        ↓
13. Proceed with Request
```

## Component Communication Patterns

### Prop Drilling

```
Dashboard
  ├─ TeamSidebar (receives selectedTeam)
  │   └─ TeamList (receives teams array)
  └─ TaskBoard (receives selectedTeam)
      ├─ TaskColumn (receives tasks for status)
      │   └─ TaskCard (receives task data)
      └─ StatusFilter (receives current status)
```

### Context API (For Global State)

```
AuthContext (Global)
  ├─ user
  ├─ token
  ├─ login()
  ├─ logout()
  └─ register()

Used in:
  - LoginPage
  - RegisterPage
  - Dashboard
  - ProtectedRoute
  - Any component needing auth
```

### Service Layer (External Data)

```
api.js (Axios Instance)
  ├─ Interceptors for token injection
  ├─ Error handling
  └─ Base URL configuration

socketService.js (Socket.io Client)
  ├─ Connection management
  ├─ Event listeners
  └─ Room management
```

## State Management Strategy

### Frontend State Hierarchy

```
Global State (AuthContext)
├─ user (authenticated user info)
├─ token (JWT token)
└─ auth actions (login, register, logout)

Local Component State
├─ Dashboard
│  ├─ teams (fetched from API)
│  ├─ selectedTeam (selected team)
│  ├─ tasks (for selected team)
│  ├─ showNewTeamModal
│  └─ showNewTaskModal
│
├─ TaskDetails
│  ├─ task (fetched from API)
│  ├─ comments (fetched from API)
│  └─ newComment (form input)
│
└─ TeamMembers
   ├─ members (fetched from API)
   ├─ users (search results)
   └─ selectedUser
```

## Error Handling Strategy

### Frontend Error Handling

```
1. API Error
   ↓
2. Axios Response Interceptor
   ↓
3. Check for 401 (auth error)
   ↓
4. If 401:
   - Clear token
   - Redirect to login
   ↓
5. Else:
   - Extract error message
   - Show Toast notification
   - Log to console
```

### Backend Error Handling

```
1. Route Handler
   ↓
2. Try-Catch Block
   ↓
3. Handle Specific Error Types
   ├─ Validation Error → 400
   ├─ Auth Error → 401
   ├─ Not Found → 404
   ├─ Conflict → 409
   └─ Server Error → 500
   ↓
4. Send JSON Response
   {
     error: "Human-readable message",
     status: 400
   }
   ↓
5. Log Error Details
   (stack trace, context)
```

## WebSocket Architecture

### Room-Based Organization

```
Broadcasting Scope:
├─ User-specific rooms
│  └─ user-<userId>
│     └─ Personal notifications
│
├─ Team rooms
│  └─ team-<teamId>
│     ├─ task-updated
│     ├─ task-created
│     ├─ task-deleted
│     ├─ comment-added
│     └─ user-presence
│
└─ Global room
   └─ (for future global events)
```

### Event Handling Pattern

```
Socket Connection
    ↓
Authenticate with userId
    ↓
Join User-Specific Room
    ↓
User Actions:
├─ Join Team → emit join-team
│  ├─ Socket joins team-<teamId>
│  └─ Listen for team events
│
├─ Update Task → emit task-updated
│  ├─ Broadcast to team-<teamId>
│  └─ All members receive update
│
├─ Leave Team → emit leave-team
│  └─ Socket leaves team-<teamId>
│
└─ Disconnect
   └─ Mark as offline
   └─ Remove from all rooms
```

## Database Connection & Query Optimization

### Connection Pool

```
Connection Pool (min: 2, max: 10)
    ↓
Request comes in
    ↓
Acquire connection from pool
    ↓
Execute Knex.js query
    ↓
Release connection back to pool
    ↓
Next request reuses connection
```

### Query Optimization

```
Knex.js Query Builder
    ↓
├─ Select specific columns (not *)
├─ Use WHERE clauses early
├─ Join tables efficiently
├─ Limit results
└─ Use indexes on filtered columns
    ↓
Database executes optimized query
    ↓
Results returned to application
```

## Deployment Architecture

```
Production Environment
│
├─ Load Balancer
│  └─ Routes traffic to multiple backend instances
│
├─ Multiple Backend Instances
│  ├─ Instance 1 (port 5000)
│  ├─ Instance 2 (port 5000)
│  └─ Instance 3 (port 5000)
│  └─ Redis (for Socket.io sync)
│
├─ PostgreSQL Database
│  ├─ Primary (read/write)
│  └─ Replicas (read-only, optional)
│
├─ CDN
│  └─ Frontend static assets
│
└─ Frontend Hosting
   └─ Serve React SPA
```

## Performance Optimization Layers

```
1. Frontend Optimization
   ├─ Code splitting
   ├─ Lazy loading components
   ├─ Memoization (React.memo)
   ├─ Virtual scrolling (for large lists)
   └─ Asset compression

2. Network Optimization
   ├─ GZIP compression
   ├─ HTTP/2
   ├─ CDN for static assets
   └─ Request batching

3. Backend Optimization
   ├─ Query optimization
   ├─ Database indexing
   ├─ Caching (Redis, future)
   ├─ Request rate limiting
   └─ Response compression

4. Database Optimization
   ├─ Connection pooling
   ├─ Query indexes
   ├─ Schema optimization
   ├─ Archiving old data
   └─ Replication (optional)
```

## Security Layers

```
1. Transport Security
   └─ HTTPS/TLS

2. Authentication Layer
   ├─ Password hashing (bcryptjs)
   ├─ JWT tokens
   └─ Token expiration

3. Authorization Layer
   ├─ Verify token on each request
   ├─ Check team membership
   ├─ Validate permissions
   └─ Role-based access

4. Input Validation
   ├─ Type checking
   ├─ Length validation
   ├─ Email validation
   └─ SQL injection prevention

5. Data Protection
   ├─ No sensitive data in frontend
   ├─ Encrypted passwords
   ├─ Secure headers
   └─ CORS configuration
```

## Scalability Considerations

### Horizontal Scaling

```
1. Stateless Backend
   └─ Each instance can handle any request

2. Shared Database
   └─ PostgreSQL handles concurrent connections

3. Socket.io Scaling
   └─ Redis adapter for cross-server communication

4. Load Balancing
   └─ Distribute requests across instances

5. Session Management
   └─ JWT eliminates need for sessions
```

### Vertical Scaling

```
1. Database
   └─ Increase memory and CPU

2. Backend Servers
   └─ More worker processes

3. Frontend
   └─ CDN and caching
```
