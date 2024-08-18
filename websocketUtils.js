import { WebSocketServer } from "ws";
import User from "./models/t_user.js";
import jwt from "jsonwebtoken";

const userConnections = new Map();
let wss;

export const connections = () => {
  return userConnections;
};
export const initWebSocketServer = (server) => {
  if (wss) {
    console.warn("WebSocket server is already initialized.");
    return;
  }
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Yeni WebSocket bağlantısı");

    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === "AUTH") {
        try {
          const decoded = jwt.verify(
            parsedMessage.token,
            process.env.JWT_SECRET
          );
          const username = decoded.username;
          userConnections.set(username, ws);

          await User.update(
            { isConnected: true },
            { where: { username: username } }
          );
          broadcastMessage(
            JSON.stringify({
              type: "AUTH",
              username: username,
              isConnected: true,
            })
          );

          console.log(`User ${username} connected`);
        } catch (err) {
          console.error("Authentication error:", err);
          ws.close();
        }
      } else {
        console.log(`Mesaj alındı: ${message}`);
        broadcastMessage(JSON.stringify(message));
      }
    });

    ws.on("close", async () => {
      console.log("WebSocket bağlantısı kapandı");

      // Update isConnected status
      for (const [username, connection] of userConnections) {
        console.log("username -------->", username);
        if (connection === ws) {
          await User.update({ isConnected: false }, { where: { username } });
          broadcastMessage(
            JSON.stringify({
              type: "AUTH",
              username: username,
              isConnected: false,
            })
          );
          userConnections.delete(username);
          console.log(`User ${username} disconnected`);
          break;
        }
      }
    });
  });
};

// Function to broadcast messages to all connected clients
export function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
