import dotenv from "dotenv";
import { HTMLEmailService } from "@repo/email-templates";
import transporter from "../config/nodemailerConfig";
dotenv.config();

export const sendPasswordChangedConfirmationMailNodemailer = async (
  email: string,
  name: string
) => {
  const html = await HTMLEmailService.getPasswordChangedConfirmationEmail(name);
  return transporter.sendMail({
    from: `SMARTDRAW <process.env.EMAIL_USER>`,
    to: email,
    subject: "Security Update: Your Password Was Changed recently 🔐",
    html,
  });
};
