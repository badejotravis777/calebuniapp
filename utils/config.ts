// utils/config.ts
// ─────────────────────────────────────────────────────────────────────────────
// THIS IS THE ONLY FILE YOU EVER NEED TO CHANGE when switching environments.
//
// After deploying to Render, paste your Render URL below and
// delete or comment out the other options.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

// ✅ USE THIS after deploying to Render:
export const BASE_URL = "https://calebuniapp.onrender.com"; // ← replace with your actual Render URL
// export const BASE_URL = "http://192.168.1.8:5000";

// 🏠 USE THIS when testing locally on same WiFi (comment out the one above):
// export const BASE_URL = "http://192.168.1.2:5000";

// ngrok bypass header — safe to keep, does nothing when not using ngrok
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";