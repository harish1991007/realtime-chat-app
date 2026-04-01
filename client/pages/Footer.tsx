"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        width: "100%",
        padding: "10px 20px",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        color: "#fff",
        fontSize: 14,
      }}
    >
      © 2026 Real-Time Chat App. All rights reserved.
    </footer>
  );
};

export default Footer;