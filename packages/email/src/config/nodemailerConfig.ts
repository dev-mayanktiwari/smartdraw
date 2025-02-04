import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.EMAIL_PORT);
console.log(PORT);

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
