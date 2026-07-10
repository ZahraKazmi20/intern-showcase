import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

console.log("=== MULTER INIT ===");
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET");
console.log("Cloudinary API Secret:", process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "intern-showcase",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    console.log("File received:", file.fieldname, file.originalname, file.size);
    cb(null, true);
  },
});

// Add error handler middleware
const uploadErrorHandler = (err, req, res, next) => {
  console.error("=== UPLOAD ERROR ===");
  console.error("Error type:", err.constructor.name);
  console.error("Error message:", err.message);
  console.error("Full error:", err);
  
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Max 5MB." });
  }
  if (err.code === "LIMIT_PART_COUNT") {
    return res.status(400).json({ message: "Too many files" });
  }
  if (err.message && err.message.includes("Cloudinary")) {
    return res.status(500).json({ message: "Image upload failed", error: err.message });
  }
  
  res.status(500).json({ message: "Upload error", error: err.message });
};

export { upload, uploadErrorHandler };
export default upload;