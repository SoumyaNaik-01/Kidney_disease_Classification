// frontend/src/config.js
// In Vite, env vars must be prefixed with VITE_. If you set VITE_API_BASE in Render or your .env, it will be used.
export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
