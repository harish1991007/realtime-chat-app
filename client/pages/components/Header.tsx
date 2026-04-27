"use client";

import { useRouter } from "next/navigation";

export default function Header({ username }: { username?: string }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("userId");
    router.push("/");
  };

  return (
    <div
      style={{
        height: 60,
        background: "#202c33",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px"
      }}
    >
      {/* LEFT LOGO */}
      <div style={{ fontSize: 18, fontWeight: "bold" }}>
        💬 MyChat App
      </div>

      {/* RIGHT MENU */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <span style={{ cursor: "pointer" }} onClick={() => router.push("/chat")}>
          Chat
        </span>

        <span style={{ cursor: "pointer" }} onClick={() => router.push("/profile")}>
          Profile
        </span>

        <span style={{ fontSize: 14, opacity: 0.8 }}>
          {username || "User"}
        </span>

        <button
          onClick={logout}
          style={{
            background: "#ff4d4f",
            border: "none",
            padding: "5px 10px",
            borderRadius: 5,
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}