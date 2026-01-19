# API Usage Examples

## Authentication

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Teams

### Get All Teams

```bash
curl -X GET http://localhost:5000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Team

```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Alpha",
    "description": "Main development project"
  }'
```

### Get Team Members

```bash
curl -X GET http://localhost:5000/api/teams/TEAM_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Team Member

```bash
curl -X POST http://localhost:5000/api/teams/TEAM_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "role": "member"
  }'
```

### Remove Team Member

```bash
curl -X DELETE http://localhost:5000/api/teams/TEAM_ID/members/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Tasks

### Get All User Tasks

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Team Tasks

```bash
curl -X GET http://localhost:5000/api/tasks/team/TEAM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design homepage",
    "description": "Create mockups for the new homepage",
    "team_id": "team-uuid",
    "status": "todo",
    "priority": "high"
  }'
```

### Update Task

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "medium"
  }'
```

### Delete Task

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Assign Task

```bash
curl -X POST http://localhost:5000/api/tasks/TASK_ID/assign \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid"
  }'
```

### Add Task Comment

```bash
curl -X POST http://localhost:5000/api/tasks/TASK_ID/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This looks great, let's proceed with implementation"
  }'
```

## Users

### Get Profile

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Users

```bash
curl -X GET http://localhost:5000/api/users/search/john \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## WebSocket Events

### JavaScript Client Example

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5000");

// Connect and authenticate
socket.emit("authenticate", { userId: "user-uuid" });

// Join team
socket.emit("join-team", "team-uuid");

// Listen for task updates
socket.on("task-updated", (data) => {
  console.log("Task updated:", data);
});

// Emit task update
socket.emit("task-updated", {
  id: "task-uuid",
  title: "Updated Title",
  status: "in_progress",
  teamId: "team-uuid",
});

// Leave team
socket.emit("leave-team", "team-uuid");
```

### React Hook Example

```javascript
import { useEffect } from "react";
import socketService from "../services/socket";

export const useTaskUpdates = (teamId) => {
  useEffect(() => {
    socketService.joinTeam(teamId);

    const handleUpdate = (task) => {
      console.log("Task update received:", task);
    };

    socketService.on("task-updated", handleUpdate);

    return () => {
      socketService.off("task-updated", handleUpdate);
      socketService.leaveTeam(teamId);
    };
  }, [teamId]);
};
```

## Status Codes & Error Handling

### Success Responses

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Successful deletion

### Error Responses

- `400 Bad Request` - Invalid input

```json
{ "error": "Missing required fields" }
```

- `401 Unauthorized` - No token or invalid token

```json
{ "error": "No token provided" }
```

- `404 Not Found` - Resource not found

```json
{ "error": "Task not found" }
```

- `409 Conflict` - Resource already exists

```json
{ "error": "User already exists" }
```

- `500 Internal Server Error` - Server error

```json
{ "error": "Internal Server Error" }
```

## Pagination (Future Enhancement)

```bash
# Get tasks with pagination
curl -X GET "http://localhost:5000/api/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Filtering Examples (Future Enhancement)

```bash
# Get tasks by status
curl -X GET "http://localhost:5000/api/tasks?status=in_progress" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get tasks by priority
curl -X GET "http://localhost:5000/api/tasks?priority=high" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get tasks by team
curl -X GET "http://localhost:5000/api/tasks/team/TEAM_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Rate Limiting (Future Enhancement)

Recommended rate limits per API endpoint:

- Auth endpoints: 5 requests/minute
- Task endpoints: 30 requests/minute
- Team endpoints: 20 requests/minute
- User search: 10 requests/minute

## Testing with Postman

1. Set up environment variables:
   - `base_url`: http://localhost:5000
   - `token`: (set after login)
   - `team_id`: (set after creating team)
   - `task_id`: (set after creating task)
   - `user_id`: (set from profile)

2. Use {{variable_name}} in requests to reference environment variables

3. Set `token` automatically from login response:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.token);
   ```

## Health Check

```bash
curl http://localhost:5000/health
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-19T10:30:00.000Z"
}
```
