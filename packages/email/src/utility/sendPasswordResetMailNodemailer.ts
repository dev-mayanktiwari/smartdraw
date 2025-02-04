import dotenv from "dotenv";
import { HTMLEmailService } from "@repo/email-templates";
import transporter from "../config/nodemailerConfig";
dotenv.config();

export const sendPasswordResetMailNodemailer = async (
  email: string,
  name: string,
  token: string
) => {
  const html = await HTMLEmailService.getPasswordResetEmail(name, token);
  return transporter.sendMail({
    from: `SMARTDRAW <process.env.EMAIL_USER>`,
    to: email,
    subject: "Reset Your SMARTDRAW Password 🔑",
    html,
  });
};
