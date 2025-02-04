import dotenv from "dotenv";
import { HTMLEmailService } from "@repo/email-templates";
import transporter from "../config/nodemailerConfig";
dotenv.config();

export const sendAccountConfirmationEmailNodemailer = async (
  email: string,
  name: string
) => {
  const html = await HTMLEmailService.getAccountConfirmationEmail(name);
  return transporter.sendMail({
    from: `SMARTDRAW <process.env.EMAIL_USER>`,
    to: email,
    subject: `🎉 Welcome, ${name}! Your Account is Now Confirmed 🚀`,
    html,
  });
};
