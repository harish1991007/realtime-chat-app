"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Load user
 useEffect(() => {
  if (!userId) return;
  fetch(`http://localhost:5000/user/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      setUser(data);
      setUsername(data.username);
    });

}, [userId]); // IMPORTANT
if (!user) {
  return <h2>Loading...</h2>;
}

  // Preview image
  const handleFile = (e: any) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // Update profile
  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("username", username);

    if (file) {
      formData.append("avatar", file);
    }

    const res = await fetch(
      `http://localhost:5000/update-profile/${userId}`,
      {
        method: "PUT",
        body: formData
      }
    );

    const data = await res.json();
    alert("Profile Updated ✅");

    setUser(data);
    setPreview("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: 20 }}>My Profile</h2>

        {/* PROFILE IMAGE */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={
                preview
                ? preview
                : user?.avatar
                ? `http://localhost:5000/uploads/${user.avatar}`
                : "https://i.pravatar.cc/120"
            }
            style={styles.avatar}
            />
        </div>

        {/* FILE INPUT */}
        <input type="file" onChange={handleFile} />

        <br /><br />

        {/* USERNAME */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={styles.input}
        />

        <br />

        {/* BUTTON */}
        <button onClick={updateProfile} style={styles.button}>
          Update Profile
        </button>

        <br /><br />

        <button
          onClick={() => (window.location.href = "/chat")}
          style={styles.backBtn}
        >
          ← Back to Chat
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 15,
    width: 350,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center"
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #667eea"
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 15
  },
  button: {
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 8,
    background: "#667eea",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },
  backBtn: {
    width: "100%",
    padding: 10,
    border: "none",
    borderRadius: 8,
    background: "#999",
    color: "#fff",
    cursor: "pointer"
  }
};