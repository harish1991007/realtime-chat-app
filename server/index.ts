import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

mongoose.connect("mongodb://127.0.0.1:27017/chat-app")
  .then(() => console.log("----------------✅ MongoDB Connected"))
  .catch((err) => console.log("----------------------❌ DB Error:", err));
// ================= USERS =================
// import { User } from "./models/User";
// import { Message } from "./models/Message";


import { User } from "./models/User";
import { Message } from "./models/Message";
// ================= AUTH =================
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash });

  res.json(user);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send("Wrong password");

  const token = jwt.sign({ id: user._id }, "SECRET");

  res.json({ token, userId: user._id });
});
// app.get("/users", async (req, res) => {
//   const users = await User.find().select("_id username");
//   res.json(users);
// });

app.get("/messages/:user1/:user2", async (req, res) => {
  try {
    console.log('--------------------1messages');
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });
    console.log('--------------------2messages', messages);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});
app.use(express.json());

// ✅ USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("_id username");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ SINGLE USER
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("_id username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

const onlineUsers: any = {};

io.on("connection", (socket) => {
  console.log("------------------User connected:", socket.id);
  console.log("---------------------🔥 New socket connected:", socket.id);

  socket.onAny((event, ...args) => {
    console.log("-----------------📩 Event:", event, args);
  });
  socket.on("join", (userId) => {
    socket.join(userId);
    onlineUsers[userId] = socket.id;

    io.emit("online_users", Object.keys(onlineUsers));
  });

  socket.on("disconnect", () => {
    for (let id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
      }
    }
    io.emit("online_users", Object.keys(onlineUsers));
  });

  // 🔥 FIXED MESSAGE HANDLER
  socket.on("send_message", async (data) => {
    console.log('--------------------1data', data);

    try {
      // ✅ SAVE MESSAGE
      const saved = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message
      });
      console.log('--------------------1saved', saved);

      // ✅ SEND TO RECEIVER ROOM
      io.to(data.receiver).emit("receive_message", saved);

      // ✅ SEND BACK TO SENDER
      io.to(data.sender).emit("receive_message", saved);

    } catch (err) {
      console.log("Message save error:", err);
    }
  });
});


server.listen(5000, () => console.log("Server running on 5000"));