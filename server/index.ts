import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

import { User } from "./models/User";
import { Message } from "./models/Message";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FIX PATH (important for TS build)
const uploadPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadPath));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// ================= DB =================
mongoose.connect("mongodb://127.0.0.1:27017/chat-app")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/", "audio/", "application/pdf"];
    if (allowed.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

// ================= AUTH =================
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send("Username exists ❌");

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hash });

    res.json({ username: user.username, userId: user._id });
  } catch {
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

// ================= USERS =================
app.get("/users", async (_req, res) => {
  const users = await User.find().select("_id username avatar");
  res.json(users);
});

app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("_id username avatar");

  if (!user) return res.status(404).send("User not found");

  res.json(user);
});

// ================= PROFILE UPDATE =================
app.put("/update-profile/:id", upload.single("avatar"), async (req, res) => {
  try {
    const { username } = req.body;

    const existingUser = await User.findById(req.params.id);

    const updateData: any = { username };

    if (req.file) {
      updateData.avatar = req.file.filename;

      // 🧹 delete old avatar
      if (existingUser?.avatar) {
        const oldPath = path.join(uploadPath, existingUser.avatar);

        fs.unlink(oldPath, (err) => {
          if (err) console.log("Delete error:", err.message);
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: "Profile update failed" });
  }
});

// ================= FILE UPLOAD =================
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ filePath: req.file.filename });
});

// ================= MESSAGES =================
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// ================= SEEN =================
app.post("/seen", async (req, res) => {
  const { sender, receiver } = req.body;

  await Message.updateMany(
    { sender, receiver, seen: false },
    { seen: true }
  );

  res.sendStatus(200);
});

// ================= SOCKET =================
const onlineUsers: Record<string, string> = {};

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);
    onlineUsers[userId] = socket.id;

    io.emit("online_users", Object.keys(onlineUsers));
  });

  // 💬 SEND MESSAGE
  socket.on("send_message", async (data: any) => {
    try {
      const saved = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        type: data.type || "text",
        seen: false
      });

      io.to(data.receiver).emit("receive_message", saved);
      io.to(data.sender).emit("receive_message", saved);

    } catch (err) {
      console.log("Message error:", err);
    }
  });

  // ⌨️ typing
  socket.on("typing", ({ to }) => {
    io.to(to).emit("typing");
  });

  socket.on("stop_typing", ({ to }) => {
    io.to(to).emit("stop_typing");
  });

  socket.on("disconnect", () => {
    for (const id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
      }
    }
    io.emit("online_users", Object.keys(onlineUsers));
  });

});

// ================= START =================
server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});