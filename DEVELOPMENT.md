# Development Instructions

## Project Structure Overview

```
cogadmin/
├── backend/                          # Node.js Express backend
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   │   └── database.js          # Database setup
│   │   ├── middleware/              # Express middleware
│   │   │   └── auth.js              # JWT authentication
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   ├── tasks.js             # Task management
│   │   │   ├── teams.js             # Team management
│   │   │   └── users.js             # User endpoints
│   │   ├── migrations/              # Database migrations
│   │   │   └── 001_initial_schema.js
│   │   ├── utils/                   # Utility functions
│   │   │   └── helpers.js
│   │   ├── websocket/               # WebSocket handlers
│   │   │   └── handlers.js
│   │   └── server.js                # Main server file
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── Dockerfile
│   └── knexfile.js
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   └── TeamMembers.jsx
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/                # API & Socket services
│   │   │   ├── api.js              # Axios instance
│   │   │   └── socket.js           # Socket.io client
│   │   ├── utils/                   # Utility functions
│   │   │   └── helpers.js
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.jsx               # React entry point
│   │   └── index.css               # Global styles
│   ├── public/
│   │   └── index.html
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── Dockerfile
│
├── docker-compose.yml               # Docker Compose config
├── README.md                         # Project overview
├── SETUP.md                         # Setup instructions
├── ADVANCED.md                      # Advanced features
├── start.sh                         # Quick start script
└── .gitignore
```

## Development Workflow

### 1. Setting Up Your Development Environment

```bash
# Clone/navigate to project
cd cogadmin

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx knex migrate:latest

# Start backend
npm run dev

# In a new terminal - Frontend setup
cd frontend
npm install
cp .env.example .env

# Start frontend
npm start
```

### 2. Adding a New API Endpoint

```javascript
// backend/src/routes/example.js
const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/:id", async (req, res) => {
  try {
    const item = await db("table_name").where("id", req.params.id).first();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

Then register in server.js:

```javascript
const exampleRoutes = require("./routes/example");
app.use("/api/example", authMiddleware, exampleRoutes);
```

### 3. Creating a New React Component

```javascript
// frontend/src/components/NewComponent.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const NewComponent = ({ itemId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [itemId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/endpoint/${itemId}`);
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return <div className="p-4">{/* Component JSX */}</div>;
};
```

### 4. Working with Real-Time Updates

```javascript
// In your component
import socketService from "../services/socket";

useEffect(() => {
  socketService.joinTeam(teamId);

  const handleUpdate = (data) => {
    // Update local state
  };

  socketService.on("task-updated", handleUpdate);

  return () => {
    socketService.off("task-updated", handleUpdate);
  };
}, [teamId]);
```

### 5. Database Migrations

Create a new migration:

```bash
cd backend
npx knex migrate:make add_new_table
```

Edit the generated file:

```javascript
exports.up = function (knex) {
  return knex.schema.createTable("new_table", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("new_table");
};
```

Run migrations:

```bash
npx knex migrate:latest
```

### 6. Testing Your Changes

```bash
# Backend - test API endpoint
curl http://localhost:5000/api/tasks

# Frontend - open browser
http://localhost:3000

# Check WebSocket connection
Open browser console and look for "WebSocket connected"
```

## Common Development Tasks

### Debugging

```javascript
// Backend
console.log("Debug message:", variable);
// Check logs with: docker-compose logs -f backend

// Frontend
console.log("Debug message:", variable);
// Open browser DevTools (F12) and check Console
```

### Adding Dependencies

```bash
# Backend
cd backend
npm install new-package

# Frontend
cd frontend
npm install new-package
```

### Resetting Database

```bash
# Rollback all migrations
cd backend
npx knex migrate:rollback --all

# Reapply migrations
npx knex migrate:latest
```

### Troubleshooting

**Port already in use**

```bash
# Backend
lsof -i :5000
kill -9 <PID>

# Frontend
lsof -i :3000
kill -9 <PID>
```

**Database connection error**

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb task_management`

**WebSocket not connecting**

- Verify backend is running
- Check CORS_ORIGIN in backend .env
- Check REACT_APP_WEBSOCKET_URL in frontend .env

## Code Style & Best Practices

### Backend

- Use async/await for asynchronous operations
- Always handle errors with try/catch
- Validate input before database operations
- Use meaningful variable names
- Add comments for complex logic

### Frontend

- Use functional components and hooks
- Lift state up when needed
- Memoize expensive computations with useMemo
- Use custom hooks for reusable logic
- Keep components small and focused
- Always handle loading and error states

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/task-details

# Make changes and commit
git add .
git commit -m "feat: add task details component"

# Push to remote
git push origin feature/task-details

# Create pull request on GitHub
```

## Performance Optimization Tips

1. **Frontend**
   - Use React.memo for expensive components
   - Implement pagination for large lists
   - Lazy load components with React.lazy()
   - Optimize images with compression

2. **Backend**
   - Add database indexes for frequently queried fields
   - Use query pagination to avoid large data transfers
   - Implement caching with Redis
   - Use database connection pooling

3. **General**
   - Monitor bundle size
   - Use CDN for static assets
   - Enable gzip compression
   - Minimize database queries per request
