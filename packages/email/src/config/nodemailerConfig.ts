import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = Number(process.env.EMAIL_PORT);
// console.log("Host", process.env.EMAIL_HOST);
// console.log("User", process.env.EMAIL_USER);
// console.log("Pass", process.env.EMAIL_PASS);
// console.log("Port", PORT);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: PORT,
  secure: PORT === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
