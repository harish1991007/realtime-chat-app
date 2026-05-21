"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  const [username, setUsername] = useState("");
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  //  LOAD USER
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

  if (!user) return <p style={{ textAlign: "center" }}>Loading...</p>;

  //  FILE PREVIEW
  const handleFile = (e: any) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  //  UPDATE PROFILE
  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("username", username);
    if (file) formData.append("avatar", file);

    const res = await fetch(
      `http://localhost:5000/update-profile/${userId}`,
      { method: "PUT", body: formData }
    );

    const data = await res.json();
    setUser(data);
    setPreview("");
    setFile(null);
    setShowModal(false);

    alert("Profile Updated ");
  };

  //  UPDATE PASSWORD
  const updatePassword = async () => {
    if (!currentPassword || !newPassword) {
      return alert("Fill all fields");
    }

    const res = await fetch(
      `http://localhost:5000/update-password/${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      }
    );

    const text = await res.text();

    if (res.ok) {
      alert("Password Updated ");
      setShowPassModal(false);
      setCurrentPassword("");
      setNewPassword("");
    } else {
      alert(text);
    }
  };

  return (
    <div style={styles.page}>
      <Header username={user?.username} avatar={user?.avatar} />

      {/*  TOP BANNER */}
      <div style={styles.topBanner}>
        <h1>My Profile</h1>
        <p>Manage your account settings</p>
      </div>

      {/* PROFILE CARD */}
      <div
        style={styles.card}
        onMouseOver={(e) =>
          (e.currentTarget.style.transform = "translateY(-5px)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        <img
          src={
            user?.avatar
              ? `http://localhost:5000/uploads/${user.avatar}`
              : "https://i.pravatar.cc/150"
          }
          style={styles.avatar}
        />

        <h2>{user.username}</h2>
        <p style={{ color: "#777" }}>User ID: {user._id}</p>

        {/* INFO SECTION */}
        <div style={styles.infoBox}>
          <div style={styles.infoItem}>
            <span style={styles.label}>Status</span>
            <span style={{ color: "green" }}>● Online</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Account Type</span>
            <span>Standard User</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>Member Since</span>
            <span>2026</span>
          </div>
        </div>

        <button style={styles.editBtn} onClick={() => setShowModal(true)}>
          ✏️ Edit Profile
        </button>

        <button style={styles.passBtn} onClick={() => setShowPassModal(true)}>
          🔐 Change Password
        </button>
      </div>

      {/*  EDIT MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Profile</h3>

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

            <input value={username} disabled style={styles.input} />

            <div style={styles.row}>
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

      {/*  PASSWORD MODAL */}
      {showPassModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />

            <div style={styles.row}>
              <button style={styles.saveBtn} onClick={updatePassword}>
                Update
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowPassModal(false)}
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
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #f1f8e9)",
    paddingBottom: 40
  },

  topBanner: {
    textAlign: "center",
    marginTop: 20
  },

  card: {
    maxWidth: 420,
    margin: "30px auto",
    padding: "30px",
    textAlign: "center",
    borderRadius: 20,
    background: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    transition: "0.3s"
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    marginBottom: 15,
    objectFit: "cover",
    border: "4px solid #25d366"
  },

  infoBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    background: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    textAlign: "left"
  },

  infoItem: {
    display: "flex",
    justifyContent: "space-between"
  },

  label: {
    color: "#777"
  },

  editBtn: {
    marginTop: 15,
    padding: "10px 20px",
    background: "linear-gradient(135deg, #25d366, #128c7e)",
    color: "#fff",
    border: "none",
    borderRadius: 25,
    cursor: "pointer"
  },

  passBtn: {
    marginTop: 10,
    padding: "10px 20px",
    background: "linear-gradient(135deg, #007bff, #0056b3)",
    color: "#fff",
    border: "none",
    borderRadius: 25,
    cursor: "pointer"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: 30,
    borderRadius: 20,
    width: 350,
    textAlign: "center"
  },

  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    marginBottom: 10
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid #ccc"
  },

  row: {
    display: "flex",
    gap: 10,
    marginTop: 15
  },

  saveBtn: {
    flex: 1,
    padding: 10,
    background: "#25d366",
    color: "#fff",
    border: "none",
    borderRadius: 10
  },

  cancelBtn: {
    flex: 1,
    padding: 10,
    background: "#ccc",
    border: "none",
    borderRadius: 10
  }
};