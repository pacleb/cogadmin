# Task Management Web App with Collaboration Features

A full-stack task management application with real-time collaboration, team features, and WebSocket support.

## Features

- **User Authentication**: JWT-based authentication
- **Real-time Collaboration**: WebSocket support for live task updates
- **Team Management**: Create teams and invite members
- **Task Management**: Create, update, delete, and organize tasks
- **Task Assignment**: Assign tasks to team members
- **Comments & Activity**: Task comments and activity feed
- **Permissions**: Role-based access control
- **Shared Workspaces**: Collaborate on shared projects

## Tech Stack

### Frontend

- React 18
- TypeScript
- Axios (HTTP client)
- Socket.io-client (WebSocket)
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- PostgreSQL
- Socket.io
- JWT Authentication
- Knex.js (Query builder)

## Project Structure

```
cogadmin/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Getting Started

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

See `.env.example` files in both backend and frontend directories.
