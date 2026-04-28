"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "./lib/socket";
import Header from "./components/Header";

export default function Chat() {
  const [userId, setUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [me, setMe] = useState<any>(null);

  // 🔥 NEW STATES
  const [file, setFile] = useState<File | null>(null);
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef<any>(null);

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
      .then((res) => res.json())
      .then((data) => {
        const id = localStorage.getItem("userId");
        setUsers(data.filter((u: any) => u._id !== id));
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
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stop_typing", () => setTyping(false));

    return () => {
      socket.off("receive_message");
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
      setMessages(data);

      // 👁 mark seen
      await fetch("http://localhost:5000/seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: receiverId,
          receiver: id
        })
      });

    } catch (err) {
      console.log("Load message error:", err);
    }
  };

  // ✅ SEND MESSAGE
  const sendMessage = async () => {
    if (!selectedUser || !userId) return;

    let payload: any = {
      sender: userId,
      receiver: selectedUser._id,
      message: msg,
      type: "text"
    };

    // 📎 FILE
    if (file) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: fd
      });

      const data = await res.json();

      payload = {
        sender: userId,
        receiver: selectedUser._id,
        message: data.filePath,
        type: "file"
      };
    }

    socket.emit("send_message", payload);

    setMsg("");
    setFile(null);
  };

  // 🎤 AUDIO RECORD
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    const chunks: any[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks);

      const fd = new FormData();
      fd.append("file", blob, "audio.webm");

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: fd
      });

      const data = await res.json();

      socket.emit("send_message", {
        sender: userId,
        receiver: selectedUser._id,
        message: data.filePath,
        type: "audio"
      });
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // ⌨️ typing
  const handleTyping = (e: any) => {
    setMsg(e.target.value);

    socket.emit("typing", { to: selectedUser._id });

    setTimeout(() => {
      socket.emit("stop_typing", { to: selectedUser._id });
    }, 1000);
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <Header username={me?.username} />

      <div style={{ display: "flex", height: "100%" }}>

        {/* 👥 LEFT SIDEBAR */}
        <div style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column"
        }}>

          {/* PROFILE */}
          <div style={{
            padding: 15,
            background: "#ededed",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  me?.avatar
                    ? `http://localhost:5000/uploads/${me.avatar}?t=${Date.now()}`
                    : "https://i.pravatar.cc/150"
                }
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  marginRight: 10
                }}
              />
              <b>{me?.username}</b>
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

          {/* USERS */}
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
                    src={
                      u?.avatar
                        ? `http://localhost:5000/uploads/${u.avatar}?t=${Date.now()}`
                        : "https://i.pravatar.cc/150"
                    }
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      marginRight: 10,
                      objectFit: "cover",   // 🔥 important (prevents stretching)
                      border: "2px solid #ddd"
                    }}
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
                  src={
                    selectedUser?.avatar
                      ? `http://localhost:5000/uploads/${selectedUser.avatar}?t=${Date.now()}`
                      : "https://i.pravatar.cc/150"
                  }
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    marginRight: 10,
                    objectFit: "cover",   // 🔥 important (prevents stretching)
                    border: "2px solid #ddd"
                  }}
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

                      {m.type === "text" && m.message}

                      {/* {m.type === "file" && (
                        <a href={`http://localhost:5000/uploads/${m.message}`} target="_blank">
                          📎 Download File
                        </a>
                      )} */}


                      {m.type === "file" && (
                        <>
                          {/* 🖼️ IMAGE PREVIEW */}
                          {m.message.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <div style={{ position: "relative" }}>
                              <img
                                src={`http://localhost:5000/uploads/${m.message}`}
                                style={{
                                  maxWidth: 200,
                                  borderRadius: 10,
                                  cursor: "pointer"
                                }}
                              />

                              {/* ⬇ DOWNLOAD ICON */}
                              <a
                                href={`http://localhost:5000/uploads/${m.message}`}
                                download
                                style={{
                                  position: "absolute",
                                  bottom: 5,
                                  right: 5,
                                  background: "rgba(0,0,0,0.6)",
                                  color: "#fff",
                                  borderRadius: "50%",
                                  padding: 5,
                                  fontSize: 12,
                                  textDecoration: "none"
                                }}
                              >
                                ⬇
                              </a>
                            </div>
                          ) : (
                            /* 📄 OTHER FILE */
                            <a
                              href={`http://localhost:5000/uploads/${m.message}`}
                              target="_blank"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "#f1f1f1",
                                padding: "6px 10px",
                                borderRadius: 8,
                                textDecoration: "none",
                                color: "#333"
                              }}
                            >
                              📎 File
                              <span>⬇</span>
                            </a>
                          )}
                        </>
                      )}


                      {m.type === "audio" && (
                        <audio controls>
                          <source src={`http://localhost:5000/uploads/${m.message}`} />
                        </audio>
                      )}

                      {isMe && (
                        <div style={{ fontSize: 10 }}>
                          {m.seen ? "✔✔ Seen" : "✔ Sent"}
                        </div>
                      )}

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
              padding: "10px",
              borderTop: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#f0f2f5"
            }}>

              {/* 📎 FILE ICON */}
              <label style={{
                cursor: "pointer",
                fontSize: 20
              }}>
                📎
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />
              </label>

              {/* INPUT */}
              <input
                value={msg}
                onChange={handleTyping}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px 15px",
                  borderRadius: 25,
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: 14,
                  background: "#fff"
                }}
              />

              {/* 🎤 MIC BUTTON */}
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "none",
                  background: recording ? "#ff4d4f" : "#6c757d",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  transition: "0.2s"
                }}
              >
                🎤
              </button>

              {/* SEND BUTTON */}
              <button
                onClick={sendMessage}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  border: "none",
                  background: "#25d366",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  transition: "0.2s"
                }}
              >
                ➤
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}