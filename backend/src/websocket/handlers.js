const setupWebSocket = (io) => {
  const userSockets = {}; // Map userId to socketId

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User authentication
    socket.on("authenticate", (data) => {
      userSockets[data.userId] = socket.id;
      socket.join(`user-${data.userId}`);
    });

    // Join team room
    socket.on("join-team", (teamId) => {
      socket.join(`team-${teamId}`);
    });

    // Leave team room
    socket.on("leave-team", (teamId) => {
      socket.leave(`team-${teamId}`);
    });

    // Task updates broadcast
    socket.on("task-updated", (data) => {
      io.to(`team-${data.teamId}`).emit("task-updated", data);
    });

    socket.on("task-created", (data) => {
      io.to(`team-${data.teamId}`).emit("task-created", data);
    });

    socket.on("task-deleted", (data) => {
      io.to(`team-${data.teamId}`).emit("task-deleted", data);
    });

    // Task assignment
    socket.on("task-assigned", (data) => {
      io.to(`team-${data.teamId}`).emit("task-assigned", data);
      if (userSockets[data.assignedUserId]) {
        io.to(`user-${data.assignedUserId}`).emit("task-assigned-to-me", data);
      }
    });

    // Comment notifications
    socket.on("comment-added", (data) => {
      io.to(`team-${data.teamId}`).emit("comment-added", data);
    });

    // User presence
    socket.on("user-online", (userId) => {
      socket.broadcast.emit("user-presence", { userId, status: "online" });
    });

    socket.on("disconnect", () => {
      // Clean up user socket mapping
      Object.keys(userSockets).forEach((userId) => {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          socket.broadcast.emit("user-presence", { userId, status: "offline" });
        }
      });
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { setupWebSocket };
