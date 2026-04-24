"use client";

import Layout from "./components/Layout";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #1e3c72, #2a5298, #6a11cb, #2575fc)",
          backgroundSize: "300% 300%",
          animation: "gradientMove 10s ease infinite",
          color: "#fff",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        {/* HERO SECTION */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "100px 20px 60px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            💬 Real-Time Chat App
          </h1>

          <p
            style={{
              fontSize: "18px",
              maxWidth: 600,
              opacity: 0.85,
              marginBottom: 30,
            }}
          >
            Connect instantly with friends and teams using a fast,
            secure, and modern real-time chat platform.
          </p>

          <div>
            <Link href="/login">
              <button style={primaryBtn}>Get Started</button>
            </Link>

            <Link href="/about">
              <button style={secondaryBtn}>Learn More</button>
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
            padding: "40px 40px 80px",
          }}
        >
          {features.map((f, i) => (
            <div key={i} style={card}>
              <h3 style={{ marginBottom: 10 }}>{f.icon} {f.title}</h3>
              <p style={{ opacity: 0.8 }}>{f.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA SECTION */}
        <section
          style={{
            textAlign: "center",
            padding: "60px 20px 100px",
          }}
        >
          <h2 style={{ fontSize: 30, marginBottom: 20 }}>
            Ready to start chatting?
          </h2>

          <Link href="/login">
            <button style={primaryBtn}>Login Now</button>
          </Link>
        </section>

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

const primaryBtn = {
  padding: "14px 25px",
  borderRadius: "10px",
  border: "none",
  marginRight: 10,
  background: "linear-gradient(45deg, #25d366, #128c7e)",
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "14px 25px",
  borderRadius: "10px",
  border: "1px solid #fff",
  background: "transparent",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
};

const card = {
  padding: 25,
  borderRadius: 15,
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
};

const features = [
  {
    icon: "⚡",
    title: "Real-Time Messaging",
    desc: "Send and receive messages instantly with Socket.io",
  },
  {
    icon: "👥",
    title: "Group Chat",
    desc: "Create groups and chat with multiple users easily",
  },
  {
    icon: "🟢",
    title: "Online Status",
    desc: "See who is online and active in real time",
  },
  {
    icon: "🔐",
    title: "Secure Login",
    desc: "Safe authentication with protected user data",
  },
];