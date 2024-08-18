import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { initWebSocketServer } from "./websocketUtils.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);

initWebSocketServer(server);

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("WebSocket mesajlaşma API'si çalışıyor");
});

app.use("/user", userRoutes);
app.use("/message", messageRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized");

    server.listen(PORT, () => {
      console.log(`Server çalışıyor: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });
