"use client";

import Link from "next/link";

export default function Layout({ children }: any) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* 🔝 HEADER */}
      <header style={{
        background: "#111",
        color: "#fff",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>💬 ChatApp</h2>

        <nav>
          <Link href="/" style={{ marginRight: 20, color: "#fff" }}>Login</Link>
          <Link href="/about" style={{ marginRight: 20, color: "#fff" }}>About</Link>
        </nav>
      </header>

      {/* 📄 PAGE CONTENT */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* 🔻 FOOTER */}
      <footer style={{
        background: "#111",
        color: "#fff",
        textAlign: "center",
        padding: 10
      }}>
        © 2026 ChatApp | Built with ❤️ using Next.js & Socket.io
      </footer>
    </div>
  );
}