"use client";

import Layout from "./components/Layout";

export default function About() {
  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          padding: "60px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
          backgroundSize: "300% 300%",
          animation: "gradientMove 10s ease infinite",
          fontFamily: "Segoe UI, sans-serif",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            width: "100%",
            padding: 40,
            borderRadius: 20,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          {/* Title */}
          <h1
            style={{
              textAlign: "center",
              fontSize: 32,
              marginBottom: 20,
            }}
          >
            📘 About ChatApp
          </h1>

          {/* Description */}
          <p style={textStyle}>
            This Real-Time Chat Application is developed using modern web
            technologies like <b>Next.js</b>, <b>Socket.io</b>,{" "}
            <b>TypeScript</b>, and <b>MongoDB</b>.
          </p>

          <p style={textStyle}>
            The application allows users to communicate instantly with features
            like:
          </p>

          {/* Features */}
          <ul style={{ marginTop: 20, marginBottom: 20, paddingLeft: 20 }}>
            <li style={listItem}>✔ One-to-One Chat</li>
            <li style={listItem}>✔ Group Chat</li>
            <li style={listItem}>✔ Online/Offline Status</li>
            <li style={listItem}>✔ Secure Login System</li>
          </ul>

          {/* Footer Text */}
          <p style={textStyle}>
            This project is built as part of a college submission and
            demonstrates real-time communication systems used in modern
            applications like WhatsApp.
          </p>
        </div>

        {/* Background Animation */}
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

const textStyle = {
  fontSize: "16px",
  lineHeight: "1.8",
  opacity: 0.9,
};

const listItem = {
  marginBottom: "10px",
  fontSize: "16px",
};