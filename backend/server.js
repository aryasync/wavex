import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.route.js";
import notificationsRouter from "./routes/notifications.route.js";
import { NotificationSchedulerService } from "./services/notification-scheduler.service.js";
import { config } from "./config/index.js";

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'https://wavex-xi.vercel.app/', // Replace with your actual Vercel URL
    'https://*.vercel.app' // Allow all Vercel subdomains
  ],
  credentials: true
}));
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running!" });
});

// Routes
app.use("/api", itemsRouter);
app.use("/api/notifications", notificationsRouter);

// Start notification scheduler
const scheduler = new NotificationSchedulerService();
scheduler.start();

// Start server
app.listen(config.server.port, () => {
  console.log(`✅ Backend running on ${config.server.host}:${config.server.port}`);
  console.log(`📅 Notification scheduler started`);
});
