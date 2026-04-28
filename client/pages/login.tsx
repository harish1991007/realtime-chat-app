"use client";

import { useState, FormEvent } from "react";
import Layout from "./components/Layout";
import Link from "next/link";

export default function Login() {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.card}>
          {/* LOGO */}
          <div style={styles.logo}>💬</div>

          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>
            Login to continue chatting
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
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

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          {/* FOOTER */}
          <p style={styles.footer}>
            Don’t have an account?{" "}
            <Link href="/register" style={styles.link}>
              Register
            </Link>
          </p>
        </div>

        {/* 🔥 GRADIENT ANIMATION */}
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
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    textAlign: "center"
  },

  logo: {
    fontSize: 42,
    marginBottom: 10
  },

  title: {
    marginBottom: 5,
    fontSize: 24,
    fontWeight: 700
  },

  subtitle: {
    marginBottom: 25,
    color: "#666",
    fontSize: 14
  },

  input: {
    width: "100%",
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
    transition: "0.2s"
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(45deg, #25d366, #128c7e)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 16,
    transition: "0.3s"
  },

  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#444"
  },

  link: {
    color: "#25d366",
    fontWeight: 600,
    textDecoration: "none"
  }
};