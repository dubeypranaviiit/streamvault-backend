import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import envFile from "./src/config/env.js";
import authRoutes from "./src/routes/authRoutes.js";
import videoRoutes from "./src/routes/videoRoutes.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./src/routes/adminRoutes.js";
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173",
  "https://streamvault-frontend.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser()); 
app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(` User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("Backend running with ES Modules");
});
const startServer = async () => {
  await connectDB(envFile.MONGO_URL);

  server.listen(envFile.PORT, () => {
    console.log(` Server running on port ${envFile.PORT}`);
  });
};

startServer();
