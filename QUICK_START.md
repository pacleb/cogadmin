# Quick Reference Guide

## Getting Started in 5 Minutes

### Option 1: Docker (Easiest)

```bash
cd cogadmin
bash start.sh
# Wait for services to start
# Open http://localhost:3000
```

### Option 2: Manual Setup

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm start
```

### Option 3: Without Database Setup

```bash
# Docker handles database automatically with docker-compose
docker-compose up
```

## First Time User Checklist

- [ ] Clone/download the project
- [ ] Copy `.env.example` to `.env` in both backend and frontend
- [ ] Update backend `.env` with database URL
- [ ] Run migrations: `npx knex migrate:latest`
- [ ] Install dependencies in both directories
- [ ] Start backend on port 5000
- [ ] Start frontend on port 3000
- [ ] Register a test account
- [ ] Create a test team
- [ ] Create test tasks
- [ ] Invite another user to team (optional)

## Common Commands

### Backend

```bash
npm install              # Install dependencies
npm run dev             # Start dev server with auto-reload
npm start               # Start production server
npx knex migrate:latest # Apply migrations
npx knex migrate:rollback # Undo migration
npm test                # Run tests (when added)
```

### Frontend

```bash
npm install             # Install dependencies
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from create-react-app (irreversible!)
```

### Docker

```bash
docker-compose up      # Start all services
docker-compose down    # Stop all services
docker-compose logs -f # View logs
docker-compose ps      # List running containers
```

## Project Structure Quick Map

```
cogadmin/
├── backend/
│   ├── src/
│   │   ├── routes/          ← Add new API endpoints here
│   │   ├── middleware/      ← Add middleware here
│   │   ├── migrations/      ← Database schema changes
│   │   └── websocket/       ← Real-time events
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      ← New React components here
│   │   ├── pages/          ← New pages here
│   │   ├── services/       ← API & Socket clients
│   │   └── contexts/       ← Global state
│   └── package.json
│
├── docker-compose.yml
├── README.md
├── SETUP.md
├── ADVANCED.md
├── DEVELOPMENT.md
├── ARCHITECTURE.md
└── API_EXAMPLES.md
```

## Feature Implementation Checklist

### Adding a New Feature

1. **Backend API**
   - [ ] Create new route file in `backend/src/routes/`
   - [ ] Register route in `backend/src/server.js`
   - [ ] Add database migration if needed
   - [ ] Run migration with `npx knex migrate:latest`
   - [ ] Test with curl or Postman
   - [ ] Add WebSocket handlers if real-time needed

2. **Frontend UI**
   - [ ] Create component in `frontend/src/components/`
   - [ ] Create page if needed in `frontend/src/pages/`
   - [ ] Add API calls in component
   - [ ] Connect WebSocket listeners if real-time needed
   - [ ] Add toast notifications for feedback
   - [ ] Test in browser

3. **Integration**
   - [ ] Connect backend API to frontend
   - [ ] Test with real data
   - [ ] Add error handling
   - [ ] Test with multiple users if collaborative

## Database Common Tasks

### View Database

```bash
# Connect with psql
psql -U user -d task_management -h localhost

# List tables
\dt

# View schema of a table
\d+ table_name

# Exit
\q
```

### Useful SQL Queries

```sql
-- See all users
SELECT id, name, email FROM users;

-- See all teams
SELECT id, name, created_by FROM teams;

-- See tasks in a team
SELECT id, title, status FROM tasks WHERE team_id = 'team-uuid';

-- See team members
SELECT u.name, tm.role FROM team_members tm
JOIN users u ON tm.user_id = u.id
WHERE tm.team_id = 'team-uuid';
```

### Reset Database

```bash
# Rollback all migrations
cd backend
npx knex migrate:rollback --all

# Reapply migrations
npx knex migrate:latest
```

## Debugging Tips

### Backend

```javascript
// Add logging
console.log('Debug:', variable);

// Check server logs
docker-compose logs backend

// Test routes with curl
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Frontend

```javascript
// Console logging
console.log("State:", state);
console.log("Props:", props);

// Check network tab in DevTools
// Check Storage tab for token
// Check Console for errors
```

### WebSocket

```javascript
// Check connection in browser console
console.log(socket.connected);

// Listen to all events
socket.onAny((event, ...args) => {
  console.log(event, args);
});
```

## Deployment Checklist

### Before Deploying

- [ ] Set strong JWT_SECRET
- [ ] Update DATABASE_URL for production
- [ ] Set NODE_ENV=production
- [ ] Run migrations on production database
- [ ] Build frontend: `npm run build`
- [ ] Test in production environment
- [ ] Set up SSL/HTTPS
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Enable CORS only for your domain

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Frontend loads
curl http://localhost:3000
```

## Environment Variables Reference

### Backend (.env)

| Variable     | Example                             | Notes                     |
| ------------ | ----------------------------------- | ------------------------- |
| DATABASE_URL | postgresql://user:pass@host:5432/db | Required                  |
| JWT_SECRET   | random-string-min-32-chars          | Keep secret!              |
| NODE_ENV     | production                          | development or production |
| PORT         | 5000                                | Backend port              |
| CORS_ORIGIN  | https://app.com                     | Frontend URL              |

### Frontend (.env)

| Variable                | Example                 | Notes              |
| ----------------------- | ----------------------- | ------------------ |
| REACT_APP_API_URL       | https://api.app.com/api | Backend API URL    |
| REACT_APP_WEBSOCKET_URL | https://api.app.com     | Backend URL for WS |

## Performance Tips

### Frontend

- Use React DevTools to profile
- Check Network tab for slow requests
- Lazy load components
- Memoize expensive computations

### Backend

- Use database indexes
- Paginate large result sets
- Cache frequently accessed data
- Monitor query performance

### Database

- Add indexes on filtered columns
- Archive old data
- Monitor table sizes
- Optimize queries with EXPLAIN

## Common Issues & Solutions

| Issue                     | Solution                                           |
| ------------------------- | -------------------------------------------------- |
| Port already in use       | Kill process: `lsof -i :5000 \| kill -9 <PID>`     |
| Database connection error | Check DATABASE_URL and PostgreSQL running          |
| CORS error                | Verify CORS_ORIGIN matches frontend URL            |
| 401 Unauthorized          | Check token in localStorage, regenerate if expired |
| WebSocket not connecting  | Check server running and CORS settings             |
| Migrations not applying   | Check knexfile.js configuration                    |
| Hot reload not working    | Restart dev server                                 |

## Resources

### Documentation

- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Installation instructions
- [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [ADVANCED.md](ADVANCED.md) - Advanced features
- [API_EXAMPLES.md](API_EXAMPLES.md) - API usage

### External Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Socket.io Docs](https://socket.io/)
- [Knex.js Docs](https://knexjs.org/)

## Support & Help

### Getting Help

1. Check the [SETUP.md](SETUP.md) for setup issues
2. Check [DEVELOPMENT.md](DEVELOPMENT.md) for development questions
3. Check [API_EXAMPLES.md](API_EXAMPLES.md) for API usage
4. Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design
5. Check console logs and server logs for errors

### Reporting Issues

When reporting issues, include:

- What were you trying to do?
- What happened instead?
- Error messages (from console or server logs)
- Steps to reproduce
- Your environment (OS, Node version, etc.)

## Next Steps

1. **Understand the Codebase**
   - Read ARCHITECTURE.md
   - Explore the file structure
   - Run the application

2. **Add Your First Feature**
   - Follow DEVELOPMENT.md
   - Start with a simple enhancement
   - Test thoroughly

3. **Deploy to Production**
   - Review ADVANCED.md security section
   - Set up proper environment variables
   - Configure database backups
   - Monitor logs and performance

4. **Scale the Application**
   - Add Redis for caching
   - Set up multiple backend instances
   - Implement database replication
   - Use CDN for frontend assets

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Ready for Development
