import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  supabase_id: {
    type: String,
    required: true,
    unique : true,
    description : "the UUID from supabase auth"
  },
  name:{
    type: String,
    required : true,
    description: "Full name (from Google profile)"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    description: "User's email (from Supabase)"
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: "When user first registered"
  },
   last_login: {
    type: Date,
    description: "Last time user logged in"
  },
   last_active: {
    type: Date,
    description: "Last interaction with the platform"
  },
})


const User = mongoose.model('User', userSchema);
export default User;