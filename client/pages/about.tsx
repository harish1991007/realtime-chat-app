import Layout from "./components/Layout";

export default function About() {
  return (
    <Layout>
      <div style={{ padding: 40 }}>
        <h1>About Us</h1>

        <p>
          This Real-Time Chat Application is developed using modern web technologies
          like Next.js, Socket.io, TypeScript, and MongoDB.
        </p>

        <p>
          The application allows users to communicate instantly with features like:
        </p>

        <ul>
          <li>✔ One-to-One Chat</li>
          <li>✔ Group Chat</li>
          <li>✔ Online/Offline Status</li>
          <li>✔ Secure Login System</li>
        </ul>

        <p>
          This project is built as part of a college submission and demonstrates
          real-time communication systems used in modern applications like WhatsApp.
        </p>
      </div>
    </Layout>
  );
}