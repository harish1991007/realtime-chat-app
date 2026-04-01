"use client";

import { useEffect, useState } from "react";
import { socket } from "./lib/socket";

export default function Chat() {
  const [userId, setUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [me, setMe] = useState<any>(null);

  // ✅ INIT USER
  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (!id) {
      window.location.href = "/";
      return;
    }

    setUserId(id);
    socket.emit("join", id);
  }, []);

  // ✅ LOAD USERS
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          const id = localStorage.getItem("userId");
          setUsers(data.filter((u: any) => u._id !== id));
        } catch {
          console.error("Users API error:", text);
        }
      });
  }, []);

  // ✅ LOAD MY PROFILE
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) return;

    fetch(`http://localhost:5000/user/${id}`)
      .then((res) => res.json())
      .then(setMe);
  }, []);

  // ✅ SOCKET LISTENERS
  useEffect(() => {
    const id = localStorage.getItem("userId");

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      if (id) {
        socket.emit("join", id);
        console.log("✅ Joined room:", id);
      }
    });

    return () => {
      socket.off("connect");
    };
  }, []);


  // ✅ LOAD CHAT HISTORY
  const loadMessages = async (receiverId: string) => {
    const id = localStorage.getItem("userId");
    if (!id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/messages/${id}/${receiverId}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.log("Load message error:", err);
    }
  };

  // ✅ SEND MESSAGE
  const sendMessage = () => {
    console.log("CLICK SEND", msg, selectedUser, userId);

    if (!msg || !selectedUser || !userId) {
      console.log("❌ Missing data");
      return;
    }

    if (!socket.connected) {
      console.log("❌ Socket not connected");
      return;
    }

    socket.emit("send_message", {
      sender: userId,
      receiver: selectedUser._id,
      message: msg
    });
    const data = {
      sender: userId,
      receiver: selectedUser._id,
      message: msg
    };
    console.log("✅ Message emitted");
   // setMessages((prev) => [...prev, data]);
    setMsg("");
  };
  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  // ✅ AUTO SCROLL
  useEffect(() => {
    const el = document.getElementById("chat-box");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* 👥 LEFT SIDEBAR */}
      <div style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column"
      }}>

        {/* 👤 PROFILE + LOGOUT */}
        <div style={{
          padding: 15,
          background: "#ededed",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="https://i.pravatar.cc/40" style={{ borderRadius: "50%", marginRight: 10 }} />
            <b>{me?.username || "Loading..."}</b>
          </div>

          <button
            onClick={logout}
            style={{
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: 5,
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        {/* 👥 USER LIST */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                loadMessages(u._id); // 🔥 LOAD HISTORY
              }}
              style={{
                padding: 12,
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                background: selectedUser?._id === u._id ? "#f0f0f0" : "#fff"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={`https://i.pravatar.cc/40?u=${u._id}`}
                  style={{ borderRadius: "50%", marginRight: 10 }}
                />
                <div>
                  <div>{u.username}</div>
                  {onlineUsers.includes(u._id) && (
                    <small style={{ color: "green" }}>online</small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 💬 CHAT AREA */}
      <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        {selectedUser && (
          <div style={{
            padding: 15,
            background: "#ededed",
            display: "flex",
            alignItems: "center"
          }}>
            <img
              src={`https://i.pravatar.cc/40?u=${selectedUser._id}`}
              style={{ borderRadius: "50%", marginRight: 10 }}
            />
            <div>
              <b>{selectedUser.username}</b><br />
              {onlineUsers.includes(selectedUser._id) && (
                <small style={{ color: "green" }}>online</small>
              )}
            </div>
          </div>
        )}

        {/* 💬 MESSAGES */}
        <div
          id="chat-box"
          style={{
            flex: 1,
            padding: 15,
            overflowY: "auto",
            background: "#e5ddd5"
          }}
        >
          {selectedUser ? (
            messages.map((m, i) => {
              const isMe = m.sender === userId;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: 10
                  }}
                >
                  <div style={{
                    background: isMe ? "#dcf8c6" : "#fff",
                    padding: "8px 12px",
                    borderRadius: 10,
                    maxWidth: "60%"
                  }}>
                    {m.message}
                  </div>
                </div>
              );
            })
          ) : (
            <h3>Select a user to start chat</h3>
          )}
        </div>

        {/* INPUT */}
        {selectedUser && (
          <div style={{
            padding: 10,
            borderTop: "1px solid #ddd",
            display: "flex",
            background: "#f0f0f0"
          }}>
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type message"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 20,
                border: "1px solid #ccc"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: 10,
                padding: "10px 15px",
                borderRadius: "50%",
                border: "none",
                background: "#25d366",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}