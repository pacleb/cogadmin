import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (this.socket?.connected) return;

    this.socket = io(
      process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5000",
      {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      },
    );

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.socket.emit("authenticate", { userId });
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinTeam(teamId) {
    this.socket?.emit("join-team", teamId);
  }

  leaveTeam(teamId) {
    this.socket?.emit("leave-team", teamId);
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }

  emit(event, data) {
    this.socket?.emit(event, data);
  }
}

export default new SocketService();
