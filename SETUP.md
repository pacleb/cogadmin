# Setup Guide - Task Management Web App

## Quick Start with Docker

The easiest way to run the entire application is with Docker Compose:

```bash
cd /Users/jeromepacleb/Apps/cogadmin
docker-compose up
```

This will start:

- PostgreSQL database on port 5432
- Backend server on port 5000
- Frontend on port 3000

Access the app at `http://localhost:3000`

## Manual Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:

```
DATABASE_URL=postgresql://user:password@localhost:5432/task_management
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

5. Create PostgreSQL database:

```bash
createdb task_management
```

6. Run migrations:

```bash
npx knex migrate:latest
```

7. Start the backend server:

```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get all user's tasks
- `GET /api/tasks/team/:teamId` - Get team tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `POST /api/tasks/:taskId/assign` - Assign task to user
- `POST /api/tasks/:taskId/comments` - Add comment to task

### Teams

- `GET /api/teams` - Get all user's teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:teamId/members` - Get team members
- `POST /api/teams/:teamId/members` - Add member to team
- `DELETE /api/teams/:teamId/members/:userId` - Remove member from team

### Users

- `GET /api/users/profile` - Get user profile
- `GET /api/users/search/:query` - Search users

## WebSocket Events

### Client to Server

- `authenticate` - Authenticate user connection
- `join-team` - Join team room
- `leave-team` - Leave team room
- `task-updated` - Broadcast task update
- `task-created` - Broadcast task creation
- `task-deleted` - Broadcast task deletion
- `task-assigned` - Broadcast task assignment
- `comment-added` - Broadcast new comment
- `user-online` - Mark user as online
- `user-offline` - Mark user as offline

### Server to Client

- `task-updated` - Receive task update
- `task-created` - Receive new task
- `task-deleted` - Receive task deletion
- `task-assigned` - Receive task assignment
- `task-assigned-to-me` - Receive personal task assignment
- `comment-added` - Receive new comment
- `user-presence` - Receive user presence update

## Database Schema

### Users

- id (UUID)
- email (unique)
- password (hashed)
- name
- avatar_url
- created_at, updated_at

### Teams

- id (UUID)
- name
- description
- created_by (user_id)
- created_at, updated_at

### Team Members

- id (UUID)
- team_id
- user_id
- role (owner, admin, member)
- joined_at

### Tasks

- id (UUID)
- title
- description
- team_id
- created_by (user_id)
- status (todo, in_progress, in_review, done)
- priority (low, medium, high, urgent)
- due_date
- created_at, updated_at

### Task Assignments

- id (UUID)
- task_id
- user_id
- assigned_at

### Task Comments

- id (UUID)
- task_id
- user_id
- content
- created_at, updated_at

### Activity Logs

- id (UUID)
- team_id
- user_id
- action
- entity_type
- entity_id
- changes (JSON)
- created_at

## Features

✅ User Authentication with JWT
✅ Real-time Collaboration with WebSocket
✅ Team Management
✅ Task Management (CRUD)
✅ Task Assignment
✅ Task Prioritization and Status Tracking
✅ Task Comments
✅ User Presence
✅ Activity Logging
✅ Role-based Access Control

## Future Enhancements

- [ ] Task attachments and file uploads
- [ ] Email notifications
- [ ] Task templates and recurring tasks
- [ ] Advanced filtering and search
- [ ] Task history and audit logs
- [ ] Team invitations via email
- [ ] Mobile app support
- [ ] Analytics and reporting dashboard
- [ ] Dark mode theme
- [ ] Integrations (Slack, GitHub, etc.)

## Troubleshooting

### Database Connection Error

Ensure PostgreSQL is running and DATABASE_URL in `.env` is correct.

### Port Already in Use

Change the PORT in backend `.env` or frontend `.env` if ports are occupied.

### WebSocket Connection Failed

Check that both frontend and backend are running and CORS settings are correct.

### Migration Issues

Run: `npx knex migrate:rollback` then `npx knex migrate:latest`

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
# Backend
npm run build

# Frontend
npm run build
```
