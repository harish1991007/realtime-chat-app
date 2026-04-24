"use client";

import Link from "next/link";

export default function Layout({ children }: any) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* 🔝 HEADER */}
      <header
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>💬 ChatApp</h2>

        <nav>
          <Link href="/" style={navLink}>Home</Link>
          <Link href="/login" style={navLink}>Login</Link>
          <Link href="/about" style={navLink}>About</Link>
        </nav>
      </header>

      {/* 📄 CONTENT */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* 🔻 FOOTER */}
      <footer
        style={{
          background: "#0a0a0a",
          color: "#aaa",
          textAlign: "center",
          padding: 15,
          fontSize: 14,
        }}
      >
        © 2026 ChatApp • Built with Next.js & Socket.io
      </footer>
    </div>
  );
}

const navLink = {
  marginRight: 20,
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
};