"use client";

import { useRouter } from "next/navigation";

export default function ({  username,  avatar }: { username?: string;  avatar?: string; }) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        
        {/* NAV */}
        <span
          onClick={() => router.push("/chat")}
          style={{ cursor: "pointer", opacity: 0.9 }}
        >
          Chat
        </span>

        <span
          onClick={() => router.push("/profile")}
          style={{ cursor: "pointer", opacity: 0.9 }}
        >
          Profile
        </span>

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
            cursor: "pointer",
            fontSize: 13
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}