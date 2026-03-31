import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: String,
  password: String
});

export const User = mongoose.model("User", schema);