"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (!id) {
      window.location.href = "/";
      return;
    }

    fetch(`http://localhost:5000/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <Header username={user.username} />

      <div
        style={{
          maxWidth: 500,
          margin: "40px auto",
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 10,
          textAlign: "center"
        }}
      >
        {/* PROFILE IMAGE */}
        <img
          src={`https://i.pravatar.cc/150?u=${user._id}`}
          style={{
            borderRadius: "50%",
            marginBottom: 20
          }}
        />

        <h2>{user.username}</h2>
        <p>User ID: {user._id}</p>

        {/* FUTURE FIELDS */}
        <div style={{ marginTop: 20 }}>
          <button
            style={{
              padding: "10px 20px",
              background: "#25d366",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer"
            }}
          >
            Edit Profile (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}