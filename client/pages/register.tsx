"use client";

import { useState } from "react";
import Layout from "./components/Layout";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();

    if (!res.ok) {
      alert(text);
      return;
    }

    const data = JSON.parse(text);
    alert("User created: " + data.username);
    window.location.href = "/";
  };

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.card}>
          {/* LOGO */}
          <div style={styles.logo}>💬</div>

          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>
            Start chatting with your friends instantly
          </p>

          {/* INPUTS */}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={styles.input}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
          />

          {/* BUTTON */}
          <button style={styles.button} onClick={register}>
            Create Account
          </button>

          {/* FOOTER */}
          <p style={styles.footer}>
            Already have an account?{" "}
            <Link href="/login" style={styles.link}>
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* 🔥 BACKGROUND ANIMATION */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}
      </style>
    </Layout>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
    backgroundSize: "300% 300%",
    animation: "gradientMove 10s ease infinite",
    fontFamily: "Segoe UI, sans-serif"
  },

  card: {
    width: 360,
    padding: 35,
    borderRadius: 12,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    textAlign: "center"
  },

  logo: {
    fontSize: 40,
    marginBottom: 10
  },

  title: {
    marginBottom: 5,
    fontSize: 22,
    fontWeight: 600
  },

  subtitle: {
    marginBottom: 25,
    color: "#666",
    fontSize: 14
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none"
  },

  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#25d366",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
    marginTop: 5,
    transition: "0.2s"
  },

  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#555"
  },

  link: {
    color: "#25d366",
    fontWeight: 600,
    textDecoration: "none"
  }
};