import { generateKeyPairSync } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

// Define file paths
const privateKeyPath = path.join(__dirname, "private.pem");
const publicKeyPath = path.join(__dirname, "public.pem");

let privateKey: string;
let publicKey: string;

// Check if keys exist, else generate them
if (existsSync(privateKeyPath) && existsSync(publicKeyPath)) {
  console.log("🔑 Loading existing RSA keys...");
  privateKey = readFileSync(privateKeyPath, "utf8");
  publicKey = readFileSync(publicKeyPath, "utf8");
} else {
  console.log("🔑 Generating new RSA key pair...");
  const keyPair = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;

  // Save the keys to files for future use
  writeFileSync(privateKeyPath, privateKey);
  writeFileSync(publicKeyPath, publicKey);

  console.log("✅ RSA keys saved to files.");
}

export const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || privateKey;
export const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || publicKey;
