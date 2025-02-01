import { generateKeyPairSync } from "crypto";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
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

export const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || privateKey;
export const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || publicKey;