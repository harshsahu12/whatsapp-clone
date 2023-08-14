import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { Server } from 'socket.io'

// IMPORTED FILES FROM API
import connectDB from "./api/config/connectDB.js";
import userRoute from "./api/routes/userRoute.js";
import chatRoute from "./api/routes/chatRoute.js";
import messageRoute from "./api/routes/messageRoute.js";
import { errorHandler } from "./api/middleware/errorMiddleware.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://whatsapp-clone-6530.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRoute)

if (process.env.NODE_ENV === "production") {
  const prodDirname = path.resolve();
  app.use(express.static(path.join(prodDirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(prodDirname, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

const server = app.listen(port, () => console.log(`Server running on ${port}`));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:5173',"https://whatsapp-clone-6530.onrender.com"],
    credentials: true
  }
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});