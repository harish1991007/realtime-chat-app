"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Header({ username, avatar }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("userId");
    router.push("/");
  };

  const navItem = (label: string, path: string) => {
    const active = pathname === path;

    return (
      <span
        onClick={() => router.push(path)}
        style={{
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: 6,
          fontSize: 14,
          transition: "0.2s",
          background: active ? "#2a3942" : "transparent",
          color: active ? "#25d366" : "#ccc",
          fontWeight: active ? 600 : 400
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = "#2a3942";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        {label}
      </span>
    );
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
        padding: "0 20px",
        borderBottom: "1px solid #111b21"
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 22 }}>💬</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          MyChat
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>

        {/* ✅ NAV ITEMS */}
        {navItem("Chat", "/chat")}
        {navItem("Profile", "/profile")}

        {/* USER */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#2a3942",
          padding: "5px 10px",
          borderRadius: 20
        }}>
          <img
            src={
              avatar
                ? `http://localhost:5000/uploads/${avatar}?t=${Date.now()}`
                : "https://i.pravatar.cc/40"
            }
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
          <span style={{ fontSize: 13 }}>
            {username || "User"}
          </span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          style={{
            background: "#ff4d4f",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
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