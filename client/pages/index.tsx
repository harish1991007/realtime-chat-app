"use client";

import { useState, FormEvent } from "react";

import Layout from "./components/Layout";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        localStorage.setItem("userId", data.userId);
        window.location.href = "/chat";
      } catch {
        alert(text);
      }
    } catch {
      alert("Error connecting to server.");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
      <Layout>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        fontFamily: "Arial",
      }}
    >
      {/* Login Form */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 350,
            padding: 30,
            borderRadius: 15,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: 20 }}>💬 Chat Login</h2>

          <form onSubmit={handleSubmit}>
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
                outline: "none",
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
                outline: "none",
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
                fontSize: 16,
              }}
            >
              Login
            </button>
          </form>

          <p style={{ marginTop: 15 }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#fff", fontWeight: "bold" }}>
              Register
            </a>
          </p>
        </div>
      </main>

    </div>
  </Layout>

  );
}