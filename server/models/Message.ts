// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema({
//   sender: String,
//   receiver: String,
//   message: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export const Message = mongoose.model("Message", MessageSchema);


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,

  type: {
    type: String,
    default: "text" // text | file | audio
  },

  seen: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);