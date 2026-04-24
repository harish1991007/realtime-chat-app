import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: {
    type: String,
    default: ""
  }
});

export const User = mongoose.model("User", userSchema);