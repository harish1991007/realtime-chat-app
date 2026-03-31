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

  // ✅ Protect route + join socket
  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (!id) {
      window.location.href = "/"; // 🔥 redirect if not logged in
      return;
    }

    setUserId(id);
    socket.emit("join", id);
  }, []);

  // ✅ Fetch users
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);

          const id = localStorage.getItem("userId");
          const filtered = data.filter((u: any) => u._id !== id);

          setUsers(filtered);
        } catch (err) {
          console.error("Users API error:", text);
        }
      });
  }, []);

  // ✅ Fetch my profile
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) return;

    fetch(`http://localhost:5000/user/${id}`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          setMe(data);
        } catch (err) {
          console.error("Profile API error:", text);
        }
      });
  }, []);

  // ✅ Socket listeners
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, []);

  // ✅ Send message
  const sendMessage = () => {
    if (!msg || !selectedUser || !userId) return;

    const data = {
      sender: userId,
      receiver: selectedUser._id,
      message: msg
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setMsg("");
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  // ✅ Auto scroll
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

        {/* 👤 PROFILE HEADER + LOGOUT */}
        <div style={{
          padding: 15,
          background: "#ededed",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://i.pravatar.cc/40"
              style={{ borderRadius: "50%", marginRight: 10 }}
            />
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
                setMessages([]);
              }}
              style={{
                padding: 12,
                cursor: "pointer",
                borderBottom: "1px solid #f1f1f1",
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

      {/* 💬 RIGHT CHAT */}
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

        {/* MESSAGES */}
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
              placeholder="Type a message"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 20,
                border: "1px solid #ccc",
                outline: "none"
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