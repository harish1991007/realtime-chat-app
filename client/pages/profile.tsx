"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const [username, setUsername] = useState("");
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // ✅ Load user
  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }

    fetch(`http://localhost:5000/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setUsername(data.username);
      });
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  // ✅ File preview
  const handleFile = (e: any) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // ✅ Update profile
  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("username", username);

    if (file) formData.append("avatar", file);

    const res = await fetch(
      `http://localhost:5000/update-profile/${userId}`,
      {
        method: "PUT",
        body: formData
      }
    );

    const data = await res.json();

    setUser(data);
    setPreview("");
    setFile(null);
    setShowModal(false);

    alert("Profile Updated ✅");
  };

  return (
    <div>
      <Header username={user.username} />

      {/* PROFILE CARD */}
      <div style={styles.card}>
        <img
          src={
            user?.avatar
              ? `http://localhost:5000/uploads/${user.avatar}`
              : "https://i.pravatar.cc/150"
          }
          style={styles.avatar}
        />

        <h2>{user.username}</h2>
        <p>User ID: {user._id}</p>

        <button style={styles.editBtn} onClick={() => setShowModal(true)}>
          Edit Profile
        </button>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Profile</h3>

            {/* IMAGE */}
            <img
              src={
                preview
                  ? preview
                  : user?.avatar
                  ? `http://localhost:5000/uploads/${user.avatar}`
                  : "https://i.pravatar.cc/120"
              }
              style={styles.modalAvatar}
            />

            <input type="file" onChange={handleFile} />

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              disabled
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button style={styles.saveBtn} onClick={updateProfile}>
                Save
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  card: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: 10
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    marginBottom: 15,
    objectFit: "cover"
  },
  editBtn: {
    marginTop: 15,
    padding: "10px 20px",
    background: "#25d366",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },

  /* MODAL */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "#fff",
    padding: 25,
    borderRadius: 10,
    width: 320,
    textAlign: "center"
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    marginBottom: 10,
    objectFit: "cover"
  },
  input: {
    width: "80%",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  saveBtn: {
    flex: 1,
    padding: 10,
    background: "#25d366",
    border: "none",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  },
  cancelBtn: {
    flex: 1,
    padding: 10,
    background: "#999",
    border: "none",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  }
};