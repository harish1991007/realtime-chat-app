import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Message = mongoose.model("Message", MessageSchema);