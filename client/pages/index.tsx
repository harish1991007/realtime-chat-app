"use client";

import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      localStorage.setItem("userId", data.userId);
      window.location.href = "/chat";
    } catch {
      alert(text);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      fontFamily: "Arial"
    }}>
      <div style={{
        width: 350,
        padding: 30,
        borderRadius: 15,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        color: "#fff"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          💬 Chat Login
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 8,
              border: "none",
              outline: "none"
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 20,
              borderRadius: 8,
              border: "none",
              outline: "none"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "none",
              background: "#25d366",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16
            }}
          >
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 15 }}>
          Don't have account?{" "}
          <a href="/register" style={{ color: "#fff", fontWeight: "bold" }}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}