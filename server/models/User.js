import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    // This becomes part of the public profile URL, e.g. /portfolio/jane-doe
    slug: { type: String, required: true, unique: true },
    bio: { type: String, default: "", maxlength: 300 },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
