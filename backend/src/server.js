require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const db = require("./config/database");
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");
const teamsRoutes = require("./routes/teams");
const usersRoutes = require("./routes/users");
const { authMiddleware } = require("./middleware/auth");
const { setupWebSocket } = require("./websocket/handlers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, tasksRoutes);
app.use("/api/teams", authMiddleware, teamsRoutes);
app.use("/api/users", authMiddleware, usersRoutes);

// WebSocket setup
setupWebSocket(io);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    status: err.status || 500,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});
