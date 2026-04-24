import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import multer from "multer";
import path from "path";

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
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;

//   const hash = await bcrypt.hash(password, 10);
//   const user = await User.create({ username, password: hash });

//   res.json(user);
// });
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send("Username already exists ❌");
    }

    const user = new User({ username, password });
    await user.save();

    res.json({ username: user.username });
  } catch (err) {
    res.status(500).send("Server error");
  }
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

app.get("/messages/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});
app.use(express.json());

//  USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("_id username");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

//  SINGLE USER
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("_id username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.put("/update-profile/:id", upload.single("avatar"), async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const { username } = req.body;

    const updateData: any = { username };

    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log("UPDATED USER:", user);

    res.json(user);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});


const onlineUsers: any = {};

io.on("connection", (socket) => {

  socket.onAny((event, ...args) => {
    console.log("----------------- Event:", event, args);
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

  // FIXED MESSAGE HANDLER
  socket.on("send_message", async (data) => {

    try {
      // SAVE MESSAGE
      const saved = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message
      });

      //  SEND TO RECEIVER ROOM
      io.to(data.receiver).emit("receive_message", saved);

      //  SEND BACK TO SENDER
      io.to(data.sender).emit("receive_message", saved);

    } catch (err) {
      console.log("Message save error:", err);
    }
  });
});


server.listen(5000, () => console.log("Server running on 5000"));