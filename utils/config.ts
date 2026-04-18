// utils/config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Change BASE_URL here ONLY. Every screen, login, signup, and socket connection
// reads from this single source of truth.
//
// LOCAL (same WiFi):   "http://192.168.1.2:5000"
// NGROK (remote):      "https://xxxx-xx-xx-xx.ngrok-free.app"  ← paste your ngrok URL here
// PRODUCTION:          "https://your-deployed-server.com"
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_URL = "https://wizard-afflicted-rehydrate.ngrok-free.dev";