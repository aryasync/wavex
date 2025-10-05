import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.route.js";
import notificationsRouter from "./routes/notifications.route.js";
import { config } from "./config/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", itemsRouter);
app.use("/api/notifications", notificationsRouter);

// Start server
app.listen(config.server.port, () => {
  console.log(`✅ Backend running on ${config.server.host}:${config.server.port}`);
});
