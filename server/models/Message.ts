import mongoose from "mongoose";

const schema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model("Message", schema);