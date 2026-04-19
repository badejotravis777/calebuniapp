const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const mongoose   = require("mongoose");
const cors       = require("cors");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
require("dotenv").config();

const app        = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  maxHttpBufferSize: 5e6, // 5MB — allows image payloads via socket
});

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.get("/", (_, res) => res.send("API WORKING 🚀"));

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

const MessageSchema = new mongoose.Schema(
  {
    room:     { type: String, required: true, index: true },
    sender:   { type: String, required: true },
    // type: text | image | document | poll
    type:     { type: String, default: "text", enum: ["text", "image", "document", "poll"] },
    text:     { type: String, default: "" },
    // For images — base64 string
    imageData:{ type: String, default: "" },
    // For documents
    fileName: { type: String, default: "" },
    fileSize: { type: String, default: "" },
    // For polls
    poll: {
      question: { type: String, default: "" },
      options:  [{ text: String, votes: [String] }], // votes = array of usernames
    },
    // Reactions: [{ emoji: "👍", users: ["b.travis7", ...] }]
    reactions: [{ emoji: String, users: [String] }],
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema, "messages");

const normalize = (value = "") => String(value).trim();

// ─── AUTH ROUTES (unchanged) ──────────────────────────────────────────────────

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
      message: "Login successful", token, role: user.role,
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

// ─── COMMUNITY REST ROUTES ────────────────────────────────────────────────────

app.get("/api/messages/:room", async (req, res) => {
  try {
    const room = decodeURIComponent(req.params.room);
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();
    return res.json(messages.reverse());
  } catch {
    return res.status(500).json({ message: "Failed to load messages" });
  }
});

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

// ─── POLL VOTE (REST — simpler than socket for votes) ────────────────────────
app.post("/api/messages/:id/vote", async (req, res) => {
  try {
    const { optionIndex, username } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message || message.type !== "poll")
      return res.status(404).json({ message: "Poll not found" });

    // Remove this user's vote from ALL options first (one vote only)
    message.poll.options.forEach((opt) => {
      opt.votes = opt.votes.filter((u) => u !== username);
    });
    // Add vote to chosen option
    message.poll.options[optionIndex].votes.push(username);
    await message.save();

    // Broadcast updated poll to everyone in the room
    io.to(message.room).emit("poll-updated", message.toObject());
    return res.json(message);
  } catch (err) {
    return res.status(500).json({ message: "Vote failed" });
  }
});

// ─── SOCKET.IO ────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  // Text message
  socket.on("send-message", async ({ room, sender, text }) => {
    if (!room || !sender || !text?.trim()) return;
    try {
      const saved = await Message.create({ room, sender, text: text.trim(), type: "text" });
      io.to(room).emit("receive-message", saved.toObject());
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  // Image message
  socket.on("send-image", async ({ room, sender, imageData }) => {
    if (!room || !sender || !imageData) return;
    try {
      const saved = await Message.create({ room, sender, type: "image", imageData, text: "" });
      io.to(room).emit("receive-message", saved.toObject());
    } catch (err) {
      console.error("Image save error:", err);
    }
  });

  // Document message
  socket.on("send-document", async ({ room, sender, fileName, fileSize }) => {
    if (!room || !sender || !fileName) return;
    try {
      const saved = await Message.create({ room, sender, type: "document", fileName, fileSize, text: "" });
      io.to(room).emit("receive-message", saved.toObject());
    } catch (err) {
      console.error("Document save error:", err);
    }
  });

  // Poll message
  socket.on("send-poll", async ({ room, sender, question, options }) => {
    if (!room || !sender || !question || !options?.length) return;
    try {
      const pollOptions = options.map((o) => ({ text: o, votes: [] }));
      const saved = await Message.create({
        room, sender, type: "poll", text: "",
        poll: { question, options: pollOptions },
      });
      io.to(room).emit("receive-message", saved.toObject());
    } catch (err) {
      console.error("Poll save error:", err);
    }
  });

  // Reaction toggle
  socket.on("toggle-reaction", async ({ messageId, emoji, username }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      const existing = message.reactions.find((r) => r.emoji === emoji);
      if (existing) {
        if (existing.users.includes(username)) {
          // Remove reaction
          existing.users = existing.users.filter((u) => u !== username);
          if (existing.users.length === 0) {
            message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
          }
        } else {
          existing.users.push(username);
        }
      } else {
        message.reactions.push({ emoji, users: [username] });
      }

      await message.save();
      io.to(message.room).emit("reaction-updated", {
        messageId: message._id.toString(),
        reactions: message.reactions,
      });
    } catch (err) {
      console.error("Reaction error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

httpServer.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});