import dotenv from "dotenv";
import { HTMLEmailService } from "@repo/email-templates";
import transporter from "../config/nodemailerConfig";
dotenv.config();

export const sendWelcomeEmailNodemailer = async (
  email: string,
  name: string
) => {
  const html = await HTMLEmailService.getWelcomeEmail(name);
  return transporter.sendMail({
    from: `SMARTDRAW <process.env.EMAIL_USER>`,
    to: email,
    subject: "Welcome to SMARTDRAW",
    html,
  });
};
