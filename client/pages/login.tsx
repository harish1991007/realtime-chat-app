"use client";

import { useState, FormEvent } from "react";
import Layout from "./components/Layout";

export default function Login() {
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
      const res = await fetch("http://10.14.208.226:5000/login", {
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
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
          backgroundSize: "300% 300%",
          animation: "gradientMove 10s ease infinite",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            width: 360,
            padding: 35,
            borderRadius: 20,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: 10, fontSize: 28 }}>💬 ChatApp</h1>
          <p style={{ marginBottom: 25, opacity: 0.8 }}>
            Welcome back! Login to continue
          </p>

          <form onSubmit={handleSubmit}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={inputStyle}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Login
            </button>
          </form>

          <p style={{ marginTop: 20 }}>
            Don't have an account?{" "}
            <a href="/register" style={linkStyle}>
              Register
            </a>
          </p>
        </div>

        {/* Animation */}
        <style>
          {`
          @keyframes gradientMove {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}
        </style>
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(45deg, #25d366, #128c7e)",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
  transition: "0.3s",
};

const linkStyle = {
  color: "#fff",
  fontWeight: "bold",
  textDecoration: "underline",
};
