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

mongoose.connect("mongodb://127.0.0.1:27017/chat-app");

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
  console.log("----------------Incoming1:", username);
  console.log("----------------Incoming2:", password);
  console.log("----------------Incoming3:", req.body);

  const user = await User.findOne({ username });
  console.log("----------------Incoming:", user);
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


// ================= SOCKET =================
// const onlineUsers: any = {};

// io.on("connection", (socket) => {
//   console.log("Connected:", socket.id);

//   socket.on("join", (userId) => {
//     onlineUsers[userId] = socket.id;
//     io.emit("online-users", Object.keys(onlineUsers));
//   });

//   socket.on("send-message", async ({ sender, receiver, content }) => {
//     const message = await Message.create({ sender, receiver, content });

//     const receiverSocket = onlineUsers[receiver];
//     if (receiverSocket) {
//       io.to(receiverSocket).emit("receive-message", message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   });
// });


const onlineUsers: any = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // ✅ user joins
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;

    io.emit("online_users", Object.keys(onlineUsers));
  });

  // ✅ private message
  socket.on("send_message", (data) => {
    const { sender, receiver, message } = data;

    const receiverSocket = onlineUsers[receiver];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", data);
    }
  });

  // ✅ disconnect
  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }

    io.emit("online_users", Object.keys(onlineUsers));
  });
});

server.listen(5000, () => console.log("Server running on 5000"));