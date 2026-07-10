import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import User from "../models/User.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const makeUniqueSlug = async (name) => {
  let base = slugify(name, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await User.findOne({ slug })) {
    slug = `${base}-${count}`;
    count += 1;
  }
  return slug;
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are all required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const slug = await makeUniqueSlug(name);

    const user = await User.create({ name, email, password: hashedPassword, slug });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      slug: user.slug,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      slug: user.slug,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
