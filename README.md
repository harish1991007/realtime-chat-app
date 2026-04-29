💬 Real-Time Chat Application

A full-stack Real-Time Chat Application similar to WhatsApp Web / Messenger built using modern technologies like Next.js, Socket.io, TypeScript, and MongoDB.

🚀 Features
💬 One-to-One Real-Time Chat
🟢 Online / Offline User Status
🔐 User Authentication (Login & Register)
💾 Persistent Chat Storage (MongoDB)
⚡ Instant Messaging using Socket.io
📱 Responsive UI (WhatsApp-like design)
🔄 Auto message sync without refresh
🧠 Tech Stack
Frontend
Next.js
React
TypeScript
Backend
Node.js
Express.js
Real-Time Communication
Socket.io
Database
MongoDB
Authentication
JWT (JSON Web Token)
Bcrypt
📂 Project Structure
realtime-chat-app/
│
├── client/          # Next.js Frontend
│   ├── pages/
│   ├── components/
│   ├── lib/socket.ts
│
├── server/          # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── index.ts
│
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/harish1991007/realtime-chat-app.git
cd realtime-chat-app
2️⃣ Install dependencies
Backend
cd server
npm install
Frontend
cd ../client
npm install
3️⃣ Setup MongoDB

Make sure MongoDB is running:

mongod

Connection URL used:

mongodb://127.0.0.1:27017/chat
4️⃣ Run the application
Start Backend
cd server
npx ts-node index.ts
Start Frontend
cd client
npm run dev
🌐 Application URLs
Frontend: http://localhost:3000
Backend: http://localhost:5000
🔑 API Endpoints
Authentication
POST /register → Create user
POST /login → Login user
Users
GET /users → Get all users
GET /user/:id → Get single user
Messages
GET /messages/:user1/:user2 → Get chat history
🔄 Real-Time Events (Socket.io)
join → Join user room
send_message → Send message
receive_message → Receive message
online_users → Get online users
📸 Screenshots

👉 (Add your screenshots here for better presentation)

📈 Future Enhancements
👥 Group Chat
✔✔ Message Seen Status
⌨️ Typing Indicator
📎 File Sharing
🔔 Notifications
🎓 Project Purpose

This project is developed as a college project to demonstrate:

Real-time communication systems
Full-stack development
WebSocket implementation
Modern web architecture
👨‍💻 Author

Harish

📜 License

This project is for educational purposes only.
