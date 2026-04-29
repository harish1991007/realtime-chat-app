import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // 🔥 this makes username unique
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, 
    default: "user_profile.png"
  }
});

export const User = mongoose.model("User", userSchema);
