const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("API WORKING 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connect error:", err.message);
    process.exit(1);
  });

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true, lowercase: true },
    matricNo: { type: String, unique: true, required: true, trim: true, uppercase: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "student", enum: ["student", "staff"] },
  },
  { timestamps: true }
);

// Force the collection name to be "users"
const User = mongoose.model("User", UserSchema, "users");

const normalize = (value = "") => String(value).trim();

app.post("/api/signup", async (req, res) => {
  try {
    let { username, matricNo, email, password, role } = req.body;

    username = normalize(username).toLowerCase();
    matricNo = normalize(matricNo).toUpperCase();
    email = normalize(email).toLowerCase();
    role = normalize(role) || "student";

    if (!username || !matricNo || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const matricExists = await User.findOne({ matricNo });
    if (matricExists) {
      return res.status(400).json({ message: "Matric number already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      matricNo,
      email,
      password: hashedPassword,
      role,
    });

    console.log("✅ User saved:", user._id, user.username, user.email);

    return res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    // 👇 Grab the portalRole sent from the app
    let { identifier, password, portalRole } = req.body;
    identifier = normalize(identifier).toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔥 THE FIX: STRICT PORTAL ACCESS CHECK
    // If they clicked "Staff" but their database role is "student", kick them out.
    if (portalRole && user.role !== portalRole) {
      return res.status(403).json({ 
        message: `Access denied. You are registered as a ${user.role}, not a ${portalRole}.` 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secret123",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        username: user.username,
        email: user.email,
        matricNo: user.matricNo,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, "secret123");
    const user = await User.findById(decoded.id).select("-password");

    return res.json(user);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

app.get("/api/check-username/:username", async (req, res) => {
  const username = req.params.username.toLowerCase();
  const exists = await User.findOne({ username });
  res.json({ available: !exists });
});