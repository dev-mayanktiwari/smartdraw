import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const URLS = {
  FRONTEND_URL: "https://smartdraw.mayanktiwari.tech",
  APP_URL: "http://localhost:4000/api/v1/auth",
} as const;

// console.log(URLS);
