import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    tags: [{ type: String, trim: true }],
    imageUrl: { type: String, default: "" },
    projectLink: { type: String, default: "" }, // e.g. live demo or GitHub link
    slug: { type: String, required: true, unique: true }, // shareable link id for this project
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
