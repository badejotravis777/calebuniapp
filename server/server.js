const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const mongoose   = require("mongoose");
const cors       = require("cors");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
require("dotenv").config();

const app        = express();
const httpServer = http.createServer(app); // ✅ Wrap express for Socket.io

// ─── SOCKET.IO ────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());
app.get("/", (_, res) => res.send("API WORKING 🚀"));

// ─── MONGODB ──────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => { console.error("MongoDB connect error:", err.message); process.exit(1); });

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    username:   { type: String, unique: true, required: true },
    matricNo:   { type: String, unique: true, required: true },
    email:      { type: String, unique: true, required: true },
    password:   { type: String, required: true },
    department: { type: String, default: "" },
    level:      { type: String, default: "" },
    role:       { type: String, default: "student", enum: ["student", "staff"] },
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema, "users");

// ✅ NEW: Chat messages — each scoped to a room (e.g. "Computer Science-100")
const MessageSchema = new mongoose.Schema(
  {
    room:     { type: String, required: true, index: true },
    sender:   { type: String, required: true },
    text:     { type: String, required: true },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema, "messages");

const normalize = (value = "") => String(value).trim();

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post("/api/signup", async (req, res) => {
  try {
    let { username, matricNo, email, password, role, department, level } = req.body;
    username   = normalize(username).toLowerCase();
    matricNo   = normalize(matricNo).toUpperCase();
    email      = normalize(email).toLowerCase();
    role       = normalize(role) || "student";
    department = normalize(department);
    level      = normalize(level);

    if (!username || !matricNo || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already taken" });
    if (await User.findOne({ username }))
      return res.status(400).json({ message: "Username already taken" });
    if (await User.findOne({ matricNo }))
      return res.status(400).json({ message: "Matric number already used" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, matricNo, email, password: hashedPassword, role, department, level });
    console.log("User saved:", user.username, user.department, user.level);
    return res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    let { identifier, password, portalRole } = req.body;
    identifier = normalize(identifier).toLowerCase();
    if (!identifier || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (portalRole && user.role !== portalRole) {
      return res.status(403).json({
        message: `Access denied. You are registered as a ${user.role}, not a ${portalRole}.`,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        username:   user.username,
        email:      user.email,
        matricNo:   user.matricNo,
        department: user.department || "",
        level:      user.level      || "",
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    const user = await User.findById(decoded.id).select("-password");
    return res.json(user);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.get("/api/check-username/:username", async (req, res) => {
  const username = req.params.username.toLowerCase();
  const exists = await User.findOne({ username });
  res.json({ available: !exists });
});

// ─── COMMUNITY ────────────────────────────────────────────────────────────────

// Last 50 messages for a room — called once on screen load
app.get("/api/messages/:room", async (req, res) => {
  try {
    const room = decodeURIComponent(req.params.room);
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json(messages.reverse()); // oldest first for display
  } catch (err) {
    return res.status(500).json({ message: "Failed to load messages" });
  }
});

// Count of users in the same dept + level — the live "X Members" number
app.get("/api/members/:department/:level", async (req, res) => {
  try {
    const department = decodeURIComponent(req.params.department);
    const level      = decodeURIComponent(req.params.level);
    const count = await User.countDocuments({ department, level });
    return res.json({ count });
  } catch {
    return res.status(500).json({ count: 0 });
  }
});

// ─── SOCKET.IO EVENTS ─────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  socket.on("send-message", async ({ room, sender, text }) => {
    if (!room || !sender || !text?.trim()) return;
    try {
      const saved = await Message.create({ room, sender, text: text.trim() });
      // Emit to EVERYONE in the room including sender so all devices update
      io.to(room).emit("receive-message", {
        _id:       saved._id.toString(),
        room:      saved.room,
        sender:    saved.sender,
        text:      saved.text,
        createdAt: saved.createdAt,
        isSystem:  false,
      });
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ─── START — use httpServer NOT app.listen ────────────────────────────────────
httpServer.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});